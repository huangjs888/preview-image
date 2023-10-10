/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 15:28:46
 * @Description: ******
 */

import { isTouchable, type IGestureEvent } from '@huangjs888/gesture';
import type { SwiperModel, ItemModel } from '../core';

export default function rotate(this: SwiperModel<ItemModel | null>, event: IGestureEvent) {
  // 只有鼠标操作才可以，touch操作被放入到pointerMove中了
  if (isTouchable()) {
    return;
  }
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
  const translate = -this.activeIndex() * this.itemSize();
  const diff = Math.round(this.value().transform.default - translate);
  if (diff === 0) {
    const { angle: a = 0 } = event;
    if (isNaN(a)) {
      // 表示停止旋转，应该重置
      item?.resetBounce();
    } else {
      item?.moveBounce(a, 1, 0, 0);
    }
  }
}
