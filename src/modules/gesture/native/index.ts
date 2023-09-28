/*
 * @Author: Huangjs
 * @Date: 2023-08-23 09:36:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 15:59:56
 * @Description: ******
 */

import { type IElement, getElement } from '../../lightdom';
import Core, { type IGestureOptions } from '../core';
import { started, moved, ended, canceled, downed, wheeled } from '../events';
import { isTouchable } from '../utils';

class Gesture extends Core {
  element: Element | null = null;
  _unbind: (() => void) | null = null;
  constructor(element: IElement, options?: IGestureOptions) {
    super(options);
    const _element = getElement(element);
    if (!_element) {
      throw new Error('Please pass in a valid element...');
    }
    this.element = _element;
    // 注册触摸事件
    if (isTouchable()) {
      const touchstarted = started.bind(this);
      const touchmoved = moved.bind(this);
      const touchended = ended.bind(this);
      const touchcanceled = canceled.bind(this);
      _element.addEventListener('touchstart', touchstarted, false);
      _element.addEventListener('touchmove', touchmoved, false);
      _element.addEventListener('touchend', touchended, false);
      _element.addEventListener('touchcancel', touchcanceled, false);
      this._unbind = () => {
        _element.removeEventListener('touchstart', touchstarted);
        _element.removeEventListener('touchmove', touchmoved);
        _element.removeEventListener('touchend', touchended);
        _element.removeEventListener('touchcancel', touchcanceled);
      };
    } else {
      // 注册触摸事件
      const mousedowned = downed.bind(this);
      const mousewheeled = wheeled.bind(this);
      _element.addEventListener('mousedown', mousedowned, false);
      _element.addEventListener('wheel', mousewheeled, false);
      this._unbind = () => {
        _element.removeEventListener('mousedown', mousedowned);
        _element.removeEventListener('wheel', mousewheeled);
      };
    }
  }
  destory() {
    // 解除所有事件
    super.off();
    // 解除手势事件
    if (this._unbind) {
      this._unbind();
      this._unbind = null;
      this.element = null;
    }
  }
}

export default Gesture;
