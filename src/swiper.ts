/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-12 17:54:30
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import Transition, { TAProperty } from './transition';
import Image from './image';
import {
  between,
  setStyle,
  loadImage,
  proxyImage,
  easeOutQuart,
  revokeDamping,
  performDamping,
} from './adjust';

proxyImage();

const touchStart = function touchStart(this: Swiper, e: GEvent) {
  const { toucheIds } = e;
  if (this._fgBehavior === 0 && toucheIds.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  let cancelNumber = 0;
  // 取消动画
  const { image } = this._images[this._activeIndex];
  if (image) {
    cancelNumber += image.transitionCancel();
  }
  cancelNumber += this.transitionCancel();
  if (cancelNumber > 0) {
    // 如果有动画停止，则本次点击或略，阻止所有单指点击相关事件
    // 曲线救国 1：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPoint = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
};
const touchMove = function touchMove(this: Swiper, e: GEvent) {
  const { toucheIds } = e;
  if (this._fgBehavior === 0 && toucheIds.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  if (this.isTransitioning()) {
    return;
  }
  const { direction, point, angle = 0, scale = 1, deltaX = 0, deltaY = 0 } = e;
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    let oneFinger = false;
    if (toucheIds.length === 1 || this._fgBehavior === 1) {
      // 此时的多指move，视作单指move
      // 曲线救国 2：这里使用注入设置，以达到使_rotateAngle不为number，避免了双指旋转
      this._gesture._rotateAngle = null;
      oneFinger = true;
    }
    const { x: tx = 0, y: ty = 0 } = image.getTransform();
    const [xRange, yRange] = image.getTranslation();
    // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
    const fixedX = xRange[0] === 0 && xRange[1] === 0;
    // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
    const fixedY = yRange[0] === 0 && yRange[1] === 0;
    if (this._moveTarget === 'none') {
      // 多指或者不满足以下条件的，则做图片操作
      this._moveTarget = 'inside';
      if (oneFinger) {
        // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
        if (this._direction === 'vertical') {
          const upMove = fixedX ? deltaY < 0 : direction === 'Up';
          const downMove = fixedX ? deltaY > 0 : direction === 'Down';
          // 如果图片抵达或超出上边界，仍然向上滑动，或者抵达或超出下边界，仍然向下滑动，则为swiper，反之为图片操作
          if ((ty <= yRange[0] && upMove) || (ty >= yRange[1] && downMove)) {
            this._moveTarget = 'outside';
          }
        } else {
          const leftMove = fixedY ? deltaX < 0 : direction === 'Left';
          const rightMove = fixedY ? deltaX > 0 : direction === 'Right';
          // 如果图片抵达或超出左边界，仍然向左滑动，或者抵达或超出右边界，仍然向右滑动，则为swiper操作，反之为图片操作
          if ((tx <= xRange[0] && leftMove) || (tx >= xRange[1] && rightMove)) {
            this._moveTarget = 'outside';
          }
        }
      }
    }
    // 进入内部图片操作
    if (this._moveTarget === 'inside') {
      const translate = -this._activeIndex * this.getUnitSize();
      // 计算出外部swiper移动的原始距离
      const diff =
        Math.round(this._translate - translate) !== 0
          ? revokeDamping(this._translate, [translate, translate]) - translate
          : 0;
      let _deltaX = deltaX;
      let _deltaY = deltaY;
      if (this._direction === 'vertical') {
        _deltaY += diff;
      } else {
        _deltaX += diff;
      }
      if (oneFinger) {
        let _delta = 0;
        if (this._direction === 'vertical') {
          _delta = _deltaY;
          _deltaX = fixedX ? 0 : _deltaX;
          _deltaY = between(_deltaY + ty, yRange) - ty;
          _delta -= _deltaY;
        } else {
          _delta = _deltaX;
          _deltaX = between(_deltaX + tx, xRange) - tx;
          _deltaY = fixedY ? 0 : _deltaY;
          _delta -= _deltaX;
        }
        // 图片需要移动的距离
        image.move(point, 0, 1, _deltaX, _deltaY);
        // swiper需要移动的距离
        this.transitionRun(
          performDamping(translate + _delta, [translate, translate]),
          0,
        );
      } else {
        image.move(point, angle, scale, _deltaX, _deltaY);
        if (diff !== 0) {
          // 多指移动前，将外部swiper移动的部分归位
          this.transitionRun(translate, 0);
        }
      }
      return;
    }
  }
  // 非内部图片操作，均是外部swiper操作
  const swiperRange = [(1 - this._images.length) * this.getUnitSize(), 0];
  this.transitionRun(
    performDamping(
      revokeDamping(this._translate, swiperRange) +
        (this._direction === 'vertical' ? deltaY : deltaX),
      swiperRange,
    ),
    0,
  );
};
const touchEnd = function touchEnd(this: Swiper, e: GEvent) {
  const { toucheIds } = e;
  // 这里暂存一下，不然后需要用到this._moveTarget，不然提前重置了
  const target = this._moveTarget;
  if (toucheIds.length === 0) {
    // 抬起最后一根手指时，重置_fgBehavior和_moveTarget
    this._fgBehavior = 0;
    this._moveTarget = 'none';
  } else if (this._fgBehavior === 1) {
    // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
    if (target === 'outside') {
      this.slide(Math.round(-this._translate / this.getUnitSize()));
    }
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    return;
  }
  if (this.isTransitioning()) {
    return;
  }
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.isTransitioning()) {
      return;
    }
    // image.reset内部会做isTransitioning的判断
    // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否为双指
    image.reset(e.point, typeof this._gesture._rotateAngle === 'number');
  }
  // 只有在swiper的时候才会下一张
  const index =
    target === 'outside'
      ? -this._translate / this.getUnitSize()
      : this._activeIndex;
  // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断, slide方法里会更新_activeIndex
  this.slide(Math.round(index));
};
const doubleTap = function doubleTap(this: Swiper, e: GEvent) {
  if (this.isTransitioning()) {
    return;
  }
  // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
  const diff = Math.round(
    this._translate + this._activeIndex * this.getUnitSize(),
  );
  if (diff === 0) {
    const { image } = this._images[this._activeIndex];
    if (image) {
      if (image.isTransitioning()) {
        return;
      }
      image.dblScale(e.point);
    }
  }
};
const swipe = function swipe(this: Swiper, e: GEvent) {
  if (this.isTransitioning()) {
    return;
  }
  if (this._moveTarget === 'outside') {
    if (!this.isTransitioning()) {
      const index = -this._translate / this.getUnitSize();
      this.slide(
        index > this._activeIndex ? Math.ceil(index) : Math.floor(index),
      );
    }
  } else if (this._moveTarget === 'inside') {
    const { image } = this._images[this._activeIndex];
    if (image) {
      if (image.isTransitioning()) {
        return;
      }
      const { velocity = 0, swipeComputed } = e;
      if (velocity > 0 && swipeComputed) {
        const { duration, stretchX, stretchY } = swipeComputed(
          0.003,
          velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
        );
        image.swipe(duration, stretchX, stretchY);
        /* const [containerWidth, containerHeight] = this._eleSize;
        const { x: tx = 0, y: ty = 0 } = image.getTransform();
        const _duration = Math.max(1200, Math.min(duration, 2500));
        // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
        const xRange = image.getXTranslation();
        if (tx > xRange[0] || tx < xRange[1]) {
          let x = tx + stretchX;
          let t = _duration;
          if (!isBetween(x, xRange)) {
            x = between(x, xRange);
            let ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
            if (image.isDamping('translate')) {
              const v = ratio * ((2 * Math.abs(stretchX)) / duration);
              x +=
                containerWidth *
                Math.min(v / 20, 1 / 4) *
                (stretchX > 0 ? 1 : -1);
              ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
            }
            t = Math.max(t * (1 - ratio), 400);
          }
          if (isBetween(x, xRange)) {
            image.transitionRun({ x }, { easing: easeOutQuad, duration: t });
          } else {
            const ix = Math.min(Math.max(x, xRange[0]), xRange[1]);
            const it = (1 - Math.sqrt(1 - ix / x)) * t;
            const jx = x - ix;
            const jt = t - it;
            image.transitionRun(
              { x: x },
              {
                easing: easeOutQuad,
                duration: t,
                before: (progress) => {
                  if (progress > it / t) {
                    console.log(progress);
                    return false;
                  }
                },
              },
            );
            this.transitionRun(
              -this._activeIndex * this.getUnitSize() + jx,
              jt,
              easeOutQuad,
            ).then(() => {
              // this.transitionRun(-this._activeIndex * this.getUnitSize());
            });
          }
        }
        // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
        const yRange = image.getYTranslation();
        if (isBetween(ty, yRange)) {
          let y = ty + stretchY;
          let t = _duration;
          if (!isBetween(y, yRange)) {
            y = between(y, yRange);
            let ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
            if (image.isDamping('translate')) {
              const v = ratio * ((2 * Math.abs(stretchY)) / duration);
              y +=
                containerHeight *
                Math.min(v / 20, 1 / 4) *
                (stretchY > 0 ? 1 : -1);
              ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
            }
            t = Math.max(t * (1 - ratio), 400);
          }
          // y方向进行惯性位移
          image
            .transitionRun({ y }, { easing: easeOutQuad, duration: t })
            .then(() => {
              // 惯性位移后超出边界，则归位
              if (!isBetween(y, yRange)) {
                image.transitionRun({ y: between(y, yRange) });
              }
            });
        } else {
          // 直接归位
          image.transitionRun({ y: between(ty, yRange) });
        } */
      }
    }
  }
};

