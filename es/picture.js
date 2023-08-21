function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import loadImage from './image';
import bindGesture from './events';
import { createContainer, createBackdrop, createItemWrapper, setStyle } from './dom';
import { popupComputedSize, popupTransform } from './popup';

// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。

class Picture {
  // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  constructor({
    container: ele,
    url = '',
    hasLoading = true,
    swipeClose = true,
    closeDestory = true,
    backdropColor = '#000f',
    originRect,
    press,
    longPress,
    onResize,
    options = {}
  }) {
    this._container = null;
    this._backdrop = null;
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
    this._image = null;
    this._gesture = null;
    // 手势对象
    this._fgBehavior = 0;
    const container = this._container = createContainer(ele);
    this._backdrop = createBackdrop(backdropColor, container);
    const gesture = this._gesture = bindGesture.apply(this, [container]);
    this._image = {
      wrapper: createItemWrapper(true, false, hasLoading, 0, container),
      url,
      width: 0,
      height: 0,
      options: _extends({
        rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
        scalation: !gesture.isTouch() ? [0.1, 10] : undefined
      }, options)
    };
    loadImage(this._image).then(okay => {
      if (okay) {
        this.resetItemSize();
      }
      if (typeof okay === 'boolean' && typeof this._onImageEnd === 'function') {
        this._onImageEnd(okay);
      }
    });
    this._swipeClose = swipeClose;
    this._closeDestory = closeDestory;
    this._originRect = originRect || null;
    this._press = press || null;
    this._longPress = longPress || null;
    // 浏览器窗口变化重置
    const resize = () => {
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
  resetItemSize() {
    const {
      _container: ele
    } = this;
    if (!ele) {
      return;
    }
    const {
      left,
      top,
      width,
      height
    } = ele.getBoundingClientRect();
    this._rectSize = {
      left,
      top,
      width,
      height
    };
    const image = this._image;
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
      if (elementHeight > height) {
        setStyle(image.wrapper, {
          alignItems: 'flex-start'
        });
      }
    }
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
    this._originRect = null;
    this._rectSize = null;
    this._image = null;
    this._press = null;
    this._longPress = null;
    this._onChange = null;
    this._backdrop = null;
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
    // 非懒加载模式下，初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在打开时再次计算一下
    // 初始化图加载很慢的情况，或懒加载模式下，虽然此时container有尺寸，但由于图片还未加载，所以计算无效
    this.resetItemSize();
    const {
      wrapper = null,
      entity
    } = this._image || {};
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
    } : {}), 300).then(() => {});
  }
  close() {
    if (!this._container || this._isClose) {
      return;
    }
    this._isClose = true;
    const {
      wrapper = null,
      entity
    } = this._image || {};
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
export default Picture;