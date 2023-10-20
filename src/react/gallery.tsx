/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 14:53:45
 * @Description: ******
 */

import React from 'react';
import Gesture, { type IGestureEvent } from '@huangjs888/gesture/react';
import Image from './image';
import Portal, { type IContainer } from './portal';
import { useStableMemo } from './useStableMemo';
import { useDerivedState } from './useDerivedState';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import {
  SwiperModel,
  type ItemModel,
  type ICallback,
  type IOpenStyle,
  type ISPosition,
  type IDirection,
} from '../core';
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
import { getSizePosition, debounce } from '../utils';
import '../style/gallery.less';

type IGalleryRef = {
  findDOMElement: () => Element | null | undefined;
  getInstance: () => SwiperModel<ItemModel | null> | null | undefined;
};

export type IGalleryProps = {
  style?: React.CSSProperties; // 全局样式
  className?: string; // 全局样式类
  backdropStyle?: React.CSSProperties; // 背景样式
  backdropClassName?: string; // 背景样式类
  wrapperStyle?: React.CSSProperties; // 图片包装器样式
  wrapperClassName?: string; // 图片包装器样式类
  indicatorStyle?: React.CSSProperties; // 指示器（页码）样式
  indicatorClassName?: string; // 指示器（页码）样式类
  open?: boolean; // 是否打开画廊
  current?: number; // 当前展示的图片下标
  container?: IContainer; // 挂载的元素
  destroyOnClose?: boolean; // 关闭时是否销毁组件
  enableSwipeClose?: boolean; // 是否开启垂直下拉关闭
  clickPosition?: ISPosition; // 计算展示和结束画廊时动画移动的位置信息，一般是缩略图的bbox
  imageUrls?: string[]; // image的url列表
  itemGap?: number; // 图片之间的间距
  direction?: IDirection; // 图片排列方向（上下滑动，还是左右滑动）
  isLazy?: boolean; // 图片是否是懒加载（滑到这个图片时再加载），否则一次性加载完
  hasLoading?: boolean; // 加载图片是否展示loading
  hasError?: boolean; // 图片错误是否显示错误提示
  renderError?: () => React.ReactElement | null; // 图片加载错误自定义渲染
  hasIndicator?: boolean; // 多图片时是否需要指示器（页码）
  renderLoading?: () => React.ReactElement | null; // 图片加载中自定义渲染
  onContextMenu?: (e: IGestureEvent) => void; // 长按弹出菜单事件
  onChange?: (v: number) => void; // index改变时事件
  onAfterChange?: (v: number) => void; // index改变后事件
  onClose?: (e: IGestureEvent) => void; // 触发关闭事件，需要调用者在该事件内更新open参数
  onAfterClose?: () => void; // 关闭之后（关闭动画结束）事件
  onAfterOpenChange?: (o: boolean) => void; // 打开和关闭动画结束之后
};

//   open(T|F)和openStatus(0|1|2)按照逆时针转变
//
//                      关闭且动画结束(无动画)
//                             F(0)
//                          /\       \
//                         /          \
//                        /            \/
//    关闭并执行关闭动画  F(1)          T(0)  打开且准备打开动画
//                        |\            |
//                        |             |
//                        |             |/
//    关闭并准备关闭动画  F(2)          T(1)  打开并执行开始动画
//                       /\            /
//                         \          /
//                          \       \/
//                             T(2)
//                      打开且动画结束(无动画)

