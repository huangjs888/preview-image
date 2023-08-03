/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:20:49
 * @Description: ******
 */

import Gallery from '../gallery';
import SingleGallery from '../singleGallery';

export default function longTap(this: Gallery | SingleGallery) {
  if (this._isClose) {
    return;
  }
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  } else {
    const { entity } = this._image || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  }
}
