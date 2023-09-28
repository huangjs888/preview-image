/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 14:45:49
 * @Description: ******
 */

import {
  getEventPoints,
  getDirection,
  getDistance,
  getAngle,
  getCenter,
  getVelocity,
  getVector,
} from '../utils';
import type Core from '../core';
import { type IGestureEvent, type IGesturePointer } from '../core';

export default function ended(this: Core, event: any) {
  const newEvent: IGestureEvent = {
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: () => [0, 0],
  };
  // 临时保存当前手指（点）
  let pointer0: IGesturePointer | null = null;
  let pointer1: IGesturePointer | null = null;
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环删除已经拿开的手指（点）
  const { points } = getEventPoints(event);
  for (let i = 0, len = points.length; i < len; ++i) {
    const t = points[i];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      pointer0 = this._pointer0;
      this._pointer0 = null;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      pointer1 = this._pointer1;
      this._pointer1 = null;
    }
  }
  // 双指变单指
  if (this._pointer1 && !this._pointer0) {
    this._pointer0 = this._pointer1;
    this._pointer1 = null;
    pointer1 = pointer0;
    pointer0 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = 0;
  }
  // 仍然存在至少一根手指（点）
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    if (this._pointer1) {
      // 剩余两指
      newEvent.pointers.push(this._pointer1);
    } else if (pointer1) {
      // 剩余一指
      newEvent.leavePointers = [pointer1];
      this._rotateAngle = 0;
    }
    const start = getCenter(
      this._pointer0.start,
      this._pointer1 ? this._pointer1.start : pointer1 ? pointer1.start : [],
    );
    const previous = getCenter(
      this._pointer0.previous,
      this._pointer1 ? this._pointer1.previous : pointer1 ? pointer1.previous : [],
    );
    const current = getCenter(
      this._pointer0.current,
      this._pointer1 ? this._pointer1.current : pointer1 ? pointer1.current : [],
    );
    newEvent.getPoint = (whichOne) =>
      whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    this.emit('gestureEnd', newEvent);
  }
  // 全部拿开
  else if (pointer0) {
    // 多指的最后一指抬起，仅仅一指抬起
    newEvent.leavePointers = [pointer0];
    if (pointer1) {
      // 双指同时抬起
      newEvent.leavePointers.push(pointer1);
    }
    const start = pointer1 ? getCenter(pointer0.start, pointer1.start) : pointer0.start;
    const previous = pointer1 ? getCenter(pointer0.previous, pointer1.previous) : pointer0.previous;
    const current = pointer1 ? getCenter(pointer0.current, pointer1.current) : pointer0.current;
    newEvent.getPoint = (whichOne) =>
      whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    if (!this._preventTap) {
      this.emit('tap', newEvent);
      this._preventTap = true;
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = +setTimeout(() => {
        this._singleTapTimer = 0;
        newEvent.delayTime = this.doubleTapInterval;
        this.emit('singleTap', newEvent);
      }, this.doubleTapInterval);
      this._preventSingleTap = true;
    }
    if (!this._preventDoubleTap) {
      // 双击点使用第一次的点
      const firstPointer = this._firstPointer;
      if (firstPointer) {
        newEvent.getPoint = () => firstPointer.current;
      }
      newEvent.intervalTime = this.doubleTapInterval;
      this.emit('doubleTap', newEvent);
      this._firstPointer = null;
      this._preventDoubleTap = true;
    }
    // this._swipePoints存在表示开始了swipe行为
    if (this._swipePoints) {
      const [prev, next] = this._swipePoints;
      // 最后一次移动的点即为swipe终点
      const endPos = next[next.length - 1];
      // 最后一次移动点的时间减去手指（点）抬起的时间，此间隔时间需小于等待时间raiseDuration，否则视为停止swipe
      if (Date.now() - endPos.timestamp <= this.raiseDuration) {
        // 找到计入swipe的时间(swipeDuration)内的swipe起点
        let startPos = next[0];
        for (let i = prev.length - 1; i >= 0; i--) {
          if (endPos.timestamp - prev[i].timestamp <= this.swipeDuration) {
            startPos = prev[i];
          } else {
            break;
          }
        }
        // 根据swipe起点和终点的距离差与时间差算出swipe抬起时速率
        const velocity = getVelocity(
          endPos.timestamp - startPos.timestamp,
          getDistance(startPos.point, endPos.point),
        );
        // swipe速率需要大于swipeVelocity，否则忽略不计，不视为swipe
        if (velocity > this.swipeVelocity) {
          // 滑动方向与x夹角
          const angle = getAngle(startPos.point, endPos.point);
          // 惯性的方向
          newEvent.direction = getDirection(startPos.point, endPos.point);
          newEvent.angle = angle;
          newEvent.velocity = velocity;
          // 给出按照velocity速度滑动，当速度减到0时的计算函数：
          // 当给出时间t，即在t时间内速度减到0，求出滑动的距离：
          // 当给出减速度a，即在减速度a的作用下，速度减到0，求出滑动的距离，和消耗的时间：
          // 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
          // 减速度某个时间的速度：v = v0 - a * t
          // s为滑动距离，v末速度为0，v0初速度为velocity
          newEvent.swipeComputed = (factor: number, _velocity: number = velocity) => {
            // 因子大于1可以认为传入的是时间毫秒数
            let duration = 0;
            let deceleration = 0;
            let distance = 0;
            if (factor > 1) {
              duration = factor;
              deceleration = _velocity / duration;
              distance = (_velocity * duration) / 2;
            }
            // 因子小于1可以认为传入的是减速度（减速如果大于1一般太大了，不符合使用场景）
            else if (factor > 0) {
              deceleration = factor;
              duration = _velocity / deceleration;
              distance = (_velocity * _velocity) / (2 * deceleration);
            }
            const [stretchX, stretchY] = getVector(distance, angle);
            return {
              duration, // swipe速率减到0花费的时间
              stretchX, // x方向swipe惯性距离（抬起后，继续移动的距离）
              stretchY, // y方向swipe惯性距离（抬起后，继续移动的距离）
              deceleration, // swipe速率减到0的减速度
            };
          };
          /**
           * swipe思路:
           * 根据移动停止前swipeDuration时间内移动的距离和时间算出速度，
           * 速度大于swipeVelocity，并且移动停止后到手指（点）抬起时间间隔小于raiseDuration即为swipe
           * 移动停止就是最后一次触发move事件
           * 0. start 清空_swipePoints
           * 1. move 每swipeDuration时间内所移动的点分为一组，只保留上一次swipeDuration时间组和这一次swipeDuration时间组，存储在_swipePoints内
           * 2. end 松开手时, 在_swipePoints内找到起终点，根据起终点距离和时间差算出速度，然后算出其他值
           */
          this.emit('swipe', newEvent);
          this._swipePoints = null;
        }
      }
    }
  }
  this.emit('pointerEnd', newEvent);
  /* // 只剩下一根在上面了，以下事件交给用户自行放在pointerEnd事件里自行判断
  if (this._pointer0 && !this._pointer1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._pointer0.start = this._pointer0.previous = this._pointer0.current;
    // 同时可以触发一次start事件
    newEvent.pointers = [this._pointer0];
    newEvent.pointer = this._pointer0;
    this.emit('pointerStart', newEvent);
  } */
}
