import Gallery from './gallery';
import Image from './image';
import { type ISPBox } from '../core';
export * from '../core';
export * from './gallery';
export * from './image';
export { Gallery, Image };
export declare const previewImage: ({ urls, current, showMenu, thumbnail, }?: {
    urls?: string[] | undefined;
    current?: string | undefined;
    showMenu?: (() => void) | undefined;
    thumbnail?: ISPBox | undefined;
}) => void;
