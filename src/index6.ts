/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-22 15:50:07
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import { matrix3d, identity, each, type Transform } from './transform';
import Animation, { type Easing } from './animation';
import {
  adjustXY,
  adjustAngle,
  adjustScale,
  adjustOffset,
  adjustSwipeXY,
  checkScale,
  isBetween,
  easingOptions,
} from './adjust';

function transition(
  this: ImageView,
  stop: boolean,
  transform: Transform,
  duration: number = easingOptions.bounce.duration,
  easing: Easing = easingOptions.bounce.fn,
) {
  return new Promise<void>((resolve) => {
    const sTransform = { ...this._transform };
    // 先检查是否要进行动画（如果动画后的值和动画前完全一样，没必要进行过渡）
    let isAnimate = false;
    each(transform, (key, value) => {
      const sValue = sTransform[key];
      if (
        typeof sValue === 'number' &&
        typeof value === 'number' &&
        sValue !== value
      ) {
        // 一旦判断可以执行动画，退出循环
        isAnimate = true;
        return false;
      }
    });
    if (isAnimate) {
      const animation = new Animation({ duration, easing });
      this._animation.push({ animation, stop });
      animation.start((progress) => {
        each(transform, (key, value) => {
          const sValue = sTransform[key];
          if (typeof sValue === 'number' && typeof value === 'number') {
            this._transform[key] = (value - sValue) * progress + sValue;
          }
        });
        this.target.style.setProperty('transform', matrix3d(this._transform));
        if (progress === 1) {
          // 动画结束后删除
          const index = this._animation.findIndex(
            (a) => animation === a.animation,
          );
          this._animation.splice(index, 1);
          resolve();
        }
      });
    }
  });
}

