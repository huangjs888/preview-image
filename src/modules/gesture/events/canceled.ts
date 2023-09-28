/*
 * @Author: Huangjs
 * @Date: 2023-08-23 11:27:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 15:23:25
 * @Description: ******
 */

import ended from './ended';
import type Core from '../core';

export default function canceled(this: Core, event: any) {
  this.emit('pointerCancel', {
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: () => [0, 0],
  });
  ended.apply(this, [event]);
}
