"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = singleTap;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:21:03
 * @Description: ******
 */

function singleTap() {
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
    if (typeof this._press === 'function') {
      this._press();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (typeof this._press === 'function') {
      this._press();
    }
  }
}