/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 10:35:07
 * @Description: ******
 */

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

export const PreviewImage = function PreviewImage({
  open = false,
  urls = [],
  current = '',
  onClose,
  clickPosition,
  onContextMenu,
}: {
  open?: boolean;
  onClose?: () => void;
  urls?: string[];
  current?: string;
  clickPosition?: ISPosition;
  onContextMenu?: () => void;
}) {
  const index = urls.indexOf(current);
  return (
    <Gallery
      open={open}
      current={index}
      imageUrls={urls}
      enableSwipeClose={true}
      destroyOnClose={true}
      onClose={onClose}
      clickPosition={clickPosition}
      onContextMenu={onContextMenu}
    />
  );
};
