"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContainer = createContainer;
exports.createContent = createContent;
exports.createError = createError;
exports.createIndicator = createIndicator;
exports.createIndicatorItem = createIndicatorItem;
exports.createWrapper = createWrapper;
exports.setStyle = setStyle;
var _svgIcon = require("./svgIcon");
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 16:58:10
 * @Description: ******
 */

var autoPxReg = /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
function setStyle(ele, css) {
  if (ele) {
    Object.keys(css).forEach(function (k) {
      if (typeof css[k] === 'undefined') {
        return;
      }
      var key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      var val = typeof css[k] === 'number' && /^[a-z]/.test(key) && autoPxReg.test("-".concat(key)) ? "".concat(css[k], "px") : String(css[k]);
      ele.style.setProperty(key, val);
    });
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
      background: 'black',
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
function createContent(isVertical, element) {
  var contentEl = setStyle(document.createElement('div'), {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row'
  });
  element.appendChild(contentEl);
  return contentEl;
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
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center'
    });
    element.appendChild(indicator);
  }
  return indicator;
}
function createIndicatorItem(isVertical, element) {
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
function createWrapper(isFirst, isVertical, hasLoading, itemGap, element) {
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
    wrapper.appendChild(loading);
  }
  element.appendChild(wrapper);
  return wrapper;
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