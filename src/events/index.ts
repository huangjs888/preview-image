/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 14:26:46
 * @Description: ******
 */

import Gesture from '@huangjs888/gesture';
import swipe from './swipe';
import longTap from './longTap';
import singleTap from './singleTap';
import doubleTap from './doubleTap';
import touchStart from './touchStart';
import touchMove from './touchMove';
import touchEnd from './touchEnd';
import Gallery from '../gallery';
import SingleGallery from '../singleGallery';

export default function bindGesture(
  this: Gallery | SingleGallery,
  element: HTMLElement,
) {
  // 绑定手势
  const gesture = new Gesture(element);
  if (gesture.done()) {
    gesture.on('touchStart', touchStart.bind(this));
    gesture.on('touchMove', touchMove.bind(this));
    gesture.on('doubleTap', doubleTap.bind(this));
    gesture.on('swipe', swipe.bind(this));
    gesture.on('longTap', longTap.bind(this));
    gesture.on('singleTap', singleTap.bind(this));
    gesture.on('touchEnd', touchEnd.bind(this));
  }
  return gesture;
}
