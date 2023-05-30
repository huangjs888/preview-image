/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-27 11:49:29
 * @Description: ******
 */
import EventTarget, { type IBaseEvent } from './event';
import {
  fixOption,
  isTouchable,
  getDirection,
  getDistance,
  getAngle,
  getCenter,
  getVelocity,
  getVector,
} from './util';

const isCurrentTarget = (target: HTMLElement, currentTarget: HTMLElement) => {
  let _target: HTMLElement | null = target;
  while (_target && _target !== currentTarget) {
    _target = _target.parentNode as HTMLElement;
  }
  return !!_target;
};

function touchstarted(this: Gesture, event: TouchEvent) {
  const _touches = event.touches;
  if (!_touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const newEvent: GestureEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timeStamp: Date.now(),
    point: [0, 0],
  };
  // 忽略掉注册事件元素之外的手指
  const touches: Touch[] = Array.prototype.filter.call(event.touches, (t) =>
    isCurrentTarget(
      t.target as HTMLElement,
      event.currentTarget as HTMLElement,
    ),
  );
  // const touches = _touches;
  // 表示第一次放入手指
  if (event.changedTouches.length === touches.length) {
    this._touch0 = null;
    this._touch1 = null;
  }
  // 如果当前事件元素之外的屏幕上有手指，此时在事件元素上放一个手指，touches会包含该手指
  // 循环保存放在屏幕上的手指，这里只会保存最多两个，忽略超过三个的手指（只对单指和双指情形处理）
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p = [t.pageX, t.pageY];
    const touch = [p, p, [t.identifier]];
    if (!this._touch0) {
      this._touch0 = touch;
    } else if (!this._touch1 && this._touch0[2][0] !== t.identifier) {
      this._touch1 = touch;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  this._swipePoint = null;
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  if (this._touch1 && this._touch0) {
    newEvent.point = getCenter(this._touch0[0], this._touch1[0]);
    this.trigger('gestureStart', newEvent);
  }
  // 单指start
  else if (this._touch0) {
    newEvent.point = this._touch0[0];
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(() => {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      this._preventTap = true;
      this._preventSingleTap = true;
      this._preventDoubleTap = true;
      this._swipePoint = null;
      this._longTapTimer = null;
      if (this._touch0) {
        newEvent.waitTime = this.longTapInterval;
        this.trigger('longTap', newEvent);
      }
    }, this.longTapInterval);
    if (
      this._singleTapTimer &&
      this._firstPoint &&
      getDistance(this._firstPoint, this._touch0[0]) < this.doubleTapDistance
    ) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指，或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      clearTimeout(this._singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
    } else {
      this._firstPoint = this._touch0[0];
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.trigger('touchStart', newEvent);
}

function touchmoved(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const newEvent: GestureEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timeStamp: Date.now(),
    point: [0, 0],
  };
  // 循环更新手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p = [t.pageX, t.pageY];
    if (this._touch0 && this._touch0[2][0] === t.identifier) {
      this._touch0[1] = p;
    } else if (this._touch1 && this._touch1[2][0] === t.identifier) {
      this._touch1[1] = p;
    }
  }
  // 手指移动至少要有一个手指移动超过touchMoveDistance才会触发移动事件
  if (
    (this._touch0 &&
      getDistance(this._touch0[0], this._touch0[1]) > this.touchMoveDistance) ||
    (this._touch1 &&
      getDistance(this._touch1[0], this._touch1[1]) > this.touchMoveDistance)
  ) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (this._touch1 && this._touch0) {
      // 双指平移
      const eCenter = getCenter(this._touch0[1], this._touch1[1]);
      const sCenter = getCenter(this._touch0[0], this._touch1[0]);
      newEvent.point = eCenter;
      newEvent.direction = getDirection(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      const eDistance = getDistance(this._touch0[1], this._touch1[1]);
      const sDistance = getDistance(this._touch0[0], this._touch1[0]);
      if (sDistance > 0 && eDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / sDistance;
      }
      const eAngle = getAngle(this._touch0[1], this._touch1[1]);
      const sAngle = getAngle(this._touch0[0], this._touch1[0]);
      // 双指旋转
      newEvent.angle = sAngle - eAngle;
      this.trigger('multiPan', newEvent);
      if (sDistance > 0 && eDistance > 0) {
        this.trigger('pinch', newEvent);
      }
      this.trigger('rotate', newEvent);
      this.trigger('gestureMove', newEvent);
    }
    // 单指移动
    else if (this._touch0) {
      const _timeStamp = Date.now();
      // 记录swipe阶段花费的时间
      this._swipeDuration = _timeStamp - this._swipeTime;
      // 一旦swipe阶段花费的时间大于swipeInterval，则之前的移动均不视为swipe，然后重新开始记录swipe阶段
      if (this._swipeDuration >= this.swipeInterval) {
        // 更新swipe起点和起点时间，并把耗费时间重置为0
        this._swipeTime = _timeStamp;
        this._swipePoint = this._touch0[1];
        this._swipeDuration = 0;
      }
      newEvent.point = this._touch0[1];
      newEvent.direction = getDirection(this._touch0[0], this._touch0[1]);
      newEvent.deltaX = this._touch0[1][0] - this._touch0[0][0];
      newEvent.deltaY = this._touch0[1][1] - this._touch0[0][1];
      // 触发单指平移事件
      this.trigger('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.trigger('touchMove', newEvent);
  }
}

function touchended(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.stopImmediatePropagation();
  const newEvent: GestureEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timeStamp: Date.now(),
    point: [0, 0],
  };
  // 临时保存当前手指
  let touch0: number[][] | null = null;
  let touch1: number[][] | null = null;
  // 循环删除已经拿开的手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    if (this._touch0 && this._touch0[2][0] === t.identifier) {
      touch0 = this._touch0;
      this._touch0 = null;
    } else if (this._touch1 && this._touch1[2][0] === t.identifier) {
      touch1 = this._touch1;
      this._touch1 = null;
    }
  }
  // 双指变单指
  if (this._touch1 && !this._touch0) {
    this._touch0 = this._touch1;
    this._touch1 = null;
    touch1 = touch0;
    touch0 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指
  if (this._touch0) {
    newEvent.point = getCenter(
      this._touch0[1],
      this._touch1 ? this._touch1[1] : touch1 ? touch1[1] : [],
    );
    this.trigger('gestureEnd', newEvent);
  }
  // 全部拿开（双指同时抬起，最后一指抬起，仅仅一指抬起）
  else if (touch0) {
    newEvent.point = touch1 ? getCenter(touch0[1], touch1[1]) : touch0[1];
    if (!this._preventTap) {
      this.trigger('tap', newEvent);
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(() => {
        this._singleTapTimer = null;
        newEvent.delayTime = this.doubleTapInterval;
        this.trigger('singleTap', newEvent);
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      newEvent.intervalTime = this.doubleTapInterval;
      this.trigger('doubleTap', newEvent);
    }
    const {
      _swipePoint,
      _swipeTime,
      _swipeDuration,
      swipeInterval,
      swipeDeceleration,
    } = this;
    if (
      _swipePoint && // 要求起点必须存在，移动过程中，会根据每次移动时间大于swipeInterval来不断更新swipe阶段的起点和时间戳
      _swipeDuration > 0 && // 要求处于swipe阶段所花费的时间必须大于0，等于0的情况：正好更新更新swipe阶段的时候停止移动（不再触发move事件）
      _swipeDuration < swipeInterval && // 要求处于swipe阶段所花费的时间必须小于swipeInterval（此处其实可以不判断，因为一旦大于，会被更新掉）
      Date.now() - _swipeTime - _swipeDuration < swipeInterval // 最后一次移动事件到手指抬起的时间间隔必须小于swipeInterval，即移动一旦停止后应该在swipeInterval时间内立马抬起，否则不视为swipe阶段
    ) {
      // 抬起时swipe阶段的速度
      const velocity = getVelocity(
        _swipeDuration,
        getDistance(_swipePoint, touch0[1]),
      );
      // 根据swipe阶段速度，给定一个减速度swipeDeceleration，计算出速度减到0时，x分量和y分量的惯性距离
      const [inertiaX, inertiaY] = getVector(
        (velocity * velocity) / swipeDeceleration,
        getAngle(_swipePoint, touch0[1]),
      );
      // 按照velocity速度，减到0时，需要的时间
      newEvent.duration = (2 * velocity) / swipeDeceleration;
      newEvent.inertiaX = inertiaX;
      newEvent.inertiaY = inertiaY;
      newEvent.velocity = velocity;
      // 惯性的方向
      newEvent.direction = getDirection(_swipePoint, touch0[1]);
      // 惯性后最终的点
      newEvent.point = [touch0[1][0] + inertiaX, touch0[1][1] + inertiaY];
      this.trigger('swipe', newEvent);
    }
  }
  this.trigger('touchEnd', newEvent);
  // 只剩下一根在上面了
  if (this._touch0 && !this._touch1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._touch0[0] = this._touch0[1];
    // 同时可以触发一次start事件
    newEvent.point = this._touch0[0];
    this.trigger('touchStart', newEvent);
  }
}

function touchcanceled(this: Gesture, event: TouchEvent) {
  this.trigger('touchCancel', {
    currentTarget: this.element,
    point: [],
    timeStamp: Date.now(),
    sourceEvent: event,
  });
  touchended.apply(this, [event]);
}

function scrollcanceled(this: Gesture) {
  if (this._singleTapTimer) {
    clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  this._firstPoint = null;
  this._touch0 = null;
  this._touch1 = null;
  this._preventTap = true;
  this._swipeTime = 0;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
}

class Gesture extends EventTarget<
  HTMLElement,
  TouchEvent,
  GestureEventType,
  GestureEvent
> {
  element: HTMLElement;
  longTapInterval: number = 750;
  doubleTapInterval: number = 250;
  doubleTapDistance: number = 10;
  touchMoveDistance: number = 3;
  swipeInterval: number = 100;
  swipeDeceleration: number = 0.0015;
  _singleTapTimer: number | null = null;
  _longTapTimer: number | null = null;
  _preventTap: boolean = true;
  _swipeTime: number = 0;
  _swipeDuration: number = 0;
  _swipePoint: number[] | null = null;
  _preventSingleTap: boolean = true;
  _preventDoubleTap: boolean = true;
  _firstPoint: number[] | null = null;
  _touch0: number[][] | null = null; // 保存第一个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]
  _touch1: number[][] | null = null; // 保存第二个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]
  _destory: (() => void) | null = null;
  constructor(element: HTMLElement | string, options?: GestureOptions) {
    super();
    let tempElement: HTMLElement | null;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    this.element = tempElement;
    const {
      longTapInterval,
      doubleTapInterval,
      doubleTapDistance,
      touchMoveDistance,
      swipeInterval,
      swipeDeceleration,
    } = options || {};
    this.longTapInterval = fixOption(longTapInterval, 750, 500);
    this.doubleTapInterval = fixOption(doubleTapInterval, 250, 200);
    this.doubleTapDistance = fixOption(doubleTapDistance, 30, 1);
    this.touchMoveDistance = fixOption(touchMoveDistance, 3, 0);
    this.swipeInterval = fixOption(swipeInterval, 100, 1);
    this.swipeDeceleration = fixOption(swipeDeceleration, 0.0015, 0);
    // 注册触摸事件
    if (isTouchable(this.element)) {
      const started = touchstarted.bind(this);
      const moved = touchmoved.bind(this);
      const ended = touchended.bind(this);
      const canceled = touchcanceled.bind(this);
      this.element.addEventListener('touchstart', started, false);
      this.element.addEventListener('touchmove', moved, false);
      this.element.addEventListener('touchend', ended, false);
      this.element.addEventListener('touchcancel', canceled, false);
      const scrolled = scrollcanceled.bind(this);
      window.addEventListener('scroll', scrolled);
      this._destory = () => {
        this.element.removeEventListener('touchstart', started);
        this.element.removeEventListener('touchmove', moved);
        this.element.removeEventListener('touchend', ended);
        this.element.removeEventListener('touchcancel', canceled);
        window.removeEventListener('scroll', scrolled);
      };
    }
  }
  done() {
    return !!this._destory;
  }
  destory() {
    // 解除所有事件
    super.off();
    scrollcanceled.apply(this);
    // 解除手势事件
    if (this._destory) {
      this._destory();
      this._destory = null;
    }
  }
}

export type GestureEventType =
  | 'pan' // 单指平移
  | 'tap' // 单指轻点（快，双击时会触发）
  | 'swipe' // 单指快速滑动
  | 'singleTap' // 单指点击（有延迟，双击时不触发）
  | 'longTap' // 单指长按
  | 'doubleTap' // 单指双击
  | 'multiPan' // 双指平移
  | 'pinch' // 双指拿捏
  | 'rotate' // 双指旋转
  | 'touchStart' // 触摸开始
  | 'touchMove' // 触摸移动
  | 'touchEnd' // 触摸抬起
  | 'touchCancel' // 触摸取消
  | 'gestureStart' // 双（多）指开始
  | 'gestureMove' // 双（多）指移动
  | 'gestureEnd'; // 双（多）指结束

/**
 * swipe思路:
 * 0. touchstart 记录按下的点_swipePoint和时间_swipeTime
 * 1. touchmove 移动时，比较当前时间减去_swipeTime是否在固定时间swipeInterval范围内，如果超出时间，重新记录点_swipePoint和时间_swipeTime
 * 2. touchend 松开手时, 比较当前时间减去_swipeTime是否在固定时间swipeInterval范围内，
 * 并且记录的点_swipePoint和抬起的点距离是否大于固定距离swipeDistance，
 * 如果满足，则认为是滑动，并算出速度(满足上述条件的距离/时间)，根据减速度（固定值swipeDeceleration）公式算出速度减为0时需要滑行的距离。
 * 如果不满足，则认为停止移动，会移动很慢，不作为swipe滑动。
 * 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
 * 减速度某个时间的速度：v = v0 - a * t
 * 知道初始速度v0，和最终速度(v=0)，则变换公式，可算出最终的距离( s = (v0 * v0) / (2 * a) )和花费的时间( t = v0 / a )
 */

export type GestureEvent = {
  point: number[]; // 当前事件变化的点，如果多个点（两个），取中心点
  scale?: number; // 移动的缩放比例（和起点比较）
  angle?: number; // 移动的旋转角度（和起点比较）
  deltaX?: number; // x方向移动的距离（和起点比较）
  deltaY?: number; // y方向移动的距离（和起点比较）
  direction?: string; // 移动时的方向（和起点比较）
  velocity?: number; // swipe阶段速率（不是从起点到终点的速率）
  duration?: number; // swipe阶段速率按照减速度减到0花费的时间
  inertiaX?: number; // x方向swipe惯性距离（抬起后，继续移动的距离）
  inertiaY?: number; // y方向swipe惯性距离（抬起后，继续移动的距离）
  waitTime?: number; // 长按等待时间
  delayTime?: number; // 点击延迟时间
  intervalTime?: number; // 双击间隔时间
} & IBaseEvent<HTMLElement, TouchEvent>;

export type GestureOptions = {
  longTapInterval?: number; // 设置长按等待时间阈值，单位ms
  doubleTapInterval?: number; // 设置双击时间间隔，单位ms
  doubleTapDistance?: number; // 双击两次点击的位置距离触发阈值
  touchMoveDistance?: number; // 移动阈值，超过这个值才算移动
  swipeInterval?: number; // swipe阶段花费时间和最后一次移动到抬起时的时间间隔阈值
  swipeDeceleration?: number; // swipe后的减速度，swipe后按照这个减速度减速移动到速度为0
};

export default Gesture;
