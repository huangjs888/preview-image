"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pointerStart;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _utils = require("../entity/utils");
var _gallery = _interopRequireDefault(require("../gallery"));
var _excluded = ["x", "y"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function pointerStart(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointers.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  var stopCount = 0;
  if (this instanceof _gallery.default) {
    stopCount += this.transitionCancel();
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    var length = (this._images || []).length;
    if (entity) {
      stopCount += entity.transitionCancel();
      // @@@1： 此处逻辑和swipe手势函数里 @@@2 逻辑是处理同一个问题（二选一，微信用的是这个效果）
      // 这里是在手指放上去时直接恢复到边界，那边是在真正要slide到上(下)一张时恢复到边界
      // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
      // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
      // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
      var _entity$getTransform = entity.getTransform(),
        _entity$getTransform$ = _entity$getTransform.x,
        tx = _entity$getTransform$ === void 0 ? 0 : _entity$getTransform$,
        _entity$getTransform$2 = _entity$getTransform.y,
        ty = _entity$getTransform$2 === void 0 ? 0 : _entity$getTransform$2,
        rest = (0, _objectWithoutProperties2.default)(_entity$getTransform, _excluded);
      var _entity$getTranslatio = entity.getTranslation(),
        _entity$getTranslatio2 = (0, _slicedToArray2.default)(_entity$getTranslatio, 2),
        xRange = _entity$getTranslatio2[0],
        yRange = _entity$getTranslatio2[1];
      // 是否是边缘图片
      var isFirst = this._activeIndex === 0;
      var isLast = this._activeIndex === length - 1;
      if (this._direction === 'vertical') {
        if (!(0, _utils.isBetween)(tx, xRange) && (ty <= yRange[0] && !isLast || ty >= yRange[1] && !isFirst)) {
          // 非边缘图片，且y方向超出边界，x方向也超出边界的，x给予恢复到边界
          entity.transitionRun(_objectSpread({
            x: (0, _utils.between)(tx, xRange),
            y: ty
          }, rest), {
            duration: 0
          });
        }
      } else {
        if (!(0, _utils.isBetween)(ty, yRange) && (tx <= xRange[0] && !isLast || tx >= xRange[1] && !isFirst)) {
          // 非边缘图片，且x方向超出边界，y方向也超出边界的，y给予恢复到边界
          entity.transitionRun(_objectSpread({
            x: tx,
            y: (0, _utils.between)(ty, yRange)
          }, rest), {
            duration: 0
          });
        }
      }
    }
  } else {
    // 取消动画
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      stopCount += _entity.transitionCancel();
    }
  }
  if (stopCount > 0 && this._gesture) {
    // 如果有动画停止，则阻止所有单指点击相关事件（就像是移动了一下一样）
    // 曲线救国：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPointer = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
}