import React from 'react';
import Gallery from './gallery';
import Image from './image';
import Portal from './portal';
import type { ISPBox } from '../core';
export * from '../core';
export * from './gallery';
export * from './image';
export * from './portal';
export { Gallery, Image, Portal };
export declare const PreviewImage: ({ open, urls, current, onClose, showMenu, thumbnail, }: {
    open?: boolean | undefined;
    onClose?: (() => void) | undefined;
    urls?: string[] | undefined;
    current?: string | undefined;
    showMenu?: (() => void) | undefined;
    thumbnail?: ISPBox | undefined;
}) => React.JSX.Element;
