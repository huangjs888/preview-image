/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 16:02:45
 * @Description: ******
 */

import {
  Transition,
  Value,
  type ITransitionOptions,
  type IAnimationExtendOptions,
} from '@huangjs888/transition';
import { easeOutQuad } from '@huangjs888/transition/easing';
import { Transform } from '@huangjs888/transform';
import { revokeDamping, performDamping } from '@huangjs888/damping';
import { type IElement } from '@huangjs888/lightdom';
import { defaultAnimationExtendOptions } from './defaultAnimationExtendOptions';
import { between, isBetween, effectuate, ratioOffset } from '../utils';

class ItemModel extends Transition {
  _dblAdjust: boolean = true;
  _dblScale: number | (() => number) = 0; // 双击放大比例和是否调整放大时的中心点
  _damping: IDamping[] = []; // 可以进行阻尼的变换
  _rotation: number[] | (() => number[]) = []; // 旋转范围
  _scalation: number[] | (() => number[]) = []; // 缩放范围
  _translation: (number[] | ((v: number) => number[]))[] = []; // 平移范围
  _sizePosition: ISizePosition & {
    elementWidth: number;
    elementHeight: number;
  } = {
    containerCenter: [0, 0],
    containerWidth: 0,
    containerHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    elementWidth: 0,
    elementHeight: 0,
  };
  constructor({
    sizePosition,
    dblAdjust,
    dblScale,
    damping,
    rotation,
    scalation,
    translation,
    transitionEl,
    ...transitionOption
  }: IItemModelOption = {}) {
    super(transitionEl || null, transitionOption);
    this.apply({
      transform: new Value({ a: 0, k: 1, x: 0, y: 0 }, { a: 0.001, k: 0.001, x: 1, y: 1 }, (v) =>
        new Transform(v).toString(),
      ),
    });
    this.sizePosition(sizePosition);
    this.setDblAdjust(dblAdjust); // 设置双击是否调整中心点
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
  }
  reset(duration: number = 0) {
    const a = between(0, this.getRotation()); // 初始角度a
    const k = between(1, this.getScalation()); // 初始比例k
    const x = between(0, this.getXTranslation(k)); // 初始位移x
    const y = between(0, this.getYTranslation(k)); //初始位移y
    this.apply(new Value({ a, k, x, y }), { ...defaultAnimationExtendOptions, duration });
  }
  sizePosition(sizePosition?: ISizePosition) {
    if (sizePosition) {
      const { containerCenter, containerWidth, containerHeight, naturalWidth, naturalHeight } =
        sizePosition;
      const aspectRatio = naturalWidth / naturalHeight;
      const boxAspectRatio = containerWidth / containerHeight;
      let width = naturalWidth;
      if (aspectRatio >= boxAspectRatio) {
        width = containerWidth;
      } else if (aspectRatio >= 1 / 2.2) {
        // 0.4545454545...
        //微信 iphone 横竖屏和微信 android 竖屏时
        width = containerHeight * aspectRatio;
      } /* else if (aspectRatio >= 0.4) {
        // 微信 android 横屏时
        width = containerHeight * aspectRatio;
      } */ else {
        // 微信 iphone 是取 containerWidth 和 naturalWidth 最小值
        width = Math.min(containerWidth, naturalWidth);
        // 微信 android 直接是取 containerWidth;
        // width = containerWidth;
      }
      const height = width / aspectRatio;
      this._sizePosition = {
        containerCenter,
        containerWidth,
        containerHeight,
        naturalWidth,
        naturalHeight,
        elementWidth: width || 0,
        elementHeight: height || 0,
      };
      this.reset();
    }
    return this._sizePosition;
  }
  setRotation(a?: number[]) {
    if (a && typeof a[0] === 'number' && typeof a[1] === 'number' && a[1] >= a[0]) {
      // 最大范围 -Infinity 到 + Infinity
      this._rotation = a;
      return;
    }
    // 测微信得到的结论，是不给旋转的
    // 如果设置不合理，则取默认
    this._rotation = () => [0, 0];
  }
  getRotation() {
    return effectuate(this._rotation);
  }
  setScalation(k?: number[]) {
    if (k && typeof k[0] === 'number' && typeof k[1] === 'number' && k[1] >= k[0] && k[0] > 0) {
      this._scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
    // 如果设置不合理，则取默认
    this._scalation = () => [1, 2 * this.getDblScale()];
  }
  getScalation() {
    return effectuate(this._scalation);
  }
  setTranslation(xy?: number[][]) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  }
  getTranslation(k?: number) {
    return [this.getXTranslation(k), this.getYTranslation()];
  }
  setXTranslation(x?: number[]) {
    if (x && typeof x[0] === 'number' && typeof x[1] === 'number' && x[1] >= x[0]) {
      this._translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this._translation[0] = (k: number) => {
      const { containerWidth, elementWidth } = this.sizePosition();
      const bx = Math.max((elementWidth * k - containerWidth) / 2, 0);
      return [-bx, bx];
    };
  }
  getXTranslation(k?: number) {
    return effectuate(this._translation[0], k || this.value().transform.k || 1);
  }
  setYTranslation(y?: number[]) {
    if (y && typeof y[0] === 'number' && typeof y[1] === 'number' && y[1] >= y[0]) {
      this._translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this._translation[1] = (k: number) => {
      const { containerHeight, elementHeight } = this.sizePosition();
      const by = Math.max((elementHeight * k - containerHeight) / 2, 0);
      return [-by, by];
    };
  }
  getYTranslation(k?: number) {
    return effectuate(this._translation[1], k || this.value().transform.k || 1);
  }
  setDblScale(k?: number) {
    if (typeof k === 'number' && k > 0) {
      this._dblScale = k;
      return;
    }
    // 测微信得到的结论，双击放大比例是
    // 1，容器宽/元素宽 和 容器高/元素高 的最大值
    // 2，元素实际宽/容器宽 和 元素实际高/容器高 的最小值
    // 3，在1、2两个值和数值2这三个之中的最大值
    this._dblScale = () => {
      const {
        containerWidth,
        containerHeight,
        naturalWidth,
        naturalHeight,
        elementWidth,
        elementHeight,
      } = this.sizePosition();
      return (
        Math.max(
          2,
          Math.max(containerWidth / elementWidth, containerHeight / elementHeight),
          Math.min(naturalWidth / containerWidth, naturalHeight / containerHeight),
        ) || 1
      );
    };
  }
  getDblScale() {
    return effectuate(this._dblScale);
  }
  setDblAdjust(aj: boolean = true) {
    this._dblAdjust = aj;
  }
  getDblAdjust() {
    return this._dblAdjust;
  }
  isDamping(key: IDamping) {
    return this._damping?.indexOf(key) !== -1;
  }
  setDamping(damping?: IDamping[]) {
    if (damping) {
      this._damping = damping;
      return;
    }
    // 如果不设置，默认只对缩放比例和位移进行阻尼
    this._damping = ['scale', 'translate'];
  }
  rotate(a: number) {
    // 负数顺时针，正数逆时针
    // 在原来的基础上再旋转 a
    return this.transform(new Transform({ a }));
  }
  rotateTo(a: number) {
    // 负数顺时针，正数逆时针
    // 直接旋转到 a
    return this.transformTo(new Transform({ a }));
  }
  scale(k: number, point?: number[]) {
    // 在原来的基础上相对 point 点缩放 k
    return this.transform(new Transform({ k }), point);
  }
  scaleTo(k: number, point?: number[]) {
    // 直接相对 point 点缩放到 k
    return this.transformTo(new Transform({ k }), point);
  }
  translate(x: number, y: number) {
    // 在原来的基础上平移 x, y
    return this.transform(new Transform({ x, y }));
  }
  translateTo(x: number, y: number) {
    // 直接平移到 x, y
    return this.transformTo(new Transform({ x, y }));
  }
  translateX(x: number) {
    // 在原来的基础上横向平移 x
    return this.transform(new Transform({ x }));
  }
  translateXTo(x: number) {
    // 直接横向平移到 x
    return this.transformTo(new Transform({ x }));
  }
  translateY(y: number) {
    // 在原来的基础上竖向平移  y
    return this.transform(new Transform({ y }));
  }
  translateYTo(y: number) {
    // 直接竖向平移到 y
    return this.transformTo(new Transform({ y }));
  }
  transform(
    transform: Transform,
    point?: number[] | IAnimationExtendOptions,
    options?: IAnimationExtendOptions,
  ) {
    const t = this.value().transform;
    let { a, k, x, y } = transform;
    if (typeof a === 'number') {
      a += t.a || 0;
    }
    if (typeof k === 'number') {
      k *= t.k || 1;
    }
    if (typeof x === 'number') {
      x += t.x || 0;
    }
    if (typeof y === 'number') {
      y += t.y || 0;
    }
    return this.transformTo(new Transform({ a, k, x, y }), point, options);
  }
  transformTo(
    transform: Transform,
    point?: number[] | IAnimationExtendOptions,
    options?: IAnimationExtendOptions,
  ) {
    let _point = point;
    let _options = options;
    if (!options && !Array.isArray(point)) {
      _options = point;
      _point = undefined;
    }
    const { a: _a, k: _k, x: _x, y: _y } = transform;
    const _transform = new Transform();
    if (typeof _a === 'number') {
      _transform.a = between(_a, this.getRotation());
    }
    if (typeof _k === 'number') {
      const k = (_transform.k = between(_k, this.getScalation()));
      if (Array.isArray(_point)) {
        const [ox, oy] = this.computeOffset(_point, k);
        const t = this.value().transform;
        _transform.x = between((typeof _x === 'number' ? _x : t.x) + ox, this.getXTranslation(k));
        _transform.y = between((typeof _y === 'number' ? _y : t.y) + oy, this.getYTranslation(k));
      } else {
        if (typeof _x === 'number') {
          _transform.x = between(_x, this.getXTranslation(k));
        }
        if (typeof _y === 'number') {
          _transform.y = between(_y, this.getYTranslation(k));
        }
      }
    } else {
      if (typeof _x === 'number') {
        _transform.x = between(_x, this.getXTranslation());
      }
      if (typeof _y === 'number') {
        _transform.y = between(_y, this.getYTranslation());
      }
    }
    return this.apply(new Value(_transform.toRaw()), {
      ...defaultAnimationExtendOptions,
      ..._options,
    });
  }
  computeOffset(point: number[], k: number, adjust: boolean = false) {
    const { containerCenter, containerWidth, containerHeight, elementWidth, elementHeight } =
      this.sizePosition();
    const t = this.value().transform;
    const dk = k / t.k;
    const [cx, cy] = containerCenter;
    let ox = (typeof point[0] === 'number' ? point[0] : cx) - (cx + t.x);
    let oy = (typeof point[1] === 'number' ? point[1] : cy) - (cy + t.y);
    if (adjust) {
      // 思路：对元素进行划线分界
      // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
      // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
      // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
      // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
      // 5，元素左右计算方式如同上下方式一样得到ox
      // 测微信得到的结论
      // 这个偏移量需要要向着边缘点发散
      const cw = containerWidth / 1;
      const ch = containerHeight / 1;
      const ew = elementWidth / t.k;
      const eh = elementHeight / t.k;
      ox =
        between(ew - (cw - ew) / (dk - 1), [0, ew]) *
          ratioOffset(ox / ew, dk, between(cw / ew, [1, 2])) || 0;
      oy =
        between(eh - (ch - eh) / (dk - 1), [0, eh]) *
          ratioOffset(oy / eh, dk, between(ch / eh, [1, 2])) || 0;
    }
    ox *= 1 - dk;
    oy *= 1 - dk;
    return [ox, oy];
  }
  moveBounce(angle: number, scale: number, deltaX: number, deltaY: number, point: number[] = []) {
    let { a, k, x, y } = this.value().transform;
    const aRange = this.getRotation();
    if (this.isDamping('rotate')) {
      // 先把当前值反算出阻尼之前的原值
      let ba = between(a, aRange);
      a = ba + revokeDamping(a - ba, { max: 180 });
      // 再对总值进行总体阻尼计算
      ba = between((a += angle), aRange);
      a = ba + performDamping(a - ba, { max: 180 });
    } else {
      a = between((a += angle), aRange);
    }
    const kRange = this.getScalation();
    if (this.isDamping('scale')) {
      // 先把当前值反算出阻尼之前的原值
      let bk = between(k, kRange);
      k = bk * revokeDamping(k / bk, { max: 2, mode: 1 });
      // 再对总值进行总体阻尼计算
      bk = between((k *= scale), kRange);
      k = bk * performDamping(k / bk, { max: 2, mode: 1 });
    } else {
      k = between((k *= scale), kRange);
    }
    const [ox, oy] = this.computeOffset(point, k);
    if (this.isDamping('scale')) {
      const { containerWidth: xMax, containerHeight: yMax } = this.sizePosition();
      // 先把当前值反算出阻尼之前的原值
      let bx = between(x, this.getXTranslation());
      x = bx + revokeDamping(x - bx, { max: xMax });
      // 再对总值进行总体阻尼计算
      bx = between((x += ox + deltaX), this.getXTranslation(k));
      x = bx + performDamping(x - bx, { max: xMax });
      // 先把当前值反算出阻尼之前的原值
      let by = between(y, this.getYTranslation());
      y = by + revokeDamping(y - by, { max: yMax });
      // 再对总值进行总体阻尼计算
      by = between((y += oy + deltaY), this.getYTranslation(k));
      y = by + performDamping(y - by, { max: yMax });
    } else {
      x = between((x += ox + deltaX), this.getXTranslation(k));
      y = between((y += oy + deltaY), this.getYTranslation(k));
    }
    this.apply(new Value({ a, k, x, y }));
  }
  resetBounce(point: number[] = [], cancel: boolean = false) {
    let { a, k, x, y } = this.value().transform;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('rotate')) {
      const ba = between(a, this.getRotation());
      a = ba + revokeDamping(a - ba, { max: 180 });
    }
    if (this.isDamping('scale')) {
      const bk = between(k, this.getScalation());
      k = bk * revokeDamping(k / bk, { max: 2, mode: 1 });
    }
    if (this.isDamping('translate')) {
      const { containerWidth: xMax, containerHeight: yMax } = this.sizePosition();
      const bx = between(x, this.getXTranslation());
      x = bx + revokeDamping(x - bx, { max: xMax });
      const by = between(y, this.getYTranslation());
      y = by + revokeDamping(y - by, { max: yMax });
    }
    // 重置之前是双指移动，是不允许取消动画的
    this.transformTo(new Transform({ a, k, x, y }), point, { cancel });
  }
  dblScale(point: number[] = []) {
    // 这三个比例都是用保留三位小数的结果进行比较
    // 其实这里的3应该用1/屏幕的宽高算出的小数位数
    // 此刻比例和位移
    const tk = this.value().transform.k || 1;
    // 双击变化的比例
    const dk = between(this.getDblScale(), this.getScalation());
    // 再次双击恢复的比例（初始比例）
    const bk = between(1, this.getScalation());
    // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
    // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
    if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
      if (this.getDblAdjust()) {
        // 需要调整的情况，自己算偏移量，并且旋转置为0
        const [ox, oy] = this.computeOffset(point, dk, this.getDblAdjust());
        const t = this.value().transform;
        this.transformTo(new Transform({ a: 0, k: dk, x: t.x + ox, y: t.y + oy }), {
          cancel: false,
        });
      } else {
        // 交给transformTo
        this.transformTo(new Transform({ k: dk }), point, { cancel: false });
      }
    } else {
      // 再次双击恢复
      if (this.getDblAdjust()) {
        // 需要调整的情况，置为初始状态
        this.transformTo(new Transform({ a: 0, k: bk, x: 0, y: 0 }), { cancel: false });
      } else {
        // 交给transformTo
        this.transformTo(new Transform({ k: bk }), point, { cancel: false });
      }
    }
  }
  swipeBounce(
    duration: number,
    stretch: number,
    key: 'x' | 'y',
    transition?: (
      key: 'x' | 'y',
      xySwipe: number,
      xyBounce: number,
      option: (v: number) => IAnimationExtendOptions,
    ) => void,
  ) {
    const sizeInfo = this.sizePosition();
    const maxBounce = sizeInfo[key === 'x' ? 'containerWidth' : 'containerHeight'];
    const xyScale = 1.2 * this.getDblScale();
    const xyPos = this.value().transform[key] || 0;
    const xyRange = this.getTranslation()[key === 'x' ? 0 : 1];
    const sign = stretch > 0 ? 1 : -1;
    // 对距离进行优化(最大值是当前双击比例下图片宽度)
    const _stretch = Math.max(1, Math.min(Math.abs(stretch), xyScale * maxBounce)) * sign;
    // 对时间进行优化
    const _duration = Math.max(800, Math.min(2500, duration));
    if (isBetween(xyPos + _stretch, xyRange)) {
      if (typeof transition === 'function') {
        // 交给调用者去计算分配如何transition，并使用回调计算transition配置
        transition(key, _stretch, 0, () => ({
          duration: _duration,
          easing: easeOutQuad,
        }));
      } else {
        // 如果加上惯性滑动距离之后图片未超出边界，则图片直接移动
        this.apply(new Value({ [key]: xyPos + _stretch }), {
          ...defaultAnimationExtendOptions,
          easing: easeOutQuad,
          duration: _duration,
        });
      }
    } else {
      // 根据边界算出到达边界要走的的距离，有可能松开时已经超出边界，此时xySwipe是需要减掉的超出部分距离
      const xySwipe = between(xyPos + _stretch, xyRange) - xyPos;
      let xyBounce = 0;
      if (this.isDamping('translate')) {
        // 计算速度时，如果松开时超出边界，xySwipe肯定为0，其实得到的就是初始速度
        const velocity =
          (isBetween(xyPos, xyRange) ? Math.sqrt(1 - Math.abs(xySwipe / _stretch)) : 1) *
          ((2 * Math.abs(_stretch)) / _duration);
        // 根据到达边界时速度的大小计算出将要Damping的距离（一个与速度成正比计算方式，最大值不能超过容器宽度的1/4）
        xyBounce = Math.min(30 * velocity, maxBounce / 4) * sign;
      }
      if (typeof transition === 'function') {
        // 交给调用者去计算分配如何transition，并使用回调计算transition配置
        transition(key, xySwipe, xyBounce, (xyMove: number) => {
          // 根据实际走的距离xyMove算出时间占比
          const kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
          return {
            duration: kt * _duration,
            easing: easeOutQuad,
          };
        });
      } else {
        // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
        const xyMove = Math.max((xySwipe + xyBounce) * sign, 0) * sign;
        // 整个减速运动中，移动xyMove的时间占比
        const kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
        if (xyMove === 0) {
          // 如果swipe抬起没有移动的距离，则直接归位
          this.apply(new Value({ [key]: between(xyPos + xyMove, xyRange) }), {
            ...defaultAnimationExtendOptions,
          });
        } else {
          // 先移动xyMove距离
          this.apply(new Value({ [key]: xyPos + xyMove }), {
            ...defaultAnimationExtendOptions,
            duration: kt * _duration,
            easing: easeOutQuad,
          }).then(() => {
            // 移动后归位
            this.apply(new Value({ [key]: between(xyPos + xyMove, xyRange) }), {
              ...defaultAnimationExtendOptions,
            });
          });
        }
      }
    }
  }
}

export type IDamping = 'rotate' | 'scale' | 'translate';

export type ISizePosition = {
  containerCenter: number[];
  containerWidth: number;
  containerHeight: number;
  naturalWidth: number;
  naturalHeight: number;
};

export type IItemModelOption = {
  sizePosition?: ISizePosition; // 容器尺寸和元素实际尺寸
  dblAdjust?: boolean; // 双击中心点是否调整
  dblScale?: number; // 双击放大比例
  damping?: IDamping[]; // 哪些操作超出边界可以进行阻尼效果，如果对rotate,scale,translate设置了无边界限制(Infinity)，则阻尼无效
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转20度和顺时针可旋转10度
} & ITransitionOptions & { transitionEl?: IElement };

export default ItemModel;
