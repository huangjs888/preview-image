/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:10
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import Gallery from '../gallery';
import type Picture from '../picture';

export default function doubleTap(this: Gallery | Picture, e: GEvent) {
  if (this._isClose) {
    return;
  }
  const point = e.getPoint();
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
        entity.dblScale(point);
      }
    }
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.dblScale(point);
    }
  }
}
