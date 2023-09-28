/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 11:03:05
 * @Description: ******
 */

import type { IGestureEvent } from '../modules/gesture';
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
    item?.dblScale(event.getPoint());
  }
}
