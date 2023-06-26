/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-26 10:34:17
 * @Description: ******
 */

import Gesture, { type GEvent } from './gesture';
import { performDamping, setStyle } from './adjust';

const touchStart = function touchStart(this: Swiper) {
  if (this.length <= 1) {
    return;
  }
  this._timeStamp = Date.now();
};
const touchMove = function touchMove(this: Swiper, e: GEvent) {
  if (this.length <= 1) {
    return;
  }
  const { moveX = 0 } = e;
  this._translate = performDamping(-this.activeIndex * this._unitSize + moveX, [
    -(this.length - 1) * this._unitSize,
    0,
  ]);
  setStyle(this.contentEl, {
    transform: `translate3d(${this._translate}px, 0, 0)`,
    transition: 'transform 0s ease 0s',
  });
};
const touchEnd = function touchEnd(this: Swiper) {
  if (this.length <= 1) {
    return;
  }
  const timeDiff = Date.now() - this._timeStamp;
  const k = -this._translate / this._unitSize;
  const index =
    timeDiff < 300
      ? k > this.activeIndex
        ? Math.ceil(k)
        : Math.floor(k)
      : Math.round(k);
  this.slide(index);
};

class Swiper {
  element: HTMLElement; // swipe
  contentEl: HTMLElement; // 内容元素
  activeIndex: number; // 当前索引
  length: number = 0; // 子元素总数
  gap: number; // 子元素间距
  _translate: number = 0; // 当前swipe位移
  _unitSize: number = 0; // 一屏大小
  _timeStamp: number = 0; //时间戳
  _gesture: Gesture; // 手势对象
  constructor(options: IOption) {
    const { container, children, gap = 20, defaultIndex = 0 } = options;
    let tempContainer: HTMLElement | null;
    try {
      if (typeof container === 'string') {
        tempContainer = document.querySelector(container);
      } else {
        tempContainer = container;
      }
    } catch (e) {
      tempContainer = null;
    }
    if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
      throw new Error('Please pass in a valid container element...');
    }
    tempContainer.innerHTML = '';
    const contentElement = document.createElement('div');
    tempContainer.appendChild(contentElement);
    this.element = tempContainer;
    this.contentEl = contentElement;
    // 绑定手势
    const gesture = new Gesture(this.element);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
    this.activeIndex = defaultIndex;
    this._unitSize = this.getContainerSize().width + gap;
    this.gap = gap;
    this.setChildren(children);
  }
  setChildren(children: HTMLElement[] = []) {
    if (children.length > 0) {
      this.contentEl.innerHTML = '';
      this.length = 0;
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          setStyle(child, {
            ...this.getContainerSize(),
            marginLeft: this.length === 0 ? 0 : this.gap,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          });
          this.length += 1;
          this.contentEl.appendChild(child);
        }
      });
    }
    setStyle(this.contentEl, {
      ...this.getContainerSize(),
      width: this.getContainerSize().width * this.length,
      display: 'flex',
    });
  }
  destory() {
    // 销毁手势事件
    this._gesture.destory();
    this.element.innerHTML = '';
  }
  getContainerSize() {
    // 获取容器元素的原始宽高
    const { clientWidth, clientHeight } = this.element;
    return { width: clientWidth, height: clientHeight };
  }
  slide(index: number) {
    this.activeIndex = Math.min(Math.max(index, 0), this.length - 1);
    this._translate = -this.activeIndex * this._unitSize;
    setStyle(this.contentEl, {
      transform: `translate3d(${this._translate}px, 0, 0)`,
      transition: `transform ${0.3}s ease 0s`,
    });
  }
  next() {
    return this.slide(this.activeIndex + 1);
  }
  prev() {
    return this.slide(this.activeIndex - 1);
  }
}

export type IOption = {
  container: HTMLElement | string;
  children?: HTMLElement[];
  defaultIndex?: number;
  gap?: number;
};

export default Swiper;
