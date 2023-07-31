"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = touchEnd;
var _gallery = _interopRequireDefault(require("../gallery"));
var _dom = require("../dom");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 13:56:53
 * @Description: ******
 */

function touchEnd(e) {
  var toucheIds = e.toucheIds,
    point = e.point;
  if (toucheIds.length === 0) {
    // 抬起最后一根手指时，重置_fgBehavior
    this._fgBehavior = 0;
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    if (this instanceof _gallery.default) {
      // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
      if (this._moveTarget === 'outside') {
        var size = this.getItemSize();
        var index = size === 0 ? 0 : -this._translate / this.getItemSize();
        this.slide(Math.round(index));
      }
    }
    return;
  }
  // entity.reset内部会做isTransitioning的判断
  // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否取消动画
  var cancel = !!this._gesture && typeof this._gesture._rotateAngle !== 'number';
  if (this instanceof _gallery.default) {
    // 因为下面需要用到this._moveTarget值，所以这里暂存一下值，不然提前重置了
    var target = this._moveTarget;
    if (toucheIds.length === 0) {
      // 抬起最后一根手指时，重置_moveTarget
      this._moveTarget = 'none';
    }
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity,
      wrapper = _ref.wrapper;
    if (target === 'closures') {
      var ele = this.container;
      if (ele) {
        (0, _dom.setStyle)(ele, {
          background: 'rgba(0,0,0,1)',
          transition: 'all 0.4s'
        });
        if (wrapper) {
          (0, _dom.setStyle)(wrapper, {
            transform: 'translate(0px,0px) scale(1)',
            transition: 'transform 0.4s'
          });
        }
        var transitionend = function transitionend(ee) {
          if (ee.target === ele && ee.propertyName.indexOf('background') !== -1) {
            ele.removeEventListener('transitionend', transitionend);
            (0, _dom.setStyle)(ele, {
              transition: 'none'
            });
            if (wrapper) {
              (0, _dom.setStyle)(wrapper, {
                overflow: 'hidden',
                transition: 'none'
              });
            }
          }
        };
        ele.addEventListener('transitionend', transitionend);
      }
      return;
    }
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.reset(point, cancel);
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
      // entity.reset内部会做isTransitioning的判断
      // 曲线救国 3：这里使用_rotateAngle是不是数字来判断是否为双指
      _entity.reset(point, cancel);
    }
  }
}