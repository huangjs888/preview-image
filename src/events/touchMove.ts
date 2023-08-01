/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 09:19:20
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import { revokeDamping, performDamping } from '@huangjs888/damping';
import { between } from '../entity/utils';
import Gallery from '../gallery';
import SingleGallery from '../singleGallery';
import { setStyle } from '../dom';

const isRightDown = (
  direction: string,
  [x0, y0]: number[],
  [x1, y1]: number[],
) => {
  if (direction === 'vertical') {
    return Math.abs(x0 - x1) > 4 * Math.abs(y0 - y1) && x0 - x1 <= 0;
  } else {
    console.log(
      90 - (Math.atan(Math.abs(y0 - y1) / Math.abs(x0 - x1)) * 180) / Math.PI,
    );
    return Math.abs(y0 - y1) > 4 * Math.abs(x0 - x1) && y0 - y1 <= 0;
  }
};

export default function touchMove(this: Gallery | SingleGallery, e: GEvent) {
  const { toucheIds } = e;
  if (this._fgBehavior === 0 && toucheIds.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  let oneFinger = false;
  if (toucheIds.length === 1 || this._fgBehavior === 1) {
    // 此时的多指move，视作单指move
    // 曲线救国 2：这里使用注入设置，以达到使_rotateAngle不为number，避免了双指旋转
    if (this._gesture) {
      this._gesture._rotateAngle = null;
    }
    oneFinger = true;
  }
  const {
    direction,
    movePoint,
    endPoint,
    point,
    angle = 0,
    scale = 1,
    deltaX = 0,
    deltaY = 0,
  } = e;
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity, wrapper } =
      (this._images && this._images[this._activeIndex]) || {};
    const length = (this._images || []).length;
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      const { x: tx = 0, y: ty = 0 } = entity.getTransform();
      const [xRange, yRange] = entity.getTranslation();
      // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
      const fixedX = xRange[0] === 0 && xRange[1] === 0;
      // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
      const fixedY = yRange[0] === 0 && yRange[1] === 0;
      if (this._moveTarget === 'none') {
        // 多指或者不满足以下条件的，则做图片操作
        this._moveTarget = 'inside';
        if (oneFinger) {
          // 是否是边缘图片
          const isFirst = this._activeIndex === 0;
          const isLast = this._activeIndex === length - 1;
          const rightDown = isRightDown(this._direction, movePoint, endPoint);
          // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
          if (this._direction === 'vertical') {
            if (
              this._events &&
              typeof this._events.downSwipe === 'function' &&
              tx >= xRange[1] &&
              rightDown
            ) {
              this._moveTarget = 'closures';
            } else {
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
            if (
              this._events &&
              typeof this._events.downSwipe === 'function' &&
              ty >= yRange[1] &&
              rightDown
            ) {
              this._moveTarget = 'closures';
            } else {
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
      }
      // 进入内部图片操作
      if (this._moveTarget === 'inside') {
        const translate = -this._activeIndex * this.getItemSize();
        // 计算出外部swiper移动的原始距离
        const diff = revokeDamping(this._translate - translate, {
          max: this.getItemSize(),
        });
        let _deltaX = deltaX;
        let _deltaY = deltaY;
        // 把swiper移动的原始距离加进去
        if (this._direction === 'vertical') {
          _deltaY += diff;
        } else {
          _deltaX += diff;
        }
        if (oneFinger) {
          let _delta = 0;
          if (this._direction === 'vertical') {
            _delta = _deltaY;
            // 竖向的时候固定x
            _deltaX = fixedX ? 0 : _deltaX;
            // 内部图片，最多移动到边界
            _deltaY = between(_deltaY + ty, yRange) - ty;
            // 超出部分由外部swiper移动
            _delta -= _deltaY;
          } else {
            _delta = _deltaX;
            // 内部图片，最多移动到边界
            _deltaX = between(_deltaX + tx, xRange) - tx;
            // 横向的时候固定y
            _deltaY = fixedY ? 0 : _deltaY;
            // 超出部分由外部swiper移动
            _delta -= _deltaX;
          }
          // 内部图片需要移动的距离
          entity.move(point, 0, 1, _deltaX, _deltaY);
          // 外部swiper需要移动的距离
          this.transitionRun(
            translate + performDamping(_delta, { max: this.getItemSize() }),
            { duration: 0 },
          );
        } else {
          entity.move(point, angle, scale, _deltaX, _deltaY);
          if (diff !== 0) {
            // 多指移动前，将外部swiper移动的部分归位（内部image会把swiper的距离加进去）
            this.transitionRun(translate, { duration: 0 });
          }
        }
        return;
      }
    } else {
      if (this._moveTarget === 'none') {
        this._moveTarget =
          this._events &&
          typeof this._events.downSwipe === 'function' &&
          isRightDown(this._direction, movePoint, endPoint)
            ? 'closures'
            : 'outside';
      }
    }
    if (this._moveTarget === 'closures') {
      if (this.container && this._rectSize) {
        const { moveX = 0, moveY = 0 } = e;
        const { width, height, left, top } = this._rectSize;
        let sk = 1;
        if (this._direction === 'vertical') {
          sk = width === 0 ? 0 : moveX / width;
        } else {
          sk = height === 0 ? 0 : moveY / height;
        }
        const nk = Math.min(Math.max(1 - sk, 0.3), 1);
        if (wrapper) {
          let x = 0;
          let y = 0;
          let k = 1;
          if (wrapper.style.transform) {
            const styles = wrapper.style.transform.split('(');
            const [xs, ys] = styles[1].split(')')[0].split(',');
            const ks = styles[2].split(')')[0];
            x = parseFloat(xs);
            y = parseFloat(ys);
            k = parseFloat(ks);
          }
          let ox = point[0] - (x + left + width / 2);
          let oy = point[1] - (y + top + height / 2);
          const dk = nk / k;
          ox *= 1 - dk;
          oy *= 1 - dk;
          setStyle(wrapper, {
            overflow: '',
            transform: `translate(${x + deltaX + ox}px,${
              y + deltaY + oy
            }px) scale(${nk})`,
            transition: 'none',
          });
        }
        setStyle(this.container, {
          background: `rgba(0,0,0,${(nk - 0.3) / 0.7})`,
          transition: 'none',
        });
      }
      return;
    }
    // 非内部图片操作，均是外部swiper操作
    const swiperRange = [(1 - length) * this.getItemSize(), 0];
    // 先把当前值反算出阻尼之前的原值
    let bt = between(this._translate, swiperRange);
    let t =
      bt + revokeDamping(this._translate - bt, { max: this.getItemSize() });
    // 再对总值进行总体阻尼计算
    bt = between(
      (t += this._direction === 'vertical' ? deltaY : deltaX),
      swiperRange,
    );
    t = bt + performDamping(t - bt, { max: this.getItemSize() });
    this.transitionRun(t, { duration: 0 });
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      if (oneFinger) {
        // 实现单指move
        entity.move(point, 0, 1, deltaX, deltaY);
      } else {
        // 双指move
        entity.move(point, angle, scale, deltaX, deltaY);
      }
    }
  }
}
