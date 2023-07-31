import Gesture from '@huangjs888/gesture';
import loadImage, { type Image, type ImageOption } from './image';
import bindGesture from './events';
import { createContainer, createWrapper, setStyle } from './dom';

// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。

class SingleGallery {
  container: HTMLElement | null = null;
  _events:
    | {
        [key in string]?: () => void | boolean;
      }
    | null = null;
  _image: Image | null = null;
  _gesture: Gesture | null = null; // 手势对象
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _removeResize: (() => void) | null = null;
  constructor({
    container,
    url = '',
    hasLoading = true,
    options = {},
    ...events
  }: COption) {
    const _container = (this.container = createContainer(container));
    this._image = {
      wrapper: createWrapper(true, false, hasLoading, 0, _container),
      url,
      width: 0,
      height: 0,
      options,
    };
    loadImage(this._image).then((okay) => okay && this.resetItemSize());
    this._gesture = bindGesture.apply(this, [_container]);
    this._events = events;
    // 浏览器窗口变化重置
    const resize = () => this.resetItemSize();
    window.addEventListener('resize', resize);
    this._removeResize = () => {
      window.removeEventListener('resize', resize);
    };
  }
  resetItemSize() {
    const { container } = this;
    if (!container) {
      return;
    }
    const { left, top, width, height } = container.getBoundingClientRect();
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
    this._image = null;
    this._events = null;
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
  open() {
    const { container } = this;
    if (!container || container.style.display === 'block') {
      return;
    }
    setStyle(container, {
      display: 'block',
      opacity: 0,
    });
    // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
    this.resetItemSize();
    // resetSize会触发回流，让opacity=0已经生效，所以后续的不需要放到setTimeout里了
    setStyle(container, {
      opacity: 1,
      transition: 'opacity 0.4s',
    });
    const transitionend = (ee: TransitionEvent) => {
      if (ee.target === container && ee.propertyName === 'opacity') {
        container.removeEventListener('transitionend', transitionend);
        container.ontransitionend = null;
        setStyle(container, {
          transition: 'none',
        });
      }
    };
    container.addEventListener('transitionend', transitionend);
  }
  close() {
    const { container } = this;
    if (!container) {
      return;
    }
    setStyle(container, {
      opacity: 0,
      transition: 'opacity 0.4s',
    });
    const transitionend = (ee: TransitionEvent) => {
      if (ee.target === container && ee.propertyName === 'opacity') {
        container.removeEventListener('transitionend', transitionend);
        setStyle(container, {
          transition: 'none',
        });
        this.destory();
      }
    };
    container.addEventListener('transitionend', transitionend);
  }
}

export type COption = {
  container?: HTMLElement | string;
  url?: string;
  hasLoading?: boolean;
  options?: ImageOption;
  longTap?: () => void;
  singleTap?: () => void;
  downSwipe?: () => void;
};

export default SingleGallery;
