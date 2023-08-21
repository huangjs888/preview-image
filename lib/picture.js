"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
var _popup = require("./popup");
// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。
var Picture = /*#__PURE__*/function () {
  // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  function Picture(_ref) {
    var _this = this;
    var ele = _ref.container,
      _ref$url = _ref.url,
      url = _ref$url === void 0 ? '' : _ref$url,
      _ref$hasLoading = _ref.hasLoading,
      hasLoading = _ref$hasLoading === void 0 ? true : _ref$hasLoading,
      _ref$swipeClose = _ref.swipeClose,
      swipeClose = _ref$swipeClose === void 0 ? true : _ref$swipeClose,
      _ref$closeDestory = _ref.closeDestory,
      closeDestory = _ref$closeDestory === void 0 ? true : _ref$closeDestory,
      _ref$backdropColor = _ref.backdropColor,
      backdropColor = _ref$backdropColor === void 0 ? '#000f' : _ref$backdropColor,
      originRect = _ref.originRect,
      press = _ref.press,
      longPress = _ref.longPress,
      onResize = _ref.onResize,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
    this._container = null;
    this._backdrop = null;
    this._rectSize = null;
    // 当前容器位置和尺寸
    this._isClose = true;
    this._swipeClose = false;
    this._closeDestory = false;
    this._originRect = null;
    this._press = null;
    this._longPress = null;
    this._onChange = null;
    this._onImageEnd = null;
    this._removeResize = null;
    this._image = null;
    this._gesture = null;
    // 手势对象
    this._fgBehavior = 0;
    var container = this._container = (0, _dom.createContainer)(ele);
    this._backdrop = (0, _dom.createBackdrop)(backdropColor, container);
    var gesture = this._gesture = _events.default.apply(this, [container]);
    this._image = {
      wrapper: (0, _dom.createItemWrapper)(true, false, hasLoading, 0, container),
      url: url,
      width: 0,
      height: 0,
      options: (0, _extends2.default)({
        rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
        scalation: !gesture.isTouch() ? [0.1, 10] : undefined
      }, options)
    };
    (0, _image.default)(this._image).then(function (okay) {
      if (okay) {
        _this.resetItemSize();
      }
      if (typeof okay === 'boolean' && typeof _this._onImageEnd === 'function') {
        _this._onImageEnd(okay);
      }
    });
    this._swipeClose = swipeClose;
    this._closeDestory = closeDestory;
    this._originRect = originRect || null;
    this._press = press || null;
    this._longPress = longPress || null;
    // 浏览器窗口变化重置
    var resize = function resize() {
      _this.resetItemSize();
      typeof onResize === 'function' && onResize();
    };
    var contextmenu = function contextmenu(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('contextmenu', contextmenu);
    this._removeResize = function () {
      window.removeEventListener('resize', resize);
      window.removeEventListener('contextmenu', contextmenu);
    };
  }
  var _proto = Picture.prototype;
  _proto.resetItemSize = function resetItemSize() {
    var ele = this._container;
    if (!ele) {
      return;
    }
    var _ele$getBoundingClien = ele.getBoundingClientRect(),
      left = _ele$getBoundingClien.left,
      top = _ele$getBoundingClien.top,
      width = _ele$getBoundingClien.width,
      height = _ele$getBoundingClien.height;
    this._rectSize = {
      left: left,
      top: top,
      width: width,
      height: height
    };
    var image = this._image;
    if (image && image.entity && width !== 0 && height !== 0) {
      image.entity.setSizeInfo({
        containerCenter: [left + width / 2, top + height / 2],
        containerWidth: width,
        containerHeight: height,
        naturalWidth: image.width,
        naturalHeight: image.height
      });
      var _image$entity$getSize = image.entity.getSizeInfo(),
        elementHeight = _image$entity$getSize.elementHeight;
      if (elementHeight > height) {
        (0, _dom.setStyle)(image.wrapper, {
          alignItems: 'flex-start'
        });
      }
    }
  };
  _proto.destory = function destory() {
    // 销毁手势事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
    if (this._removeResize) {
      this._removeResize();
      this._removeResize = null;
    }
    this._isClose = true;
    this._originRect = null;
    this._rectSize = null;
    this._image = null;
    this._press = null;
    this._longPress = null;
    this._onChange = null;
    this._backdrop = null;
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
      this._container = null;
    }
  };
  _proto.setSwipeClose = function setSwipeClose(swipeClose) {
    if (swipeClose === void 0) {
      swipeClose = true;
    }
    if (!this._container) {
      return;
    }
    this._swipeClose = swipeClose;
  };
  _proto.setCloseDestory = function setCloseDestory(closeDestory) {
    if (closeDestory === void 0) {
      closeDestory = true;
    }
    if (!this._container) {
      return;
    }
    this._closeDestory = closeDestory;
  };
  _proto.setOriginRect = function setOriginRect(originRect) {
    if (originRect === void 0) {
      originRect = null;
    }
    if (!this._container) {
      return;
    }
    this._originRect = originRect;
  };
  _proto.open = function open() {
    if (!this._container || !this._isClose) {
      return;
    }
    this._isClose = false;
    var backdrop = this._backdrop,
      container = this._container;
    (0, _dom.setStyle)(container, {
      display: 'block'
    });
    // 非懒加载模式下，初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在打开时再次计算一下
    // 初始化图加载很慢的情况，或懒加载模式下，虽然此时container有尺寸，但由于图片还未加载，所以计算无效
    this.resetItemSize();
    var _ref2 = this._image || {},
      _ref2$wrapper = _ref2.wrapper,
      wrapper = _ref2$wrapper === void 0 ? null : _ref2$wrapper,
      entity = _ref2.entity;
    var elementSize = null;
    var elementEl = null;
    if (entity) {
      var size = entity.getSizeInfo();
      elementEl = entity.getElement();
      elementSize = {
        width: size.elementWidth,
        height: size.elementHeight,
        top: 0,
        left: 0
      };
    }
    var _popupComputedSize = (0, _popup.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize.x,
      y = _popupComputedSize.y,
      k = _popupComputedSize.k,
      w = _popupComputedSize.w,
      h = _popupComputedSize.h;
    (0, _popup.popupTransform)({
      el: backdrop,
      o: 0
    }, {
      el: wrapper,
      x: x,
      y: y,
      k: k
    }, {
      el: elementEl,
      w: w,
      h: h
    });
    // 目的是让上一个popupTransform变化立马生效，下一个popupTransform可以顺利进行，而不是合并进行了
    container.getBoundingClientRect();
    (0, _popup.popupTransform)({
      el: backdrop,
      o: 1
    }, {
      el: wrapper,
      x: 0,
      y: 0,
      k: 1
    }, (0, _extends2.default)({
      el: elementEl
    }, elementSize ? {
      w: elementSize.width,
      h: elementSize.height
    } : {}), 300).then(function () {});
  };
  _proto.close = function close() {
    var _this2 = this;
    if (!this._container || this._isClose) {
      return;
    }
    this._isClose = true;
    var _ref3 = this._image || {},
      _ref3$wrapper = _ref3.wrapper,
      wrapper = _ref3$wrapper === void 0 ? null : _ref3$wrapper,
      entity = _ref3.entity;
    var elementSize = null;
    var elementEl = null;
    if (entity) {
      var size = entity.getSizeInfo();
      elementEl = entity.getElement();
      elementSize = {
        width: size.elementWidth,
        height: size.elementHeight,
        top: 0,
        left: 0
      };
      // 需要把放大的图片归位到原始大小
      entity.reset();
    }
    var _popupComputedSize2 = (0, _popup.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize2.x,
      y = _popupComputedSize2.y,
      k = _popupComputedSize2.k,
      w = _popupComputedSize2.w,
      h = _popupComputedSize2.h;
    (0, _popup.popupTransform)({
      el: this._backdrop,
      o: 0
    }, {
      el: wrapper,
      x: x,
      y: y,
      k: k
    }, {
      el: elementEl,
      w: w,
      h: h
    }, 300).then(function () {
      if (_this2._closeDestory) {
        _this2.destory();
      } else if (_this2._container) {
        (0, _dom.setStyle)(_this2._container, {
          display: 'none'
        });
      }
    });
  };
  return Picture;
}();
var _default = Picture;
exports.default = _default;