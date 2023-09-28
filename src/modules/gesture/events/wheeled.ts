/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 15:38:35
 * @Description: ******
 */

import type Core from '../core';
import { type IGestureEvent } from '../core';

export default function wheeled(this: Core, event: any) {
  const newEvent: IGestureEvent = {
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: () => [0, 0],
  };
  const point = [event.pageX, event.pageY];
  if (this._wheelTimerEnd) {
    if (this._pointer0) {
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = point;
    }
    clearTimeout(this._wheelTimerEnd.timer);
    // wheelRoll
  } else {
    this._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true,
    };
    // wheelstart
  }
  const wheelEnd = () => {
    this._pointer0 = null;
    this._wheelTimerEnd = null;
    newEvent.timestamp = Date.now();
    // 表示滚轮结束，不参与计算
    newEvent.scale = 0 / 0;
    this.emit('scale', newEvent);
    // wheelEnd
  };
  this._wheelTimerEnd = {
    wheelEnd,
    timer: +setTimeout(wheelEnd, this.wheelDelay),
    scale: this._wheelTimerEnd ? this._wheelTimerEnd.scale : 1,
  };
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    const { start, previous, current } = this._pointer0;
    newEvent.getPoint = (whichOne) =>
      whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    const scale = Math.pow(
      2,
      -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002),
    );
    this._wheelTimerEnd.scale *= scale;
    newEvent.moveScale = this._wheelTimerEnd.scale;
    newEvent.scale = scale;
    this.emit('scale', newEvent);
  }
}
