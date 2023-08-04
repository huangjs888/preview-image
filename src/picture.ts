import Gesture from '@huangjs888/gesture';
import loadImage, { type Image, type ImageOption } from './image';
import bindGesture from './events';
import {
  createContainer,
  createBackdrop,
  createItemWrapper,
  setStyle,
} from './dom';

// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。

class Picture {
  _container: HTMLElement | null = null;
  _backdrop: HTMLElement | null = null;
  _rectSize: RectSize | null = null; // 当前容器位置和尺寸
  _isClose: boolean = true;
  _swipeClose: boolean = false;
  _closeDestory: boolean = false;
  _originRect: RectSize | null = null;
  _press: (() => void) | null = null;
  _longPress: (() => void) | null = null;
  _onChange: (() => void) | null = null;
  _removeResize: (() => void) | null = null;
  _image: Image | null = null;
  _gesture: Gesture | null = null; // 手势对象
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
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
    options = {},
  }: COption) {
    const container = (this._container = createContainer(ele));
    this._backdrop = createBackdrop(backdropColor, container);
    const gesture = (this._gesture = bindGesture.apply(this, [container]));
    this._image = {
      wrapper: createItemWrapper(true, false, hasLoading, 0, container),
      url,
      width: 0,
      height: 0,
      options: {
        rotation: !gesture.isTouch()
          ? [-Number.MAX_VALUE, Number.MAX_VALUE]
          : undefined,
        scalation: !gesture.isTouch() ? [0.1, 10] : undefined,
        ...options,
      },
    };
    loadImage(this._image).then((okay) => okay && this.resetItemSize());
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
    const contextmenu = (e: Event) => {
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
    const { _container: ele } = this;
    if (!ele) {
      return;
    }
    const { left, top, width, height } = ele.getBoundingClientRect();
    this._rectSize = { left, top, width, height };
    const image = this._image;
    if (image && image.entity && width !== 0 && height !== 0) {
      image.entity.setSizeInfo({
        containerCenter: [left + width / 2, top + height / 2],
        containerWidth: width,
        containerHeight: height,
        naturalWidth: image.width,
        naturalHeight: image.height,
      });
      const { elementHeight } = image.entity.getSizeInfo();
      if (elementHeight > height) {
        setStyle(image.wrapper, {
          alignItems: 'flex-start',
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
  setSwipeClose(swipeClose: boolean = true) {
    if (!this._container) {
      return;
    }
    this._swipeClose = swipeClose;
  }
  setCloseDestory(closeDestory: boolean = true) {
    if (!this._container) {
      return;
    }
    this._closeDestory = closeDestory;
  }
  setOriginRect(originRect: RectSize | null = null) {
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
    setStyle(this._container, {
      display: 'block',
    });
    // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
    this.resetItemSize();
    let x = 0;
    let y = 0;
    let k = 0.01;
    if (this._originRect && this._rectSize) {
      const { left, top, width, height } = this._originRect;
      const {
        left: _left = 0,
        top: _top = 0,
        width: _width = 0,
        height: _height = 0,
      } = this._rectSize || {};
      x = left + width / 2 - (_left + _width / 2);
      y = top + height / 2 - (_top + _height / 2);
      k = width / _width || 0.01;
    }
    this.originTransform(x, y, k, 0, 0);
    setTimeout(() => {
      this.originTransform(0, 0, 1, 1, 300);
    }, 1);
  }
  close() {
    if (!this._container || this._isClose) {
      return;
    }
    this._isClose = true;
    let x = 0;
    let y = 0;
    let k = 0.01;
    if (this._originRect && this._rectSize) {
      const { left, top, width, height } = this._originRect;
      const {
        left: _left = 0,
        top: _top = 0,
        width: _width = 0,
        height: _height = 0,
      } = this._rectSize || {};
      x = left + width / 2 - (_left + _width / 2);
      y = top + height / 2 - (_top + _height / 2);
      k = width / _width || 0.01;
    }
    // 需要把放大的图片归位到原始大小
    const { entity } = this._image || {};
    if (entity) {
      entity.reset();
    }
    this.originTransform(x, y, k, 0, 300).then(() => {
      if (this._closeDestory) {
        this.destory();
      } else if (this._container) {
        setStyle(this._container, {
          display: 'none',
        });
      }
    });
  }
  originTransform(
    x: number,
    y: number,
    k: number,
    o: number,
    duration: number = 0,
  ) {
    const backdrop = this._backdrop;
    if (backdrop) {
      const { wrapper } = this._image || {};
      if (wrapper) {
        setStyle(wrapper, {
          overflow: 'visible',
          transform: `translate(${x}px,${y}px) scale(${k})`,
          transition: duration > 0 ? `transform ${duration}ms` : '',
        });
      }
      setStyle(backdrop, {
        opacity: o,
        transition: duration > 0 ? `opacity ${duration}ms` : '',
      });
      if (duration > 0) {
        return new Promise<void>((resolve) => {
          backdrop.ontransitionend = (e) => {
            // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
            if (e.target === backdrop && e.propertyName === 'opacity') {
              backdrop.ontransitionend = null;
              if (wrapper) {
                setStyle(wrapper, {
                  overflow: 'hidden',
                  transition: 'none',
                });
              }
              setStyle(backdrop, {
                transition: 'none',
              });
              resolve();
            }
          };
        });
      }
    }
    return Promise.resolve();
  }
}

type RectSize = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type COption = {
  container?: HTMLElement | string; // 容器元素
  url?: string;
  backdropColor?: string; // backdrop背景色和透明度（rgba(0,0,0,0.9)）
  hasLoading?: boolean; // 加载图片是否展示loading
  originRect?: RectSize; // 缩略图的位置和吃尺寸，用于点开和关闭时的动画
  swipeClose?: boolean; // 向下滑动时是否执行关闭操作
  closeDestory?: boolean; // 关闭时是否销毁组件还是hide
  options?: ImageOption; // 图片实体的相关配置
  press?: () => void; // singleTap回调
  longPress?: () => void; // longTap回调
  onResize?: () => void; // 窗口改变时的回调
};

export default Picture;
