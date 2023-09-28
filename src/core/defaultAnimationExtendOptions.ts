/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 15:26:18
 * @Description: ******
 */

import { easeOutQuart, type IAnimationExtendOptions } from '../modules/transition';

export const defaultAnimationExtendOptions: IAnimationExtendOptions = {
  cancel: true,
  duration: 500,
  easing: easeOutQuart,
};
