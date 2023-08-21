"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = doubleTap;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:10
 * @Description: ******
 */

function doubleTap(e) {
  if (this._isClose) {
    return;
  }
  var point = e.getPoint();
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    var translate = -this._activeIndex * this.getItemSize();
    var diff = Math.round(this._translate - translate);
    if (diff === 0) {
      var _ref = this._images && this._images[this._activeIndex] || {},
        entity = _ref.entity;
      if (entity) {
        if (entity.isTransitioning()) {
          return;
        }
        entity.dblScale(point);
      }
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      _entity.dblScale(point);
    }
  }
}