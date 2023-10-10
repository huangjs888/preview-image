/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-18 17:25:24
 * @Description: ******
 */

import type { IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';

export default function longTap(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { popupMenu }: ICallback,
) {
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  popupMenu?.(event);
}
