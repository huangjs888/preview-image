/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:25
 * @Description: ******
 */

import Gesture from '@huangjs888/gesture';
import rotate from './rotate';
import scale from './scale';
import swipe from './swipe';
import longTap from './longTap';
import singleTap from './singleTap';
import doubleTap from './doubleTap';
import pointerStart from './pointerStart';
import pointerMove from './pointerMove';
import pointerEnd from './pointerEnd';
import type Gallery from '../gallery';
import type Picture from '../picture';

export default function bindGesture(this: Gallery | Picture, element: HTMLElement) {
  // 绑定手势
  const gesture = new Gesture(element);
  gesture.on('pointerStart', pointerStart.bind(this));
  gesture.on('pointerMove', pointerMove.bind(this));
  gesture.on('pointerEnd', pointerEnd.bind(this));
  gesture.on('swipe', swipe.bind(this));
  gesture.on('longTap', longTap.bind(this));
  gesture.on('singleTap', singleTap.bind(this));
  gesture.on('doubleTap', doubleTap.bind(this));
  gesture.on('rotate', rotate.bind(this));
  gesture.on('scale', scale.bind(this));
  return gesture;
}
