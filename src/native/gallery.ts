/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 10:15:52
 * @Description: ******
 */

import Gesture, { type IGestureEvent } from '../modules/gesture';
import { SwiperModel, type ICallback, type IOpenStyle, type IBBox, type IDirection } from '../core';
import Image from './image';
import {
  pointerStart,
  pointerMove,
  pointerEnd,
  doubleTap,
  singleTap,
  longTap,
  rotate,
  scale,
  swipe,
} from '../events';
import {
  type ICSSStyle,
  type IElement,
  getElement,
  createElement,
  setStyle,
  addClass,
  hasClass,
  removeClass,
  getBBox,
  getScrollBarSize,
  isBodyOverflowing,
} from '../modules/lightdom';
import '../style/gallery.less';

class Gallery extends SwiperModel<Image> {
  _container: HTMLElement | null;
  _backdrop: HTMLElement | null;
  _wrapper: HTMLElement | null;
  _indicator: HTMLElement | null;
  _openStyle: IEOpenStyle | null = null;
  _originBox: IBBox | null = null;
  _viewBox: IBBox | null = null;
  _overflow: string = '';
  _destoryOnClose: boolean = false;
  _itemGap: number = 0;
  _unbind: (() => void) | null;

  constructor({
    container,
    style,
    className,
    backdropStyle,
    backdropClassName,
    wrapperStyle,
    wrapperClassName,
    indicatorStyle,
    indicatorClassName,
    current = 0,
    imageUrls = [],
    direction = 'horizontal',
    itemGap = 20,
    isLazy = true,
    hasIndicator = true,
    destroyOnClose = false,
    enableSwipeClose = true,
    loading,
    error,
    originBox,
    onPopupMenu,
    onChange,
    onAfterChange,
    onClose,
    onAfterClose,
    onAfterOpenChange,
  }: IGalleryOptions) {
    let el: (() => HTMLElement | null) | null = null;
    super({ transitionEl: () => el?.() });
    const defalutTotal = imageUrls.length;
    const defaultCurrent = !current || current < 0 || current >= defalutTotal ? 0 : current;
    const _container = (this._container = createElement(
      {
        className: [
          'preview-image__gallery__container',
          `preview-image__gallery__container-${direction}`,
          className || '',
        ],
        style,
      },
      null,
      getElement(container) || document.body,
    ) as HTMLElement);
    const _backdrop = (this._backdrop = createElement(
      {
        className: ['preview-image__gallery__backdrop', backdropClassName || ''],
        style: {
          backgroundColor: '#000f',
          ...(backdropStyle || {}),
        },
      },
      null,
      _container,
    ) as HTMLElement);
    const _wrapper = (this._wrapper = createElement(
      {
        className: ['preview-image__gallery__wrapper', wrapperClassName || ''],
        style: wrapperStyle,
      },
      null,
      _container,
    ) as HTMLElement);
    const _indicator = (this._indicator =
      hasIndicator && defalutTotal > 1
        ? (createElement(
            {
              className: ['preview-image__gallery__indicator', indicatorClassName || ''],
              style: indicatorStyle,
            },
            null,
            _container,
          ) as HTMLElement)
        : null);
    const indicatorItems: Element[] = [];
    imageUrls.forEach((url, index) => {
      if (_indicator) {
        indicatorItems.push(
          createElement(
            'span',
            {
              className: [
                'preview-image__gallery__indicator-item',
                defaultCurrent === index ? 'active' : '',
              ],
            },
            null,
            _indicator,
          ),
        );
      }
      const image = new Image({
        container: _wrapper,
        src: url,
        active: !isLazy || defaultCurrent === index,
        loading,
        error,
      });
      super.itemModels(image, index);
    });
    this.setOriginBox(originBox);
    this.setDestoryOnClose(destroyOnClose);
    this.setItemGap(itemGap);
    this.setDirection(direction);
    this.enableSwipeClose(enableSwipeClose);
    this.slide(defaultCurrent, { duration: 0, before: onChange, after: onAfterChange });
    // 绑定手势
    const gesture = new Gesture(_container);
    const eventBind = (trigger: (e: IGestureEvent, o: ICallback) => void, event: IGestureEvent) => {
      trigger.apply(this, [
        event,
        {
          preventAllTap: () => {
            // 曲线救国：这里使用回调阻止所有Tap事件触发
            gesture.preventAllTap();
          },
          popupMenu: (e: IGestureEvent) => {
            onPopupMenu?.(e);
          },
          internalClose: (e: IGestureEvent) => {
            onClose?.(e);
          },
          openStyleChange: (computedStyle: (style: IOpenStyle, bbox: IBBox) => IOpenStyle) => {
            this.openStyle(computedStyle(this._openStyle || {}, this._viewBox || {}));
          },
          slideBefore: (index: number) => {
            // slide当前图片就再加载
            (super.itemModels() as Image[]).forEach((image, i) => {
              image.setActive(index === i);
              const item = indicatorItems[i];
              if (i !== index && hasClass(item, 'active')) {
                removeClass(item, 'active');
              }
              if (i === index && !hasClass(item, 'active')) {
                addClass(item, 'active');
              }
            });
            onChange?.(index);
          },
          slideAfter: (index: number) => onAfterChange?.(index),
        },
      ]);
    };
    gesture.on('pointerStart', (e) => eventBind(pointerStart, e));
    gesture.on('pointerMove', (e) => eventBind(pointerMove, e));
    gesture.on('pointerEnd', (e) => eventBind(pointerEnd, e));
    gesture.on('doubleTap', (e) => eventBind(doubleTap, e));
    gesture.on('singleTap', (e) => eventBind(singleTap, e));
    gesture.on('longTap', (e) => eventBind(longTap, e));
    gesture.on('rotate', (e) => eventBind(rotate, e));
    gesture.on('scale', (e) => eventBind(scale, e));
    gesture.on('swipe', (e) => eventBind(swipe, e));
    const transitionend = (e: TransitionEvent) => {
      if (e.target === _backdrop && e.propertyName === 'opacity') {
        const { o, k, x, y, end, open = false } = this._openStyle || {};
        if (end) {
          if (!open) {
            onAfterClose?.();
          }
          onAfterOpenChange?.(open);
        }
        this.openStyle({ o, k, x, y });
        end?.();
      }
    };
    _backdrop.addEventListener('transitionend', transitionend);
    const contextmenu = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const resize = () => this.updateViewBox();
    window.addEventListener('resize', resize);
    window.addEventListener('contextmenu', contextmenu);
    this._unbind = () => {
      gesture.destory();
      _backdrop.removeEventListener('transitionend', transitionend);
      window.removeEventListener('resize', resize);
      window.removeEventListener('contextmenu', contextmenu);
    };
    el = () => _wrapper;
  }
  updateViewBox() {
    const viewBox = (this._viewBox = getBBox(this._container));
    (super.itemModels() as Image[]).forEach((image) => image.setViewBox(viewBox));
    this.updateImageSize();
  }
  updateImageGap() {
    (super.itemModels() as Image[]).forEach((image, i) =>
      setStyle(image.getElement(), {
        marginTop: this.isVertical() && i !== 0 ? this._itemGap : 0,
        marginLeft: this.isVertical() || i === 0 ? 0 : this._itemGap,
      }),
    );
  }
  updateImageSize() {
    let { width = 0, height = 0 } = this._viewBox || {};
    let size = this.isVertical() ? height : width;
    size = !size ? 0 : size + this._itemGap;
    super.itemSize(size);
    const count = this.countItems();
    size = size * count - this._itemGap;
    if (this.isVertical()) {
      height = size;
    } else {
      width = size;
    }
    setStyle(this._wrapper, { width, height });
  }
  setDestoryOnClose(destoryOnClose?: boolean) {
    this._destoryOnClose = destoryOnClose || false;
  }
  setOriginBox(originBox?: IBBox) {
    this._originBox = originBox || null;
  }
  setItemGap(itemGap?: number) {
    this._itemGap = itemGap || 0;
    this.updateImageGap();
    this.updateImageSize();
  }
  setDirection(direction?: IDirection) {
    const _direction = direction || 'horizontal';
    addClass(
      removeClass(this._container, `preview-image__gallery__container-${super.direction()}`),
      `preview-image__gallery__container-${_direction}`,
    );
    super.direction(_direction);
    this.updateImageGap();
    this.updateImageSize();
  }
  currentItem(sup: boolean = true) {
    const item = super.currentItem();
    if (sup && !item?.getImageElement()) {
      return null;
    }
    return item;
  }
  enableSwipeClose(enableSwipeClose?: boolean) {
    super.swipeClose(enableSwipeClose || false);
  }
  destory() {
    // 销毁事件
    this._unbind?.();
    this._container?.parentNode?.removeChild(this._container);
    super.itemModels([]);
    this._indicator = null;
    this._backdrop = null;
    this._wrapper = null;
    this._container = null;
    this._openStyle = null;
    this._originBox = null;
    this._viewBox = null;
    this._unbind = null;
  }
  // 私有方法
  private animateOpen(open: boolean, end: () => void) {
    const image = this.currentItem(false);
    // 动画之前重置内部图片的transform
    image?.reset();
    const { elementWidth: ew = 0, elementHeight: eh = 0 } = image?.sizePosition() || {};
    const { left: ol = 0, top: ot = 0, width: ow = 0, height: oh = 0 } = this._originBox || {};
    const { left: rl = 0, top: rt = 0, width: rw = 0, height: rh = 0 } = this._viewBox || {};
    let k = 0.001;
    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;
    if (rw > 0 && rh > 0 && ow > 0 && oh > 0) {
      x = ol + ow / 2 - (rl + rw / 2);
      y = ot + oh / 2 - (rt + rh / 2);
    }
    if (ew > 0 && eh > 0 && ow > 0 && oh > 0) {
      const rat = ew / eh > ow / oh;
      k = rat ? oh / eh : ow / ew;
      w = rat ? eh * (ow / oh) : ew;
      h = rat ? eh : ew / (ow / oh);
    }
    const hideStyle = { o: 0, k, x, y, w, h };
    const showStyle = { o: 1, k: 1, x: 0, y: 0, w: ew, h: eh };
    // 动画开始样式
    this.openStyle({
      // 这里在关闭的时候，优先从当前状态prevOpenStyle开始动画
      ...(open ? hideStyle : { ...showStyle, ...this._openStyle }),
    });
    // 走一次getBBox为了使上次样式立马生效，然后进行下次样式动画
    getBBox(this._container);
    // 动画结束样式
    this.openStyle({ ...(open ? showStyle : hideStyle), t: 300, end, open });
  }
  // 私有方法
  private openStyle(style: IEOpenStyle) {
    this._openStyle = style;
    const { o, k, x, y, w, h, t } = style;
    setStyle(this._backdrop, {
      opacity: o,
      transition: !t ? '' : `opacity ${t}ms`,
    });
    const image = this.currentItem(false);
    setStyle(image?.getElement(), {
      transform: `translate(${x}px,${y}px) scale(${k})`,
      transition: t ? `transform ${t}ms` : '',
      // 在图片放大的情况下，图片超出部分会被hidden，这里对于整体缩小的情况将需要visible
      overflow: (k || 1) < 1 || t ? 'visible' : undefined,
    });
    setStyle(image?.getImageElement(), {
      width: w || undefined,
      height: h || undefined,
      transition: t && w && h ? `width ${t}ms, height ${t}ms` : '',
      // 在带开和关闭动画过程中，图片的object-fit使用cover，保持宽高变化的情况下图片不变形
      objectFit: w && h ? 'cover' : undefined,
    });
  }
  private lockOverflow(lock: boolean = true) {
    const body = document.body;
    const html = body.parentElement;
    if (lock) {
      const isOverflow = isBodyOverflowing();
      const scrollbarSize = getScrollBarSize(body).width;
      const width = isOverflow ? `calc(100% - ${scrollbarSize}px)` : '';
      const overflow = [];
      overflow[0] = body.style.overflow;
      body.style.overflow = 'hidden';
      overflow[1] = body.style.width;
      body.style.width = width;
      if (html) {
        overflow[2] = html.style.overflow;
        html.style.overflow = 'hidden';
        overflow[3] = html.style.width;
        html.style.width = width;
      }
      this._overflow = overflow.join('-');
    } else {
      const overflow = this._overflow.split('-');
      this._overflow = '';
      body.style.overflow = overflow[0];
      body.style.width = overflow[1];
      if (html) {
        html.style.overflow = overflow[2];
        html.style.width = overflow[3];
      }
    }
  }
  open() {
    addClass(this._container, 'visible');
    this.updateViewBox();
    this.lockOverflow(true);
    this.animateOpen(true, () => {
      addClass(this._indicator, 'visible');
    });
  }
  close() {
    removeClass(this._indicator, 'visible');
    this.lockOverflow(false);
    this.animateOpen(false, () => {
      if (this._destoryOnClose) {
        this.destory();
      } else {
        removeClass(this._container, 'visible');
      }
    });
  }
}

