/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 14:49:41
 * @Description: ******
 */

import { type IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel, ICallback } from '../core';

let isRotated = false;
export default function rotate(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { contextMenu }: ICallback,
) {
  // 只有当前正处于鼠标操作才可以进行下面的
  if (!event.isTouching()) {
    const item = this.currentItem();
    if (this.running() || item?.running()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    const translate = -this.activeIndex() * this.itemSize();
    const diff = Math.round(this.value().transform.default - translate);
    if (diff === 0) {
      const { angle: a = 0 } = event;
      // 表示停止旋转（松开了右键）
      if (isNaN(a)) {
        // 如果没有旋转过，就触发菜单事件
        if (!isRotated) {
          contextMenu?.(event);
        }
        isRotated = false;
        // 重置
        item?.resetBounce(false);
      } else {
        isRotated = true;
        item?.moveBounce(false, a, 1, 0, 0);
      }
    }
  }
}
