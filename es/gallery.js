function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 15:02:11
 * @Description: ******
 */

import Transition, { TAProperty, easeOutQuart } from '@huangjs888/transition';
import loadImage from './image';
import bindGesture from './events';
import { createContainer, createBackdrop, createIndicator, createSubstance, createItemIndicator, createItemWrapper, setStyle } from './dom';
import { popupComputedSize, popupTransform } from './popup';
class Gallery {
  // 判断是内部的图片移动，还是外部swiper移动，还是直接关闭
  constructor({
    container: ele,
    imageUrls = [],
    activeIndex = 0,
    direction = 'horizontal',
    itemGap = 20,
    hasLoading = true,
    hasIndicator = true,
    isLazy = true,
    swipeClose = true,
    closeDestory = true,
    backdropColor = '#000f',
    originRect,
    press,
    longPress,
    onChange,
    onResize,
    onImageEnd,
    options = {}
  }) {
    this._container = null;
    this._substance = null;
    this._backdrop = null;
    this._indicator = null;
    this._itemGap = 0;
    this._direction = 'horizontal';
    this._rectSize = null;
    // 当前容器位置和尺寸
    this._isClose = true;
    this._swipeClose = false;
    this._closeDestory = false;
    this._originRect = null;
    this._press = null;
    this._longPress = null;
    this._onChange = null;
    this._onImageEnd = null;
    this._removeResize = null;
    this._images = null;
    this._activeIndex = 0;
    this._translate = 0;
    // swiper位移值
    this._transition = null;
    // 过渡对象
    this._gesture = null;
    // 手势对象
    this._fgBehavior = 0;
    // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
    this._moveTarget = 'none';
    const container = this._container = createContainer(ele);
    this._backdrop = createBackdrop(backdropColor, container);
    const substance = this._substance = createSubstance(direction === 'vertical', container);
    const indicator = this._indicator = createIndicator(direction === 'vertical', hasIndicator && imageUrls.length > 1, container);
    const gesture = this._gesture = bindGesture.apply(this, [container]);
    this._images = imageUrls.map((url, index) => {
      const image = {
        wrapper: createItemWrapper(index === 0, direction === 'vertical', hasLoading, itemGap, substance),
        indicator: createItemIndicator(direction === 'vertical', indicator),
        url,
        width: 0,
        height: 0,
        options: _extends({
          rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
          scalation: !gesture.isTouch() ? [0.1, 10] : undefined
        }, options)
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        loadImage(image).then(okay => {
          if (okay) {
            this.resetItemSize(index);
          }
          if (typeof okay === 'boolean' && typeof this._onImageEnd === 'function') {
            this._onImageEnd(index, okay);
          }
        });
      }
      return image;
    });
    // 创建过度
    this._transition = new Transition({
      element: substance,
      propertyName: 'transform',
      propertyValue: new class extends TAProperty {
        toString() {
          return `translate${direction === 'vertical' ? 'Y' : 'X'}(${this.value.translate}px)`;
        }
      }({
        translate: this._translate
      })
    });
    this._itemGap = itemGap;
    this._direction = direction;
    this._swipeClose = swipeClose;
    this._closeDestory = closeDestory;
    this._originRect = originRect || null;
    this._press = press || null;
    this._longPress = longPress || null;
    this._onChange = onChange || null;
    this._onImageEnd = onImageEnd || null;
    this._activeIndex = activeIndex;
    // 浏览器窗口变化重新计算容器尺寸和所有图片尺寸
    const resize = () => {
      this.resetSize();
      this.resetItemSize();
      typeof onResize === 'function' && onResize();
    };
    const contextmenu = e => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('contextmenu', contextmenu);
    this._removeResize = () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('contextmenu', contextmenu);
    };
  }
  resetSize() {
    if (!this._container || !this._substance || !this._images) {
      return;
    }
    // 容器宽高设置
    const {
      left,
      top,
      width,
      height
    } = this._container.getBoundingClientRect();
    this._rectSize = {
      left,
      top,
      width,
      height
    };
    const length = this._images.length;
    if (length > 0) {
      setStyle(this._substance, {
        width: this._direction === 'vertical' ? width : width * length + (length - 1) * this._itemGap,
        height: this._direction === 'vertical' ? height * length + (length - 1) * this._itemGap : height
      });
    }
  }
  resetItemSize(index) {
    if (!this._rectSize || !this._images) {
      return;
    }
    const {
      left,
      top,
      width,
      height
    } = this._rectSize;
    const resize = image => {
      if (image && image.entity && width !== 0 && height !== 0) {
        image.entity.setSizeInfo({
          containerCenter: [left + width / 2, top + height / 2],
          containerWidth: width,
          containerHeight: height,
          naturalWidth: image.width,
          naturalHeight: image.height
        });
        const {
          elementHeight
        } = image.entity.getSizeInfo();
        if (this._direction !== 'vertical' && elementHeight > height) {
          setStyle(image.wrapper, {
            alignItems: 'flex-start'
          });
        }
      }
    };
    if (typeof index === 'number') {
      resize(this._images[index]);
    } else {
      this._images.forEach(resize);
    }
  }
  getItemSize() {
    if (!this._rectSize) {
      return 0;
    }
    const {
      width,
      height
    } = this._rectSize;
    const wh = this._direction === 'vertical' ? height : width;
    return wh === 0 ? 0 : wh + this._itemGap;
  }
  slide(index, options, open = false) {
    if (!this._images || this._images.length === 0) {
      return Promise.resolve();
    }
    const _index = Math.max(Math.min(index, this._images.length - 1), 0);
    const isChange = open || this._activeIndex !== _index;
    if (isChange) {
      const {
        indicator: lastOne
      } = this._images[this._activeIndex] || {};
      if (lastOne) {
        setStyle(lastOne, {
          width: 7,
          height: 7,
          opacity: 0.6
        });
      }
      const {
        indicator: thisOne
      } = this._images[_index] || {};
      if (thisOne) {
        setStyle(thisOne, {
          width: 8,
          height: 8,
          opacity: 1
        });
      }
      this._activeIndex = _index;
      loadImage(this._images[_index]).then(
      // lazy的时候，滑到这里才加载图片，所以加载成功后需要计算该图片尺寸
      okay => {
        if (okay) {
          this.resetItemSize(_index);
        }
        if (typeof okay === 'boolean' && typeof this._onImageEnd === 'function') {
          this._onImageEnd(_index, okay);
        }
      });
    }
    const _translate = -_index * this.getItemSize();
    return this.transitionRun(_translate, options).then(v => {
      if (isChange && typeof this._onChange === 'function') {
        this._onChange();
      }
      return v;
    });
  }
  next(options) {
    return this.slide(this._activeIndex + 1, options);
  }
  prev(options) {
    return this.slide(this._activeIndex - 1, options);
  }
  transitionRun(translate, options = {}) {
    const delta = translate - this._translate;
    if (delta === 0 || !this._transition) {
      return Promise.resolve({
        translate: this._translate
      });
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._translate = translate;
      this._transition.bind({
        translate
      });
      return Promise.resolve({
        translate
      });
    }
    this._translate = translate;
    return this._transition.apply({
      translate: delta
    }, _extends({
      precision: {
        translate: 1
      },
      cancel: true,
      duration: 500,
      easing: easeOutQuart
    }, options)).then(value => {
      if (!this.isTransitioning()) {
        // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
        if (this._transition) {
          this._transition.bind({
            translate: this._translate
          });
        }
      }
      return value;
    });
  }
  transitionCancel() {
    if (!this._transition) {
      return 0;
    }
    // cancel返回值是动画未执行的部分
    return this._transition.cancel().map(value => {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      this._translate -= value.translate;
    }).length;
  }
  isTransitioning() {
    if (!this._transition) {
      return false;
    }
    return this._transition.transitioning();
  }
  destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
    if (this._removeResize) {
      this._removeResize();
      this._removeResize = null;
    }
    this._isClose = true;
    this._transition = null;
    this._rectSize = null;
    this._originRect = null;
    this._images = null;
    this._press = null;
    this._longPress = null;
    this._onChange = null;
    this._substance = null;
    this._backdrop = null;
    this._indicator = null;
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
      this._container = null;
    }
  }
  setSwipeClose(swipeClose = true) {
    if (!this._container) {
      return;
    }
    this._swipeClose = swipeClose;
  }
  setCloseDestory(closeDestory = true) {
    if (!this._container) {
      return;
    }
    this._closeDestory = closeDestory;
  }
  setOriginRect(originRect = null) {
    if (!this._container) {
      return;
    }
    this._originRect = originRect;
  }
  open() {
    if (!this._container || !this._isClose) {
      return;
    }
    this._isClose = false;
    const {
      _backdrop: backdrop,
      _container: container
    } = this;
    setStyle(container, {
      display: 'block'
    });
    // 设置容器宽高尺寸
    this.resetSize();
    // 非懒加载模式下，初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在打开时再次计算一下
    // 初始化图加载很慢的情况，或懒加载模式下，虽然此时container有尺寸，但由于图片还未加载，所以计算无效
    this.resetItemSize();
    this.slide(this._activeIndex, {
      duration: 0
    }, true);
    const {
      wrapper = null,
      entity
    } = this._images && this._images[this._activeIndex] || {};
    let elementSize = null;
    let elementEl = null;
    if (entity) {
      const size = entity.getSizeInfo();
      elementEl = entity.getElement();
      elementSize = {
        width: size.elementWidth,
        height: size.elementHeight,
        top: 0,
        left: 0
      };
    }
    const {
      x,
      y,
      k,
      w,
      h
    } = popupComputedSize(this._originRect, this._rectSize, elementSize);
    popupTransform({
      el: backdrop,
      o: 0
    }, {
      el: wrapper,
      x,
      y,
      k
    }, {
      el: elementEl,
      w,
      h
    });
    // 目的是让上一个popupTransform变化立马生效，下一个popupTransform可以顺利进行，而不是合并进行了
    container.getBoundingClientRect();
    popupTransform({
      el: backdrop,
      o: 1
    }, {
      el: wrapper,
      x: 0,
      y: 0,
      k: 1
    }, _extends({
      el: elementEl
    }, elementSize ? {
      w: elementSize.width,
      h: elementSize.height
    } : {}), 300).then(() => {
      if (this._indicator) {
        setStyle(this._indicator, {
          display: 'flex'
        });
      }
    });
  }
  close() {
    if (!this._container || this._isClose) {
      return;
    }
    this._isClose = true;
    const {
      wrapper = null,
      entity
    } = this._images && this._images[this._activeIndex] || {};
    let elementSize = null;
    let elementEl = null;
    if (entity) {
      const size = entity.getSizeInfo();
      elementEl = entity.getElement();
      elementSize = {
        width: size.elementWidth,
        height: size.elementHeight,
        top: 0,
        left: 0
      };
      // 需要把放大的图片归位到原始大小
      entity.reset();
    }
    if (this._indicator) {
      setStyle(this._indicator, {
        display: 'none'
      });
    }
    const {
      x,
      y,
      k,
      w,
      h
    } = popupComputedSize(this._originRect, this._rectSize, elementSize);
    popupTransform({
      el: this._backdrop,
      o: 0
    }, {
      el: wrapper,
      x,
      y,
      k
    }, {
      el: elementEl,
      w,
      h
    }, 300).then(() => {
      if (this._closeDestory) {
        this.destory();
      } else if (this._container) {
        setStyle(this._container, {
          display: 'none'
        });
      }
    });
  }
}
export default Gallery;