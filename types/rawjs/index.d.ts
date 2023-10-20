import Gallery from './gallery';
import Image from './image';
import { type ISPosition } from '../core';
export * from '../core';
export * from './gallery';
export * from './image';
export { Gallery, Image };
export declare const previewImage: ({ urls, current, clickPosition, onContextMenu, }?: {
    urls?: string[] | undefined;
    current?: string | undefined;
    clickPosition?: ISPosition | undefined;
    onContextMenu?: (() => void) | undefined;
}) => void;
