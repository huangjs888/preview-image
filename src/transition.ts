/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-21 13:23:30
 * @Description: ******
 */

import Animation, { type AIOptions } from './animation';

interface TIValue {
  [key: string]: number;
}
export type TAIOptions = AIOptions & {
  cancel?: boolean; // 该过渡过程是否可以取消
  precision?: TIValue; // 传入精度，如果变化值小于这个精度，就不再动画，直接赋值
  transition?: (v: TIValue) => void; // 过渡时每一帧的事件函数
};

export abstract class TAProperty {
  value: TIValue; // 过渡需要变化的值
  constructor(value: TIValue) {
    this.value = value;
  }
  abstract toString(): string; // 要实现该值转变为style的字符串方法
}
export type TIOptions = {
  element: HTMLElement; // 过渡应用的元素
  propertyName: string; // 当前将要过渡的动画应用在元素的哪个属性上
  propertyValue: TAProperty; // 当前将要过渡的动画属性的实时值
};

export default class Transition {
  element: HTMLElement; // 过渡的元素
  propertyName: string; // 当前将要过渡的动画应用在元素的哪个属性上
  propertyValue: TAProperty; // 当前将要过渡的动画属性的实时值
  _animation: {
    animation: Animation; // 当前正在执行的过渡动画
    remainValue: TIValue; // 该过渡动画被取消后剩余未执行的值
    cancel: boolean; // 该过渡动画是否可以停止
  }[] = []; // 该属性执行所有过渡的动画集合
  constructor({ element, propertyName, propertyValue }: TIOptions) {
    this.element = element;
    // 将驼峰转换为连字符-，style.setProperty只支持连字符-，不支持驼峰（不生效）
    this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.element.style.setProperty(this.propertyName, propertyValue.toString());
    this.propertyValue = propertyValue;
  }
  bind(value: TIValue) {
    // 这里直接做一次校准
    const { element, propertyName, propertyValue } = this;
    const newValue: TIValue = {};
    Object.keys(value).forEach((key) => {
      const val = value[key];
      if (typeof val === 'number') {
        newValue[key] = val;
      }
    });
    propertyValue.value = newValue;
    element.style.setProperty(propertyName, propertyValue.toString());
  }
  apply(deltaValue: TIValue, options: TAIOptions) {
    return new Promise<TIValue>((resolve) => {
      const {
        precision = {},
        transition = () => {},
        cancel = true,
        ...restOptions
      } = options;
      const { element, propertyName, propertyValue } = this;
      const produced: TIValue = {};
      // 做一次精度筛选
      Object.keys(deltaValue).forEach((key) => {
        const val = deltaValue[key];
        if (typeof val === 'number') {
          // 大于精度的先存起来，后面启用动画
          if (Math.abs(val) > (precision[key] || 0)) {
            produced[key] = val;
          } else {
            // 小于精度的直接累加到value
            if (typeof propertyValue.value[key] === 'number') {
              propertyValue.value[key] += val;
            }
          }
        }
      });
      const producedKeys = Object.keys(produced);
      // 存在需要执行动画的增量(大于精度的)，进行动画处理
      if (producedKeys.length > 0) {
        // 存储每一帧动画后还有多少剩余没有执行
        const remainValue = { ...produced };
        // 创建动画，并存储到this
        const animation = new Animation(restOptions);
        this._animation.push({ animation, remainValue, cancel });
        // 开启动画
        animation.start((progress) => {
          // 根据动画进度对value进行累加
          producedKeys.forEach((key) => {
            const unconsumed = produced[key] * (1 - progress);
            if (typeof propertyValue.value[key] === 'number') {
              propertyValue.value[key] += remainValue[key] - unconsumed;
            }
            remainValue[key] = unconsumed;
          });
          // 每帧动画后应用到元素并执行帧回调
          element.style.setProperty(propertyName, propertyValue.toString());
          transition(propertyValue.value);
          if (progress === 1) {
            // 动画结束后删除集合中的这个动画对象
            const index = this._animation.findIndex(
              (a) => animation === a.animation,
            );
            // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
            if (index !== -1) {
              this._animation.splice(index, 1);
            }
            resolve(propertyValue.value);
          }
        });
      } else {
        // 不存在需要执行动画的增量(小于精度的)，就直接将精度筛选时累加的值应用到元素并执行帧回调
        element.style.setProperty(propertyName, propertyValue.toString());
        transition(propertyValue.value);
        resolve(propertyValue.value);
      }
    });
  }
  cancel(end: boolean = false) {
    // end是告诉动画取消时是停留在当前还是执行到终点
    const remainValues: TIValue[] = [];
    this._animation = this._animation.filter(
      ({ animation, remainValue, cancel }) => {
        if (cancel) {
          animation[end ? 'end' : 'stop']();
          // 存储剩余没有执行的部分返回给调用者
          remainValues.push(remainValue);
          return false;
        }
        return true;
      },
    );
    return remainValues;
  }
  transitioning() {
    return this._animation.length !== 0;
  }
}
