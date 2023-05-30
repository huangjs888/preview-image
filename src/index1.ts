/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-27 17:54:09
 * @Description: ******
 */

import Gesture, { type GestureEvent } from './gesture';
import Matrix from './matrix';

const boundRect = { left: 0, top: 0, width: 0, height: 0 };

function rebounceSize(
  value: number,
  friction: number,
  inverse: boolean = false,
) {
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
const touchStart = function touchStart(this: ImageView, e: GestureEvent) {
  const { left, top, width, height } = this.stage
    ? this.stage.getBoundingClientRect()
    : boundRect;
  this._center = [left + width / 2, top + height / 2];
  this._startPoint = e.point;
  if (this.target) {
    // 滑动时，手指放上去，要停止移动
    const matrix3d = window
      .getComputedStyle(this.target)
      .getPropertyValue('transform')
      .split(')')[0]
      .split(', ');
    this._x = +matrix3d[12];
    this._y = +matrix3d[13];
    window.log(this._x, this._y);
    this.transform();
  }
  this._sx = this._x;
  this._sy = this._y;
  this._sk = this._k;
  this._sa = this._a;
};
const touchMove = function touchMove(this: ImageView, e: GestureEvent) {
  const [sx, sy] = this._startPoint;
  const [cx, cy] = this._center;

  let a = this._sa + (e.angle || 0);
  let k = this._sk * (e.scale || 1);
  let x = this._sx + (e.deltaX || 0);
  let y = this._sy + (e.deltaY || 0);
  if (!this.rotation) {
    a = this._sa;
  }
  if (k < this.minScale) {
    k = rebounceSize(k / this.minScale, 0.4) * this.minScale;
  } else if (k > this.maxScale) {
    k = rebounceSize(k / this.maxScale, 0.4) * this.maxScale;
  }
  x += (sx - (cx + this._sx)) * (1 - k / this._sk);
  y += (sy - (cy + this._sy)) * (1 - k / this._sk);
  if (this.translation === 'forbidden') {
    x = this._sx + rebounceSize(x - this._sx, 0.8);
    y = this._sy + rebounceSize(y - this._sy, 0.8);
  } else if (this.translation === 'boundary') {
    const { width, height } = this.target || boundRect;
    const bx = Math.max((width * k) / 2 - Math.abs(cx), 0);
    const by = Math.max((height * k) / 2 - Math.abs(cy), 0);
    if (x < -bx) {
      x = -bx + rebounceSize(x + bx, 0.8);
    } else if (x > bx) {
      x = bx + rebounceSize(x - bx, 0.8);
    }
    if (y < -by) {
      y = -by + rebounceSize(y + by, 0.8);
    } else if (y > by) {
      y = by + rebounceSize(y - by, 0.8);
    }
  }
  this._x = x;
  this._y = y;
  this._k = k;
  this._a = a;
  this.transform(0);
};
const doubleTap = function doubleTap(this: ImageView, e: GestureEvent) {
  const [cx, cy] = this._center;
  const { width, height } = this.target || boundRect;
  const k = Math.max(this.doubleScale, (2 * cx) / width, (2 * cy) / height);
  if (k === 1 || (k > 1 && this._k > 1) || (k < 1 && this._k < 1)) {
    this._k = 1;
    this._x = 0;
    this._y = 0;
    this._a = 0;
  } else {
    const [ex, ey] = e.point;
    this._x += (ex - (cx + this._x)) * (1 - k / this._sk);
    this._y += (ey - (cy + this._y)) * (1 - k / this._sk);
    this._k = k;
  }
};
const touchEnd = function touchEnd(this: ImageView, e: GestureEvent) {
  const [sx, sy] = this._startPoint;
  const [ex, ey] = e.point;
  const [cx, cy] = this._center;
  const { width, height } = this.target || boundRect;
  // swipe
  let ix = 0;
  let iy = 0;
  let timing = this.timing;
  let duration = this.duration;
  const velocity = e.velocity || 0;
  if (velocity > 0 && e.swipeComputed) {
    window.log(11111);
    const { inertiaX, inertiaY, duration: _duration } = e.swipeComputed(0.0015);
    ix = inertiaX;
    iy = inertiaY;
    duration = Math.min(2.5, _duration / 1000);
    timing = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  }
  let a = this._a;
  let k = this._k;
  let x = this._sx + (ex + ix - sx);
  let y = this._sy + (ey + iy - sy);
  if (!this.rotation) {
    a = this._sa;
  }
  k = Math.max(this.minScale, Math.min(this.maxScale, k));
  x += (sx - (cx + this._sx)) * (1 - k / this._sk);
  y += (sy - (cy + this._sy)) * (1 - k / this._sk);
  if (this.translation === 'forbidden') {
    duration = this.duration;
    timing = this.timing;
    x = this._sx;
    y = this._sy;
  } else if (this.translation === 'boundary') {
    const bx = Math.max((width * k) / 2 - Math.abs(cx), 0);
    const by = Math.max((height * k) / 2 - Math.abs(cy), 0);
    if ((x - ix < -bx || x - ix > bx) && (y - iy < -by || y - iy > by)) {
      duration = this.duration;
      timing = this.timing;
    }
    x = Math.max(Math.min(x, bx), -bx);
    y = Math.max(Math.min(y, by), -by);
  }
  this._x = x;
  this._y = y;
  this._k = k;
  this._a = a;
  this.transform(duration, timing);
};

class ImageView {
  stage: HTMLElement | null; // 舞台元素
  target: HTMLElement | null; // 目标元素
  _center: [number, number] | null = null; // 视图中心点
  _bounds: [number, number, number, number] | null = null; // 视图边界
  doubleScale: number; // 双击放大比例
  maxScale: number; // 最大缩放比例
  minScale: number; // 最小缩放比例
  rotation: boolean; // 是否可以旋转
  translation: ITranslation; // 平移类型
  duration: number; // 变换动画时间
  timing: Timing; // 滑动时动画的函数
  _gesture: Gesture | null; // 手势
  _perspective: number; // css-transform-perspective
  _sx: number = 0; // 本次手势开始时x方向位移
  _sy: number = 0; // 本次手势开始时y方向位移
  _sk: number = 1; // 本次手势开始时缩放比例
  _sa: number = 0; // 本次手势开始时旋转角度
  _x: number = 0; // 本次手势操作时x方向位移
  _y: number = 0; // 本次手势操作时y方向位移
  _k: number = 1; // 本次手势操作时缩放比例
  _a: number = 0; // 本次手势操作时旋转角度
  _destory: boolean = false; // 是否销毁
  constructor({
    stage,
    target,
    perspective = 500,
    duration = 0.25,
    timing = 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    doubleScale = 3,
    maxScale = 6.5,
    minScale = 1,
    translation = 'boundary',
    rotation = false,
  }: IOption) {
    this.stage = stage;
    this.target = target;
    const gesture = new Gesture(this.stage);
    if (gesture.done()) {
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this.doubleScale = doubleScale;
    this.maxScale = maxScale;
    this.minScale = minScale;
    this.rotation = rotation;
    this.translation = translation;
    this.duration = duration;
    this.timing = timing;
    this._gesture = gesture;
    this._destory = false;
    this._perspective = perspective;
    this.transform();
  }
  destory() {
    this._destory = true;
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
  }
  scaleTo(k: number = this._k, immediately: boolean = true) {
    // 直接缩放到 k
    if (this._destory) {
      return;
    }
    this._k = Math.max(this.minScale, Math.min(this.maxScale, k));
    if (immediately) {
      this.transform();
    }
  }
  scale(k: number = this._k, immediately: boolean = true) {
    // 在原来的基础上缩放 k
    this.scaleTo(this._k * k, immediately);
  }
  rotateTo(a: number = this._a, immediately: boolean = true) {
    // 直接旋转到 a
    if (this._destory) {
      return;
    }
    this._a = this.rotation ? a : 0;
    if (immediately) {
      this.transform();
    }
  }
  rotate(a: number = this._a, immediately: boolean = true) {
    // 在原来的基础上再旋转 a
    this.rotateTo(this._a + a, immediately);
  }
  translateTo(
    x: number = this._x,
    y: number = this._y,
    immediately: boolean = true,
  ) {
    // 直接平移到 x, y
    if (this._destory) {
      return;
    }
    if (this.translation === 'infinity') {
      // 随便移动的情况，就在当前平移
      this._x = x;
      this._y = y;
    } else if (this.translation === 'forbidden') {
      // 禁止移动的情况，在起初平移的基础上进行rebounce平移
      this._x = this._x;
      this._y = this._y;
    } else {
      // 边界情况，在边界内就是当前平移，超出边界在边界的基础上进行rebounce平移
      const { width: sw, height: sh } = this.stage
        ? this.stage.getBoundingClientRect()
        : boundRect;
      const { width: tw, height: th } = this.target
        ? this.target.getBoundingClientRect()
        : boundRect;
      const bx = Math.max((tw - sw) / 2, 0);
      const by = Math.max((th - sh) / 2, 0);
      this._x = Math.max(Math.min(x, bx), -bx);
      this._y = Math.max(Math.min(y, by), -by);
    }
    if (immediately) {
      this.transform();
    }
  }
  translate(
    x: number = this._x,
    y: number = this._y,
    immediately: boolean = true,
  ) {
    // 在原来的基础上平移 x, y
    this.translateTo(this._x + x, this._x + y, immediately);
  }
  transform(duration: number = this.duration, timing: Timing = this.timing) {
    if (this._destory) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      // 放入下一帧执行（move的时候使用这个节能而且不抖动）
      window.requestAnimationFrame(() => {
        const ele = this.target;
        if (!ele) {
          return;
        }
        const matrix = new Float32Array(16);
        Matrix.identity(matrix);
        Matrix.translate(matrix, this._x, this._y, 0);
        Matrix.scale(matrix, this._k, this._k, this._k);
        Matrix.rotate(matrix, this._a, 0, 0, 1);
        const perspective = this._perspective
          ? `perspective(${this._perspective}px) `
          : '';
        const matrix3d = `matrix3d(${Array.prototype.slice
          .call(matrix)
          .join(',')})`;
        ele.style.setProperty('transform', perspective + matrix3d);
        const transition =
          duration <= 0 ? '' : `transform ${duration}s ${timing}`;
        ele.style.setProperty('transition', transition);
        ele.ontransitionend = (e: TransitionEvent) => {
          // 阻止冒泡及后续事件触发
          e.stopImmediatePropagation();
          // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
          if (e.target === ele && e.propertyName === 'transform') {
            ele.ontransitionend = null;
            resolve();
          }
        };
      });
    });
  }
}
export type Timing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | `cubic-bezier(${number},${number},${number},${number})`;

export type ITranslation = 'forbidden' | 'boundary' | 'infinity';

export type IOption = {
  stage: HTMLElement;
  target: HTMLElement;
  perspective?: number; // css-transform-perspective
  duration?: number; // 变换动画时间
  timing?: Timing; // 滑动时动画的函数
  doubleScale?: number; // 双击放大比例
  maxScale?: number; // 最大缩放比例
  minScale?: number; // 最小缩放比例
  translation?: ITranslation; // 平移类型
  rotation?: boolean; // 是否可以旋转
};

export default ImageView;
