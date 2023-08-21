import Gallery, { type SOption } from './gallery';
import Picture from './picture';
import Entity from './entity';
import loadImage from './image';
export * from './gallery';
export * from './picture';
export * from './entity';
export * from './image';
export { Gallery, Picture, Entity, loadImage };
export default function previewImage({ urls, current, showMenu, ...restOption }: {
    urls: string[];
    current?: string;
    showMenu?: () => void;
} & SOption): void;
