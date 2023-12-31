/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-11-07 09:25:43
 * @Description: ******
 */

import { type ICSSStyle, type IElement, getElement, createElement } from '@huangjs888/lightdom';
import { loadImage } from '@huangjs888/load-image';
import { ItemModel, type ISPosition } from '../core';
import loadingIcon from '../svg/loading.svg';
import errorIcon from '../svg/error.svg';
import '../style/image.less';

class Image extends ItemModel {
  _wrapper: HTMLElement | null;
  _image: HTMLImageElement | null | undefined;
  _viewPosition: ISPosition | null = null;
  _loading: IElement | false;
  _error: IElement | false;
  _src: string = '';
  _active: boolean = false;

  constructor({
    container,
    style,
    className,
    src = '',
    viewPosition,
    loading,
    error,
    active = true,
  }: IImageOptions) {
    let el: (() => HTMLElement | null) | null = null;
    super({
      transitionEl: () => el?.(),
      rotation: (touching) => (!touching ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined),
      scalation: (touching) => (!touching ? [0.1, 10] : undefined),
    });
    this._wrapper = createElement(
      { className: ['preview-image__image__wrapper', className || ''], style },
      null,
      container,
    ) as HTMLElement;
    this._loading = loading || null;
    this._error = error || null;
    this.setViewPosition(viewPosition);
    this.setSrc(src);
    this.setActive(active);
    el = () => this.getImageElement();
  }
  getElement() {
    return this._wrapper;
  }
  getImageElement() {
    return this._image || null;
  }
  setActive(active: boolean = true) {
    this._active = active;
    if (active) {
      this.load();
    }
  }
  setSrc(src?: string) {
    this._src = src || '';
    this._image = undefined;
    const _wrapper = this.getElement();
    if (_wrapper) {
      _wrapper.innerHTML = '';
      const loading = this._loading;
      if (loading !== false) {
        _wrapper.appendChild(
          getElement(loading) ||
            createElement('span', {
              className: 'preview-image__image__loading',
              style: {
                background: `url(${loadingIcon})`,
              },
            }),
        );
      }
      if (this._active) {
        this.load();
      }
    }
  }
  setViewPosition(viewPosition?: ISPosition) {
    this._viewPosition = viewPosition || null;
    this.resize();
  }
  load() {
    const _wrapper = this.getElement();
    // this._image未定义代表从未加载过
    if (_wrapper && typeof this._image === 'undefined') {
      this._image = null;
      loadImage(this._src)
        .then((image) => {
          this._image = image;
          this.resize();
          _wrapper.innerHTML = '';
          _wrapper.appendChild(image);
        })
        .catch(() => {
          _wrapper.innerHTML = '';
          const error = this._error;
          if (error !== false) {
            _wrapper.appendChild(
              getElement(error) ||
                createElement({ className: 'preview-image__image__error' }, [
                  createElement('span', { style: { background: `url(${errorIcon})` } }),
                  createElement('span', {}, '图片加载失败'),
                ]),
            );
          }
        });
    }
  }
  resize() {
    const _image = this._image;
    if (_image) {
      const nWidth = _image.naturalWidth;
      const nHeight = _image.naturalHeight;
      const { x = 0, y = 0, w = 0, h = 0 } = this._viewPosition || {};
      const { elementWidth, elementHeight } = super.sizePosition({
        containerCenter: [x, y],
        containerWidth: w,
        containerHeight: h,
        naturalWidth: nWidth,
        naturalHeight: nHeight,
      });
      _image.width = elementWidth;
      _image.height = elementHeight;
    }
  }
  destory() {
    this._wrapper = null;
    this._image = undefined;
    this._viewPosition = null;
    this._loading = null;
    this._error = null;
  }
}
export type IImageOptions = {
  container: Element; // 装image的容器
  style?: ICSSStyle; // 样式
  className?: string; // 样式类
  src?: string; // 图片url地址
  viewPosition?: ISPosition; // 装image的容器的中心点位置和尺寸
  loading?: IElement | false; // 图片加载中自定义渲染
  error?: IElement | false; // 图片加载错误自定义渲染
  active?: boolean; // 是否准备加载
};

export default Image;
