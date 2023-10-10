/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-19 14:13:38
 * @Description: ******
 */

import type { IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';

export default function pointerEnd(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { openStyleChange, slideBefore, slideAfter }: ICallback,
) {
  // 单指抬起的情况才可以取消动画
  const target = this._moveTarget;
  const cancel = event.leavePointers.length === 1 || this._fgBehavior === 1;
  if (event.pointers.length === 0) {
    // 抬起最后一根手指时，重置以下参数
    this._fgBehavior = 0;
    this._moveTarget = 'none';
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
    if (!this.running() && target === 'outside') {
      const size = this.itemSize();
      const index = size === 0 ? 0 : -this.value().transform.default / size;
      this.slide(Math.round(index), {
        before: slideBefore as (v: number) => void,
        after: slideAfter as (v: number) => void,
      });
    }
    return;
  }
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  if (target === 'closures') {
    openStyleChange?.(() => ({ o: 1, k: 1, x: 0, y: 0, t: 300 }));
    return;
  }
  item?.resetBounce(event.getPoint(), cancel);
  // 如果移动到越界，则抬起需要恢复
  let index = this.activeIndex();
  if (target === 'outside') {
    const size = this.itemSize();
    // Math.round代表移动超过一半，就下一张
    index = Math.round(size === 0 ? 0 : -this.value().transform.default / size);
  }
  this.slide(index, {
    before: slideBefore as (v: number) => void,
    after: slideAfter as (v: number) => void,
  });
}
