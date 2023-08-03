"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBackdrop = createBackdrop;
exports.createContainer = createContainer;
exports.createError = createError;
exports.createIndicator = createIndicator;
exports.createItemIndicator = createItemIndicator;
exports.createItemWrapper = createItemWrapper;
exports.createLoading = createLoading;
exports.createSubstance = createSubstance;
exports.setStyle = setStyle;
var _svgIcon = require("./svgIcon");
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:24:30
 * @Description: ******
 */

var autoPxReg = /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
function setStyle(ele, css) {
  if (ele) {
    var cssText = '';
    Object.keys(css).forEach(function (k) {
      var key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      if (css[k] !== 0 && !css[k]) {
        // 删除
        ele.style.setProperty(key, '');
      } else {
        var suffix = typeof css[k] === 'number' && /^[a-z]/.test(key) && autoPxReg.test("-".concat(key)) ? 'px' : '';
        var val = "".concat(css[k]).concat(suffix);
        cssText += "".concat(key, ":").concat(val, ";");
      }
    });
    if (cssText) {
      ele.style.cssText += cssText;
    }
  }
  return ele;
}
function createContainer(element) {
  var ele;
  try {
    if (typeof element === 'string') {
      ele = document.querySelector(element);
    } else {
      ele = element;
    }
  } catch (e) {
    ele = null;
  }
  if (!ele || !(ele instanceof HTMLElement)) {
    ele = setStyle(document.createElement('div'), {
      position: 'fixed',
      left: '0px',
      top: '0px',
      zIndex: '9999',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'none'
    });
    document.body.appendChild(ele);
  } else {
    setStyle(ele, {
      display: 'none'
    });
    ele.innerHTML = '';
  }
  return ele;
}
function createSubstance(isVertical, element) {
  var substance = setStyle(document.createElement('div'), {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row'
  });
  element.appendChild(substance);
  return substance;
}
function createBackdrop(background, element) {
  var backdrop = setStyle(document.createElement('div'), {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: background
  });
  element.appendChild(backdrop);
  return backdrop;
}
function createIndicator(isVertical, hasIndicator, element) {
  var indicator = null;
  if (hasIndicator) {
    indicator = setStyle(document.createElement('div'), {
      position: 'absolute',
      bottom: isVertical ? '0px' : '16px',
      right: isVertical ? '16px' : 'auto',
      width: isVertical ? 'auto' : '100%',
      height: isVertical ? '100%' : 'auto',
      display: 'none',
      flexDirection: isVertical ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center'
    });
    element.appendChild(indicator);
  }
  return indicator;
}
function createItemIndicator(isVertical, element) {
  var item = null;
  if (element) {
    item = setStyle(document.createElement('span'), {
      borderRadius: '100%',
      width: 7,
      height: 7,
      display: 'inline-block',
      margin: isVertical ? '5px 0' : '0 5px',
      background: '#fff',
      opacity: 0.6
    });
    element.appendChild(item);
  }
  return item;
}
function createItemWrapper(isFirst, isVertical, hasLoading, itemGap, element) {
  var wrapper = setStyle(document.createElement('div'), {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
    marginTop: isVertical && !isFirst ? itemGap : 0,
    marginLeft: isVertical || isFirst ? 0 : itemGap
  });
  if (hasLoading) {
    createLoading(wrapper);
  }
  element.appendChild(wrapper);
  return wrapper;
}
function createLoading(element) {
  var loading = setStyle(document.createElement('span'), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    width: 32,
    height: 32,
    display: 'inline-block'
  });
  loading.innerHTML = _svgIcon.loadingIcon;
  element.appendChild(loading);
}
function createError(element) {
  var error = setStyle(document.createElement('div'), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%,-50%,0)',
    width: '100%',
    color: '#fff',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.88
  });
  error.innerHTML = "\n    <span style=\"width: 72px;height: 72px;\">\n      ".concat(_svgIcon.errorIcon, "\n    </span>\n    <span style=\"margin-top:16px;\">\u56FE\u7247\u52A0\u8F7D\u5931\u8D25</span>\n  ");
  element.appendChild(error);
}