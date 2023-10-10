/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 16:11:44
 * @Description: ******
 */

import type { IGestureEvent } from '@huangjs888/gesture';
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
