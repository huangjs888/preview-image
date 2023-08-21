/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 15:56:28
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import Gallery from '../gallery';
import type Picture from '../picture';

export default function rotate(this: Gallery | Picture, e: GEvent) {
  if (this._isClose) {
    return;
  }
  // 只有鼠标操作才可以，touch操作被放入到pointerMove中了
  if (this._gesture && this._gesture.isTouch()) {
    return;
  }
  const { angle: a = 0 } = e;
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    const translate = -this._activeIndex * this.getItemSize();
    const diff = Math.round(this._translate - translate);
    if (diff === 0) {
      const { entity } = (this._images && this._images[this._activeIndex]) || {};
      if (entity) {
        if (entity.isTransitioning()) {
          return;
        }
        // 表示停止缩放，应该重置
        if (isNaN(a)) {
          entity.resetBounce();
        } else {
          entity.moveBounce(a, 1, 0, 0);
        }
      }
    }
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      // 表示停止缩放，应该重置
      if (isNaN(a)) {
        entity.resetBounce();
      } else {
        entity.moveBounce(a, 1, 0, 0);
      }
    }
  }
}