export default React.forwardRef<IGalleryRef, IGalleryProps>(
  (
    {
      style,
      className,
      backdropStyle,
      backdropClassName,
      wrapperStyle,
      wrapperClassName,
      indicatorStyle,
      indicatorClassName,
      open = false,
      current = 0,
      container,
      clickPosition,
      imageUrls = [],
      itemGap = 20,
      direction = 'horizontal',
      isLazy = true,
      hasLoading = true,
      renderLoading,
      hasError = true,
      renderError,
      hasIndicator = true,
      destroyOnClose = false,
      enableSwipeClose = true,
      onContextMenu,
      onChange,
      onAfterChange,
      onClose,
      onAfterClose,
      onAfterOpenChange,
    },
    ref,
  ) => {
    const defaultTotal = imageUrls.length;
    const defaultCurrent = !current || current < 0 || current >= defaultTotal ? 0 : current;
    const gestureRef = React.useRef<React.ElementRef<typeof Gesture> | null>(null);
    const swiperModelRef = React.useRef<SwiperModel<ItemModel | null> | null>(null);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [openStatus, setOpenStatus] = React.useState<number>(0);
    const [openStyle, setOpenStyle] = React.useState<IOpenStyle>({});
    const [viewPosition, setViewPosition] = React.useState<ISPosition>({});
    const [activeIndex, setActiveIndex] = useDerivedState<number>(defaultCurrent);

    React.useImperativeHandle(
      ref,
      (): IGalleryRef => ({
        findDOMElement: () => gestureRef.current?.findDOMElement(),
        getInstance: () => swiperModelRef.current,
      }),
      [],
    );

    useIsomorphicLayoutEffect(() => {
      swiperModelRef.current = new SwiperModel<ItemModel | null>({
        transitionEl: () => wrapperRef.current,
      });
    }, []);

    const stableOptions = useStableMemo({
      // 只有在打开时并且动画已结束时，才可以有slide过渡
      ...(open && openStatus === 2 ? {} : { duration: 0 }),
      before: onChange,
      after: onAfterChange,
    });
    useIsomorphicLayoutEffect(() => {
      const swiperModel = swiperModelRef.current;
      if (swiperModel) {
        swiperModel.slide(activeIndex, { ...stableOptions.data });
      }
    }, [activeIndex, stableOptions]);

    useIsomorphicLayoutEffect(() => {
      // T(0)状态
      if (open && openStatus === 0) {
        setViewPosition(getSizePosition(gestureRef.current?.findDOMElement()));
        // 开启打开动画
        setOpenStatus(1);
      }
      // F(2)状态
      if (!open && openStatus === 2) {
        // 开启关闭动画
        setOpenStatus(1);
      }
    }, [open]);

    // 在打开和关闭动画过程中clickPosition或viewPosition发生变化，则不再重新动画
    const stableBox = useStableMemo({ clickPosition, viewPosition });
    useIsomorphicLayoutEffect(() => {
      // 进行开启关闭动画，F(1)或T(1)状态
      if (openStatus === 1) {
        const item = swiperModelRef.current?.currentItem();
        // 动画之前重置内部图片的transform
        item?.reset();
        const { elementWidth: ew = 0, elementHeight: eh = 0 } = item?.sizePosition() || {};
        const { x: vx = 0, y: vy = 0, w: vw = 0, h: vh = 0 } = stableBox.data.viewPosition || {};
        const { x: ox = 0, y: oy = 0, w: ow = 0, h: oh = 0 } = stableBox.data.clickPosition || {};
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
        setOpenStyle((prevOpenStyle) => ({
          // 这里在关闭的时候，优先从当前状态prevOpenStyle开始动画
          ...(open ? hideStyle : { ...showStyle, ...prevOpenStyle }),
        }));
        // 使用Promise是为了使上述setState生效，在下一次渲染操作新的setState
        Promise.resolve().then(() => {
          // 走一次getSizePosition为了使上次渲染的样式立马生效，然后进行下次渲染
          getSizePosition(gestureRef.current?.findDOMElement());
          // 以上两步可以可以合并只使用：setTimeout(() => {}, 0);
          // 动画结束样式
          setOpenStyle({ ...(open ? showStyle : hideStyle), t: 300 });
        });
      }
    }, [open, openStatus, stableBox]);

    useIsomorphicLayoutEffect(() => {
      const swiperModel = swiperModelRef.current;
      if (swiperModel) {
        swiperModel.swipeClose(enableSwipeClose);
      }
    }, [enableSwipeClose]);

    useIsomorphicLayoutEffect(() => {
      const swiperModel = swiperModelRef.current;
      if (swiperModel) {
        swiperModel.direction(direction);
      }
    }, [direction]);

    useIsomorphicLayoutEffect(() => {
      const swiperModel = swiperModelRef.current;
      if (swiperModel) {
        const { w: width, h: height } = viewPosition;
        let size = direction !== 'horizontal' ? height : width;
        size = !size ? 0 : size + itemGap;
        swiperModel.itemSize(size);
      }
    }, [direction, itemGap, viewPosition]);

    useIsomorphicLayoutEffect(() => {
      const resize = debounce(
        () => setViewPosition(getSizePosition(gestureRef.current?.findDOMElement())),
        50,
      );
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    const _wrapperStyle = React.useMemo(() => {
      let { w: width = 0, h: height = 0 } = viewPosition;
      const totalGap = (defaultTotal - 1) * itemGap;
      if (direction !== 'horizontal') {
        height = height * defaultTotal + totalGap;
      } else {
        width = width * defaultTotal + totalGap;
      }
      return { width, height };
    }, [direction, itemGap, viewPosition, defaultTotal]);

    function renderImages() {
      return imageUrls.map((url, index) => {
        return (
          <Image
            ref={(_ref) => swiperModelRef.current?.itemModels(_ref && _ref.getInstance(), index)}
            key={index}
            style={{
              ...(index === activeIndex
                ? {
                    transform: `translate(${openStyle.x}px,${openStyle.y}px) scale(${openStyle.k})`,
                    transition: openStyle.t ? `transform ${openStyle.t}ms` : '',
                    // 在图片放大的情况下，图片超出部分会被hidden，这里对于整体缩小的情况将需要visible
                    overflow: (openStyle.k || 1) < 1 || openStyle.t ? 'visible' : undefined,
                  }
                : {}),
              // 给予图片之间一个间隔gap
              marginTop: direction !== 'horizontal' && index !== 0 ? itemGap : 0,
              marginLeft: direction !== 'horizontal' || index === 0 ? 0 : itemGap,
            }}
            imgStyle={
              index === activeIndex
                ? {
                    width: openStyle.w || undefined,
                    height: openStyle.h || undefined,
                    transition:
                      openStyle.t && openStyle.w && openStyle.h
                        ? `width ${openStyle.t}ms, height ${openStyle.t}ms`
                        : '',
                    // 在带开和关闭动画过程中，图片的object-fit使用cover，保持宽高变化的情况下图片不变形
                    objectFit: openStyle.w && openStyle.h ? 'cover' : undefined,
                  }
                : {}
            }
            src={url}
            error={hasError ? renderError : false}
            loading={hasLoading ? renderLoading : false}
            active={!isLazy || activeIndex === index}
            viewPosition={viewPosition}
          />
        );
      });
    }

    const bind = (emitter: (e: IGestureEvent, o: ICallback) => void, event: IGestureEvent) => {
      const swiperModel = swiperModelRef.current;
      if (swiperModel) {
        emitter.apply(swiperModel, [
          event,
          {
            preventAllTap: () => {
              // 曲线救国：这里使用回调阻止所有Tap事件触发
              const gesture = gestureRef.current?.getInstance();
              if (gesture) {
                gesture.preventAllTap();
              }
            },
            contextMenu: (e: IGestureEvent) => {
              onContextMenu?.(e);
            },
            internalClose: (e: IGestureEvent) => {
              if (typeof onClose === 'function') {
                onClose(e);
                // 返回true通知真的关闭了
                return true;
              }
            },
            openStyleChange: (
              computedStyle: (style: IOpenStyle, bbox: ISPosition) => IOpenStyle,
            ) => {
              setOpenStyle((prevOpenStyle) => computedStyle(prevOpenStyle, viewPosition));
            },
            slideBefore: (index: number) => {
              setActiveIndex(index);
              onChange?.(index);
            },
            slideAfter: (index: number) => onAfterChange?.(index),
          },
        ]);
      }
    };
    // F(0)状态时destroyOnClose，则销毁元素
    if (destroyOnClose && !open && openStatus === 0) {
      return null;
    }

    return (
      <Portal prevent={open && openStatus === 2} container={container}>
        <Gesture
          ref={gestureRef}
          onPointerStart={(e) => bind(pointerStart, e)}
          onPointerMove={(e) => bind(pointerMove, e)}
          onPointerEnd={(e) => bind(pointerEnd, e)}
          onDoubleTap={(e) => bind(doubleTap, e)}
          onSingleTap={(e) => bind(singleTap, e)}
          onLongTap={(e) => bind(longTap, e)}
          onRotate={(e) => bind(rotate, e)}
          onScale={(e) => bind(scale, e)}
          onSwipe={(e) => bind(swipe, e)}>
          <div
            className={`preview-image__gallery__container preview-image__gallery__container-${direction}${
              !className ? '' : ` ${className}`
            }${open || openStatus !== 0 ? ' visible' : ''}`}
            style={style}>
            <div
              className={`preview-image__gallery__backdrop${
                !backdropClassName ? '' : ` ${backdropClassName}`
              }`}
              style={{
                backgroundColor: '#000f',
                ...(backdropStyle || {}),
                opacity: openStyle.o,
                transition: !openStyle.t ? '' : `opacity ${openStyle.t}ms`,
              }}
              onTransitionEnd={(e: React.SyntheticEvent<HTMLDivElement, TransitionEvent>) => {
                if (e.nativeEvent.propertyName === 'opacity') {
                  if (openStatus === 1) {
                    //动画结束转换到T(2)或F(0)状态
                    setOpenStatus(open ? 2 : 0);
                    if (!open) {
                      onAfterClose?.();
                    }
                    onAfterOpenChange?.(open);
                  }
                  setOpenStyle(({ o, k, x, y }) => ({ o, k, x, y }));
                }
              }}
            />
            <div
              ref={wrapperRef}
              className={`preview-image__gallery__wrapper${
                !wrapperClassName ? '' : ` ${wrapperClassName}`
              }`}
              style={{
                ...(wrapperStyle || {}),
                ..._wrapperStyle,
              }}>
              {renderImages()}
            </div>
            {hasIndicator && defaultTotal > 1 && (
              <div
                className={`preview-image__gallery__indicator${
                  !indicatorClassName ? '' : ` ${indicatorClassName}`
                }${open && openStatus === 2 ? ' visible' : ''}`}
                style={indicatorStyle}>
                {imageUrls.map((_, index) => (
                  <span
                    key={index}
                    className={`preview-image__gallery__indicator-item${
                      activeIndex === index ? ' active' : ''
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Gesture>
      </Portal>
    );
  },
);
