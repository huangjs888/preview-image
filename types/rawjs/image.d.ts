import { type ICSSStyle, type IElement } from '@huangjs888/lightdom';
import { ItemModel, type ISPBox } from '../core';
import '../style/image.less';
declare class Image extends ItemModel {
    _wrapper: HTMLElement | null;
    _image: HTMLImageElement | null | undefined;
    _vspBox: ISPBox | null;
    _loading: IElement | false;
    _error: IElement | false;
    _src: string;
    _active: boolean;
    constructor({ container, style, className, src, vspBox, loading, error, active, }: IImageOptions);
    getElement(): HTMLElement | null;
    getImageElement(): HTMLImageElement | null;
    setActive(active?: boolean): void;
    setSrc(src?: string): void;
    setVSPBox(vspBox?: ISPBox): void;
    load(): void;
    resize(): void;
    destory(): void;
}
export type IImageOptions = {
    container: Element;
    style?: ICSSStyle;
    className?: string;
    src?: string;
    vspBox?: ISPBox;
    loading?: IElement | false;
    error?: IElement | false;
    active?: boolean;
};
export default Image;
