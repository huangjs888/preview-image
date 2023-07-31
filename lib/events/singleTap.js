"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = singleTap;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 11:28:19
 * @Description: ******
 */

function singleTap() {
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.singleTap === 'function') {
      this._events.singleTap();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (this._events && typeof this._events.singleTap === 'function') {
      this._events.singleTap();
    }
  }
}