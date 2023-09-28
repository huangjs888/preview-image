/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-14 15:39:45
 * @Description: ******
 */

import Animation, { type IAnimationOptions } from '../animation';
import type ICSSOptionValue from './value';
import { union, delta } from './method';

class Transition {
  cssProperties: ICSSProperties = {}; // 元素的css属性信息，和元素实际css结果保持同步
  _cssProperties: ICSSProperties | null = null; // 每次动画开启前缓存的css信息，不会和元素实际css结果保持同步，是执行动画后的最终结果
  _animations: {
    animation: Animation; // 当前正在执行的过渡动画
    remain: ICSSProperties; // 剩余未执行的值
    cancel: boolean; // 该过渡动画是否可以停止
  }[] = []; // 该属性执行所有过渡的动画集合
  _apply: (style: ICSSStyle) => void;
  constructor({ cssProperties, apply }: ITransitionOptions = {}) {
    this._apply = apply || (() => {});
    if (cssProperties) {
      this.apply(cssProperties);
    }
  }
  update() {
    // 动画全部结束后将当前值更新为最终缓存值
    if (!this.running() && this._cssProperties) {
      this.cssProperties = this._cssProperties;
      this._cssProperties = null;
    }
    // 更新样式
    const { cssProperties } = this;
    const style: ICSSStyle = {};
    Object.keys(cssProperties).forEach((name) => {
      const { value, transform } = cssProperties[name];
      // 将驼峰转换为 - 连字符，style.setProperty只支持 - 连字符，不支持驼峰（不生效）
      style[name.replace(/([A-Z])/g, '-$1').toLocaleLowerCase()] = transform(value);
    });
    this._apply(style);
  }
  value() {
    // 正在动画的时候取_cssProperties
    const cssProperties = this._cssProperties || this.cssProperties;
    const value: ICSSLikeStyle = {};
    Object.keys(cssProperties).forEach((k) => {
      value[k] = cssProperties[k].value;
    });
    return value;
  }
  apply(cssProperties: ICSSOptionProperties, extendOptions?: IAnimationExtendOptions) {
    if (!this._cssProperties) {
      // 初始没有缓存值的情况，取当前值
      this._cssProperties = this.cssProperties;
    }
    // 修正合并
    const unionCSSProperties = union(this._cssProperties, cssProperties);
    // 计算出动画需要的增量
    const deltaCSSProperties = delta(this._cssProperties, unionCSSProperties);
    // 缓存动画最终值
    this._cssProperties = unionCSSProperties;
    // 动画增量的键集合
    const deltaCSSNames = Object.keys(deltaCSSProperties);
    // 存储每一帧动画后还有多少剩余没有执行
    const remainCSSProperties: ICSSProperties = {};
    // 初始的时候是全部值
    deltaCSSNames.forEach((name) => {
      const { value, ...restItem } = deltaCSSProperties[name];
      remainCSSProperties[name] = {
        value: { ...value },
        ...restItem,
      };
      // 更新除了value之外的其它值
      this.cssProperties[name] = {
        ...this.cssProperties[name],
        ...restItem,
      };
    });
    // 如果没有传入extendOptions或者没有需要执行动画的增量，则无动画配置（动画会默认duration为0，按进度100%一次执行完毕）
    const _extendOptions = !extendOptions || deltaCSSNames.length === 0 ? {} : extendOptions;
    return new Promise<ICSSLikeStyle>((resolve) => {
      const { before = () => {}, after = () => {}, cancel = true, ...restOptions } = _extendOptions;
      const animation = new Animation(restOptions);
      this._animations.push({ animation, cancel, remain: remainCSSProperties });
      // 开启动画
      animation.start((progress) => {
        const next = before(progress, this.value());
        if (next !== false) {
          let _progress = progress;
          if (typeof next === 'number') {
            _progress = next;
          }
          deltaCSSNames.forEach((name) => {
            const thisCSSValue = this.cssProperties[name].value;
            const deltaCSSValue = deltaCSSProperties[name].value;
            const remainCSSValue = remainCSSProperties[name].value;
            Object.keys(deltaCSSValue).forEach((key) => {
              // 总的需要消费数减去已经消费的部分，即为这一帧之后未消费的部分，_progress为已消费的进度
              const remainValue = deltaCSSValue[key] * (1 - _progress);
              // 上一帧未消费的部分减去这一帧之后未消费的部分，即为本次需要消费的部分
              thisCSSValue[key] += remainCSSValue[key] - remainValue;
              // 更新最新剩余未消费的
              remainCSSValue[key] = remainValue;
            });
          });
          this.update();
        }
        after(progress, this.value());
        if (progress === 1) {
          // 动画结束后删除集合中的这个动画对象
          const index = this._animations.findIndex((a) => animation === a.animation);
          // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
          if (index !== -1) {
            this._animations.splice(index, 1);
          }
          this.update();
          resolve(this.value());
        }
      });
    });
  }
  cancel(end: boolean = false) {
    // end是告诉动画取消时是停留在当前还是执行到终点
    let count = 0;
    this._animations = this._animations.filter(({ animation, remain, cancel }) => {
      if (cancel) {
        animation[end ? 'end' : 'stop']();
        count += 1;
        // 动画停止后，_cssProperties里面必须把停止的动画未完成的部分减掉
        const _cssProperties = this._cssProperties;
        if (_cssProperties) {
          Object.keys(remain).forEach((name) => {
            if (_cssProperties[name]) {
              const remainCSSValue = remain[name].value;
              const tempCSSValue = _cssProperties[name].value;
              Object.keys(remainCSSValue).forEach((key) => {
                tempCSSValue[key] -= remainCSSValue[key];
              });
            }
          });
        }
        return false;
      }
      return true;
    });
    this.update();
    return count;
  }
  running() {
    return this._animations.length !== 0;
  }
}

export type ICSSName = string;

export type ICSSValue = {
  [key: string]: number;
};

export type ICSSStyle = {
  [key: ICSSName]: string;
};

export type ICSSLikeStyle = {
  [key: ICSSName]: ICSSValue;
};

export type ICSSProperties = {
  [key: ICSSName]: {
    value: ICSSValue; // 传入css属性值，对象或值的形式
    precision: ICSSValue; // 传入精度，与value对应
    transform: (v: ICSSValue) => string; // 传入实现该value转变为style的字符串方法
  };
};

export type IAnimationExtendOptions = IAnimationOptions & {
  cancel?: boolean; // 该过渡过程是否可以取消
  // 过渡时每一帧执行之前（只针对过渡动画，对于精度值小于precision的变化，由于不会开启Animation，所以不会调用该函数）
  // 返回false，则该帧不执行即丢帧，返回其它则按照原来的继续向下执行（若返回是数字，则会达到篡改progress目的）
  before?: (p: number, v?: ICSSLikeStyle) => void | boolean | number;
  // 过渡时每一帧执行之后（只针对过渡动画，对于精度值小于precision的变化，由于不会开启Animation，所以不会调用该函数）
  after?: (p: number, v?: ICSSLikeStyle) => void;
};

export type ICSSOptionProperties =
  | ICSSOptionValue
  | {
      [key: ICSSName]: ICSSOptionValue;
    };

export type ITransitionOptions = {
  cssProperties?: ICSSOptionProperties; // 过渡的css属性信息
  apply?: (style: ICSSStyle) => void;
};

export default Transition;
