import { Transition, type ITransitionOptions, type IAnimationExtendOptions } from '@huangjs888/transition';
import { type IElement } from '@huangjs888/lightdom';
declare class SwiperModel<T extends Object | null> extends Transition {
    _direction: IDirection;
    _itemModels: T[];
    _itemSize: number;
    _activeIndex: number;
    _enableSwipeClose: boolean;
    _fgBehavior: number;
    _moveTarget: 'closures' | 'outside' | 'inside' | 'none';
    constructor({ direction, itemModels, itemSize, enableSwipeClose, transitionEl, ...transitionOption }?: SwiperOption<T>);
    activeIndex(): number;
    isHorizontal(): boolean;
    isVertical(): boolean;
    swipeClose(enableSwipeClose?: boolean): boolean;
    direction(direction?: IDirection): IDirection;
    itemSize(itemSize?: number): number;
    itemModels(itemModels?: number | T | T[], index?: number): T | T[];
    currentItem(): T | null;
    countItems(): number;
    slide(index: number, options?: IAnimationExtendOptions): Promise<number>;
    next(options?: IAnimationExtendOptions): Promise<number>;
    prev(options?: IAnimationExtendOptions): Promise<number>;
}
export type IDirection = 'vertical' | 'horizontal';
export type SwiperOption<T> = {
    direction?: IDirection;
    enableSwipeClose?: boolean;
    itemModels?: T | T[];
    itemSize?: number;
} & ITransitionOptions & {
    transitionEl?: IElement;
};
export type ISPBox = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
};
export type IOpenStyle = {
    o?: number;
    k?: number;
    t?: number;
} & ISPBox;
export type ICallback = {
    [key: string]: Function;
};
export default SwiperModel;
