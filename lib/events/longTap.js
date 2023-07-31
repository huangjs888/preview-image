"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = longTap;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 10:22:06
 * @Description: ******
 */

function longTap() {
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.longTap === 'function') {
      this._events.longTap();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.longTap === 'function') {
      this._events.longTap();
    }
  }
}