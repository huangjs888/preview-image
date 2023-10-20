/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 10:20:50
 * @Description: ******
 */

import { type IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';

export default function longTap(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { contextMenu }: ICallback,
) {
  // 如果当前正处于触摸操作，则可以进行
  if (event.isTouching()) {
    const item = this.currentItem();
    if (this.running() || item?.running()) {
      return;
    }
    // 触发菜单事件
    contextMenu?.(event);
  }
}
