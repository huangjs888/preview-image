/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 11:28:19
 * @Description: ******
 */

import Gallery from '../gallery';
import SingleGallery from '../singleGallery';

export default function singleTap(this: Gallery | SingleGallery) {
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.singleTap === 'function') {
      this._events.singleTap();
    }
  } else {
    const { entity } = this._image || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.singleTap === 'function') {
      this._events.singleTap();
    }
  }
}
