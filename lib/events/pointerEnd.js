"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pointerEnd;
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 14:49:48
 * @Description: ******
 */

function pointerEnd(e) {
  if (this._isClose) {
    return;
  }
  var target = '';
  if (this instanceof _gallery.default) {
    target = this._moveTarget;
  }
  if (e.pointer.length === 0) {
    // 抬起最后一根手指时，重置以下参数
    this._fgBehavior = 0;
    if (this instanceof _gallery.default) {
      this._moveTarget = 'none';
    }
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    if (this instanceof _gallery.default) {
      // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
      if (target === 'outside') {
        var size = this.getItemSize();
        var index = size === 0 ? 0 : -this._translate / this.getItemSize();
        this.slide(Math.round(index));
      }
    }
    return;
  }
  var point = e.point[2];
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    if (target === 'closures') {
      this.originTransform(0, 0, 1, 1, 300);
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.resetBounce(point, this._onePoint);
    }
    // 只有在swiper的时候才会下一张
    var _size = this.getItemSize();
    var _index = this._activeIndex;
    if (target === 'outside') {
      _index = _size === 0 ? 0 : -this._translate / this.getItemSize();
    }
    // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断, slide方法里会更新_activeIndex
    this.slide(Math.round(_index));
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      _entity.resetBounce(point, this._onePoint);
    }
  }
}