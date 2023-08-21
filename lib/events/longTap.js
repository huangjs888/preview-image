"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = longTap;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:33
 * @Description: ******
 */

function longTap() {
  if (this._isClose) {
    return;
  }
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  }
}