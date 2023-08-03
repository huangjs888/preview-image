"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindEvents;
var _gesture = _interopRequireDefault(require("@huangjs888/gesture"));
var _rotate = _interopRequireDefault(require("./rotate"));
var _scale = _interopRequireDefault(require("./scale"));
var _swipe = _interopRequireDefault(require("./swipe"));
var _longTap = _interopRequireDefault(require("./longTap"));
var _singleTap = _interopRequireDefault(require("./singleTap"));
var _doubleTap = _interopRequireDefault(require("./doubleTap"));
var _pointerStart = _interopRequireDefault(require("./pointerStart"));
var _pointerMove = _interopRequireDefault(require("./pointerMove"));
var _pointerEnd = _interopRequireDefault(require("./pointerEnd"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 14:42:44
 * @Description: ******
 */

function bindEvents(element) {
  // 绑定手势
  var gesture = new _gesture.default(element);
  gesture.on('pointerStart', _pointerStart.default.bind(this));
  gesture.on('pointerMove', _pointerMove.default.bind(this));
  gesture.on('pointerEnd', _pointerEnd.default.bind(this));
  gesture.on('swipe', _swipe.default.bind(this));
  gesture.on('longTap', _longTap.default.bind(this));
  gesture.on('singleTap', _singleTap.default.bind(this));
  gesture.on('doubleTap', _doubleTap.default.bind(this));
  gesture.on('rotate', _rotate.default.bind(this));
  gesture.on('scale', _scale.default.bind(this));
  return gesture;
}