/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 17:26:59
 * @Description: ******
 */

import loadImage from '@huangjs888/load-image';
import Entity, { type IOption } from './entity';
import { createError } from './dom';

export default function (image: Image) {
  const { wrapper, entity, url, options } = image || {};
  // 未定义表示还未加载过图片，null表示已经加载了，只是还没加载完或加载失败
  if (typeof entity === 'undefined') {
    image.entity = null;
    return loadImage(url)
      .then((ele) => {
        image.entity = new Entity({
          element: ele,
          ...options,
        });
        image.width = ele.naturalWidth;
        image.height = ele.naturalHeight;
        wrapper.innerHTML = '';
        wrapper.appendChild(ele);
        return true;
      })
      .catch(() => {
        // 这里可以加一个错误的提示
        wrapper.innerHTML = '';
        createError(wrapper);
        return false;
      });
  }
  return Promise.resolve();
}

export type Image = {
  wrapper: HTMLElement;
  indicator?: HTMLElement | null;
  entity?: Entity | null;
  url: string;
  width: number;
  height: number;
  options: IOption;
};

export type ImageOption = IOption;
