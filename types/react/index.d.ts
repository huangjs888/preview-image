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
export default function PreviewImage({ open, urls, current, onClose, showMenu, thumbnail, }: {
    open?: boolean;
    onClose?: () => void;
    urls?: string[];
    current?: string;
    showMenu?: () => void;
    thumbnail?: ISPBox;
}): React.JSX.Element;
