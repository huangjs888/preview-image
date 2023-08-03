/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-02 10:54:32
 * @Description: ******
 */
import Gallery, { type SOption } from './gallery';
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
} & SOption) {
  const index = !current ? 0 : urls.indexOf(current);
  const gallery = new Gallery({
    imageUrls: urls,
    activeIndex: index,
    longPress: () => {
      typeof showMenu === 'function' && showMenu();
    },
    press: () => {
      gallery.close();
    },
    ...restOption,
  });
  gallery.open();
}
