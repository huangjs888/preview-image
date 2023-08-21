/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 10:52:26
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import Gallery from '../gallery';
import type Picture from '../picture';
import { popupTransform } from '../popup';

export default function pointerEnd(this: Gallery | Picture, e: GEvent) {
  if (this._isClose) {
    return;
  }
  let target = '';
  if (this instanceof Gallery) {
    target = this._moveTarget;
  }
  // 单指抬起的情况才可以取消动画
  const cancel = this._fgBehavior === 1 || e.leavePointers.length === 1;
  if (e.pointers.length === 0) {
    // 抬起最后一根手指时，重置以下参数
    this._fgBehavior = 0;
    if (this instanceof Gallery) {
      this._moveTarget = 'none';
    }
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    if (this instanceof Gallery) {
      // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
      if (target === 'outside') {
        const size = this.getItemSize();
        const index = size === 0 ? 0 : -this._translate / this.getItemSize();
        this.slide(Math.round(index));
      }
    }
    return;
  }
  const point = e.getPoint();
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity, wrapper } = (this._images && this._images[this._activeIndex]) || {};
    if (target === 'closures') {
      popupTransform(
        { el: this._backdrop, o: 1 },
        { el: wrapper || null, x: 0, y: 0, k: 1 },
        { el: null },
        300,
      );
      return;
    }
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.resetBounce(point, cancel);
    }
    // 只有在swiper的时候才会下一张
    const size = this.getItemSize();
    let index = this._activeIndex;
    if (target === 'outside') {
      index = size === 0 ? 0 : -this._translate / this.getItemSize();
    }
    // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断, slide方法里会更新_activeIndex
    this.slide(Math.round(index));
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.resetBounce(point, cancel);
    }
  }
}
