/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 13:51:40
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import { between, isBetween } from '../entity/utils';
import Gallery from '../gallery';
import SingleGallery from '../singleGallery';

export default function pointerStart(this: Gallery | SingleGallery, e: GEvent) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointer.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  let stopCount = 0;
  if (this instanceof Gallery) {
    stopCount += this.transitionCancel();
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    const length = (this._images || []).length;
    if (entity) {
      stopCount += entity.transitionCancel();
      // @@@1： 此处逻辑和swipe手势函数里 @@@2 逻辑是处理同一个问题（二选一，微信用的是这个效果）
      // 这里是在手指放上去时直接恢复到边界，那边是在真正要slide到上(下)一张时恢复到边界
      // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
      // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
      // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
      const { x: tx = 0, y: ty = 0, ...rest } = entity.getTransform();
      const [xRange, yRange] = entity.getTranslation();
      // 是否是边缘图片
      const isFirst = this._activeIndex === 0;
      const isLast = this._activeIndex === length - 1;
      if (this._direction === 'vertical') {
        if (
          !isBetween(tx, xRange) &&
          ((ty <= yRange[0] && !isLast) || (ty >= yRange[1] && !isFirst))
        ) {
          // 非边缘图片，且y方向超出边界，x方向也超出边界的，x给予恢复到边界
          entity.transitionRun(
            { x: between(tx, xRange), y: ty, ...rest },
            { duration: 0 },
          );
        }
      } else {
        if (
          !isBetween(ty, yRange) &&
          ((tx <= xRange[0] && !isLast) || (tx >= xRange[1] && !isFirst))
        ) {
          // 非边缘图片，且x方向超出边界，y方向也超出边界的，y给予恢复到边界
          entity.transitionRun(
            { x: tx, y: between(ty, yRange), ...rest },
            { duration: 0 },
          );
        }
      }
    }
  } else {
    // 取消动画
    const { entity } = this._image || {};
    if (entity) {
      stopCount += entity.transitionCancel();
    }
  }
  if (stopCount > 0 && this._gesture) {
    // 如果有动画停止，则阻止所有单指点击相关事件（就像是移动了一下一样）
    // 曲线救国：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPoint = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
}
