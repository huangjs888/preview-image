/*
 * @Author: Huangjs
 * @Date: 2023-08-23 09:36:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-14 09:43:35
 * @Description: ******
 */

import EventEmitter from '../emitter';
import { fixOption } from '../utils';

class Gesture extends EventEmitter<IGestureEventType, IGestureEvent> {
  wheelDelay: number = 350;
  longTapInterval: number = 750;
  doubleTapInterval: number = 250;
  doubleTapDistance: number = 30;
  touchMoveDistance: number = 3;
  swipeVelocity: number = 0.3;
  swipeDuration: number = 100;
  raiseDuration: number = 100;
  _rotateAngle: number = 0;
  _singleTapTimer: number = 0;
  _longTapTimer: number = 0;
  _wheelTimerEnd: {
    scale: number;
    timer: number;
    wheelEnd: () => void;
  } | null = null;
  _preventTap: boolean = true;
  _swipePoints: any[] | null = null;
  _preventSingleTap: boolean = true;
  _preventDoubleTap: boolean = true;
  _firstPointer: IGesturePointer | null = null;
  _pointer0: IGesturePointer | null = null;
  _pointer1: IGesturePointer | null = null;
  constructor(options?: IGestureOptions) {
    super();
    this.resetOptions(options);
  }
  resetOptions(options?: IGestureOptions) {
    const {
      wheelDelay,
      longTapInterval,
      doubleTapInterval,
      doubleTapDistance,
      touchMoveDistance,
      swipeVelocity,
      swipeDuration,
      raiseDuration,
    } = options || {};
    this.wheelDelay = fixOption(wheelDelay, 350, 1);
    this.longTapInterval = fixOption(longTapInterval, 750, 1);
    this.doubleTapInterval = fixOption(doubleTapInterval, 250, 1);
    this.doubleTapDistance = fixOption(doubleTapDistance, 30, 1);
    this.touchMoveDistance = fixOption(touchMoveDistance, 3, 0);
    this.swipeVelocity = fixOption(swipeVelocity, 0.3, 0);
    this.swipeDuration = fixOption(swipeDuration, 100, 1);
    this.raiseDuration = fixOption(raiseDuration, 100, 1);
  }
  preventAllTap(fp: boolean = true) {
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    if (fp) {
      this._firstPointer = null;
    }
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = 0;
    }
  }
}

export type IGestureOptions = {
  wheelDelay?: number; // 设置wheel等待时间，超时则认为结束滚动，单位ms
  longTapInterval?: number; // 设置长按等待时间阈值，单位ms
  doubleTapInterval?: number; // 设置双击时间间隔，单位ms
  doubleTapDistance?: number; // 双击两次点击的位置距离触发阈值
  touchMoveDistance?: number; // 移动阈值，超过这个值才算移动
  swipeVelocity?: number; // swipe阶段的速率大于这个值才会触发swipe
  swipeDuration?: number; // 移动过程中计入swipe的时间范围，即：最后一次移动事件向前推swipeDuration时间内，作为swipe阶段
  raiseDuration?: number; // 最后一次移动到手指（点）抬起的时间间隔，小于这个值才会触发swipe
};

export type IGestureDirection = 'Left' | 'Right' | 'Up' | 'Down' | 'None';

export type IGestureEventType =
  | 'pan' // 平移
  | 'tap' // 轻点（快，双击时会触发）
  | 'swipe' // 快速滑动
  | 'singleTap' // 点击（有延迟，双击时不触发）
  | 'longTap' // 长按
  | 'doubleTap' // 双击
  | 'multiPan' // 平移
  | 'scale' // 缩放
  | 'rotate' // 旋转
  | 'pointerStart' // 开始
  | 'pointerMove' // 移动
  | 'pointerEnd' // 抬起
  | 'pointerCancel' // 触摸取消
  | 'gestureStart' // 双（多）指开始
  | 'gestureMove' // 双（多）指移动
  | 'gestureEnd'; // 双（多）指结束

export type IGesturePointer = {
  start: number[]; // 开始点
  previous: number[]; // 上一个点
  current: number[]; // 当前点
  identifier: number; // 手指（点）id
  changed: boolean; // 手指（点）是否变化
};

export type IGestureEvent = {
  pointers: IGesturePointer[]; // 当前停留在界面上的所有手指（点）
  leavePointers: IGesturePointer[]; // 已经离开界面的所有手指（点）
  getPoint: (whichOne?: 'start' | 'previous' | 'current') => number[]; // 获取当前点（两个点取中心值）参数是获取起点，还是当前点，还是移动时的上个点
  scale?: number; // 缩放比例（和上一个点比较）
  angle?: number; // 旋转角度（和上一个点比较）swipe角度
  deltaX?: number; // x方向距离（和上一个点比较）
  deltaY?: number; // y方向距离（和上一个点比较）
  direction?: IGestureDirection; // 移动时的方向（和上一个点比较）swipe方向
  moveScale?: number; // 缩放比例（和起点比较）
  moveAngle?: number; // 旋转角度（和起点比较）
  moveX?: number; // x方向距离（和起点比较）
  moveY?: number; // y方向距离（和起点比较）
  moveDirection?: IGestureDirection; // 移动时的方向（和起点比较）
  velocity?: number; // swipe阶段速率（不是从起点到终点的速率）
  waitTime?: number; // 长按等待时间
  delayTime?: number; // 点击延迟时间
  intervalTime?: number; // 双击间隔时间
  swipeComputed?: (
    factor: number,
    _velocity?: number,
  ) => {
    duration: number; // swipe速率减到0花费的时间
    stretchX: number; // x方向swipe惯性距离（抬起后，继续移动的距离）
    stretchY: number; // y方向swipe惯性距离（抬起后，继续移动的距离）
    deceleration: number; // swipe速率减到0的减速度
  };
  timestamp: number;
  sourceEvent: any;
};

export default Gesture;