type IEOpenStyle = IOpenStyle & { end?: () => void; open?: boolean };

export type IGalleryOptions = {
  container?: IElement; // 挂载的元素
  style?: ICSSStyle; // 全局样式
  className?: string; // 全局样式类
  backdropStyle?: ICSSStyle; // 背景样式
  backdropClassName?: string; // 背景样式类
  wrapperStyle?: ICSSStyle; // 图片包装器样式
  wrapperClassName?: string; // 图片包装器样式类
  indicatorStyle?: ICSSStyle; // 指示器（页码）样式
  indicatorClassName?: string; // 指示器（页码）样式类
  current?: number; // 当前展示的图片下标
  imageUrls?: string[]; // image的url列表
  itemGap?: number; // 图片之间的间距
  direction?: IDirection; // 图片排列方向（上下滑动，还是左右滑动）
  isLazy?: boolean; // 图片是否是懒加载（滑到这个图片时再加载），否则一次性加载完
  hasIndicator?: boolean; // 多图片时是否需要指示器（页码）
  destroyOnClose?: boolean; // 关闭时是否销毁组件
  enableSwipeClose?: boolean; // 是否开启垂直下拉关闭
  originBox?: IBBox; // 计算展示和结束画廊时动画移动的位置信息，一般是缩略图的bbox
  loading?: IElement | false; // 图片加载中自定义渲染
  error?: IElement | false; // 图片加载错误自定义渲染
  onPopupMenu?: (e: IGestureEvent) => void; // 长按弹出菜单事件
  onChange?: (v: number) => void; // index改变时事件
  onAfterChange?: (v: number) => void; // index改变后事件
  onClose?: (e: IGestureEvent) => void; // 触发关闭事件，需要调用者在该事件内更新open参数
  onAfterClose?: () => void; // 关闭之后（关闭动画结束）事件
  onAfterOpenChange?: (o: boolean) => void; // 打开和关闭动画结束之后
};

export default Gallery;
