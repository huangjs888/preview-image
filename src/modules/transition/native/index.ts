/*
 * @Author: Huangjs
 * @Date: 2023-08-23 09:36:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 10:06:48
 * @Description: ******
 */

import { type IElement, setStyle, getElement } from '../../lightdom';
import Core, { type ITransitionOptions } from '../core';

class Transition extends Core {
  constructor(element: IElement, options?: ITransitionOptions) {
    super({
      apply: (style) => setStyle(getElement(element), style),
      ...(options || {}),
    });
  }
}

export default Transition;
