/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:53
 * @Description: ******
 */

import { revokeDamping, performDamping } from '@huangjs888/damping';
import { between } from '../entity/utils';
import Gallery from '../gallery';
import { popupTransform } from '../popup';
const minScale = 0.3; // swipeClose下拉最小缩放比例
const minOpacity = 0.01; // swipeClose下拉最小透明度
const isRightDown = (direction, [x0, y0], [x1, y1]) => {
  if (direction === 'vertical') {
    return Math.abs(x0 - x1) > 4 * Math.abs(y0 - y1) && x0 - x1 <= 0;
  } else {
    return Math.abs(y0 - y1) > 4 * Math.abs(x0 - x1) && y0 - y1 <= 0;
  }
};
export default function pointerMove(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointers.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  let onePointer = false;
  if (e.pointers.length === 1 || this._fgBehavior === 1) {
    onePointer = true;
  }
  const point = e.getPoint();
  const point0 = e.getPoint('previous');
  const {
    direction,
    angle = 0,
    scale = 1,
    deltaX = 0,
    deltaY = 0
  } = e;
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const {
      entity,
      wrapper
    } = this._images && this._images[this._activeIndex] || {};
    const length = (this._images || []).length;
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      const {
        x: tx = 0,
        y: ty = 0
      } = entity.getTransform();
      const [xRange, yRange] = entity.getTranslation();
      // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
      const fixedX = xRange[0] === 0 && xRange[1] === 0;
      // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
      const fixedY = yRange[0] === 0 && yRange[1] === 0;
      if (this._moveTarget === 'none') {
        // 多指或者不满足以下条件的，则做图片操作
        this._moveTarget = 'inside';
        if (onePointer) {
          // 是否是边缘图片
          const isFirst = this._activeIndex === 0;
          const isLast = this._activeIndex === length - 1;
          const rightDown = isRightDown(this._direction, point0, point);
          // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
          if (this._direction === 'vertical') {
            if (this._swipeClose && tx >= xRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果x的范围是[0,0]，则判断上下移动，直接根据deltaY的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              const upMove = fixedX ? deltaY < 0 : direction === 'Up';
              const downMove = fixedX ? deltaY > 0 : direction === 'Down';
              // 如果图片上边抵达或超出上边界，仍然向下滑动（不是第一张图）
              // 或者下边抵达或超出下边界，仍然向上滑动（不是最后一张图），则为swiper，反之为图片操作
              // 因为第一张图片和最后一张都是边缘图片（边缘图片向两边swipe时，是没有上一张或下一张的），无需外部swipe操作，直接走内部图片操作
              if (ty <= yRange[0] && upMove && !isLast || ty >= yRange[1] && downMove && !isFirst) {
                this._moveTarget = 'outside';
              }
            }
          } else {
            if (this._swipeClose && ty >= yRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果y的范围是[0,0]，则判断左右移动，直接根据deltaX的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              const leftMove = fixedY ? deltaX < 0 : direction === 'Left';
              const rightMove = fixedY ? deltaX > 0 : direction === 'Right';
              // 如果图片左边抵达或超出左边界，仍然向右滑动（不是第一张图）
              // 或者右边抵达或超出右边界，仍然向左滑动（不是最后一张图），则为swiper操作，反之为图片操作
              if (tx <= xRange[0] && leftMove && !isLast || tx >= xRange[1] && rightMove && !isFirst) {
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
          max: this.getItemSize()
        });
        let _deltaX = deltaX;
        let _deltaY = deltaY;
        // 把swiper移动的原始距离加进去
        if (this._direction === 'vertical') {
          _deltaY += diff;
        } else {
          _deltaX += diff;
        }
        if (onePointer) {
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
          entity.moveBounce(0, 1, _deltaX, _deltaY, point);
          // 外部swiper需要移动的距离
          this.transitionRun(translate + performDamping(_delta, {
            max: this.getItemSize()
          }), {
            duration: 0
          });
        } else {
          entity.moveBounce(angle, scale, _deltaX, _deltaY, point);
          if (diff !== 0) {
            // 多指移动前，将外部swiper移动的部分归位（内部image会把swiper的距离加进去）
            this.transitionRun(translate, {
              duration: 0
            });
          }
        }
        return;
      }
    } else {
      if (this._moveTarget === 'none') {
        this._moveTarget = this._swipeClose && isRightDown(this._direction, point0, point) ? 'closures' : 'outside';
      }
    }
    if (this._moveTarget === 'closures') {
      const {
        moveX = 0,
        moveY = 0
      } = e;
      const {
        width = 0,
        height = 0,
        left = 0,
        top = 0
      } = this._rectSize || {};
      const k = Math.min(Math.max(1 - ((this._direction === 'vertical' ? moveX / width : moveY / height) || 0), minScale), 1);
      const o = minOpacity + (k - minScale) * (1 - minOpacity) / (1 - minScale);
      let x = 0;
      let y = 0;
      if (wrapper) {
        let _x = 0;
        let _y = 0;
        let _k = 1;
        if (wrapper.style.transform) {
          const styles = wrapper.style.transform.split('(');
          const [xs, ys] = styles[1].split(')')[0].split(',');
          const ks = styles[2].split(')')[0];
          _x = parseFloat(xs);
          _y = parseFloat(ys);
          _k = parseFloat(ks);
        }
        x = _x + deltaX + (point[0] - (_x + left + width / 2)) * (1 - k / _k);
        y = _y + deltaY + (point[1] - (_y + top + height / 2)) * (1 - k / _k);
      }
      popupTransform({
        el: this._backdrop,
        o
      }, {
        el: wrapper || null,
        x,
        y,
        k
      }, {
        el: null
      });
      return;
    }
    // 非内部图片操作，均是外部swiper操作
    const swiperRange = [(1 - length) * this.getItemSize(), 0];
    // 先把当前值反算出阻尼之前的原值
    let bt = between(this._translate, swiperRange);
    let t = bt + revokeDamping(this._translate - bt, {
      max: this.getItemSize()
    });
    // 再对总值进行总体阻尼计算
    bt = between(t += this._direction === 'vertical' ? deltaY : deltaX, swiperRange);
    t = bt + performDamping(t - bt, {
      max: this.getItemSize()
    });
    this.transitionRun(t, {
      duration: 0
    });
  } else {
    const {
      entity
    } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      if (onePointer) {
        // 实现单指move
        entity.moveBounce(0, 1, deltaX, deltaY, point);
      } else {
        // 双指move
        entity.moveBounce(angle, scale, deltaX, deltaY, point);
      }
    }
  }
}