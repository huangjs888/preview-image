"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _Object$keys = require("@babel/runtime-corejs3/core-js/object/keys");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
var _exportNames = {
  Gallery: true,
  Picture: true,
  Entity: true,
  loadImage: true
};
exports.default = previewImage;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));
var _gallery = _interopRequireWildcard(require("./gallery"));
exports.Gallery = _gallery.default;
_Object$keys(_gallery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _gallery[key]) return;
  exports[key] = _gallery[key];
});
var _picture = _interopRequireWildcard(require("./picture"));
exports.Picture = _picture.default;
_Object$keys(_picture).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _picture[key]) return;
  exports[key] = _picture[key];
});
var _entity = _interopRequireWildcard(require("./entity"));
exports.Entity = _entity.default;
_Object$keys(_entity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _entity[key]) return;
  exports[key] = _entity[key];
});
var _image = _interopRequireWildcard(require("./image"));
exports.loadImage = _image.default;
_Object$keys(_image).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _image[key]) return;
  exports[key] = _image[key];
});
var _excluded = ["urls", "current", "showMenu"];
/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 14:27:09
 * @Description: ******
 */
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function previewImage(_ref) {
  var urls = _ref.urls,
    current = _ref.current,
    showMenu = _ref.showMenu,
    restOption = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  var index = !current ? 0 : urls.indexOf(current);
  var gallery = new _gallery.default((0, _extends2.default)({
    imageUrls: urls,
    activeIndex: index,
    longPress: function longPress() {
      typeof showMenu === 'function' && showMenu();
    },
    press: function press() {
      gallery.close();
    }
  }, restOption));
  gallery.open();
}