/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 09:19:59
 * @Description: ******
 */
import Gesture from '@huangjs888/gesture';
import Transition, {
  TAProperty,
  easeOutQuart,
  type EaseFn,
} from '@huangjs888/transition';
import loadImage, { type Image, type ImageOption } from './image';
import bindGesture from './events';
import {
  createContainer,
  createContent,
  createIndicator,
  createIndicatorItem,
  createWrapper,
  setStyle,
} from './dom';

class Gallery {
  container: HTMLElement | null = null;
  contentEl: HTMLElement | null = null;
  _itemGap: number = 0;
  _direction: Direction = 'horizontal'; // 滑动方向
  _rectSize: RectSize | null = null;
  _events:
    | {
        [key in string]?: () => void | boolean;
      }
    | null = null;
  _images: Image[] | null = null;
  _activeIndex: number = -1;
  _translate: number = 0;
  _transition: Transition | null = null;
  _gesture: Gesture | null = null; // 手势对象
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _moveTarget: 'closures' | 'outside' | 'inside' | 'none' = 'none'; // 判断是内部的图片移动，还是外部swiper移动，还是直接关闭
  _removeResize: (() => void) | null = null;
  constructor({
    container,
    imageUrls = [],
    activeIndex = 0,
    direction = 'horizontal',
    itemGap = 20,
    hasLoading = true,
    hasIndicator = true,
    isLazy = true,
    options = {},
    ...events
  }: SOption) {
    const _container = (this.container = createContainer(container));
    const contentEl = (this.contentEl = createContent(
      direction === 'vertical',
      _container,
    ));
    const indicator = createIndicator(
      direction === 'vertical',
      hasIndicator && imageUrls.length > 1,
      this.container,
    );
    this._images = imageUrls.map((url, index) => {
      const image: Image = {
        wrapper: createWrapper(
          index === 0,
          direction === 'vertical',
          hasLoading,
          itemGap,
          contentEl,
        ),
        indicator: createIndicatorItem(direction === 'vertical', indicator),
        url,
        width: 0,
        height: 0,
        options,
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        loadImage(image).then((okay) => okay && this.resetItemSize(index));
      }
      return image;
    });
    this._gesture = bindGesture.apply(this, [_container]);
    // 创建过度
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
    this._itemGap = itemGap;
    this._direction = direction;
    this._events = events;
    this.slide(activeIndex, { duration: 0 });
    // 浏览器窗口变化重新计算容器尺寸和所有图片尺寸
    const resize = () => {
      this.resetSize();
      this.resetItemSize();
    };
    window.addEventListener('resize', resize);
    this._removeResize = () => {
      window.removeEventListener('resize', resize);
    };
  }
  resetSize() {
    if (!this.container || !this.contentEl || !this._images) {
      return;
    }
    // 容器宽高设置
    const { left, top, width, height } = this.container.getBoundingClientRect();
    this._rectSize = { left, top, width, height };
    const length = this._images.length;
    if (length > 0) {
      setStyle(this.contentEl, {
        width:
          this._direction === 'vertical'
            ? width
            : width * length + (length - 1) * this._itemGap,
        height:
          this._direction === 'vertical'
            ? height * length + (length - 1) * this._itemGap
            : height,
      });
    }
  }
  resetItemSize(index?: number) {
    if (!this._rectSize || !this._images) {
      return;
    }
    const { left, top, width, height } = this._rectSize;
    const resize = (image: Image) => {
      if (image && image.entity && width !== 0 && height !== 0) {
        image.entity.setSizeInfo({
          containerCenter: [left + width / 2, top + height / 2],
          containerWidth: width,
          containerHeight: height,
          naturalWidth: image.width,
          naturalHeight: image.height,
        });
        const { elementHeight } = image.entity.getSizeInfo();
        if (this._direction !== 'vertical' && elementHeight > height) {
          setStyle(image.wrapper, {
            alignItems: 'flex-start',
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
    const { width, height } = this._rectSize;
    const wh = this._direction === 'vertical' ? height : width;
    return wh === 0 ? 0 : wh + this._itemGap;
  }
  slide(
    index: number,
    options?: {
      duration?: number;
      easing?: EaseFn;
    },
  ) {
    if (!this._images || this._images.length === 0) {
      return Promise.resolve();
    }
    const _index = Math.max(Math.min(index, this._images.length - 1), 0);
    const isChange = this._activeIndex !== _index;
    if (isChange) {
      const lastIndicator = (this._images[this._activeIndex] || {}).indicator;
      if (lastIndicator) {
        setStyle(lastIndicator, {
          width: 7,
          height: 7,
          opacity: 0.6,
        });
      }
      const thisIndicator = (this._images[_index] || {}).indicator;
      if (thisIndicator) {
        setStyle(thisIndicator, {
          width: 8,
          height: 8,
          opacity: 1,
        });
      }
      this._activeIndex = _index;
      loadImage(this._images[_index]).then(
        // lazy的时候，滑到这里才加载图片，所以加载成功后需要计算该图片尺寸
        (okay) => okay && this.resetItemSize(_index),
      );
    }
    const _translate = -_index * this.getItemSize();
    return this.transitionRun(_translate, options).then((v) => {
      if (
        isChange &&
        this._events &&
        typeof this._events.onChange === 'function'
      ) {
        this._events.onChange();
      }
      return v;
    });
  }
  next(options?: { duration?: number; easing?: EaseFn }) {
    return this.slide(this._activeIndex + 1, options);
  }
  prev(options?: { duration?: number; easing?: EaseFn }) {
    return this.slide(this._activeIndex - 1, options);
  }
  transitionRun(
    translate: number,
    options: {
      duration?: number;
      easing?: EaseFn;
      before?: EaseFn;
    } = {},
  ) {
    const delta = translate - this._translate;
    if (delta === 0 || !this._transition) {
      return Promise.resolve({ translate: this._translate });
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._translate = translate;
      this._transition.bind({ translate });
      return Promise.resolve({ translate });
    }
    this._translate = translate;
    return this._transition
      .apply(
        { translate: delta },
        {
          precision: { translate: 1 },
          cancel: true,
          duration: 500,
          easing: easeOutQuart,
          ...options,
        },
      )
      .then((value) => {
        if (!this.isTransitioning()) {
          // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
          if (this._transition) {
            this._transition.bind({ translate: this._translate });
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
    return this._transition.cancel().map((value) => {
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
    this._transition = null;
    this._rectSize = null;
    this._images = null;
    this._events = null;
    this.contentEl = null;
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
    // 设置容器宽高尺寸
    this.resetSize();
    // 要计算每一张图片尺寸
    // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
    this.resetItemSize();
    // 计算完尺寸，自然要将当前activeIndex的图片展示出来，要计算一下swiper的位移
    if (this._transition) {
      this._translate = -this._activeIndex * this.getItemSize();
      this._transition.bind({ translate: this._translate });
    }
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

type RectSize = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Direction = 'vertical' | 'horizontal';

export type SOption = {
  container?: HTMLElement | string;
  imageUrls?: string[];
  direction?: Direction;
  activeIndex?: number;
  itemGap?: number;
  hasLoading?: boolean;
  hasIndicator?: boolean;
  isLazy?: boolean;
  options?: ImageOption;
  longTap?: () => void;
  singleTap?: () => void;
  downSwipe?: () => void;
  onChange?: () => void;
};

export default Gallery;
