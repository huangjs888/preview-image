import Gallery from './gallery';
import Image from './image';
import { type IBBox } from '../core';
export * from './gallery';
export * from './image';
export { Gallery, Image };
export default function previewImage({ urls, current, showMenu, originBox, }?: {
    urls?: string[];
    current?: string;
    showMenu?: () => void;
    originBox?: IBBox;
}): void;
