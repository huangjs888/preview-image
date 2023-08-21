function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 17:26:59
 * @Description: ******
 */

import loadImage from '@huangjs888/load-image';
import Entity from './entity';
import { createError } from './dom';
export default function (image) {
  const {
    wrapper,
    entity,
    url,
    options
  } = image || {};
  // 未定义表示还未加载过图片，null表示已经加载了，只是还没加载完或加载失败
  if (typeof entity === 'undefined') {
    image.entity = null;
    return loadImage(url).then(ele => {
      image.entity = new Entity(_extends({
        element: ele
      }, options));
      image.width = ele.naturalWidth;
      image.height = ele.naturalHeight;
      wrapper.innerHTML = '';
      wrapper.appendChild(ele);
      return true;
    }).catch(() => {
      // 这里可以加一个错误的提示
      wrapper.innerHTML = '';
      createError(wrapper);
      return false;
    });
  }
  return Promise.resolve();
}