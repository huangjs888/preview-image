"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pointerMove;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _damping = require("@huangjs888/damping");
var _utils = require("../entity/utils");
var _gallery = _interopRequireDefault(require("../gallery"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:36:40
 * @Description: ******
 */

var minScale = 0.3; // swipeClose下拉最小缩放比例
var minOpacity = 0.01; // swipeClose下拉最小透明度
var isRightDown = function isRightDown(direction, _ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 2),
    x0 = _ref3[0],
    y0 = _ref3[1];
  var _ref4 = (0, _slicedToArray2.default)(_ref2, 2),
    x1 = _ref4[0],
    y1 = _ref4[1];
  if (direction === 'vertical') {
    return Math.abs(x0 - x1) > 4 * Math.abs(y0 - y1) && x0 - x1 <= 0;
  } else {
    return Math.abs(y0 - y1) > 4 * Math.abs(x0 - x1) && y0 - y1 <= 0;
  }
};
function pointerMove(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointer.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  this._onePoint = e.pointer.length === 1 || this._fgBehavior === 1;
  var _e$point = (0, _slicedToArray2.default)(e.point, 3),
    _ = _e$point[0],
    point0 = _e$point[1],
    point = _e$point[2];
  var direction = e.direction,
    _e$angle = e.angle,
    angle = _e$angle === void 0 ? 0 : _e$angle,
    _e$scale = e.scale,
    scale = _e$scale === void 0 ? 1 : _e$scale,
    _e$deltaX = e.deltaX,
    deltaX = _e$deltaX === void 0 ? 0 : _e$deltaX,
    _e$deltaY = e.deltaY,
    deltaY = _e$deltaY === void 0 ? 0 : _e$deltaY;
  if (this instanceof _gallery.default) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref5 = this._images && this._images[this._activeIndex] || {},
      entity = _ref5.entity,
      wrapper = _ref5.wrapper;
    var length = (this._images || []).length;
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      var _entity$getTransform = entity.getTransform(),
        _entity$getTransform$ = _entity$getTransform.x,
        tx = _entity$getTransform$ === void 0 ? 0 : _entity$getTransform$,
        _entity$getTransform$2 = _entity$getTransform.y,
        ty = _entity$getTransform$2 === void 0 ? 0 : _entity$getTransform$2;
      var _entity$getTranslatio = entity.getTranslation(),
        _entity$getTranslatio2 = (0, _slicedToArray2.default)(_entity$getTranslatio, 2),
        xRange = _entity$getTranslatio2[0],
        yRange = _entity$getTranslatio2[1];
      // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
      var fixedX = xRange[0] === 0 && xRange[1] === 0;
      // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
      var fixedY = yRange[0] === 0 && yRange[1] === 0;
      if (this._moveTarget === 'none') {
        // 多指或者不满足以下条件的，则做图片操作
        this._moveTarget = 'inside';
        if (this._onePoint) {
          // 是否是边缘图片
          var isFirst = this._activeIndex === 0;
          var isLast = this._activeIndex === length - 1;
          var rightDown = isRightDown(this._direction, point0, point);
          // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
          if (this._direction === 'vertical') {
            if (this._swipeClose && tx >= xRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果x的范围是[0,0]，则判断上下移动，直接根据deltaY的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              var upMove = fixedX ? deltaY < 0 : direction === 'Up';
              var downMove = fixedX ? deltaY > 0 : direction === 'Down';
              // 如果图片上边抵达或超出上边界，仍然向下滑动（不是第一张图）
              // 或者下边抵达或超出下边界，仍然向上滑动（不是最后一张图），则为swiper，反之为图片操作
              // 因为第一张图片和最后一张都是边缘图片（边缘图片向两边swipe时，是没有上一张或下一张的），无需外部swipe操作，直接走内部图片操作
              if (ty <= yRange[0] && upMove && !isLast || ty >= yRange[1] && downMove && !isFirst) {
                this._moveTarget = 'outside';
              }
            }
          } else {
            if (this._swipeClose && ty >= yRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果y的范围是[0,0]，则判断左右移动，直接根据deltaX的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              var leftMove = fixedY ? deltaX < 0 : direction === 'Left';
              var rightMove = fixedY ? deltaX > 0 : direction === 'Right';
              // 如果图片左边抵达或超出左边界，仍然向右滑动（不是第一张图）
              // 或者右边抵达或超出右边界，仍然向左滑动（不是最后一张图），则为swiper操作，反之为图片操作
              if (tx <= xRange[0] && leftMove && !isLast || tx >= xRange[1] && rightMove && !isFirst) {
                this._moveTarget = 'outside';
              }
            }
          }
        }
      }
      // 进入内部图片操作
      if (this._moveTarget === 'inside') {
        var translate = -this._activeIndex * this.getItemSize();
        // 计算出外部swiper移动的原始距离
        var diff = (0, _damping.revokeDamping)(this._translate - translate, {
          max: this.getItemSize()
        });
        var _deltaX = deltaX;
        var _deltaY = deltaY;
        // 把swiper移动的原始距离加进去
        if (this._direction === 'vertical') {
          _deltaY += diff;
        } else {
          _deltaX += diff;
        }
        if (this._onePoint) {
          var _delta = 0;
          if (this._direction === 'vertical') {
            _delta = _deltaY;
            // 竖向的时候固定x
            _deltaX = fixedX ? 0 : _deltaX;
            // 内部图片，最多移动到边界
            _deltaY = (0, _utils.between)(_deltaY + ty, yRange) - ty;
            // 超出部分由外部swiper移动
            _delta -= _deltaY;
          } else {
            _delta = _deltaX;
            // 内部图片，最多移动到边界
            _deltaX = (0, _utils.between)(_deltaX + tx, xRange) - tx;
            // 横向的时候固定y
            _deltaY = fixedY ? 0 : _deltaY;
            // 超出部分由外部swiper移动
            _delta -= _deltaX;
          }
          // 内部图片需要移动的距离
          entity.moveBounce(0, 1, _deltaX, _deltaY, point);
          // 外部swiper需要移动的距离
          this.transitionRun(translate + (0, _damping.performDamping)(_delta, {
            max: this.getItemSize()
          }), {
            duration: 0
          });
        } else {
          entity.moveBounce(angle, scale, _deltaX, _deltaY, point);
          if (diff !== 0) {
            // 多指移动前，将外部swiper移动的部分归位（内部image会把swiper的距离加进去）
            this.transitionRun(translate, {
              duration: 0
            });
          }
        }
        return;
      }
    } else {
      if (this._moveTarget === 'none') {
        this._moveTarget = this._swipeClose && isRightDown(this._direction, point0, point) ? 'closures' : 'outside';
      }
    }
    if (this._moveTarget === 'closures') {
      var _e$moveX = e.moveX,
        moveX = _e$moveX === void 0 ? 0 : _e$moveX,
        _e$moveY = e.moveY,
        moveY = _e$moveY === void 0 ? 0 : _e$moveY;
      var _ref6 = this._rectSize || {},
        _ref6$width = _ref6.width,
        width = _ref6$width === void 0 ? 0 : _ref6$width,
        _ref6$height = _ref6.height,
        height = _ref6$height === void 0 ? 0 : _ref6$height,
        _ref6$left = _ref6.left,
        left = _ref6$left === void 0 ? 0 : _ref6$left,
        _ref6$top = _ref6.top,
        top = _ref6$top === void 0 ? 0 : _ref6$top;
      var k = Math.min(Math.max(1 - ((this._direction === 'vertical' ? moveX / width : moveY / height) || 0), minScale), 1);
      var o = minOpacity + (k - minScale) * (1 - minOpacity) / (1 - minScale);
      var x = 0;
      var y = 0;
      if (wrapper) {
        var _x = 0;
        var _y = 0;
        var _k = 1;
        if (wrapper.style.transform) {
          var styles = wrapper.style.transform.split('(');
          var _styles$1$split$0$spl = styles[1].split(')')[0].split(','),
            _styles$1$split$0$spl2 = (0, _slicedToArray2.default)(_styles$1$split$0$spl, 2),
            xs = _styles$1$split$0$spl2[0],
            ys = _styles$1$split$0$spl2[1];
          var ks = styles[2].split(')')[0];
          _x = parseFloat(xs);
          _y = parseFloat(ys);
          _k = parseFloat(ks);
        }
        x = _x + deltaX + (point[0] - (_x + left + width / 2)) * (1 - k / _k);
        y = _y + deltaY + (point[1] - (_y + top + height / 2)) * (1 - k / _k);
      }
      this.originTransform(x, y, k, o, 0);
      return;
    }
    // 非内部图片操作，均是外部swiper操作
    var swiperRange = [(1 - length) * this.getItemSize(), 0];
    // 先把当前值反算出阻尼之前的原值
    var bt = (0, _utils.between)(this._translate, swiperRange);
    var t = bt + (0, _damping.revokeDamping)(this._translate - bt, {
      max: this.getItemSize()
    });
    // 再对总值进行总体阻尼计算
    bt = (0, _utils.between)(t += this._direction === 'vertical' ? deltaY : deltaX, swiperRange);
    t = bt + (0, _damping.performDamping)(t - bt, {
      max: this.getItemSize()
    });
    this.transitionRun(t, {
      duration: 0
    });
  } else {
    var _ref7 = this._image || {},
      _entity = _ref7.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      if (this._onePoint) {
        // 实现单指move
        _entity.moveBounce(0, 1, deltaX, deltaY, point);
      } else {
        // 双指move
        _entity.moveBounce(angle, scale, deltaX, deltaY, point);
      }
    }
  }
}