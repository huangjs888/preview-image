/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 15:22:21
 * @Description: ******
 */

import started from './started';
import moved from './moved';
import ended from './ended';
import { getDirection } from '../utils';
import type Core from '../core';
import { type IGestureEvent } from '../core';

export default function downed(this: Core, event: any) {
  const that = this;
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', mousemoved);
    window.addEventListener('mouseup', mouseupped);
    window.addEventListener('blur', blured);
    window.addEventListener('dragstart', dragstarted, {
      capture: true,
      passive: false,
    });
    if ('onselectstart' in window.document.documentElement) {
      window.addEventListener('selectstart', dragstarted, {
        capture: true,
        passive: false,
      });
    }
  }
  function unbind() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', mousemoved);
      window.removeEventListener('mouseup', mouseupped);
      window.removeEventListener('blur', blured);
      window.removeEventListener('dragstart', dragstarted);
      if ('onselectstart' in window.document.documentElement) {
        window.removeEventListener('selectstart', dragstarted);
      }
    }
  }
  function blured(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    unbind();
  }
  function dragstarted(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  function mousemoved(e: MouseEvent) {
    if (event.button === 0) {
      moved.apply(that, [e]);
    } else {
      const newEvent: IGestureEvent = {
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: () => [0, 0],
      };
      const point = [e.pageX, e.pageY];
      if (that._pointer0) {
        that._pointer0.previous = that._pointer0.current;
        that._pointer0.current = point;
        newEvent.pointers = [that._pointer0];
        const { start, previous, current } = that._pointer0;
        newEvent.getPoint = (whichOne) =>
          whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
        newEvent.direction = getDirection(previous, current);
        newEvent.moveDirection = getDirection(start, current);
        newEvent.deltaX = current[0] - previous[0];
        newEvent.moveX = current[0] - start[0];
        newEvent.deltaY = current[1] - previous[1];
        newEvent.moveY = current[1] - start[1];
        // 根据移动距离计算：1度 = 4px; 正值顺时针，负值逆时针
        newEvent.angle = newEvent.deltaX / 4;
        newEvent.moveAngle = newEvent.moveX / 4;
        that.emit('rotate', newEvent);
      }
    }
  }
  function mouseupped(e: MouseEvent) {
    unbind();
    if (event.button === 0) {
      ended.apply(that, [e]);
    } else {
      const newEvent: IGestureEvent = {
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: () => [0, 0],
      };
      const point = [e.pageX, e.pageY];
      if (that._pointer0) {
        const pointer0 = that._pointer0;
        that._pointer0 = null;
        pointer0.previous = pointer0.current;
        pointer0.current = point;
        newEvent.leavePointers = [pointer0];
        const { start, previous, current } = pointer0;
        newEvent.getPoint = (whichOne) =>
          whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
      }
      newEvent.angle = 0 / 0;
      that.emit('rotate', newEvent);
    }
  }
  if (event.button === 0) {
    started.apply(that, [event]);
  } else {
    // 如果存在wheel没执行，需要执行掉
    if (that._wheelTimerEnd) {
      clearTimeout(that._wheelTimerEnd.timer);
      that._wheelTimerEnd.wheelEnd();
      that._wheelTimerEnd = null;
    }
    const point = [event.pageX, event.pageY];
    that._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true,
    };
  }
}
