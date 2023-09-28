import React from 'react';
import Gallery, { type IGalleryProps } from './gallery';
import Image, { type IImageProps } from './image';
import Portal, { type IPortalProps, type IContainer } from './portal';
import type { IBBox } from '../core';
export { Gallery, Image, Portal, IGalleryProps, IImageProps, IPortalProps, IContainer };
export default function PreviewImage({ open, urls, current, onClose, showMenu, originBox, }: {
    open?: boolean;
    onClose?: () => void;
    urls?: string[];
    current?: string;
    showMenu?: () => void;
    originBox?: IBBox;
}): React.JSX.Element;
