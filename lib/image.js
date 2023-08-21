"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = _default;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _loadImage = _interopRequireDefault(require("@huangjs888/load-image"));
var _entity = _interopRequireDefault(require("./entity"));
var _dom = require("./dom");
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 17:26:59
 * @Description: ******
 */

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
      image.entity = new _entity.default((0, _extends2.default)({
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
      return false;
    });
  }
  return _promise.default.resolve();
}