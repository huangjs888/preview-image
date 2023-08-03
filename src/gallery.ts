/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:39:51
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
  createBackdrop,
  createIndicator,
  createSubstance,
  createItemIndicator,
  createItemWrapper,
  setStyle,
} from './dom';

class Gallery {
  _container: HTMLElement | null = null;
  _substance: HTMLElement | null = null;
  _backdrop: HTMLElement | null = null;
  _indicator: HTMLElement | null = null;
  _itemGap: number = 0;
  _direction: Direction = 'horizontal';
  _rectSize: RectSize | null = null; // 当前容器位置和尺寸
  _isClose: boolean = true;
  _swipeClose: boolean = false;
  _closeDestory: boolean = false;
  _originRect: RectSize | null = null;
  _press: (() => void) | null = null;
  _longPress: (() => void) | null = null;
  _onChange: (() => void) | null = null;
  _removeResize: (() => void) | null = null;
  _images: Image[] | null = null;
  _activeIndex: number = -1;
  _translate: number = 0; // swiper位移值
  _transition: Transition | null = null; // 过渡对象
  _gesture: Gesture | null = null; // 手势对象
  _onePoint: boolean = false; // 是否被视作单点移动
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _moveTarget: 'closures' | 'outside' | 'inside' | 'none' = 'none'; // 判断是内部的图片移动，还是外部swiper移动，还是直接关闭
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
    options = {},
  }: SOption) {
    const container = (this._container = createContainer(ele));
    this._backdrop = createBackdrop(backdropColor, container);
    const substance = (this._substance = createSubstance(
      direction === 'vertical',
      container,
    ));
    const indicator = (this._indicator = createIndicator(
      direction === 'vertical',
      hasIndicator && imageUrls.length > 1,
      container,
    ));
    const gesture = (this._gesture = bindGesture.apply(this, [container]));
    this._images = imageUrls.map((url, index) => {
      const image: Image = {
        wrapper: createItemWrapper(
          index === 0,
          direction === 'vertical',
          hasLoading,
          itemGap,
          substance,
        ),
        indicator: createItemIndicator(direction === 'vertical', indicator),
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
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        loadImage(image).then((okay) => okay && this.resetItemSize(index));
      }
      return image;
    });
    // 创建过度
    this._transition = new Transition({
      element: substance,
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
    this._swipeClose = swipeClose;
    this._closeDestory = closeDestory;
    this._originRect = originRect || null;
    this._press = press || null;
    this._longPress = longPress || null;
    this._onChange = onChange || null;
    this.slide(activeIndex, { duration: 0 });
    // 浏览器窗口变化重新计算容器尺寸和所有图片尺寸
    const resize = () => {
      this.resetSize();
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
  resetSize() {
    if (!this._container || !this._substance || !this._images) {
      return;
    }
    // 容器宽高设置
    const { left, top, width, height } =
      this._container.getBoundingClientRect();
    this._rectSize = { left, top, width, height };
    const length = this._images.length;
    if (length > 0) {
      setStyle(this._substance, {
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
      const { indicator: lastOne } = this._images[this._activeIndex] || {};
      if (lastOne) {
        setStyle(lastOne, {
          width: 7,
          height: 7,
          opacity: 0.6,
        });
      }
      const { indicator: thisOne } = this._images[_index] || {};
      if (thisOne) {
        setStyle(thisOne, {
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
      if (isChange && typeof this._onChange === 'function') {
        this._onChange();
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
      this.originTransform(0, 0, 1, 1, 300).then(() => {
        if (this._indicator) {
          setStyle(this._indicator, {
            display: 'flex',
          });
        }
      });
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
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (entity) {
      entity.reset();
    }
    if (this._indicator) {
      setStyle(this._indicator, {
        display: 'none',
      });
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
      const { wrapper } =
        (this._images && this._images[this._activeIndex]) || {};
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

export type RectSize = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Direction = 'vertical' | 'horizontal';

export type SOption = {
  container?: HTMLElement | string; // 容器元素
  imageUrls?: string[]; // image的url列表
  direction?: Direction; // 图片排列方向（上下滑动，还是左右滑动）
  activeIndex?: number; // 当前展示的图片下标
  itemGap?: number; // 图片之间的间距
  backdropColor?: string; // backdrop背景色和透明度（rgba(0,0,0,0.9)）
  hasLoading?: boolean; // 加载图片是否展示loading
  hasIndicator?: boolean; // 多图片时是否需要指示器（页码）
  isLazy?: boolean; // 图片是否是懒加载（滑到这个图片时再加载），否则一次性加载完
  originRect?: RectSize; // 缩略图的位置和吃尺寸，用于点开和关闭时的动画
  swipeClose?: boolean; // 向下滑动时是否执行关闭操作
  closeDestory?: boolean; // 关闭时是否销毁组件还是hide
  options?: ImageOption; // 图片实体的相关配置
  press?: () => void; // singleTap回调
  longPress?: () => void; // longTap回调
  onChange?: () => void; // 滑动到另一张图片之后的回调
  onResize?: () => void; // 窗口改变时的回调
};

export default Gallery;
