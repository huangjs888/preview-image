/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-11-01 14:35:38
 * @Description: ******
 */

import React from 'react';
import { useChanged } from './useChanged';
import { useDerivedState } from './useDerivedState';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { ItemModel, type ISPosition } from '../core';
import Loading from '../svg/loading.svg';
import Error from '../svg/error.svg';
import '../style/image.less';

type IImageRef = {
  findImageElement: () => HTMLImageElement | null | undefined;
  findDOMElement: () => HTMLDivElement | null | undefined;
  getInstance: () => ItemModel | null | undefined;
};

export interface IImageProps {
  className?: string; // 样式类
  style?: React.CSSProperties; // 样式
  imgStyle?: React.CSSProperties; // 图片样式
  src?: string; // 图片url地址
  alt?: string; // 图片说明
  error?: false | (() => React.ReactElement | null); // 是否显示错误提示
  loading?: false | (() => React.ReactElement | null); // 是否显示loading信息
  active?: boolean; // 是否准备加载
  viewPosition?: ISPosition; // 装在image的容器的位置和尺寸
}

const defaultRenderError = () => {
  return (
    <div className="preview-image__image__error">
      <span>
        <Error width="100%" height="100%" />
      </span>
      <span style={{ marginTop: 16 }}>图片加载失败</span>
    </div>
  );
};
const defaultRenderLoading = () => {
  return (
    <span className="preview-image__image__loading">
      <Loading width="100%" height="100%" />
    </span>
  );
};

export default React.forwardRef<IImageRef, IImageProps>(
  (
    { src = '', alt = '', style, imgStyle, className, viewPosition, loading, error, active = true },
    ref,
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const imageRef = React.useRef<HTMLImageElement | null>(null);
    const itemModelRef = React.useRef<ItemModel | null>(null);
    const [status, setStatus] = useDerivedState<number>(0, function useCompare(prev) {
      let _status = prev;
      if (useChanged(src)) {
        _status = 0;
      }
      if (_status === 0 && active) {
        _status = 1;
      }
      return _status;
    });
    useIsomorphicLayoutEffect(() => {
      itemModelRef.current = new ItemModel({
        transitionEl: () => imageRef.current,
        rotation: (touching) => (!touching ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined),
        scalation: (touching) => (!touching ? [0.1, 10] : undefined),
      });
    }, []);

    React.useImperativeHandle(
      ref,
      (): IImageRef => ({
        findImageElement: () => (status === 2 ? imageRef.current : null),
        findDOMElement: () => (status === 2 ? wrapperRef.current : null),
        getInstance: () => (status === 2 ? itemModelRef.current : null),
      }),
      [status],
    );

    const imageSize = React.useMemo(() => {
      const size = {
        containerCenter: [0, 0],
        containerWidth: 0,
        containerHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0,
      };
      const imageEl = imageRef.current;
      if (imageEl && status === 2) {
        const nWidth = imageEl.naturalWidth;
        const nHeight = imageEl.naturalHeight;
        const { x = 0, y = 0, w = 0, h = 0 } = viewPosition || {};
        size.containerCenter = [x, y];
        size.containerWidth = w;
        size.containerHeight = h;
        size.naturalWidth = nWidth;
        size.naturalHeight = nHeight;
      }
      const itemModel = itemModelRef.current;
      const _imageSize = { width: 0, height: 0 };
      if (itemModel) {
        const { elementWidth, elementHeight } = itemModel.sizePosition(size);
        _imageSize.width = elementWidth;
        _imageSize.height = elementHeight;
      }
      return _imageSize;
    }, [viewPosition, status]);

    return (
      <div
        ref={wrapperRef}
        className={`preview-image__image__wrapper${!className ? '' : ` ${className}`}`}
        style={{
          alignItems: (viewPosition?.h || 0) < imageSize.height ? 'flex-start' : 'center',
          ...(style || {}),
        }}>
        <img
          ref={imageRef}
          style={{ ...imgStyle }}
          alt={alt}
          onLoad={() => setStatus(2)}
          onError={() => setStatus(3)}
          {...(status > 0 ? { src } : {})}
          {...imageSize}
        />
        {status <= 1 && loading !== false && (loading || defaultRenderLoading)()}
        {status === 3 && error !== false && (error || defaultRenderError)()}
      </div>
    );
  },
);
