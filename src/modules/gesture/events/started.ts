/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 12:01:41
 * @Description: ******
 */

import { getEventPoints, getDistance, getCenter } from '../utils';
import type Core from '../core';
import { type IGestureEvent } from '../core';

export default function started(this: Core, event: any) {
  const newEvent: IGestureEvent = {
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: () => [0, 0],
  };
  const { points, isFirst } = getEventPoints(event, true);
  // 表示第一次放入手指（点）
  if (isFirst) {
    // 第一次点击，如果存在wheel没执行，需要执行掉
    if (this._wheelTimerEnd) {
      clearTimeout(this._wheelTimerEnd.timer);
      this._wheelTimerEnd.wheelEnd();
      this._wheelTimerEnd = null;
    }
    this._pointer0 = null;
    this._pointer1 = null;
  } else {
    if (this._pointer0) {
      this._pointer0.changed = false;
    }
    if (this._pointer1) {
      this._pointer1.changed = false;
    }
  }
  // 如果当前事件元素之外的屏幕上有手指（点），此时在事件元素上放一个手指（点），points会包含该手指（点）
  // 循环保存放在屏幕上的手指（点），这里只会保存最多两个，忽略超过三个的手指（点）（只对单指和双指情形处理）
  for (let i = 0, len = points.length; i < len; ++i) {
    const t = points[i];
    const p = [t.pageX, t.pageY];
    const pointer = {
      start: p,
      previous: p,
      current: p,
      identifier: t.identifier,
      changed: true,
    };
    if (!this._pointer0) {
      this._pointer0 = pointer;
    } else if (!this._pointer1 && this._pointer0.identifier !== t.identifier) {
      this._pointer1 = pointer;
    }
  }
  // 每次进入时先阻止所有单指事件
  this.preventAllTap(false);
  this._swipePoints = null;
  this._rotateAngle = 0;
  // 双指start
  const pointer0 = this._pointer0;
  const pointer1 = this._pointer1;
  if (pointer1 && pointer0) {
    this._firstPointer = null;
    newEvent.pointers = [pointer0, pointer1];
    newEvent.getPoint = () => getCenter(pointer0.current, pointer1.current);
    this.emit('gestureStart', newEvent);
  }
  // 单指start
  else if (pointer0) {
    newEvent.pointers = [pointer0];
    newEvent.getPoint = () => pointer0.current;
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = +setTimeout(() => {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      this._preventTap = true;
      this._preventSingleTap = true;
      this._preventDoubleTap = true;
      this._longTapTimer = 0;
      this._firstPointer = null;
      newEvent.waitTime = this.longTapInterval;
      this.emit('longTap', newEvent);
    }, this.longTapInterval);
    const firstPointer = this._firstPointer;
    const singleTapTimer = this._singleTapTimer;
    if (
      singleTapTimer &&
      firstPointer &&
      getDistance(firstPointer.current, pointer0.current) < this.doubleTapDistance
    ) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指（点），或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      clearTimeout(singleTapTimer);
      this._singleTapTimer = 0;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
      newEvent.getPoint = () => firstPointer.current;
    } else {
      this._firstPointer = pointer0;
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.emit('pointerStart', newEvent);
}
