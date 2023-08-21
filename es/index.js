const _excluded = ["urls", "current", "showMenu"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 14:27:09
 * @Description: ******
 */

import Gallery from './gallery';
import Picture from './picture';
import Entity from './entity';
import loadImage from './image';
export * from './gallery';
export * from './picture';
export * from './entity';
export * from './image';
export { Gallery, Picture, Entity, loadImage };
export default function previewImage(_ref) {
  let {
      urls,
      current,
      showMenu
    } = _ref,
    restOption = _objectWithoutPropertiesLoose(_ref, _excluded);
  const index = !current ? 0 : urls.indexOf(current);
  const gallery = new Gallery(_extends({
    imageUrls: urls,
    activeIndex: index,
    longPress: () => {
      typeof showMenu === 'function' && showMenu();
    },
    press: () => {
      gallery.close();
    }
  }, restOption));
  gallery.open();
}