const touchStart = function touchStart(this: ImageView, e: GEvent) {
  this._animation = this._animation.filter(({ animation, stop }) => {
    // swipe的动画立即停止
    if (stop) {
      animation.stop();
      // 停止后过滤掉（即删除）
      return false;
    }
    // 不需要停止的动画会在动画结束后被删除
    return true;
  });
  const [cx, cy] = this.getCenter();
  const { a, k, x = 0, y = 0 } = this._transform;
  if (this._animation.length === 0) {
    this._startMoving = {
      offset: [e.point[0] - (cx + x), e.point[1] - (cy + y)],

      sTransform: { a, k, x, y },
      mTransform: identity(),
    };
  }
};
const touchMove = function touchMove(this: ImageView, e: GEvent) {
  if (this._startMoving) {
    if (this._animation.length > 0) {
      // 若存在正在进行的渐变动画，则不做任何操作
      return;
    }
    const { offset, sTransform } = this._startMoving;
    const {
      moveAngle: ma = 0,
      moveScale: mk = 1,
      moveX: mx = 0,
      moveY: my = 0,
    } = e;
    const { a: sa = 0, k: sk = 1, x: sx = 0, y: sy = 0 } = sTransform;
    const { rotation, scalation, translation } = this;
    const a = adjustAngle(true, rotation, sa, ma);
    const k = adjustScale(true, scalation, sk, mk);
    window.log(k);
    const d = 1 - k / sk;
    const translationX = translation[0] || this.getBoundary(k, 'x');
    const x = adjustXY(true, translationX, sx, mx + offset[0] * d);
    const translationY = translation[1] || this.getBoundary(k, 'y');
    const y = adjustXY(true, translationY, sy, my + offset[1] * d);
    transition.apply(this, [false, { a, k, x, y }, 0]);
    // 存储初始数据，交给touchEnd收尾
    this._startMoving.mTransform = {
      a: ma,
      k: mk,
      x: mx,
      y: my,
    };
  }
};
const touchEnd = function touchEnd(this: ImageView) {
  if (this._startMoving) {
    // 只有不存在正在运行的渐变动画，才可以继续执行
    if (this._animation.length === 0) {
      const { offset, sTransform, mTransform } = this._startMoving;
      const { a: ma = 0, k: mk = 1, x: mx = 0, y: my = 0 } = mTransform;
      const { a: sa = 0, k: sk = 1, x: sx = 0, y: sy = 0 } = sTransform;
      const { rotation, scalation, translation } = this;
      const a = adjustAngle(false, rotation, sa + ma);
      const k = adjustScale(false, scalation, sk * mk);
      const d = 1 - k / sk;
      const translationX = translation[0] || this.getBoundary(k, 'x');
      const x = adjustXY(false, translationX, sx + offset[0] * d, mx);
      const translationY = translation[1] || this.getBoundary(k, 'y');
      const y = adjustXY(false, translationY, sy + offset[1] * d, my);
      // 只有当akxy有发生变化了，才会执行，否则不需要执行（动画机制里实际会判断，无变化不执行）
      const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = this._transform;
      if (ta !== a || tk !== k || tx !== x || ty !== y) {
        transition.apply(this, [false, { a, k, x, y }]);
      }
    }
    this._startMoving = null;
  }
};
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  if (this._animation.length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const [cw, ch] = this.getSize();
  const [cx, cy] = this.getCenter();
  const { _transform, dblScale, scalation, translation } = this;
  const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = _transform;
  const dk = adjustScale(
    false,
    scalation,
    checkScale(dblScale) ? dblScale : Math.max(3, (2 * cx) / cw, (2 * cy) / ch),
  );
  let transform = identity();
  // 只有双击缩放比例和当前缩放比例相反的时候才进行双击操作，否则为归位操作
  if ((dk > 1 && tk <= 1) || (dk < 1 && tk >= 1)) {
    // 这个偏移量需要要向着边缘点发散
    // 1/3是占比这个值还需要测测微信，似乎与宽高比有关，并不是固定的
    const ox = adjustOffset(e.point[0] - (cx + tx), (cx * tk) / 3, cx * tk);
    const oy = adjustOffset(e.point[1] - (cy + ty), (cx * tk) / 3, cy * tk);
    const d = 1 - dk / tk;
    const translationX = translation[0] || this.getBoundary(dk, 'x');
    const x = adjustXY(false, translationX, tx + ox * d);
    const translationY = translation[1] || this.getBoundary(dk, 'y');
    const y = adjustXY(false, translationY, ty + oy * d);
    transform = { a: ta, k: dk, x, y };
  }
  transition.apply(this, [false, transform]);
};
const swipe = function swipe(this: ImageView, e: GEvent) {
  if (this._animation.length > 0) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    const { duration, inertiaX, inertiaY } = swipeComputed(0.003);
    const [width, height] = this.getBoxSize();
    const { _transform, translation } = this;
    const { k = 1, x = 0, y = 0 } = _transform;
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationX = translation[0] || this.getBoundary(k, 'x');
    if (isBetween(x, translationX)) {
      // 如果x在translationX范围内，那么x值一定是不含damping过的部分，可以直接使用
      // 调整x方向最终的惯性距离
      const swipeX = adjustSwipeXY(
        x + inertiaX, // x方向最终位移
        (2 * inertiaX) / duration, // x方向初始速度
        translationX, // x方向位移范围
        width,
      );
      // 判断惯性位移后是否超出边界
      const inBoundary = isBetween(swipeX, translationX);
      // 根据是否超出边界使用不同的easingOption
      const eOption = easingOptions[inBoundary ? 'swipe' : 'swipeBounce'];
      // x方向进行惯性位移
      transition
        .apply(this, [true, { x: swipeX }, eOption.duration, eOption.fn])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!inBoundary) {
            transition.apply(this, [
              true,
              { x: adjustXY(false, translationX, swipeX) },
            ]);
          }
        });
    } else {
      // 已经超出边界，不再进行惯性位移，直接归位
      transition.apply(this, [true, { x: adjustXY(false, translationX, x) }]);
    }
    // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    const translationY = translation[1] || this.getBoundary(k, 'y');
    if (isBetween(y, translationY)) {
      // 如果y在translationY范围内，那么y值一定是不含damping过的部分，可以直接使用
      // 调整y方向最终的惯性距离
      const swipeY = adjustSwipeXY(
        y + inertiaY, // y方向最终位移
        (2 * inertiaY) / duration, // y方向初始速度
        translationY, // y方向位移范围
        height,
      );
      // 判断惯性位移后是否超出边界
      const inBoundary = isBetween(swipeY, translationY);
      // 根据是否超出边界使用不同的easingOption
      const eOption = easingOptions[inBoundary ? 'swipe' : 'swipeBounce'];
      /// y方向进行惯性位移
      transition
        .apply(this, [true, { y: swipeY }, eOption.duration, eOption.fn])
        .then(() => {
          // 惯性位移后超出边界，则归位
          if (!inBoundary) {
            transition.apply(this, [
              true,
              { y: adjustXY(false, translationY, swipeY) },
            ]);
          }
        });
    } else {
      // 如果已经在范围之外，就不再进行惯性位移，直接归位
      transition.apply(this, [true, { y: adjustXY(false, translationY, y) }]);
    }
  }
};

