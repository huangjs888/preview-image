/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-16 15:37:10
 * @Description: ******
 */

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

export const PreviewImage = function PreviewImage({
  open = false,
  urls = [],
  current = '',
  onClose,
  showMenu,
  thumbnail,
}: {
  open?: boolean;
  onClose?: () => void;
  urls?: string[];
  current?: string;
  showMenu?: () => void;
  thumbnail?: ISPBox;
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
      thumbnail={thumbnail}
    />
  );
};
