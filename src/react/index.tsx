/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 09:59:50
 * @Description: ******
 */

import React from 'react';
import Gallery, { type IGalleryProps } from './gallery';
import Image, { type IImageProps } from './image';
import Portal, { type IPortalProps, type IContainer } from './portal';
import type { IBBox } from '../core';

export { Gallery, Image, Portal, IGalleryProps, IImageProps, IPortalProps, IContainer };

export default function PreviewImage({
  open = false,
  urls = [],
  current = '',
  onClose,
  showMenu,
  originBox,
}: {
  open?: boolean;
  onClose?: () => void;
  urls?: string[];
  current?: string;
  showMenu?: () => void;
  originBox?: IBBox;
}) {
  const index = urls.indexOf(current);
  return (
    <Gallery
      open={open}
      current={index}
      imageUrls={urls}
      enableSwipeClose={true}
      destroyOnClose={true}
      onPopupMenu={showMenu}
      onClose={onClose}
      originBox={originBox}
    />
  );
}
