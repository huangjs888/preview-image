/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 09:36:55
 * @Description: ******
 */

import { isTouchable } from '../modules/gesture';
import loadImage from '../modules/loadImage';
import { ItemModel, type IBBox } from '../core';
import { type ICSSStyle, type IElement, getElement, createElement } from '../modules/lightdom';
import loadingIcon from '../svg/loading.svg';
import errorIcon from '../svg/error.svg';
import '../style/image.less';

class Image extends ItemModel {
  _wrapper: HTMLElement | null;
  _image: HTMLImageElement | null | undefined;
  _viewBox: IBBox | null = null;
  _loading: IElement | false;
  _error: IElement | false;
  _src: string = '';
  _active: boolean = false;

  constructor({
    container,
    style,
    className,
    src = '',
    viewBox,
    loading,
    error,
    active = true,
  }: IImageOptions) {
    let el: (() => HTMLElement | null) | null = null;
    super({
      transitionEl: () => el?.(),
      rotation: !isTouchable() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
      scalation: !isTouchable() ? [0.1, 10] : undefined,
    });
    this._wrapper = createElement(
      { className: ['preview-image__image__wrapper', className || ''], style },
      null,
      container,
    ) as HTMLElement;
    this._loading = loading || null;
    this._error = error || null;
    this.setViewBox(viewBox);
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
    this.load();
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
  setViewBox(viewBox?: IBBox) {
    this._viewBox = viewBox || null;
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
          this._image = null;
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
      const { left = 0, top = 0, width = 0, height = 0 } = this._viewBox || {};
      const { elementWidth, elementHeight } = super.sizePosition({
        containerCenter: [left + width / 2, top + height / 2],
        containerWidth: width,
        containerHeight: height,
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
    this._viewBox = null;
    this._loading = null;
    this._error = null;
  }
}
export type IImageOptions = {
  container: Element; // 装在image的容器的bbox
  style?: ICSSStyle; // 样式
  className?: string; // 样式类
  src?: string; // 图片url地址
  viewBox?: IBBox; // 装在image的容器的bbox
  loading?: IElement | false; // 图片加载中自定义渲染
  error?: IElement | false; // 图片加载错误自定义渲染
  active?: boolean; // 是否准备加载
};

export default Image;
