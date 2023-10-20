/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 09:24:44
 * @Description: ******
 */

import {
  Transition,
  Value,
  type ITransitionOptions,
  type IAnimationExtendOptions,
} from '@huangjs888/transition';
import { type IElement } from '@huangjs888/lightdom';
import { defaultAnimationExtendOptions } from './defaultAnimationExtendOptions';

class SwiperModel<T extends Object | null> extends Transition {
  _direction: IDirection = 'horizontal';
  _itemModels: T[] = [];
  _itemSize: number = 0;
  _activeIndex: number = -1;
  _enableSwipeClose: boolean = true;
  _fgBehavior: number = 0; // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  _moveTarget: 'closures' | 'outside' | 'inside' | 'none' = 'none'; // 判断是内部的图片移动，还是外部swiper移动，还是进入swipeClose
  constructor({
    direction,
    itemModels,
    itemSize,
    enableSwipeClose,
    transitionEl,
    ...transitionOption
  }: SwiperOption<T> = {}) {
    super(transitionEl || null, transitionOption);
    this.apply({
      transform: new Value(0, 1, (v) => `translateX(${v.default}px)`),
    });
    this.swipeClose(enableSwipeClose);
    this.direction(direction);
    this.itemSize(itemSize);
    this.itemModels(itemModels);
  }
  activeIndex() {
    return this._activeIndex;
  }
  isHorizontal() {
    return this._direction === 'horizontal';
  }
  isVertical() {
    return this._direction === 'vertical';
  }
  swipeClose(enableSwipeClose?: boolean) {
    if (typeof enableSwipeClose !== 'undefined') {
      this._enableSwipeClose = enableSwipeClose;
    }
    return this._enableSwipeClose;
  }
  direction(direction?: IDirection) {
    if (direction) {
      this._direction = direction;
      const xy = direction === 'vertical' ? 'Y' : 'X';
      // 方向改变了要重置transform函数
      this.apply(new Value(0, 1, (v) => `translate${xy}(${v.default}px)`));
    }
    return this._direction;
  }
  itemSize(itemSize?: number) {
    if (typeof itemSize !== 'undefined') {
      this._itemSize = itemSize;
      // 单位尺寸变了，需要调整一下位移
      this.apply(new Value(-this.activeIndex() * itemSize));
    }
    return this._itemSize;
  }
  itemModels(itemModels?: number | T | T[], index?: number) {
    if (typeof itemModels === 'undefined') {
      return this._itemModels;
    } else if (typeof itemModels === 'number') {
      return this._itemModels[itemModels];
    } else if (Array.isArray(itemModels)) {
      this._itemModels = itemModels;
      return itemModels;
    } else {
      this._itemModels[index || 0] = itemModels;
      return itemModels;
    }
  }
  currentItem(): T | null {
    return this.itemModels(this.activeIndex()) as T;
  }
  countItems() {
    return (this.itemModels() as T[]).length;
  }
  slide(index: number, options: IAnimationExtendOptions = {}) {
    const { before, after, ...restOptions } = options;
    const activeIndex = Math.max(Math.min(index, this.countItems() - 1), 0);
    const isChanged = this.activeIndex() !== activeIndex;
    if (isChanged) {
      this._activeIndex = activeIndex;
      before?.(activeIndex);
    }
    const translate = -activeIndex * this.itemSize();
    return this.apply(new Value(translate), {
      ...defaultAnimationExtendOptions,
      ...restOptions,
    }).then(() => {
      if (isChanged) {
        after?.(activeIndex);
      }
      return activeIndex;
    });
  }
  next(options?: IAnimationExtendOptions) {
    return this.slide(this._activeIndex + 1, options);
  }
  prev(options?: IAnimationExtendOptions) {
    return this.slide(this._activeIndex - 1, options);
  }
}

export type IDirection = 'vertical' | 'horizontal';

export type SwiperOption<T> = {
  direction?: IDirection;
  enableSwipeClose?: boolean;
  itemModels?: T | T[];
  itemSize?: number;
} & ITransitionOptions & { transitionEl?: IElement };

export type ISPosition = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export type IOpenStyle = {
  o?: number;
  k?: number;
  t?: number;
} & ISPosition;

export type ICallback = {
  [key: string]: Function;
};

export default SwiperModel;
