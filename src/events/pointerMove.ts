/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 14:32:58
 * @Description: ******
 */

import type { IGestureEvent } from '@huangjs888/gesture';
import { Value } from '@huangjs888/transition';
import { revokeDamping, performDamping } from '@huangjs888/damping';
import { between } from '../utils';
import type { SwiperModel, ItemModel, ICallback, IOpenStyle, ISPosition } from '../core';

const minScale = 0.3; // swipeClose下拉最小缩放比例
const minOpacity = 0.01; // swipeClose下拉最小透明度
const isRightDown = (isVertical: boolean, [x0, y0]: number[], [x1, y1]: number[]) => {
  if (isVertical) {
    return Math.abs(x0 - x1) > 4 * Math.abs(y0 - y1) && x0 - x1 <= 0;
  } else {
    return Math.abs(y0 - y1) > 4 * Math.abs(x0 - x1) && y0 - y1 <= 0;
  }
};
export default function pointerMove(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { openStyleChange }: ICallback,
) {
  if (this._fgBehavior === 0 && event.pointers.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  const onePointer = event.pointers.length === 1 || this._fgBehavior === 1;
  const maxOption = { max: this.itemSize() };
  const {
    getPoint,
    direction,
    angle = 0,
    scale = 1,
    deltaX = 0,
    deltaY = 0,
    moveX = 0,
    moveY = 0,
  } = event;
  const point = getPoint();
  if (this._moveTarget === 'none') {
    const point0 = getPoint('previous');
    // 多指或者不满足以下条件的，则做图片操作
    if (item) {
      this._moveTarget = 'inside';
      if (onePointer) {
        // 是否是边缘图片
        const isFirst = this.activeIndex() === 0;
        const isLast = this.activeIndex() === this.countItems() - 1;
        const rightDown = isRightDown(this.isVertical(), point0, point);
        const { x: tx = 0, y: ty = 0 } = item.value().transform;
        const [xRange, yRange] = item.getTranslation(0, event.isTouching());
        // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
        if (this.isVertical()) {
          if (this.swipeClose() && tx >= xRange[1] && rightDown) {
            this._moveTarget = 'closures';
          } else {
            // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
            const fixedX = xRange[0] === 0 && xRange[1] === 0;
            // 如果x的范围是[0,0]，则判断上下移动，直接根据deltaY的正负
            // 否则需要根据移动方向（因为移动方向是按照45度分开的）
            const upMove = fixedX ? deltaY < 0 : direction === 'Up';
            const downMove = fixedX ? deltaY > 0 : direction === 'Down';
            // 如果图片上边抵达或超出上边界，仍然向下滑动（不是第一张图）
            // 或者下边抵达或超出下边界，仍然向上滑动（不是最后一张图），则为swiper，反之为图片操作
            // 因为第一张图片和最后一张都是边缘图片（边缘图片向两边swipe时，是没有上一张或下一张的），无需外部swipe操作，直接走内部图片操作
            if (
              (ty <= yRange[0] && upMove && !isLast) ||
              (ty >= yRange[1] && downMove && !isFirst)
            ) {
              this._moveTarget = 'outside';
            }
          }
        } else {
          if (this.swipeClose() && ty >= yRange[1] && rightDown) {
            this._moveTarget = 'closures';
          } else {
            // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
            const fixedY = yRange[0] === 0 && yRange[1] === 0;
            // 如果y的范围是[0,0]，则判断左右移动，直接根据deltaX的正负
            // 否则需要根据移动方向（因为移动方向是按照45度分开的）
            const leftMove = fixedY ? deltaX < 0 : direction === 'Left';
            const rightMove = fixedY ? deltaX > 0 : direction === 'Right';
            // 如果图片左边抵达或超出左边界，仍然向右滑动（不是第一张图）
            // 或者右边抵达或超出右边界，仍然向左滑动（不是最后一张图），则为swiper操作，反之为图片操作
            if (
              (tx <= xRange[0] && leftMove && !isLast) ||
              (tx >= xRange[1] && rightMove && !isFirst)
            ) {
              this._moveTarget = 'outside';
            }
          }
        }
      }
    } else {
      this._moveTarget =
        this.swipeClose() && isRightDown(this.isVertical(), point0, point) ? 'closures' : 'outside';
    }
  }
  // 进入内部图片操作
  if (this._moveTarget === 'inside') {
    if (item) {
      // 计算出外部swiper移动的原始距离diff
      const translate = -this.activeIndex() * this.itemSize();
      const diff = revokeDamping(this.value().transform.default - translate, maxOption);
      let _deltaX = deltaX;
      let _deltaY = deltaY;
      // 把swiper移动的原始距离加进去
      if (this.isVertical()) {
        _deltaY += diff;
      } else {
        _deltaX += diff;
      }
      if (onePointer) {
        const { x: tx = 0, y: ty = 0 } = item.value().transform;
        const [xRange, yRange] = item.getTranslation(0, event.isTouching());
        let _delta = 0;
        if (this.isVertical()) {
          // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
          const fixedX = xRange[0] === 0 && xRange[1] === 0;
          _delta = _deltaY;
          // 竖向的时候固定x
          _deltaX = fixedX ? 0 : _deltaX;
          // 内部图片，最多移动到边界
          _deltaY = between(_deltaY + ty, yRange) - ty;
          // 超出部分由外部swiper移动
          _delta -= _deltaY;
        } else {
          // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
          const fixedY = yRange[0] === 0 && yRange[1] === 0;
          _delta = _deltaX;
          // 内部图片，最多移动到边界
          _deltaX = between(_deltaX + tx, xRange) - tx;
          // 横向的时候固定y
          _deltaY = fixedY ? 0 : _deltaY;
          // 超出部分由外部swiper移动
          _delta -= _deltaX;
        }
        // 内部图片需要移动的距离
        item.moveBounce(event.isTouching(), 0, 1, _deltaX, _deltaY, point);
        // 外部swiper需要移动的距离
        this.apply(new Value(translate + performDamping(_delta, maxOption)));
      } else {
        item.moveBounce(event.isTouching(), angle, scale, _deltaX, _deltaY, point);
        if (diff !== 0) {
          // 多指移动前，将外部swiper移动的部分归位（内部image会把swiper的距离加进去）
          this.apply(new Value(translate));
        }
      }
    }
    return;
  }
  if (this._moveTarget === 'closures') {
    openStyleChange?.((prevStyle: IOpenStyle, sizePosition: ISPosition) => {
      const { w = 0, h = 0, x: sx = 0, y: sy = 0 } = sizePosition;
      const k = Math.min(
        Math.max(1 - ((this.isVertical() ? moveX / w : moveY / h) || 0), minScale),
        1,
      );
      const o = minOpacity + ((k - minScale) * (1 - minOpacity)) / (1 - minScale);
      const { k: _k = 1, x: _x = 0, y: _y = 0 } = prevStyle;
      const x = _x + deltaX + (point[0] - (_x + sx)) * (1 - k / _k);
      const y = _y + deltaY + (point[1] - (_y + sy)) * (1 - k / _k);
      return { o, k, x, y };
    });
    return;
  }
  // 非内部图片操作，均是外部swiper操作
  const swiperRange = [(1 - this.countItems()) * this.itemSize(), 0];
  // 先把当前值反算出阻尼之前的原值
  let bt = between(this.value().transform.default, swiperRange);
  let t = bt + revokeDamping(this.value().transform.default - bt, maxOption);
  // 再对总值进行总体阻尼计算
  bt = between((t += this.isVertical() ? deltaY : deltaX), swiperRange);
  t = bt + performDamping(t - bt, maxOption);
  this.apply(new Value(t));
}
