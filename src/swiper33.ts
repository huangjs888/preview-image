/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-10 10:42:04
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import Image from './image';
import Transition, { TAProperty } from './transition';
import {
  setStyle,
  proxyImage,
  loadImage,
  performDamping,
  revokeDamping,
  easeOutQuart,
} from './adjust';

type STarget = 'swiper' | 'image' | 'none';

proxyImage();

//-1：加入swipe然后，手指问题，双指，单指变化
// 0._target判断问题，start里如何判断，何时置为none，没有移动的情况下抬起以及双击时里面如何判断
// 1.加入了swiper方向，构造函数里样式和宽高设置要改
// 2.如何让image里的move和swipe根据在(xRange[0] === 0 && xRange[1] === 0)的时候x不做变换，(yRange[0] ===0 && yRange[1] ===0)的时候y不做变换
// 3.如何让image里的move和swipe在越界damping的时候使用swiper的damping（只在swiper方向上）

const touchStart = function touchStart(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length > 1 && this._fingers === 0) {
    // 当单指未触发移动，接着放了另外的手指，则认为开启了双指操作，手指为2个
    this._fingers = 2;
  }
  let cancelNumber = 0;
  if (this._target === 'swiper') {
    cancelNumber += this.transitionCancel();
  } else if (this._target === 'image') {
    const { image } = this._images[this._activeIndex];
    if (image) {
      cancelNumber += image.transitionCancel();
    }
    this._target = 'none';
  }
  if (cancelNumber > 0) {
    // 曲线救国 1：
    // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
    // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
    this._gesture._firstPoint = null;
    this._gesture._preventSingleTap = true;
  }
};
const touchMove = function touchMove(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length === 1 && this._fingers === 0) {
    // 当触发移动时，若只有一个手指在界面上，就认为一直只有一个手指，即使后面再放手指
    this._fingers = 1;
    // 曲线救国 2：
    // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
    // 这里拿出来是为了阻止双指移动时改变了_rotateAngle类型，仅仅是让touchEnd的时候可以取消动画
    this._gesture._rotateAngle = null;
  }
  const { direction, deltaX = 0, deltaY = 0 } = e;
  const { image } = this._images[this._activeIndex];
  if (this._target === 'none') {
    // 先对_target进行判断
    if (this._fingers === 1) {
      if (image) {
        // 一根手指，并且image存在，则根据图片位置，判断后续为swiper操作还是image操作
        const { x: tx = 0, y: ty = 0 } = image.getTransform();
        const [xRange, yRange] = image.getTranslation();
        if (this._direction === 'vertical') {
          // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
          const fixedX = xRange[0] === 0 && xRange[1] === 0;
          const upMove = fixedX ? deltaY < 0 : direction === 'Up';
          const downMove = fixedX ? deltaY > 0 : direction === 'Down';
          // 如果图片抵达或超出上边界，仍然向上滑动，或者抵达或超出下边界，仍然向下滑动，则为swiper，反之为image
          if ((ty <= yRange[0] && upMove) || (ty >= yRange[1] && downMove)) {
            this._target = 'swiper';
          } else {
            this._target = 'image';
          }
        } else {
          // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
          const fixedY = yRange[0] === 0 && yRange[1] === 0;
          const leftMove = fixedY ? deltaX < 0 : direction === 'Left';
          const rightMove = fixedY ? deltaX > 0 : direction === 'Right';
          // 如果图片抵达或超出左边界，仍然向左滑动，或者抵达或超出右边界，仍然向右滑动，则为swiper操作，反之为image操作
          if ((tx <= xRange[0] && leftMove) || (tx >= xRange[1] && rightMove)) {
            this._target = 'swiper';
          } else {
            this._target = 'image';
          }
        }
      } else {
        // 一根手指，并且image不存在，只做swiper操作
        this._target = 'swiper';
      }
    } else {
      if (image) {
        // 两根手指，并且image存在，则做image操作
        this._target = 'image';
      } else {
        // 两根手指，并且image不存在，不做任何操作
      }
    }
  }
  if (this._target === 'swiper') {
    if (!this.isTransitioning()) {
      const range = [(1 - this._images.length) * this.getUnitSize(), 0];
      this.transitionRun(
        performDamping(revokeDamping(this._translate, range) + deltaX, range),
        0,
      );
    }
  } else if (this._target === 'image') {
    if (image) {
      const { point, angle = 0, scale = 1 } = e;
      image.move(point, angle, scale, deltaX, deltaY);
    }
  }
};
const touchEnd = function touchEnd(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length === 0 && this._fingers !== 0) {
    // 手指全部抬起时，手指数目置为0
    this._fingers = 0;
  }
  if (this._target === 'swiper') {
    if (!this.isTransitioning()) {
      const index = -this._translate / this.getUnitSize();
      // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断
      this.slide(Math.round(index));
    }
  } else if (this._target === 'image') {
    const { image } = this._images[this._activeIndex];
    if (image) {
      // 曲线救国 3：
      // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
      // 这里拿出来是为了判断抬起之前是否进行过双指移动行为（如果未移动或单指是null），从而判断是否可以取消动画
      image.reset(e.point, typeof this._gesture._rotateAngle !== 'number');
    }
  }
};
const doubleTap = function doubleTap(this: Swiper, e: GEvent) {
  if (this._target !== 'swiper') {
    const { image } = this._images[this._activeIndex];
    if (image) {
      image.dblScale(e.point);
    }
  }
};
const swipe = function swipe(this: Swiper, e: GEvent) {
  if (this._target === 'swiper') {
    if (!this.isTransitioning()) {
      const index = -this._translate / this.getUnitSize();
      this.slide(
        index > this._activeIndex ? Math.ceil(index) : Math.floor(index),
      );
    }
  } else if (this._target === 'image') {
    const { image } = this._images[this._activeIndex];
    if (image) {
      const { velocity = 0, swipeComputed } = e;
      if (velocity > 0 && swipeComputed) {
        const { duration, stretchX, stretchY } = swipeComputed(
          0.003,
          velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
        );
        image.swipe(duration, stretchX, stretchY);
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
  _images: {
    wrapper: HTMLElement;
    image: Image | null;
    url: string;
    width: number;
    height: number;
  }[];
  _direction: Direction;
  _eleSize: number[] = [0, 0];
  _gesture: Gesture; // 手势对象
  _fingers: number = 0; // 当单指放上去移动之后，再放手指移动，不会出现双指缩放旋转，会连续移动（一种感觉效果而已）
  _target: STarget = 'none';
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
      flexFlow: 'row nowrap',
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
          return `translateX(${this.value.translate}px)`;
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
      const wrapper = setStyle(document.createElement('div'), {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        marginLeft: i === 0 ? 0 : this._itemGap,
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
  createImage(imageObj) {
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
      width: width * len + (len - 1) * this._itemGap,
      height,
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
      if (elementHeight > height) {
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
    const _translate = -_index * (this._eleSize[0] + this._itemGap);
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
  transitionRun(translate: number, duration: number = 400) {
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
          duration: duration,
          easing: easeOutQuart,
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

export type Direction = 'vertical' | 'horizontal';

export type SOption = {
  element: HTMLElement | string;
  imageUrls: string[];
  direction?: Direction;
  activeIndex?: number;
  itemGap?: number;
};

export default Swiper;
