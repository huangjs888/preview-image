/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 17:33:11
 * @Description: ******
 */
import Gallery from './gallery';
import SingleGallery from './singleGallery';
import Entity from './entity';
import loadImage from './image';

export * from './gallery';

export * from './singleGallery';

export * from './entity';

export * from './image';

export { Gallery, SingleGallery, Entity, loadImage };

export default function previewImage({
  urls,
  current,
  showMenu,
  ...restOption
}: {
  urls: string[];
  current?: string;
  showMenu?: () => void;
  direction?: 'horizontal' | 'vertical';
  itemGap?: number;
  hasIndicator?: boolean;
  isLazy?: boolean;
}) {
  const index = !current ? 0 : urls.indexOf(current);
  const gallery = new Gallery({
    imageUrls: urls,
    activeIndex: index,
    ...restOption,
    longTap: () => {
      typeof showMenu === 'function' && showMenu();
    },
    singleTap: () => {
      gallery.close();
    },
    downSwipe: () => {
      gallery.close();
      // 阻止downSwipe后效果回弹
      return true;
    },
  });
  gallery.open();
}
