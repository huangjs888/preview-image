import type Gesture from '@huangjs888/gesture';
import Transition, { type EaseFn } from '@huangjs888/transition';
import { type Image, type ImageOption } from './image';
import { type RectSize } from './popup';
declare class Gallery {
    _container: HTMLElement | null;
    _substance: HTMLElement | null;
    _backdrop: HTMLElement | null;
    _indicator: HTMLElement | null;
    _itemGap: number;
    _direction: Direction;
    _rectSize: RectSize | null;
    _isClose: boolean;
    _swipeClose: boolean;
    _closeDestory: boolean;
    _originRect: RectSize | null;
    _press: (() => void) | null;
    _longPress: (() => void) | null;
    _onChange: (() => void) | null;
    _onImageEnd: ((i: number, o: boolean) => void) | null;
    _removeResize: (() => void) | null;
    _images: Image[] | null;
    _activeIndex: number;
    _translate: number;
    _transition: Transition | null;
    _gesture: Gesture | null;
    _fgBehavior: number;
    _moveTarget: 'closures' | 'outside' | 'inside' | 'none';
    constructor({ container: ele, imageUrls, activeIndex, direction, itemGap, hasLoading, hasIndicator, isLazy, swipeClose, closeDestory, backdropColor, originRect, press, longPress, onChange, onResize, onImageEnd, options, }: SOption);
    resetSize(): void;
    resetItemSize(index?: number): void;
    getItemSize(): number;
    slide(index: number, options?: {
        duration?: number;
        easing?: EaseFn;
    }, open?: boolean): Promise<void> | Promise<{
        [key: string]: number;
    } | {
        translate: number;
    }>;
    next(options?: {
        duration?: number;
        easing?: EaseFn;
    }): Promise<void> | Promise<{
        [key: string]: number;
    } | {
        translate: number;
    }>;
    prev(options?: {
        duration?: number;
        easing?: EaseFn;
    }): Promise<void> | Promise<{
        [key: string]: number;
    } | {
        translate: number;
    }>;
    transitionRun(translate: number, options?: {
        duration?: number;
        easing?: EaseFn;
        before?: EaseFn;
    }): Promise<{
        [key: string]: number;
    }> | Promise<{
        translate: number;
    }>;
    transitionCancel(): number;
    isTransitioning(): boolean;
    destory(): void;
    setSwipeClose(swipeClose?: boolean): void;
    setCloseDestory(closeDestory?: boolean): void;
    setOriginRect(originRect?: RectSize | null): void;
    open(): void;
    close(): void;
}
export type Direction = 'vertical' | 'horizontal';
export type SOption = {
    container?: HTMLElement | string;
    imageUrls?: string[];
    direction?: Direction;
    activeIndex?: number;
    itemGap?: number;
    backdropColor?: string;
    hasLoading?: boolean;
    hasIndicator?: boolean;
    isLazy?: boolean;
    originRect?: RectSize;
    swipeClose?: boolean;
    closeDestory?: boolean;
    options?: ImageOption;
    press?: () => void;
    longPress?: () => void;
    onChange?: () => void;
    onResize?: () => void;
    onImageEnd?: (i: number, o: boolean) => void;
};
export default Gallery;
