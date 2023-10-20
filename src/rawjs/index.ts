/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 10:13:46
 * @Description: ******
 */

import Gallery from './gallery';
import Image from './image';
import { type ISPosition } from '../core';

export * from '../core';

export * from './gallery';

export * from './image';

export { Gallery, Image };

export const previewImage = function previewImage({
  urls = [],
  current = '',
  clickPosition,
  onContextMenu,
}: {
  urls?: string[];
  current?: string;
  clickPosition?: ISPosition;
  onContextMenu?: () => void;
} = {}) {
  const index = urls.indexOf(current);
  const gallery = new Gallery({
    current: index,
    imageUrls: urls,
    destroyOnClose: true,
    enableSwipeClose: true,
    onClose: () => {
      gallery.close();
    },
    clickPosition,
    onContextMenu,
  });
  gallery.open();
};
