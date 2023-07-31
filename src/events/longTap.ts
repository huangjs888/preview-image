/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 10:22:06
 * @Description: ******
 */

import Gallery from '../gallery';
import SingleGallery from '../singleGallery';

export default function longTap(this: Gallery | SingleGallery) {
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.longTap === 'function') {
      this._events.longTap();
    }
  } else {
    const { entity } = this._image || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.longTap === 'function') {
      this._events.longTap();
    }
  }
}
