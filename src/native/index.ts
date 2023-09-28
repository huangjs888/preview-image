/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 10:00:11
 * @Description: ******
 */

import Gallery from './gallery';
import Image from './image';
import { type IBBox } from '../core';

export * from './gallery';

export * from './image';

export { Gallery, Image };

export default function previewImage({
  urls = [],
  current = '',
  showMenu,
  originBox,
}: {
  urls?: string[];
  current?: string;
  showMenu?: () => void;
  originBox?: IBBox;
} = {}) {
  const index = urls.indexOf(current);
  const gallery = new Gallery({
    current: index,
    imageUrls: urls,
    originBox,
    destroyOnClose: true,
    enableSwipeClose: true,
    onPopupMenu: showMenu,
    onClose: () => {
      gallery.close();
    },
  });
  gallery.open();
}
