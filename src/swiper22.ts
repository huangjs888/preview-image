/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-07 14:48:59
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
  isBetween,
  between,
  easeOutQuart,
  easeOutQuad,
} from './adjust';

proxyImage();

const touchStart = function touchStart(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length > 1 && this._fingers === 0) {
    // 当单指未触发移动，接着放了另外的手指，则认为开启了双指操作，手指为2个
    this._fingers = 2;
  }
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.transitionCancel() > 0) {
      // 曲线救国 1：
      // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
      // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
      this._gesture._firstPoint = null;
      this._gesture._preventSingleTap = true;
    }
  }
  if (this.transitionCancel() > 0) {
    // 曲线救国 1：
    // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
    // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
    this._gesture._firstPoint = null;
    this._gesture._preventSingleTap = true;
    this._swiper = 1;
  }
};
const touchMove = function touchMove(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length === 1 && this._fingers === 0) {
    // 当触发移动时，若只有一个手指在界面上，就认为一直只有一个手指，即使后面再放手指
    this._fingers = 1;
  }
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.isTransitioning()) {
      // 若存在正在进行的渐变动画，则不做任何操作
      return;
    }
    const {
      point,
      angle = 0,
      scale = 1,
      deltaX = 0,
      deltaY = 0,
      direction,
    } = e;
    const { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = image.getTransform();
    if (this._fingers === 1) {
      // _fingers为1的时候，只进行位移，不进行旋转和缩放，相当于单指移动
      // 曲线救国 2：
      // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
      // 这里拿出来是为了阻止双指移动时改变了_rotateAngle类型，仅仅是让touchEnd的时候可以取消动画
      this._gesture._rotateAngle = null;
      const xRange = image.getXTranslation();
      const yRange = image.getYTranslation();
      if (!this._swiper) {
        // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用Direction值
        const fixedY = yRange[0] === 0 && yRange[1] === 0;
        const leftMove = fixedY ? deltaX < 0 : direction === 'Left';
        const rightMove = fixedY ? deltaX > 0 : direction === 'Right';
        if ((tx <= xRange[0] && leftMove) || (tx >= xRange[1] && rightMove)) {
          this._swiper = 1;
        } else {
          this._swiper = 2;
        }
      }
      if (this._swiper === 1) {
        const range = [
          (1 - this._images.length) * (this._eleSize[0] + this._itemGap),
          0,
        ];
        this.transitionRun(
          performDamping(revokeDamping(this._translate, range) + deltaX, range),
          0,
        );
      } else if (this._swiper === 2) {
        let adjustTranlate = between;
        let _tx = tx;
        let _ty = ty;
        // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
        if (image.isDamping('translate')) {
          _tx = revokeDamping(tx, xRange);
          _ty = revokeDamping(ty, yRange);
          adjustTranlate = performDamping;
        }
        image.transitionRun(
          {
            a: ta,
            k: tk,
            x: adjustTranlate(_tx + deltaX, xRange),
            y: adjustTranlate(_ty + deltaY, yRange),
          },
          { duration: 0 },
        );
      }
    } else if (this._fingers === 2) {
      // 以下是双指情况
      // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
      let adjustRotate = between;
      let _ta = ta;
      if (image.isDamping('rotate')) {
        _ta = revokeDamping(ta, image.getRotation());
        adjustRotate = performDamping;
      }
      let adjustScale = between;
      let _tk = tk;
      if (image.isDamping('scale')) {
        _tk = revokeDamping(tk, image.getScalation(), true);
        adjustScale = performDamping;
      }
      let adjustTranlate = between;
      let _tx = tx;
      let _ty = ty;
      if (image.isDamping('translate')) {
        _tx = revokeDamping(tx, image.getXTranslation());
        _ty = revokeDamping(ty, image.getYTranslation());
        adjustTranlate = performDamping;
      }
      // 把原值进行各项变化，再进行总体阻尼计算
      const a = adjustRotate(_ta + angle, image.getRotation());
      const k = adjustScale(_tk * scale, image.getScalation(), true);
      const [ox, oy] = image.computeOffset(point, k);
      const x = adjustTranlate(_tx + ox + deltaX, image.getXTranslation(k));
      const y = adjustTranlate(_ty + oy + deltaY, image.getYTranslation(k));
      image.transitionRun({ a, k, x, y }, { duration: 0 });
    }
  }
};
const touchEnd = function touchEnd(this: Swiper, e: GEvent) {
  if (e.sourceEvent.touches.length === 0 && this._fingers !== 0) {
    // 手指全部抬起时，手指数目置为0
    this._fingers = 0;
  }
  if (this._swiper === 1) {
    const size = -(this._eleSize[0] + this._itemGap);
    const index = this._translate / size;
    if (index !== this._activeIndex) {
      this.slide(Math.round(index));
    }
    this._swiper = 0;
  } else if (this._swiper === 2) {
    const { image } = this._images[this._activeIndex];
    if (image) {
      if (image.isTransitioning()) {
        // 若存在正在进行的渐变动画，则不做任何操作
        return;
      }
      let { a: ta = 0, k: tk = 1, x: tx = 0, y: ty = 0 } = image.getTransform();
      // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
      if (image.isDamping('rotate')) {
        ta = revokeDamping(ta, image.getRotation());
      }
      if (image.isDamping('scale')) {
        tk = revokeDamping(tk, image.getScalation(), true);
      }
      if (image.isDamping('translate')) {
        tx = revokeDamping(tx, image.getXTranslation());
        ty = revokeDamping(ty, image.getYTranslation());
      }
      image.transformTo(
        {
          a: ta,
          k: tk,
          x: tx,
          y: ty,
        },
        e.point,
        {
          // 曲线救国 3：
          // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
          // 这里拿出来是为了判断抬起之前是否进行过双指移动行为（如果未移动或单指是null），从而判断是否可以取消动画
          cancel: typeof this._gesture._rotateAngle !== 'number',
        },
      );
    }
    this._swiper = 0;
  }
};
const doubleTap = function doubleTap(this: Swiper, e: GEvent) {
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.isTransitioning()) {
      // 若存在正在进行的渐变动画，则不做任何操作
      return;
    }
    // 这三个比例都是用保留三位小数的结果进行比较
    // 其实这里的3应该用1/屏幕的宽高算出的小数位数
    // 此刻比例和位移
    const tk = image.getTransform().k || 1;
    // 双击变化的比例
    const dk = between(image.getDblScale(), image.getScalation());
    // 再次双击恢复的比例（初始比例）
    const bk = between(1, image.getScalation());
    // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
    // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
    if ((dk > bk && tk <= bk) || (dk < bk && tk >= bk)) {
      if (image.getDblAdjust()) {
        // 需要调整的情况，自己算偏移量，并且旋转置为0
        const [ox, oy] = image.computeOffset(e.point, dk, image.getDblAdjust());
        const { x: tx = 0, y: ty = 0 } = image.getTransform();
        image.transformTo(
          { a: 0, k: dk, x: tx + ox, y: ty + oy },
          { cancel: false },
        );
      } else {
        // 交给transformTo
        image.transformTo({ k: dk }, e.point, { cancel: false });
      }
    } else {
      // 再次双击恢复
      if (image.getDblAdjust()) {
        // 需要调整的情况，置为初始状态
        image.transformTo({ a: 0, k: bk, x: 0, y: 0 }, { cancel: false });
      } else {
        // 交给transformTo
        image.transformTo({ k: bk }, e.point, { cancel: false });
      }
    }
  }
};
const swipe = function swipe(this: Swiper, e: GEvent) {
  if (this._swiper === 1) {
    const size = -(this._eleSize[0] + this._itemGap);
    const index = this._translate / size;
    this.slide(
      index > this._activeIndex ? Math.ceil(index) : Math.floor(index),
    );
    this._swiper = 0;
    return;
  }
  const { image } = this._images[this._activeIndex];
  if (image) {
    if (image.isTransitioning()) {
      // 若存在正在进行的渐变动画，则不做任何操作
      return;
    }
    const { velocity = 0, swipeComputed } = e;
    if (velocity > 0 && swipeComputed) {
      const [clientWidth, clientHeight] = this._eleSize;
      const { x: tx = 0, y: ty = 0 } = image.getTransform();
      // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
      // 减速度为 0.003，这个需要测微信
      const { duration, stretchX, stretchY } = swipeComputed(
        0.003,
        velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity, // 对速度进行一个限制
      );
      const _duration = Math.max(1200, Math.min(duration, 2500));
      // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
      const xRange = image.getXTranslation();
      if (isBetween(tx, xRange)) {
        let x = tx + stretchX;
        let t = _duration;
        if (!isBetween(x, xRange)) {
          x = between(x, xRange);
          let ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
          if (image.isDamping('translate')) {
            const v = ratio * ((2 * Math.abs(stretchX)) / duration);
            x +=
              clientWidth * Math.min(v / 20, 1 / 4) * (stretchX > 0 ? 1 : -1);
            ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
          }
          t = Math.max(t * (1 - ratio), 400);
        }
        // x方向进行惯性位移
        image
          .transitionRun({ x }, { easing: easeOutQuad, duration: t })
          .then(() => {
            // 惯性位移后超出边界，则归位
            if (!isBetween(x, xRange)) {
              image.transitionRun({ x: between(x, xRange) });
            }
          });
      } else {
        // 直接归位
        image.transitionRun({ x: between(tx, xRange) });
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
              clientHeight * Math.min(v / 20, 1 / 4) * (stretchY > 0 ? 1 : -1);
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
  _eleSize: number[] = [0, 0];
  _gesture: Gesture; // 手势对象
  _fingers: number = 0; // 当单指放上去移动之后，再放手指移动，不会出现双指缩放旋转，会连续移动（一种感觉效果而已）
  constructor({ element, imageUrls, activeIndex = 0, itemGap = 20 }: SOption) {
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

export type SOption = {
  element: HTMLElement | string;
  imageUrls: string[];
  activeIndex?: number;
  itemGap?: number;
};

export default Swiper;
