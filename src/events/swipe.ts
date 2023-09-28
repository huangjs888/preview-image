/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-19 14:12:23
 * @Description: ******
 */

import type { IGestureEvent } from '../modules/gesture';
import { Value, type IAnimationExtendOptions } from '../modules/transition';
import {
  type SwiperModel,
  type ItemModel,
  type ICallback,
  defaultAnimationExtendOptions,
} from '../core';

export default function swipe(
  this: SwiperModel<ItemModel | null>,
  event: IGestureEvent,
  { internalClose, slideBefore, slideAfter }: ICallback,
) {
  const item = this.currentItem();
  if (this.running() || item?.running()) {
    return;
  }
  const { direction } = event;
  const isForward =
    (direction === 'Right' && this.isHorizontal()) || (direction === 'Down' && this.isVertical());
  const translate = -this.activeIndex() * this.itemSize();
  // 启动swipe时，已经Damping的部分
  const diff = this.value().transform.default - translate;
  const diffXY =
    ((isForward && diff < 0) || (!isForward && diff > 0)) && Math.round(diff) !== 0 ? -diff : 0;
  if (this._moveTarget === 'inside') {
    if (item) {
      const { velocity = 0, swipeComputed } = event;
      if (velocity > 0 && swipeComputed) {
        const that = this;
        const transition = (
          key: 'x' | 'y',
          xySwipe: number,
          xyBounce: number,
          option: (v: number) => IAnimationExtendOptions,
        ) => {
          if (xySwipe !== 0) {
            const { duration, easing } = option(xySwipe + xyBounce);
            // 在未超出边界时启动swipe
            if (xyBounce !== 0) {
              // 超出边界
              Promise.all([
                // 外部damping反方向恢复
                diffXY !== 0
                  ? that.apply(new Value(translate), {
                      ...defaultAnimationExtendOptions,
                      duration,
                      easing,
                      // 先走 diffXY ，走完之后，后面就一直 1
                      before: (progress) =>
                        Math.min(
                          (Math.abs(diffXY + xySwipe + xyBounce) * progress) / Math.abs(diffXY),
                          1,
                        ),
                    })
                  : Promise.resolve(),
                // 图片走到边界距离xySwipe
                item.apply(new Value({ [key]: (item.value().transform[key] || 0) + xySwipe }), {
                  ...defaultAnimationExtendOptions,
                  duration,
                  easing,
                  // 接着走 xySwipe ，没走到之前都是0，走完之后，后面就一直 1
                  before: (progress) =>
                    Math.min(
                      Math.max(
                        (Math.abs(diffXY + xySwipe + xyBounce) * progress - Math.abs(diffXY)) /
                          Math.abs(xySwipe),
                        0,
                      ),
                      1,
                    ),
                }),
                // 外部走damping距离xyBounce
                that.apply(new Value(translate + xyBounce), {
                  ...defaultAnimationExtendOptions,
                  duration,
                  easing,
                  // 后走 xyBounce ，没走之前，前面一直 0
                  before: (progress) =>
                    Math.max(
                      (Math.abs(diffXY + xySwipe + xyBounce) * progress -
                        Math.abs(diffXY) -
                        Math.abs(xySwipe)) /
                        Math.abs(xyBounce),
                      0,
                    ),
                }),
              ]).then(() => {
                // 外部归位
                that.apply(new Value(translate), {
                  ...defaultAnimationExtendOptions,
                });
              });
            } else {
              // 未超出边界
              if (diffXY !== 0) {
                // 外部damping反方向恢复
                that.apply(new Value(translate), {
                  ...defaultAnimationExtendOptions,
                  duration,
                  easing,
                  // 先走 diffXY ，走完之后，后面就一直 1
                  before: (progress) =>
                    Math.min((Math.abs(diffXY + xySwipe) * progress) / Math.abs(diffXY), 1),
                });
              }
              // 图片走xySwipe
              item.apply(new Value({ [key]: (item.value().transform[key] || 0) + xySwipe }), {
                ...defaultAnimationExtendOptions,
                duration,
                easing,
                // 后走 xySwipe ，没走之前，前面一直 0
                before: (progress) =>
                  Math.max(
                    (Math.abs(diffXY + xySwipe) * progress - Math.abs(diffXY)) / Math.abs(xySwipe),
                    0,
                  ),
              });
            }
          } else {
            // 在超出边界时启动swipe，且swipe方向是远离超出边界的方向
            const sign = diff > 0 ? 1 : -1;
            // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
            const xyMove = Math.max((xyBounce - diff) * sign, 0) * sign;
            const { duration, easing } = option(xyMove);
            if (xyMove === 0) {
              // 外部直接归位
              that.apply(new Value(translate), {
                ...defaultAnimationExtendOptions,
              });
            } else {
              that
                .apply(new Value(translate + diff + xyMove), {
                  ...defaultAnimationExtendOptions,
                  duration,
                  easing,
                })
                .then(() => {
                  // 外部归位
                  that.apply(new Value(translate), {
                    ...defaultAnimationExtendOptions,
                  });
                });
            }
          }
        };
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        const { duration, stretchX, stretchY } = swipeComputed(0.003);
        if (this.isVertical()) {
          const xRange = item.getXTranslation();
          // 竖向的时候固定x
          if (!(xRange[0] === 0 && xRange[1] === 0)) {
            item.swipeBounce(duration, stretchX, 'x');
          }
          item.swipeBounce(duration, stretchY - diffXY, 'y', transition);
        } else {
          item.swipeBounce(duration, stretchX - diffXY, 'x', transition);
          const yRange = item.getYTranslation();
          // 横向的时候固定y
          if (!(yRange[0] === 0 && yRange[1] === 0)) {
            item.swipeBounce(duration, stretchY, 'y');
          }
        }
      }
    } else {
      // 如果item不存在，却越界了，则抬起需要恢复
      this.slide(this.activeIndex(), {
        before: slideBefore as (v: number) => void,
        after: slideAfter as (v: number) => void,
      });
    }
    return;
  }
  if (this._moveTarget === 'closures') {
    // 这里设置目的是不再执行end里的closures
    this._moveTarget = 'none';
    // 如果滑动方向是向下的或向右的，执行关闭操作
    const isClose =
      (direction === 'Down' && this.isHorizontal()) || (direction === 'Right' && this.isVertical());
    this.swipeClose() && isClose && internalClose?.(event);
    return;
  }
  const size = this.itemSize();
  const index = size === 0 ? 0 : -this.value().transform.default / size;
  this.slide(Math[isForward ? 'floor' : 'ceil'](index), {
    before: slideBefore as (v: number) => void,
    after: slideAfter as (v: number) => void,
  });
}
