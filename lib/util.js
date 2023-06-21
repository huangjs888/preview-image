"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixOption = fixOption;
exports.getAngle = getAngle;
exports.getCenter = getCenter;
exports.getDirection = getDirection;
exports.getDistance = getDistance;
exports.getVector = getVector;
exports.getVelocity = getVelocity;
exports.isTouchable = isTouchable;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-20 10:49:25
 * @Description: ******
 */

function fixOption(value, defaultValue, minVal) {
  return typeof value !== 'number' || value < minVal ? defaultValue : value;
}
function isTouchable(ele) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}
function getDistance(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 2),
    x0 = _ref3[0],
    y0 = _ref3[1];
  var _ref4 = (0, _slicedToArray2.default)(_ref2, 2),
    x1 = _ref4[0],
    y1 = _ref4[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }
  return 0;
}
function getAngle(_ref5, _ref6) {
  var _ref7 = (0, _slicedToArray2.default)(_ref5, 2),
    x0 = _ref7[0],
    y0 = _ref7[1];
  var _ref8 = (0, _slicedToArray2.default)(_ref6, 2),
    x1 = _ref8[0],
    y1 = _ref8[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  }
  return 0;
}
function getCenter(_ref9, _ref10) {
  var _ref11 = (0, _slicedToArray2.default)(_ref9, 2),
    x0 = _ref11[0],
    y0 = _ref11[1];
  var _ref12 = (0, _slicedToArray2.default)(_ref10, 2),
    x1 = _ref12[0],
    y1 = _ref12[1];
  var ok0 = typeof x0 === 'number' && typeof y0 === 'number';
  var ok1 = typeof x1 === 'number' && typeof y1 === 'number';
  return !ok0 && !ok1 ? [0, 0] : ok0 && !ok1 ? [x0, y0] : !ok0 && ok1 ? [x1, y1] : [(x0 + x1) / 2, (y0 + y1) / 2];
}
function getDirection(_ref13, _ref14) {
  var _ref15 = (0, _slicedToArray2.default)(_ref13, 2),
    x0 = _ref15[0],
    y0 = _ref15[1];
  var _ref16 = (0, _slicedToArray2.default)(_ref14, 2),
    x1 = _ref16[0],
    y1 = _ref16[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    var x = x0 - x1;
    var y = y0 - y1;
    if (x !== y) {
      return Math.abs(x) >= Math.abs(y) ? x0 - x1 > 0 ? 'Left' : 'Right' : y0 - y1 > 0 ? 'Up' : 'Down';
    }
  }
  return 'None';
}
function getVelocity(deltaTime, distance) {
  if (typeof distance !== 'number' || distance === 0 || typeof deltaTime !== 'number' || deltaTime === 0) {
    return 0;
  }
  return distance / deltaTime;
}

//根据数值，与水平夹角，计算x和y的分量值
function getVector(value, angle) {
  if (typeof value !== 'number' || typeof angle !== 'number') {
    return [0, 0];
  }
  var rad = angle * Math.PI / 180;
  return [value * Math.cos(rad), value * Math.sin(rad)];
}