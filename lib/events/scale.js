"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scale;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 16:23:15
 * @Description: ******
 */

function scale(e) {
  if (this._isClose) {
    return;
  }
  // 只有鼠标操作才可以，touch操作被放入到pointerMove中了
  if (this._gesture && this._gesture.isTouch()) {
    return;
  }
  // const point = e.getPoint();
  var _e$scale = e.scale,
    k = _e$scale === void 0 ? 1 : _e$scale;
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
        // 表示停止缩放，应该重置
        if (isNaN(k)) {
          entity.resetBounce();
        } else {
          entity.moveBounce(0, k, 0, 0 /* , point */);
        }
      }
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      // 表示停止缩放，应该重置
      if (isNaN(k)) {
        _entity.resetBounce();
      } else {
        _entity.moveBounce(0, k, 0, 0 /* , point */);
      }
    }
  }
}