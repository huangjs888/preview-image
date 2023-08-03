"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _loadImage = _interopRequireDefault(require("@huangjs888/load-image"));
var _entity = _interopRequireDefault(require("./entity"));
var _dom = require("./dom");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _default(image) {
  var _ref = image || {},
    wrapper = _ref.wrapper,
    entity = _ref.entity,
    url = _ref.url,
    options = _ref.options;
  // 未定义表示还未加载过图片，null表示已经加载了，只是还没加载完或加载失败
  if (typeof entity === 'undefined') {
    image.entity = null;
    return (0, _loadImage.default)(url).then(function (ele) {
      image.entity = new _entity.default(_objectSpread({
        element: ele
      }, options));
      image.width = ele.naturalWidth;
      image.height = ele.naturalHeight;
      wrapper.innerHTML = '';
      wrapper.appendChild(ele);
      return true;
    }).catch(function () {
      // 这里可以加一个错误的提示
      wrapper.innerHTML = '';
      (0, _dom.createError)(wrapper);
    });
  }
  return Promise.resolve();
}