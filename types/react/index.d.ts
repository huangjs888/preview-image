import React from 'react';
import Gallery from './gallery';
import Image from './image';
import Portal from './portal';
import type { ISPosition } from '../core';
export * from '../core';
export * from './gallery';
export * from './image';
export * from './portal';
export { Gallery, Image, Portal };
export declare const PreviewImage: ({ open, urls, current, onClose, clickPosition, onContextMenu, }: {
    open?: boolean | undefined;
    onClose?: (() => void) | undefined;
    urls?: string[] | undefined;
    current?: string | undefined;
    clickPosition?: ISPosition | undefined;
    onContextMenu?: (() => void) | undefined;
}) => React.JSX.Element;
