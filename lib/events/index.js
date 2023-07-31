"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindGesture;
var _gesture = _interopRequireDefault(require("@huangjs888/gesture"));
var _swipe = _interopRequireDefault(require("./swipe"));
var _longTap = _interopRequireDefault(require("./longTap"));
var _singleTap = _interopRequireDefault(require("./singleTap"));
var _doubleTap = _interopRequireDefault(require("./doubleTap"));
var _touchStart = _interopRequireDefault(require("./touchStart"));
var _touchMove = _interopRequireDefault(require("./touchMove"));
var _touchEnd = _interopRequireDefault(require("./touchEnd"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-31 14:26:46
 * @Description: ******
 */

function bindGesture(element) {
  // 绑定手势
  var gesture = new _gesture.default(element);
  if (gesture.done()) {
    gesture.on('touchStart', _touchStart.default.bind(this));
    gesture.on('touchMove', _touchMove.default.bind(this));
    gesture.on('doubleTap', _doubleTap.default.bind(this));
    gesture.on('swipe', _swipe.default.bind(this));
    gesture.on('longTap', _longTap.default.bind(this));
    gesture.on('singleTap', _singleTap.default.bind(this));
    gesture.on('touchEnd', _touchEnd.default.bind(this));
  }
  return gesture;
}