/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-15 17:48:00
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import Transform from './transform';
import Animation, { Easing } from './animation';

const boundRect = { left: 0, top: 0, width: 0, height: 0 };
const transitionMap = {
  swipeBounce: {
    duration: 400, // swipe超出边界情况下移动时间
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (t: number) {
      return t * (2 - t);
    },
  },
  swipe: {
    duration: 2000, // swipe未超出边界情况下移动时间（需要和减速时间比较取最小值）
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t: number) {
      return 1 - --t * t * t * t;
    },
  },
  bounce: {
    duration: 500, // swipe超出边界后反弹的时间
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t: number) {
      return 1 - --t * t * t * t;
    },
  },
};

// 阻尼函数
function bounce(x: number, max: number) {
  let y = Math.abs(x);
  y = (0.82231 * max) / (1 + 4338.47 / Math.pow(y, 1.14791));
  return Math.round(x < 0 ? -y : y);
}
function bounce2(value: number, friction: number, inverse: boolean = false) {
  if (value === 0) {
    return 0;
  }
  if (friction <= 0) {
    return 1;
  }
  const v = value || 1;
  let f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return (Math.pow(Math.abs(v), f) * v) / Math.abs(v);
}
const touchMove = function touchMove(this: ImageView, e: GEvent) {
  const { _transform, rotation, scalation /* , translation */ } = this;
  const translation = this.getBoundary();
  const { a: sa, k: sk, x: sx, y: sy } = this._startTransform;
  let a = sa + (e.angle || 0);
  let k = sk * (e.scale || 1);
  let x = sx + (e.deltaX || 0);
  let y = sy + (e.deltaY || 0);
  a = 0; // Math.max(rotation[0], Math.min(rotation[1], a % 360));
  if (k < scalation[0]) {
    k = bounce2(k / scalation[0], 0.4) * scalation[0];
  } else if (k > scalation[1]) {
    k = bounce2(k / scalation[1], 0.4) * scalation[1];
  }
  const dt = 1 - k / sk;
  x += this._offset[0] * dt;
  y += this._offset[1] * dt;
  if (x < translation[0][0]) {
    x = translation[0][0] + bounce2(x - translation[0][0], 0.8);
  } else if (x > translation[0][1]) {
    x = translation[0][1] + bounce2(x - translation[0][1], 0.8);
  }
  if (y < translation[1][0]) {
    y = translation[1][0] + bounce2(y - translation[1][0], 0.8);
  } else if (y > translation[1][1]) {
    y = translation[1][1] + bounce2(y - translation[1][1], 0.8);
  }
  transition.apply(this, [new Transform(a, k, x, y), 0]);
};
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  const { _transform, dblScale } = this;
  const { a, k, x, y } = _transform;
  if (dblScale === 1 || (dblScale > 1 && k > 1) || (dblScale < 1 && k < 1)) {
    this.transformTo(a, 1, x, y, this.getOffset(e.point));
  } else {
    this.transformTo(a, dblScale, x, y, this.getOffset(e.point));
  }
  this._offset = null;
  this._startTransform = null;
};