class Swiper {
  element: HTMLElement;
  tipEl: HTMLElement;
  contentEl: HTMLElement; // swiper元素
  _transition: Transition; // swiper过渡
  _translate: number = 0; // swiper位移
  _activeIndex: number = 0;
  _itemGap: number;
  _images: ImageType[];
  _direction: Direction;
  _eleSize: number[] = [0, 0];
  _gesture: Gesture; // 手势对象
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _moveTarget: 'outside' | 'inside' | 'none' = 'none'; // 判断是内部的图片移动，还是外部swiper移动
  constructor({
    element,
    imageUrls,
    direction = 'horizontal',
    activeIndex = 0,
    itemGap = 20,
  }: SOption) {
    let _element: HTMLElement | null;
    try {
      if (typeof element === 'string') {
        _element = document.querySelector(element);
      } else {
        _element = element;
      }
    } catch (e) {
      _element = null;
    }
    if (!_element || !(_element instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    _element.innerHTML = '';
    const _contentEl = setStyle(document.createElement('div'), {
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
    });
    _element.appendChild(_contentEl);
    const _tipEl = setStyle(document.createElement('div'), {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.5)',
      color: '#fff',
      fontSize: 18,
    });
    _element.appendChild(_tipEl);
    this.element = _element;
    this.contentEl = _contentEl;
    this.tipEl = _tipEl;
    this._itemGap = itemGap;
    this._direction = direction;
    this._transition = new Transition({
      element: this.contentEl,
      propertyName: 'transform',
      propertyValue: new (class extends TAProperty {
        toString() {
          return `translate${direction === 'vertical' ? 'Y' : 'X'}(${
            this.value.translate
          }px)`;
        }
      })({ translate: this._translate }),
    });
    // 绑定手势
    const gesture = new Gesture(this.element);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    this._images = imageUrls.map((url, i) => {
      const margin =
        direction === 'vertical'
          ? { marginTop: i === 0 ? 0 : itemGap }
          : { marginLeft: i === 0 ? 0 : itemGap };
      const wrapper = setStyle(document.createElement('div'), {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        ...margin,
      });
      this.contentEl.appendChild(wrapper);
      return {
        wrapper,
        url,
        image: null,
        width: 0,
        height: 0,
      };
    });
    this.resize();
    this.slide(activeIndex, 0);
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }
  getUnitSize() {
    const unitSize =
      this._eleSize[this._direction === 'vertical' ? 1 : 0] + this._itemGap;
    return unitSize;
  }
  createImage(imageObj: ImageType) {
    const { image, url, wrapper } = imageObj;
    if (!image) {
      loadImage(url, (v) => {
        setStyle(this.tipEl, { display: 'flex' });
        // 这里可以加一个进度条提示
        // 如果需要进度，必须在初始化的时候执行 proxyImage
        this.tipEl.innerHTML = `${Math.round(v * 100)}%`;
      })
        .then((ele) => {
          imageObj.image = new Image({ element: ele });
          imageObj.width = ele.naturalWidth;
          imageObj.height = ele.naturalHeight;
          setStyle(this.tipEl, { display: 'none' });
          this.tipEl.innerHTML = '';
          wrapper.appendChild(ele);
          this.resize();
        })
        .catch((e) => {
          // 这里可以加一个错误的提示
          console.error(e);
          setStyle(this.tipEl, { display: 'flex' });
          this.tipEl.innerHTML = '加载失败';
        });
    }
  }
  resize() {
    const { left, top, width, height } = this.element.getBoundingClientRect();
    this._eleSize = [width, height];
    const len = this._images.length;
    setStyle(this.contentEl, {
      width:
        this._direction === 'vertical'
          ? width
          : width * len + (len - 1) * this._itemGap,
      height:
        this._direction === 'vertical'
          ? height * len + (len - 1) * this._itemGap
          : height,
    });
    const imageObj = this._images[this._activeIndex];
    if (imageObj.image) {
      imageObj.image.setRectSize({
        containerCenter: [left + width / 2, top + height / 2],
        containerWidth: width,
        containerHeight: height,
        naturalWidth: imageObj.width,
        naturalHeight: imageObj.height,
      });
      const { elementHeight } = imageObj.image.getRectSize();
      if (this._direction !== 'vertical' && elementHeight > height) {
        setStyle(imageObj.wrapper, {
          alignItems: 'flex-start',
        });
      }
    }
  }

  slide(index: number, duration?: number) {
    const _index = (this._activeIndex = Math.min(
      Math.max(index, 0),
      this._images.length - 1,
    ));
    const _translate =
      -_index *
      (this._eleSize[this._direction === 'vertical' ? 1 : 0] + this._itemGap);
    this.transitionRun(_translate, duration).then(() => {
      // resize上一个
      // this.resize();
      // 创建下一个
      this.createImage(this._images[_index]);
    });
  }
  next() {
    return this.slide(this._activeIndex + 1);
  }
  prev() {
    return this.slide(this._activeIndex - 1);
  }
  transitionRun(
    translate: number,
    duration: number = 400,
    easing = easeOutQuart,
  ) {
    if (duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._translate = translate;
      this._transition.bind({ translate });
      return Promise.resolve({ translate });
    }
    const delta = translate - this._translate;
    this._translate = translate;
    return this._transition
      .apply(
        { translate: delta },
        {
          precision: { translate: 1 },
          duration,
          easing,
          cancel: true,
        },
      )
      .then((value) => {
        if (!this.isTransitioning()) {
          // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
          this._transition.bind({ translate: this._translate });
        }
        return value;
      });
  }
  transitionCancel() {
    // cancel返回值是动画未执行的部分
    return this._transition.cancel().map((value) => {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      this._translate -= value.translate;
    }).length;
  }
  isTransitioning() {
    return this._transition.transitioning();
  }
  destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
    }
    window.removeEventListener('resize', this.resize);
  }
}

type ImageType = {
  wrapper: HTMLElement;
  image: Image | null;
  url: string;
  width: number;
  height: number;
};

export type Direction = 'vertical' | 'horizontal';

export type SOption = {
  element: HTMLElement | string;
  imageUrls: string[];
  direction?: Direction;
  activeIndex?: number;
  itemGap?: number;
};

export default Swiper;