class ImageView {
  stage: HTMLElement;
  target: HTMLElement;
  scalation: number[]; // 缩放范围
  translation: number[][]; // 平移范围
  rotation: number[]; // 旋转范围
  dblScale: number; // 双击放大比例

  _startMoving: {
    offset: number[];
    sTransform: Transform;
    mTransform: Transform;
  } | null = null;
  _animation: Array<{ animation: Animation; stop: boolean }> = []; // 此刻正在进行的动画
  _transform: Transform = identity(); // 本次手势操作时的变换
  _gesture: Gesture | null = null; // 手势

  constructor({
    stage,
    target,
    dblScale,
    scalation = [],
    translation = [],
    rotation = [],
  }: IOption) {
    this.stage = stage;
    this.target = target;
    const gesture = new Gesture(this.stage);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    this.dblScale = dblScale; // 1不进行双击缩放，但可双击归位，若不设置，双击时会根据元素尺寸动态设置大小
    this.scalation = [1, 6]; // 都设置1，则不允许缩放，数字都要大于0，小于1缩小，大于1放大
    this.rotation = [0, 0]; // 不能旋转，校正，两数字逆负，顺正都是0-360度
    this.translation = []; /* [
      [-Infinity, Infinity],
      [-Infinity, Infinity],
    ] */ // 不限制平移，都设置0，不允许平移，默认的时候会根据元素尺寸和缩放比例计算为元素边界
    this._gesture = gesture;
  }
  destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
  }
  getSize() {
    // 获取目标元素的宽高
    const { clientWidth, clientHeight } = this.target;
    return [clientWidth, clientHeight];
  }
  getBoxSize() {
    // 获取容器元素的宽高
    const { width, height } = this.stage.getBoundingClientRect();
    return [width, height];
  }
  getCenter() {
    // 获取视图中心点位置
    const { left, top, width, height } = this.stage.getBoundingClientRect();
    return [left + width / 2, top + height / 2];
  }
  getBoundary(k: number, hv?: string) {
    // 获取边界范围
    const [cx, cy] = this.getCenter();
    const [cw, ch] = this.getSize();
    let xBoundary = null;
    if (hv !== 'y') {
      const bx = Math.max((cw * k) / 2 - Math.abs(cx), 0);
      xBoundary = [-bx, bx];
    }
    let yBoundary = null;
    if (hv !== 'x') {
      const by = Math.max((ch * k) / 2 - Math.abs(cy), 0);
      yBoundary = [-by, by];
    }
    return hv === 'x'
      ? xBoundary
      : hv === 'y'
      ? yBoundary
      : [xBoundary, yBoundary];
  }
}

export type IOption = {
  stage: HTMLElement;
  target: HTMLElement;
  dblScale?: number; // 双击放大比例
  scalation?: number[]; // 缩放范围 [0.1, 10]，最小比例0.1和最大比例10
  translation?: number[][]; // 平移范围 [[-10, 20], [-20, 10]]，x最小-10，最大20，y最小-20，最大10
  rotation?: number[]; // 旋转范围 [-10, 20]，逆时针可旋转10度和顺时针可旋转20度
};

export default ImageView;
