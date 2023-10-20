/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 16:09:31
 * @Description: ******
 */

import type { IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel } from '../core';

export default function doubleTap(this: SwiperModel<ItemModel | null>, event: IGestureEvent) {
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  // diff===0 表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
  const translate = -this.activeIndex() * this.itemSize();
  const diff = Math.round(this.value().transform.default - translate);
  if (diff === 0) {
    item?.dblScale(event.isTouching(), event.getPoint());
  }
}
