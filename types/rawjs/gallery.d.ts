import { type IGestureEvent } from '@huangjs888/gesture';
import { type ICSSStyle, type IElement } from '@huangjs888/lightdom';
import { SwiperModel, type IOpenStyle, type ISPosition, type IDirection } from '../core';
import Image from './image';
import '../style/gallery.less';
declare class Gallery extends SwiperModel<Image> {
    _container: HTMLElement | null;
    _backdrop: HTMLElement | null;
    _wrapper: HTMLElement | null;
    _indicator: HTMLElement | null;
    _openStyle: IEOpenStyle | null;
    _clickPosition: ISPosition | null;
    _viewPosition: ISPosition | null;
    _destoryOnClose: boolean;
    _itemGap: number;
    _unbind: (() => void) | null;
    constructor({ container, style, className, backdropStyle, backdropClassName, wrapperStyle, wrapperClassName, indicatorStyle, indicatorClassName, current, imageUrls, direction, itemGap, isLazy, hasIndicator, destroyOnClose, enableSwipeClose, loading, error, clickPosition, onContextMenu, onChange, onAfterChange, onClose, onAfterClose, onAfterOpenChange, }: IGalleryOptions);
    updateViewPosition(): void;
    updateImageGap(): void;
    updateImageSize(): void;
    setDestoryOnClose(destoryOnClose?: boolean): void;
    setClickPosition(clickPosition?: ISPosition): void;
    setItemGap(itemGap?: number): void;
    setDirection(direction?: IDirection): void;
    currentItem(sup?: boolean): Image | null;
    enableSwipeClose(enableSwipeClose?: boolean): void;
    destory(): void;
    private animateOpen;
    private openStyle;
    private preventDefault;
    open(): void;
    close(): void;
}
type IEOpenStyle = IOpenStyle & {
    end?: () => void;
    open?: boolean;
};
export type IGalleryOptions = {
    container?: IElement;
    style?: ICSSStyle;
    className?: string;
    backdropStyle?: ICSSStyle;
    backdropClassName?: string;
    wrapperStyle?: ICSSStyle;
    wrapperClassName?: string;
    indicatorStyle?: ICSSStyle;
    indicatorClassName?: string;
    current?: number;
    imageUrls?: string[];
    itemGap?: number;
    direction?: IDirection;
    isLazy?: boolean;
    hasIndicator?: boolean;
    destroyOnClose?: boolean;
    enableSwipeClose?: boolean;
    clickPosition?: ISPosition;
    loading?: IElement | false;
    error?: IElement | false;
    onContextMenu?: (e: IGestureEvent) => void;
    onChange?: (v: number) => void;
    onAfterChange?: (v: number) => void;
    onClose?: (e: IGestureEvent) => void;
    onAfterClose?: () => void;
    onAfterOpenChange?: (o: boolean) => void;
};
export default Gallery;
