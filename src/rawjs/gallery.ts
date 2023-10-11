/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-11 14:45:22
 * @Description: ******
 */

import Gesture, { type IGestureEvent } from '@huangjs888/gesture';
import {
  type ICSSStyle,
  type IElement,
  getElement,
  createElement,
  setStyle,
  addClass,
  hasClass,
  removeClass,
} from '@huangjs888/lightdom';
import {
  SwiperModel,
  type ICallback,
  type IOpenStyle,
  type ISPBox,
  type IDirection,
} from '../core';
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
import { getSPBox, preventDefault } from '../utils';
import '../style/gallery.less';

class Gallery extends SwiperModel<Image> {
  _container: HTMLElement | null;
  _backdrop: HTMLElement | null;
  _wrapper: HTMLElement | null;
  _indicator: HTMLElement | null;
  _openStyle: IEOpenStyle | null = null;
  _ospBox: ISPBox | null = null;
  _vspBox: ISPBox | null = null;
  // _overflow: string = '';
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
    enableSwipeClose = false,
    loading,
    error,
    thumbnail,
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
    this.setOSPBox(thumbnail);
    this.setDestoryOnClose(destroyOnClose);
    this.setItemGap(itemGap);
    this.setDirection(direction);
    this.enableSwipeClose(enableSwipeClose);
    this.slide(defaultCurrent, { duration: 0, before: onChange, after: onAfterChange });
    // 绑定手势
    const gesture = new Gesture(_container);
    const bind = (emitter: (e: IGestureEvent, o: ICallback) => void, event: IGestureEvent) => {
      emitter.apply(this, [
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
            if (typeof onClose === 'function') {
              onClose(e);
              // 返回true通知真的关闭了
              return true;
            }
          },
          openStyleChange: (computedStyle: (style: IOpenStyle, bbox: ISPBox) => IOpenStyle) => {
            this.openStyle(computedStyle(this._openStyle || {}, this._vspBox || {}));
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
    gesture.on('pointerStart', (e) => bind(pointerStart, e));
    gesture.on('pointerMove', (e) => bind(pointerMove, e));
    gesture.on('pointerEnd', (e) => bind(pointerEnd, e));
    gesture.on('doubleTap', (e) => bind(doubleTap, e));
    gesture.on('singleTap', (e) => bind(singleTap, e));
    gesture.on('longTap', (e) => bind(longTap, e));
    gesture.on('rotate', (e) => bind(rotate, e));
    gesture.on('scale', (e) => bind(scale, e));
    gesture.on('swipe', (e) => bind(swipe, e));
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
    _backdrop.addEventListener('transitionend', transitionend, { capture: false, passive: false });
    const resize = () => this.updateVSPBox();
    window.addEventListener('resize', resize, { capture: false, passive: false });
    this._unbind = () => {
      gesture.destory();
      _backdrop.removeEventListener('transitionend', transitionend);
      window.removeEventListener('resize', resize);
    };
    el = () => _wrapper;
  }
  updateVSPBox() {
    const vspBox = (this._vspBox = getSPBox(this._container));
    (super.itemModels() as Image[]).forEach((image) => image.setVSPBox(vspBox));
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
    let { w: width = 0, h: height = 0 } = this._vspBox || {};
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
  setOSPBox(ospBox?: ISPBox) {
    this._ospBox = ospBox || null;
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
    this._ospBox = null;
    this._vspBox = null;
    this._unbind = null;
  }
  // 私有方法
  private animateOpen(open: boolean, end: () => void) {
    const image = this.currentItem(false);
    // 动画之前重置内部图片的transform
    image?.reset();
    const { elementWidth: ew = 0, elementHeight: eh = 0 } = image?.sizePosition() || {};
    const { x: vx = 0, y: vy = 0, w: vw = 0, h: vh = 0 } = this._vspBox || {};
    const { x: ox = 0, y: oy = 0, w: ow = 0, h: oh = 0 } = this._ospBox || {};
    const x = ow === 0 && oh === 0 ? 0 : ox - vx;
    const y = ow === 0 && oh === 0 ? 0 : oy - vy;
    const evw = ew == 0 && eh === 0 ? vw : ew;
    const evh = ew == 0 && eh === 0 ? vh : eh;
    const rat = evw / evh > ow / oh;
    const k = (rat ? oh / evh : ow / evw) || 0.001;
    const w = (rat ? evh * (ow / oh) : evw) || 0;
    const h = (rat ? evh : evw / (ow / oh)) || 0;
    const hideStyle = { o: 0, k, x, y, w, h };
    const showStyle = { o: 1, k: 1, x: 0, y: 0, w: ew, h: eh };
    // 动画开始样式
    this.openStyle({
      // 这里在关闭的时候，优先从当前状态prevOpenStyle开始动画
      ...(open ? hideStyle : { ...showStyle, ...this._openStyle }),
    });
    // 走一次getSPBox为了使上次样式立马生效，然后进行下次样式动画
    getSPBox(this._container);
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
  private preventDefault(prevent: boolean = true) {
    // Chrome 73之后，所有绑定在根节点（window,document,body）的scroll,wheel,mobile touch事件都会默认passive为true
    // 这就会导致事件内调用e.preventDefault()无效，还会报错：Unable to preventDefault inside passive event listener invocation.
    // 这里设置为false，并注册事件达到关闭浏览器的右键菜单，选择，滚动，缩放等默认行为
    // 阻止滚动行为，也可以统一在html和body标签上加入overflow：hidden
    // const body = document.body;
    // const html = body.parentElement;
    if (prevent) {
      // 阻止web端右键菜单行为
      window.addEventListener('contextmenu', preventDefault, { capture: false, passive: false });
      // 阻止移动端长按菜单，滚动，缩放，选择等行为
      window.addEventListener('touchstart', preventDefault, { capture: false, passive: false });
      // 阻止web端滚动行为
      window.addEventListener('wheel', preventDefault, { capture: false, passive: false });
      // 阻止web端选择行为
      window.addEventListener('dragstart', preventDefault, {
        capture: false,
        passive: false,
      });
      // 阻止web端选择行为
      if ('onselectstart' in window.document.documentElement) {
        // capture为true使其为捕获阶段就执行
        window.addEventListener('selectstart', preventDefault, {
          capture: false,
          passive: false,
        });
      }
      /* const overflow = [];
      overflow[0] = body.style.overflow;
      body.style.overflow = 'hidden';
      if (html) {
        overflow[1] = html.style.overflow;
        html.style.overflow = 'hidden';
      }
      this._overflow = overflow.join('-'); */
    } else {
      window.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('touchstart', preventDefault);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('dragstart', preventDefault);
      if ('onselectstart' in window.document.documentElement) {
        window.removeEventListener('selectstart', preventDefault);
      }
      /* const overflow = this._overflow.split('-');
      this._overflow = '';
      body.style.overflow = overflow[0];
      if (html) {
        html.style.overflow = overflow[1];
      } */
    }
  }
  open() {
    addClass(this._container, 'visible');
    this.preventDefault(true);
    this.updateVSPBox();
    this.animateOpen(true, () => {
      addClass(this._indicator, 'visible');
    });
  }
  close() {
    removeClass(this._indicator, 'visible');
    this.preventDefault(false);
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
  thumbnail?: ISPBox; // 计算展示和结束画廊时动画移动的位置信息，一般是缩略图的位置和尺寸
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
