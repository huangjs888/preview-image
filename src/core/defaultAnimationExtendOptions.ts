/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 16:01:30
 * @Description: ******
 */

import { type IAnimationExtendOptions } from '@huangjs888/transition';
import { easeOutQuart } from '@huangjs888/transition/easing';

export const defaultAnimationExtendOptions: IAnimationExtendOptions = {
  cancel: true,
  duration: 500,
  easing: easeOutQuart,
};
