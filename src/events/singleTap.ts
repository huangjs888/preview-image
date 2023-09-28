/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-18 17:21:23
 * @Description: ******
 */

import type { IGestureEvent } from '../modules/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';

export default function singleTap(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { internalClose }: ICallback,
) {
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  internalClose?.(event);
}
