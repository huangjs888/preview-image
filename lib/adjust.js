"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.between = between;
exports.easeOutQuad = easeOutQuad;
exports.easeOutQuart = easeOutQuart;
exports.execute = execute;
exports.fixDecimal = fixDecimal;
exports.isBetween = isBetween;
exports.performDamping = performDamping;
exports.ratioOffset = ratioOffset;
exports.revokeDamping = revokeDamping;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-21 13:34:18
 * @Description: ******
 */

// 阻尼算法逻辑
function damping(value, friction) {
  var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (value === 0) {
    return 0;
  }
  if (friction <= 0) {
    return 1;
  }
  var v = value || 1;
  var f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return Math.pow(Math.abs(v), f) * (v > 0 ? 1 : -1);
}
// 解决0.1+0.2不等于0.3的问题
function fixDecimal(value) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  var multiple = Math.pow(10, places);
  return Math.round(value * multiple) / multiple;
}
// 算出双击时offset的比例
function ratioOffset(v, k, t) {
  if (v <= (1 - k) / (2 * k)) {
    return -1 / 2;
  } else if (v >= (1 + k - 2 * t) / (2 * k)) {
    return 1 / 2;
  } else {
    return (v - (1 - t) / (2 * k)) / (1 - t / k);
  }
}
// 传入的a是函数，就返回函数执行结果，否则直接返回a
function execute(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return typeof fn === 'function' ? fn.apply(void 0, args) : fn;
}
// 判断v是否在min和max之间
function isBetween(v, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    min = _ref2[0],
    max = _ref2[1];
  return min <= v && v <= max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
function between(v, _ref3, _) {
  var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
    min = _ref4[0],
    max = _ref4[1];
  return Math.max(Math.min(v, max), min);
}
// 跟随手指移动，旋转或缩放时的阻尼算法
function performDamping(v, _ref5) {
  var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
    min = _ref6[0],
    max = _ref6[1];
  var k = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (v < min || v > max) {
    var m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4) : m + damping(v - m, 0.8);
  }
  return v;
}
// 跟随手指移动，旋转或缩放时恢复阻尼算法的原值
function revokeDamping(v, _ref7) {
  var _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
    min = _ref8[0],
    max = _ref8[1];
  var k = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (v < min || v > max) {
    var m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4, true) : m + damping(v - m, 0.8, true);
  }
  return v;
}
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}
function easeOutQuart(t) {
  return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
}