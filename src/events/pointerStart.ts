/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 14:33:07
 * @Description: ******
 */
import type { IGestureEvent } from '@huangjs888/gesture';
import { Value } from '@huangjs888/transition';
import { between, isBetween } from '../utils';
import type { SwiperModel, ItemModel, ICallback } from '../core';

export default function pointerStart(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { preventAllTap }: ICallback,
) {
  if (this._fgBehavior === 0 && event.pointers.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  let stopCount = 0;
  stopCount += this.cancel();
  const item = this.currentItem();
  stopCount += item?.cancel() || 0;
  if (stopCount > 0) {
    // 如果有动画停止，此时处于内外部同时，则非边缘图片的内部damping需要立马恢复（微信这么干的）
    if (item) {
      const { x: tx = 0, y: ty = 0, ...rest } = item.value().transform;
      const [xRange, yRange] = item.getTranslation(0, event.isTouching());
      // 是否是边缘图片
      const isFirst = this.activeIndex() === 0;
      const isLast = this.activeIndex() === this.countItems() - 1;
      if (this.isVertical()) {
        if (
          !isBetween(tx, xRange) &&
          ((ty <= yRange[0] && !isLast) || (ty >= yRange[1] && !isFirst))
        ) {
          // 非边缘图片，且y方向超出边界，x方向也超出边界的，x给予恢复到边界
          item.apply(new Value({ x: between(tx, xRange), y: ty, ...rest }));
        }
      } else {
        if (
          !isBetween(ty, yRange) &&
          ((tx <= xRange[0] && !isLast) || (tx >= xRange[1] && !isFirst))
        ) {
          // 非边缘图片，且x方向超出边界，y方向也超出边界的，y给予恢复到边界
          item.apply(new Value({ x: tx, y: between(ty, yRange), ...rest }));
        }
      }
    }
    // 如果有动画停止，则阻止所有单指点击相关事件（就像是移动了一下一样）
    preventAllTap?.();
  }
}
