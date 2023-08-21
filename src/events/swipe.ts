/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:41:16
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import { type EaseFn } from '@huangjs888/transition';
import Gallery from '../gallery';
import type Picture from '../picture';

export default function swipe(this: Gallery | Picture, e: GEvent) {
  if (this._isClose) {
    return;
  }
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (this._moveTarget === 'inside' && entity) {
      if (entity.isTransitioning()) {
        return;
      }
      const { velocity = 0, swipeComputed } = e;
      if (velocity > 0 && swipeComputed) {
        const transition = (
          key: 'x' | 'y',
          xySwipe: number,
          xyBounce: number,
          option: (v: number) => { duration: number; easing: EaseFn },
        ) => {
          if (this instanceof Gallery) {
            const translate = -this._activeIndex * this.getItemSize();
            // 不等于0，表示未达到边界
            if (xySwipe !== 0) {
              const { duration, easing } = option(xySwipe + xyBounce);
              // 因为是两个过渡，这里同时触发，分别在before里设置先后发生，使两个过度连贯进行
              Promise.all([
                // 图片走到边界距离xySwipe
                entity.transitionRun(
                  { [key]: (entity.getTransform()[key] || 0) + xySwipe },
                  {
                    duration,
                    easing,
                    before: (progress) => {
                      // 先走 xySwipe ，走完之后，后面就一直 1
                      // 根据总路程 xySwipe + xyBounce，计算走 xySwipe 实际的进度
                      const s = Math.abs(xySwipe);
                      const sb = Math.abs(xySwipe + xyBounce);
                      return Math.min(sb * progress, s) / s;
                    },
                  },
                ),
                // 外部走damping距离xyBounce
                this.transitionRun(this._translate + xyBounce, {
                  duration,
                  easing,
                  before: (progress) => {
                    // 后走 xyBounce ，没走之前，前面一直 0
                    // 根据总路程 xySwipe + xyBounce，计算走 xyBounce 的实际的进度
                    const s = Math.abs(xySwipe);
                    const b = Math.abs(xyBounce);
                    const sb = Math.abs(xySwipe + xyBounce);
                    return Math.max(sb * progress - s, 0) / b;
                  },
                }),
              ]).then(() => {
                // 外部归位
                if (this instanceof Gallery) {
                  this.transitionRun(translate);
                }
              });
            } else {
              // 已经Damping的部分，即超出部分的距离
              const diff = this._translate - translate;
              const sign = diff > 0 ? 1 : -1;
              // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
              const xyMove = Math.max((xyBounce - diff) * sign, 0) * sign;
              const { duration, easing } = option(xyMove);
              if (xyMove === 0) {
                // 外部直接归位
                this.transitionRun(translate);
              } else {
                this.transitionRun(this._translate + xyMove, {
                  duration,
                  easing,
                }).then(() => {
                  // 外部归位
                  if (this instanceof Gallery) {
                    this.transitionRun(translate);
                  }
                });
              }
            }
          }
        };
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        const { duration, stretchX, stretchY } = swipeComputed(0.003);
        if (this._direction === 'vertical') {
          const xRange = entity.getXTranslation();
          // 竖向的时候固定x
          if (!(xRange[0] === 0 && xRange[1] === 0)) {
            entity.swipeBounce(duration, stretchX, 'x');
          }
          entity.swipeBounce(duration, stretchY, 'y', transition);
        } else {
          entity.swipeBounce(duration, stretchX, 'x', transition);
          const yRange = entity.getYTranslation();
          // 横向的时候固定y
          if (!(yRange[0] === 0 && yRange[1] === 0)) {
            entity.swipeBounce(duration, stretchY, 'y');
          }
        }
      }
      return;
    }
    if (this._moveTarget === 'closures') {
      if (entity && entity.isTransitioning()) {
        return;
      }
      // 如果滑动方向是向下的或向右的，执行关闭操作
      if (this._swipeClose && e.direction === 'Down') {
        this.close();
        this._moveTarget = 'none';
      }
      return;
    }
    const size = this.getItemSize();
    const index = size === 0 ? 0 : -this._translate / this.getItemSize();
    this.slide(index > this._activeIndex ? Math.ceil(index) : Math.floor(index));
    // @@@2： 此处逻辑和touchstart手势函数里 @@@1 逻辑是处理里同一个问题（二选一，微信用的是@@@1效果）
    // 这里是在真正要slide到上(下)一张时恢复到边界，那里是在手指放上去时直接恢复到边界
    // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
    // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
    // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
    /* if (entity) {
        // 这里在slide时把内部图片reset
        entity.reset();
      } */
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      const { velocity = 0, swipeComputed } = e;
      if (velocity > 0 && swipeComputed) {
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        const { duration, stretchX, stretchY } = swipeComputed(0.003);
        entity.swipeBounce(duration, stretchX, 'x');
        entity.swipeBounce(duration, stretchY, 'y');
      }
    }
  }
}
