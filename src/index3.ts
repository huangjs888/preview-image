/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-16 14:40:12
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import Transform from './transform';
import Animation, { Easing } from './animation';

function isBetween(x: number, [min, max]: number[]) {
  return min > x && x > max;
}

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
const doubleTap = function doubleTap(this: ImageView, e: GEvent) {
  const _k = this._transform.k;
  let k = this.dblScale;
  if (k === 1 || (k > 1 && _k > 1) || (k < 1 && _k < 1)) {
    k = 1;
  }
  const offset = this.getOffset(e.point);
  const dt = 1 - k / this._transform.k;
  const x = this._transform.x + offset[0] * dt;
  const y = this._transform.y + offset[1] * dt;
  transition.apply(this, [{ k, x, y }]);
};
function rotateOk(value: number, [min, max]: number[]) {
  return 0;
}
const rotate = function rotate(this: ImageView, e: GEvent) {
  this._moving = true;
  const a = rotateOk(this._transform.a + (e.angle || 0), this.rotation);
  transition.apply(this, [{ a }, 0]);
};

const touchStart = function touchStart(this: ImageView, e: GEvent) {
  Object.keys(this._animation).forEach((k) => {
    this._animation[k].stop();
    delete this._animation[k];
  });
  this._startTransform = this._transform;
  this._offset = this.getOffset();
};
const touchMove = function touchMove(this: ImageView, e: GEvent) {
  const { a: sa, k: sk, x: sx, y: sy } = this._startTransform;
  let a = sa + (e.angle || 0);
  let k = sk * (e.scale || 1);
  let x = sx + (e.deltaX || 0);
  let y = sy + (e.deltaY || 0);
  a = adjustAngle(a, true);
  k = adjustScale(k, true);
  const dk = 1 - k / sk;
  x += this._offset[0] * dk;
  y += this._offset[1] * dk;
  x = adjustX(x, true);
  y = adjustY(y, true);
  transition.apply(this, [{ a, k, x, y }, 0]);
};
const touchEnd = function touchEnd(this: ImageView, e: GEvent) {
  if (this._moving) {
    this._moving = false;
    const { a, k, x, y } = this._transform;
    transition.apply(this, [{ a, k, x, y }]);
  }
};

let guid = 0;
function transition(
  this: ImageView,
  transform,
  duration: number = 400,
  easing: Easing = transitionMap.bounce.fn,
) {
  return new Promise((resolve) => {
    guid++;
    const transformStart = this._transform.toJson();
    const animation = new Animation({ duration, easing });
    animation.start((progress) => {
      const newTransform = {};
      Object.keys(transform).forEach((key) => {
        const startValue = transformStart[key];
        const endValue = transform[key];
        newTransform[key] = (endValue - startValue) * progress + startValue;
      });
      this._transform = Transform.transform({
        ...this._transform,
        ...newTransform,
      });
      this.target.style.setProperty('transform', this._transform.toString());
      if (progress === 1) {
        delete this._animation[guid];
        resolve();
      }
    });
    this._animation[guid] = animation;
  });
}
function swipeOk(
  value: number,
  velocity: number,
  size: number,
  [min, max]: number[],
) {
  let val = value;
  const delta = Math.abs((size / 15) * velocity);
  if (value < min) {
    val = Math.max(min - size / 5, min - delta);
  } else if (value > max) {
    val = Math.min(max + size / 5, max + delta);
  }
  return {
    value: val,
    ...transitionMap[value < min || value > max ? 'swipeBounce' : 'swipe'],
  };
}
const swipe = function swipe(this: ImageView, e: GEvent) {
  this.moving = false;
  const [width, height] = this.getSize();
  const translation = this.getBoundary();
  const { velocity = 0, swipeComputed } = e;
  if (velocity > 0 && swipeComputed) {
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    const { duration, inertiaX, inertiaY } = swipeComputed(0.003);
    if (isBetween(this._transform.x, translation[0])) {
      const x = swipeOk(
        this._transform.x + inertiaX,
        (2 * inertiaX) / duration,
        width,
        translation[0],
      );
      transition.apply(this, [{ x: x.value }, x.duration, x.fn]).then(() => {
        transition.apply(this, [{ x: this._transform.x }]);
      });
    }
    if (isBetween(this._transform.y, translation[1])) {
      const y = swipeOk(
        'y',
        this._transform.y + inertiaY,
        (2 * inertiaY) / duration,
        height,
        translation[1],
      );
      transition.apply(this, [{ y: y.value }, y.duration, y.fn]).then(() => {
        transition.apply(this, [{ y: this._transform.y }]);
      });
    }
  }
};
function panOk(
  value: number,
  isBounce: boolean,
  size: number,
  [min, max]: number[],
) {
  /* if (value < min) {
    return min + (isBounce ? value / 3 : 0);
  } else if (value > max) {
    return max + (isBounce ? value / 3 : 0);
  } */
  return value;
}
const pan = function pan(this: ImageView, e: GEvent) {
  this._moving = true;
  const [width, height] = this.getSize();
  const translation = this.getBoundary();
  let x = this._transform.x + (e.deltaX || 0);
  let y = this._transform.y + (e.deltaY || 0);
  x = panOk(x, true, width, translation[0]);
  y = panOk(y, true, height, translation[1]);
  console.log(this._transform.x, this._transform.y);
  transition.apply(this, [{ x, y }, 0]);
};
function pinchOk(value: number, isBounce: boolean, [min, max]: number[]) {
  /*  if (value < min) {
    return min * (isBounce ? bounce2(value / min, 0.4) : 1);
  } else if (value > max) {
    return max * (isBounce ? bounce2(value / max, 0.4) : 1);
  } */
  return value;
}
const pinch = function pinch(this: ImageView, e: GEvent) {
  this._moving = true;
  const offset = this.getOffset(e.point);
  let k = this._transform.k * (e.scale || 1);
  /* k = pinchOk(k, true, this.scalation);
  const dt = 1 - k / this._transform.k;
  const x = this._transform.x + offset[0] * dt;
  const y = this._transform.y + offset[1] * dt; */
  transition.apply(this, [{ k }, 0]);
};

class ImageView {
  stage: HTMLElement;
  target: HTMLElement;
  scalation: number[]; // 缩放范围
  translation: number[][]; // 平移范围
  rotation: number[]; // 旋转范围
  dblScale: number; // 双击放大比例
  _moving: boolean = false;
  _animation: { [key: string]: Animation } = {}; // 此刻正在进行的动画
  _transform: Transform = Transform.identity(); // 本次手势操作时的变换
  _gesture: Gesture | null = null; // 手势
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
      /* gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('pan', pan.bind(this)); */
      gesture.on('pinch', pinch.bind(this));
      /* gesture.on('rotate', rotate.bind(this));
      gesture.on('multiPan', pan.bind(this));
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this)); */
    }
    this._gesture = gesture;
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
  }
  destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
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
    // 获取视图
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
