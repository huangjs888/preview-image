import { type ICSSStyle, type IElement } from '@huangjs888/lightdom';
import { ItemModel, type ISPosition } from '../core';
import '../style/image.less';
declare class Image extends ItemModel {
    _wrapper: HTMLElement | null;
    _image: HTMLImageElement | null | undefined;
    _viewPosition: ISPosition | null;
    _loading: IElement | false;
    _error: IElement | false;
    _src: string;
    _active: boolean;
    constructor({ container, style, className, src, viewPosition, loading, error, active, }: IImageOptions);
    getElement(): HTMLElement | null;
    getImageElement(): HTMLImageElement | null;
    setActive(active?: boolean): void;
    setSrc(src?: string): void;
    setViewPosition(viewPosition?: ISPosition): void;
    load(): void;
    resize(): void;
    destory(): void;
}
export type IImageOptions = {
    container: Element;
    style?: ICSSStyle;
    className?: string;
    src?: string;
    viewPosition?: ISPosition;
    loading?: IElement | false;
    error?: IElement | false;
    active?: boolean;
};
export default Image;