function ok(
  value: number,
  delta: number,
  time: number,
  size: number,
  [min, max]: number[],
  callback: (v: number, d: number, e: Easing) => void,
) {
  if (value < min || value > max) {
    // 如果值已经超过最大或最小，则不再进行惯性位移
    return true;
  }
  let newValue = value + delta;
  const _delta = Math.abs((size / 15) * ((2 * delta) / time));
  if (newValue < min) {
    newValue = Math.max(min - size / 5, min - _delta);
  } else if (newValue > max) {
    newValue = Math.min(max + size / 5, max + _delta);
  }
  const tm =
    transitionMap[newValue < min || newValue > max ? 'swipeBounce' : 'swipe'];
  callback(newValue, tm.duration, tm.fn);
}
const swipe = function swipe(this: ImageView, e: GEvent) {
  const { _transform /* , translation */ } = this;
  const translation = this.getBoundary();
  const [width, height] = this.getSize();
  const velocity = e.velocity || 0;
  if (velocity > 0 && e.swipeComputed) {
    // 设置减速度为0.003的到速度减为0时的滑动距离和时间
    const { duration: time, inertiaX, inertiaY } = e.swipeComputed(0.003);
    if (
      ok(
        _transform.x,
        inertiaX,
        time,
        width,
        translation[0],
        (x, duration, easing) => {
          transition
            .apply(this, [new Transform(null, null, x, null), duration, easing])
            .then(() => {
              const _x = Math.max(
                Math.min(this._transform.x, translation[0][1]),
                translation[0][0],
              );
              transition.apply(this, [new Transform(null, null, _x, null)]);
            });
        },
      )
    ) {
      const _x = Math.max(
        Math.min(this._transform.x, translation[0][1]),
        translation[0][0],
      );
      transition.apply(this, [new Transform(null, null, _x, null)]);
    }
    if (
      ok(
        _transform.y,
        inertiaY,
        time,
        height,
        translation[1],
        (y, duration, easing) => {
          transition
            .apply(this, [new Transform(null, null, null, y), duration, easing])
            .then(() => {
              const _y = Math.max(
                Math.min(this._transform.y, translation[1][1]),
                translation[1][0],
              );
              transition.apply(this, [new Transform(null, null, null, _y)]);
            });
        },
      )
    ) {
      const _y = Math.max(
        Math.min(this._transform.y, translation[1][1]),
        translation[1][0],
      );
      transition.apply(this, [new Transform(null, null, null, _y)]);
    }
    this._offset = null;
    this._startTransform = null;
  }
};
const touchEnd = function touchEnd(this: ImageView, e: GEvent) {
  if (this._startTransform) {
    this._offset = null;
    this._startTransform = null;
    const { a, k, x, y } = this._transform;
    this.transformTo(a, k, x, y, this.getOffset(e.point));
  }
};
const touchStart = function touchStart(this: ImageView, e: GEvent) {
  this._animation.forEach((a) => {
    a.stop();
  });
  this._offset = this.getOffset(e.point);
  this._startTransform = this._transform;
};
class ImageView {
  stage: HTMLElement | null = null;
  target: HTMLElement | null = null;
  dblScale: number; // 双击放大比例
  scalation: number[] | null = null; // 缩放范围
  translation: number[][] | null = null; // 平移范围
  rotation: number[] | null = null; // 旋转范围
  _animation: Animation[] = []; // 此刻正在进行的动画
  _offset: [number, number] | null = null; // 视图中心点
  _startTransform: Transform | null = null; // 本次手势开始时的变换
  _transform: Transform | null = null; // 本次手势操作时的变换
  _gesture: Gesture | null = null; // 手势
  _destory: boolean = false; // 是否销毁
  constructor({
    stage,
    target,
    dblScale = 3,
    scalation = [],
    translation = [],
    rotation = [],
  }: IOption) {
    this.stage = stage;
    this.target = target;
    const gesture = new Gesture(this.stage);
    if (gesture.done()) {
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    /* // 不指定dblScale的情况下
    const [cx, cy] = this._center;
    const { width, height } = this.target || boundRect;
    const dblScale = Math.max(dblScale, (2 * cx) / width, (2 * cy) / height); */
    this.dblScale = 3; // 1不进行双击缩放，若不设置，双击时会根据元素尺寸动态设置大小
    this.scalation = [1, 6]; // 都设置1，则不允许缩放，数字都要大于0，小于1缩小，大于1放大
    this.rotation = [0, 0]; // 不能旋转，校正，两数字逆负，顺正都是0-360度
    this.translation = [
      [-Infinity, Infinity],
      [-Infinity, Infinity],
    ]; // 不限制平移，都设置0，不允许平移，默认的时候会根据元素尺寸和缩放比例计算为元素边界
    this._gesture = gesture;
    this._destory = false;
    this._transform = Transform.identity();
    this.transform();
  }
  destory() {
    this._destory = true;
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
      this._animation = null;
    }
  }
  getCenter() {
    // 获取视图中心点位置
    const { left, top, width, height } = this.stage
      ? this.stage.getBoundingClientRect()
      : boundRect;
    return [left + width / 2, top + height / 2];
  }
  getSize() {
    // 获取边界范围
    const { width, height } = this.stage
      ? this.stage.getBoundingClientRect()
      : boundRect;
    return [width, height];
  }
  getBoundary() {
    // 获取边界范围
    const k = this._transform.k;
    const { width, height } = this.target;
    const [cx, cy] = this.getCenter();
    const bx = Math.max((width * k) / 2 - Math.abs(cx), 0);
    const by = Math.max((height * k) / 2 - Math.abs(cy), 0);
    return [
      [-bx, bx],
      [-by, by],
    ];
  }
  getOffset(point: number[]) {
    // 获取中心点相对该点的偏移量
    if (point && typeof point[0] === 'number' && typeof point[1] === 'number') {
      const [cx, cy] = this.getCenter();
      return [
        point[0] - (cx + this._transform.x),
        point[1] - (cy + this._transform.y),
      ];
    }
    return [0, 0];
  }
  scaleTo(k: number, offset?: number[]) {
    // 直接缩放到 k, offset 是缩放中心位置的偏移量 [x,y]
    return this.transformTo(0, k, 0, 0, offset);
  }
  scale(k: number, offset?: number[]) {
    // 在原来的基础上缩放 k, offset 是缩放中心位置的偏移量 [x,y]
    return this.transform(0, k, 0, 0, offset);
  }
  rotateTo(a: number) {
    // 直接旋转到 a
    return this.transformTo(a, 1, 0, 0);
  }
  rotate(a: number) {
    // 在原来的基础上再旋转 a
    return this.transform(a, 1, 0, 0);
  }
  translateTo(x: number, y: number) {
    // 直接平移到 x, y
    this.transformTo(0, 1, x, y);
  }
  translate(x: number, y: number) {
    // 在原来的基础上平移 x, y
    this.transform(0, 1, x, y);
  }
  scaleTo(k: number, offset?: number[]) {
    // 直接缩放到 k, offset 是缩放中心位置的偏移量 [x,y]
    return this.transformTo(this._a, k, this._x, this._y, offset);
  }
  rotateTo(a: number) {
    // 直接旋转到 a
    return this.transformTo(a, this._k, this._x, this._y);
  }
  translateTo(x: number, y: number) {
    // 直接平移到 x, y
    return this.transformTo(this._a, this._k, x, y);
  }
  scale(k: number, offset?: number[]) {
    // 在原来的基础上缩放 k, offset 是缩放中心位置的偏移量 [x,y]
    return this.transform(0, k, 0, 0, offset);
  }
  rotate(a: number) {
    // 在原来的基础上再旋转 a
    return this.transform(a, 1, 0, 0);
  }
  translate(x: number, y: number) {
    // 在原来的基础上平移 x, y
    return this.transform(0, 1, x, y);
  }
  transform(
    a: number = 0,
    k: number = 1,
    x: number = 0,
    y: number = 0,
    offset?: number[],
  ) {
    // 在原来的基础变换
    const { a: sa, k: sk, x: sx, y: sy } = this._transform;
    this.transformTo(sa + a, sk * k, sx + x, sy + y, offset);
  }
  transformTo(
    a: number = 0,
    k: number = 1,
    x: number = 0,
    y: number = 0,
    offset?: number[],
  ) {
    // 直接变换到指定值
    const sk = this._transform.k;
    const { rotation, scalation /* , translation */ } = this;
    const translation = this.getBoundary();
    const _a = a; // Math.max(Math.min(a % 360,rotation[1]),rotation[0]);
    const _k = Math.max(Math.min(k, scalation[1]), scalation[0]);
    let _x = x;
    let _y = y;
    if (
      offset &&
      typeof offset[0] === 'number' &&
      typeof offset[1] === 'number'
    ) {
      const dt = 1 - _k / sk;
      _x += offset[0] * dt;
      _y += offset[1] * dt;
    }
    _x = Math.max(Math.min(_x, translation[0][1]), translation[0][0]);
    _y = Math.max(Math.min(_y, translation[1][1]), translation[1][0]);
    transition.apply(this, [new Transform(_a, _k, _x, _y)]);
  }
}

function transition(
  this: ImageView,
  transform: Transform,
  duration: number = 400,
  easing: Easing = transitionMap.bounce.fn,
) {
  if (this._destory) {
    return Promise.reject(new Error('Component destroyed...'));
  }
  return new Promise<void>((resolve, reject) => {
    if (!this.target) {
      reject(new Error('No target element...'));
      return;
    }
    if (!this._transform) {
      reject(new Error('No transform data...'));
      return;
    }
    const element = this.target;
    const { k: sk, x: sx, y: sy, a: sa } = this._transform;
    const { k: ek, x: ex, y: ey, a: ea } = transform;
    const animation = new Animation({ duration, easing });
    animation.start((progress) => {
      const _transform = new Transform(
        ea === null ? this._transform.a : (ea - sa) * progress + sa,
        ek === null ? this._transform.k : (ek - sk) * progress + sk,
        ex === null ? this._transform.x : (ex - sx) * progress + sx,
        ey === null ? this._transform.y : (ey - sy) * progress + sy,
      );
      element.style.setProperty('transform', _transform.toString());
      this._transform = _transform;
    });
    animation.on('end', () => resolve());
    // animation.on('cancel', () => resolve());
    this._animation.push(animation);
  });
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
