import { ItemModel, type IBBox } from '../core';
import { type ICSSStyle, type IElement } from '../modules/lightdom';
import '../style/image.less';
declare class Image extends ItemModel {
    _wrapper: HTMLElement | null;
    _image: HTMLImageElement | null | undefined;
    _viewBox: IBBox | null;
    _loading: IElement | false;
    _error: IElement | false;
    _src: string;
    _active: boolean;
    constructor({ container, style, className, src, viewBox, loading, error, active, }: IImageOptions);
    getElement(): HTMLElement | null;
    getImageElement(): HTMLImageElement | null;
    setActive(active?: boolean): void;
    setSrc(src?: string): void;
    setViewBox(viewBox?: IBBox): void;
    load(): void;
    resize(): void;
    destory(): void;
}
export type IImageOptions = {
    container: Element;
    style?: ICSSStyle;
    className?: string;
    src?: string;
    viewBox?: IBBox;
    loading?: IElement | false;
    error?: IElement | false;
    active?: boolean;
};
export default Image;
