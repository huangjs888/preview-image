import Gallery from './gallery';
import Image from './image';
import { type ISPBox } from '../core';
export * from '../core';
export * from './gallery';
export * from './image';
export { Gallery, Image };
export default function previewImage({ urls, current, showMenu, thumbnail, }?: {
    urls?: string[];
    current?: string;
    showMenu?: () => void;
    thumbnail?: ISPBox;
}): void;
