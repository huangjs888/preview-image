"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.popupComputedSize = popupComputedSize;
exports.popupTransform = popupTransform;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _dom = require("./dom");
/*
 * @Author: Huangjs
 * @Date: 2023-08-18 10:01:01
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 10:33:22
 * @Description: ******
 */

function popupTransform(backdrop, wrapper, element, duration) {
  if (duration === void 0) {
    duration = 0;
  }
  if (backdrop.el) {
    if (wrapper.el) {
      var _el = wrapper.el,
        x = wrapper.x,
        y = wrapper.y,
        k = wrapper.k;
      (0, _dom.setStyle)(_el, {
        overflow: 'visible',
        transform: "translate(" + (x || 0) + "px," + (y || 0) + "px) scale(" + (k || 0.01) + ")",
        transition: duration > 0 ? "transform " + duration + "ms" : ''
      });
    }
    if (element.el) {
      var _el2 = element.el,
        w = element.w,
        h = element.h;
      (0, _dom.setStyle)(_el2, {
        width: w || 0,
        height: h || 0,
        objectFit: 'cover',
        transition: duration > 0 ? "width " + duration + "ms, height " + duration + "ms" : ''
      });
    }
    var el = backdrop.el,
      o = backdrop.o;
    (0, _dom.setStyle)(el, {
      opacity: o || 0,
      transition: duration > 0 ? "opacity " + duration + "ms" : ''
    });
    if (duration > 0) {
      return new _promise.default(function (resolve) {
        el.ontransitionend = function (e) {
          // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
          if (e.target === el && e.propertyName === 'opacity') {
            el.ontransitionend = null;
            if (wrapper.el) {
              (0, _dom.setStyle)(wrapper.el, {
                overflow: 'hidden',
                transition: ''
              });
            }
            if (element.el) {
              (0, _dom.setStyle)(element.el, {
                objectFit: '',
                transition: ''
              });
            }
            (0, _dom.setStyle)(el, {
              transition: ''
            });
            resolve();
          }
        };
      });
    }
  }
  return _promise.default.resolve();
}
function popupComputedSize(originRect, continerRect, elementSize) {
  if (originRect && continerRect) {
    var ol = originRect.left,
      ot = originRect.top,
      ow = originRect.width,
      oh = originRect.height;
    var rl = continerRect.left,
      rt = continerRect.top,
      rw = continerRect.width,
      rh = continerRect.height;
    var x = ol + ow / 2 - (rl + rw / 2);
    var y = ot + oh / 2 - (rt + rh / 2);
    var ew = rw;
    var eh = rh;
    if (elementSize) {
      ew = elementSize.width;
      eh = elementSize.height;
    }
    var rat = ew / eh > ow / oh;
    var k = rat ? oh / eh : ow / ew;
    var w = rat ? eh * (ow / oh) : ew;
    var h = rat ? eh : ew / (ow / oh);
    return {
      x: x,
      y: y,
      k: k,
      w: w,
      h: h
    };
  }
  return {
    x: 0,
    y: 0,
    k: 0.01,
    w: 0,
    h: 0
  };
}