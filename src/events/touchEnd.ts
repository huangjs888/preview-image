/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 13:56:53
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import Gallery from '../gallery';
import SingleGallery from '../singleGallery';
import { setStyle } from '../dom';

export default function touchEnd(this: Gallery | SingleGallery, e: GEvent) {
  const { toucheIds, point } = e;
  if (toucheIds.length === 0) {
    // 抬起最后一根手指时，重置_fgBehavior
    this._fgBehavior = 0;
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    if (this instanceof Gallery) {
      // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
      if (this._moveTarget === 'outside') {
        const size = this.getItemSize();
        const index = size === 0 ? 0 : -this._translate / this.getItemSize();
        this.slide(Math.round(index));
      }
    }
    return;
  }
  // entity.reset内部会做isTransitioning的判断
  // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否取消动画
  const cancel =
    !!this._gesture && typeof this._gesture._rotateAngle !== 'number';
  if (this instanceof Gallery) {
    // 因为下面需要用到this._moveTarget值，所以这里暂存一下值，不然提前重置了
    const target = this._moveTarget;
    if (toucheIds.length === 0) {
      // 抬起最后一根手指时，重置_moveTarget
      this._moveTarget = 'none';
    }
    if (this.isTransitioning()) {
      return;
    }
    const { entity, wrapper } =
      (this._images && this._images[this._activeIndex]) || {};
    if (target === 'closures') {
      const ele = this.container;
      if (ele) {
        setStyle(ele, {
          background: 'rgba(0,0,0,1)',
          transition: 'all 0.4s',
        });
        if (wrapper) {
          setStyle(wrapper, {
            transform: 'translate(0px,0px) scale(1)',
            transition: 'transform 0.4s',
          });
        }
        const transitionend = (ee: TransitionEvent) => {
          if (
            ee.target === ele &&
            ee.propertyName.indexOf('background') !== -1
          ) {
            ele.removeEventListener('transitionend', transitionend);
            setStyle(ele, {
              transition: 'none',
            });
            if (wrapper) {
              setStyle(wrapper, {
                overflow: 'hidden',
                transition: 'none',
              });
            }
          }
        };
        ele.addEventListener('transitionend', transitionend);
      }
      return;
    }
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }

      entity.reset(point, cancel);
    }
    // 只有在swiper的时候才会下一张
    const size = this.getItemSize();
    let index = this._activeIndex;
    if (target === 'outside') {
      index = size === 0 ? 0 : -this._translate / this.getItemSize();
    }
    // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断, slide方法里会更新_activeIndex
    this.slide(Math.round(index));
  } else {
    const { entity } = this._image || {};
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      // entity.reset内部会做isTransitioning的判断
      // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否为双指
      entity.reset(point, cancel);
    }
  }
}
