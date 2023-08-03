"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = swipe;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:41:16
 * @Description: ******
 */

function swipe(e) {
  var _this = this;
  if (this._isClose) {
    return;
  }
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (this._moveTarget === 'inside' && entity) {
      if (entity.isTransitioning()) {
        return;
      }
      var _e$velocity = e.velocity,
        velocity = _e$velocity === void 0 ? 0 : _e$velocity,
        swipeComputed = e.swipeComputed;
      if (velocity > 0 && swipeComputed) {
        var transition = function transition(key, xySwipe, xyBounce, option) {
          if (_this instanceof _gallery.default) {
            var translate = -_this._activeIndex * _this.getItemSize();
            // 不等于0，表示未达到边界
            if (xySwipe !== 0) {
              var _option = option(xySwipe + xyBounce),
                _duration = _option.duration,
                easing = _option.easing;
              // 因为是两个过渡，这里同时触发，分别在before里设置先后发生，使两个过度连贯进行
              Promise.all([
              // 图片走到边界距离xySwipe
              entity.transitionRun((0, _defineProperty2.default)({}, key, (entity.getTransform()[key] || 0) + xySwipe), {
                duration: _duration,
                easing: easing,
                before: function before(progress) {
                  // 先走 xySwipe ，走完之后，后面就一直 1
                  // 根据总路程 xySwipe + xyBounce，计算走 xySwipe 实际的进度
                  var s = Math.abs(xySwipe);
                  var sb = Math.abs(xySwipe + xyBounce);
                  return Math.min(sb * progress, s) / s;
                }
              }),
              // 外部走damping距离xyBounce
              _this.transitionRun(_this._translate + xyBounce, {
                duration: _duration,
                easing: easing,
                before: function before(progress) {
                  // 后走 xyBounce ，没走之前，前面一直 0
                  // 根据总路程 xySwipe + xyBounce，计算走 xyBounce 的实际的进度
                  var s = Math.abs(xySwipe);
                  var b = Math.abs(xyBounce);
                  var sb = Math.abs(xySwipe + xyBounce);
                  return Math.max(sb * progress - s, 0) / b;
                }
              })]).then(function () {
                // 外部归位
                if (_this instanceof _gallery.default) {
                  _this.transitionRun(translate);
                }
              });
            } else {
              // 已经Damping的部分，即超出部分的距离
              var diff = _this._translate - translate;
              var sign = diff > 0 ? 1 : -1;
              // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
              var xyMove = Math.max((xyBounce - diff) * sign, 0) * sign;
              var _option2 = option(xyMove),
                _duration2 = _option2.duration,
                _easing = _option2.easing;
              if (xyMove === 0) {
                // 外部直接归位
                _this.transitionRun(translate);
              } else {
                _this.transitionRun(_this._translate + xyMove, {
                  duration: _duration2,
                  easing: _easing
                }).then(function () {
                  // 外部归位
                  if (_this instanceof _gallery.default) {
                    _this.transitionRun(translate);
                  }
                });
              }
            }
          }
        };
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        var _swipeComputed = swipeComputed(0.003),
          duration = _swipeComputed.duration,
          stretchX = _swipeComputed.stretchX,
          stretchY = _swipeComputed.stretchY;
        if (this._direction === 'vertical') {
          var xRange = entity.getXTranslation();
          // 竖向的时候固定x
          if (!(xRange[0] === 0 && xRange[1] === 0)) {
            entity.swipeBounce(duration, stretchX, 'x');
          }
          entity.swipeBounce(duration, stretchY, 'y', transition);
        } else {
          entity.swipeBounce(duration, stretchX, 'x', transition);
          var yRange = entity.getYTranslation();
          // 横向的时候固定y
          if (!(yRange[0] === 0 && yRange[1] === 0)) {
            entity.swipeBounce(duration, stretchY, 'y');
          }
        }
      }
      return;
    }
    if (this._moveTarget === 'closures') {
      if (entity && entity.isTransitioning()) {
        return;
      }
      // 如果滑动方向是向下的或向右的，执行关闭操作
      if (this._swipeClose && e.direction === 'Down') {
        this.close();
        this._moveTarget = 'none';
      }
      return;
    }
    var size = this.getItemSize();
    var index = size === 0 ? 0 : -this._translate / this.getItemSize();
    this.slide(index > this._activeIndex ? Math.ceil(index) : Math.floor(index));
    // @@@2： 此处逻辑和touchstart手势函数里 @@@1 逻辑是处理里同一个问题（二选一，微信用的是@@@1效果）
    // 这里是在真正要slide到上(下)一张时恢复到边界，那里是在手指放上去时直接恢复到边界
    // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
    // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
    // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
    /* if (entity) {
        // 这里在slide时把内部图片reset
        entity.reset();
      } */
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      var _e$velocity2 = e.velocity,
        _velocity = _e$velocity2 === void 0 ? 0 : _e$velocity2,
        _swipeComputed2 = e.swipeComputed;
      if (_velocity > 0 && _swipeComputed2) {
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        var _swipeComputed3 = _swipeComputed2(0.003),
          _duration3 = _swipeComputed3.duration,
          _stretchX = _swipeComputed3.stretchX,
          _stretchY = _swipeComputed3.stretchY;
        _entity.swipeBounce(_duration3, _stretchX, 'x');
        _entity.swipeBounce(_duration3, _stretchY, 'y');
      }
    }
  }
}