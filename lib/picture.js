"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。
var Picture = /*#__PURE__*/function () {
  // 当前容器位置和尺寸

  // 手势对象
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
    (0, _classCallCheck2.default)(this, Picture);
    (0, _defineProperty2.default)(this, "_container", null);
    (0, _defineProperty2.default)(this, "_backdrop", null);
    (0, _defineProperty2.default)(this, "_rectSize", null);
    (0, _defineProperty2.default)(this, "_isClose", true);
    (0, _defineProperty2.default)(this, "_swipeClose", false);
    (0, _defineProperty2.default)(this, "_closeDestory", false);
    (0, _defineProperty2.default)(this, "_originRect", null);
    (0, _defineProperty2.default)(this, "_press", null);
    (0, _defineProperty2.default)(this, "_longPress", null);
    (0, _defineProperty2.default)(this, "_onChange", null);
    (0, _defineProperty2.default)(this, "_removeResize", null);
    (0, _defineProperty2.default)(this, "_image", null);
    (0, _defineProperty2.default)(this, "_gesture", null);
    (0, _defineProperty2.default)(this, "_fgBehavior", 0);
    var container = this._container = (0, _dom.createContainer)(ele);
    this._backdrop = (0, _dom.createBackdrop)(backdropColor, container);
    var gesture = this._gesture = _events.default.apply(this, [container]);
    this._image = {
      wrapper: (0, _dom.createItemWrapper)(true, false, hasLoading, 0, container),
      url: url,
      width: 0,
      height: 0,
      options: _objectSpread({
        rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
        scalation: !gesture.isTouch() ? [0.1, 10] : undefined
      }, options)
    };
    (0, _image.default)(this._image).then(function (okay) {
      return okay && _this.resetItemSize();
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
  (0, _createClass2.default)(Picture, [{
    key: "resetItemSize",
    value: function resetItemSize() {
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
    }
  }, {
    key: "destory",
    value: function destory() {
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
    }
  }, {
    key: "setSwipeClose",
    value: function setSwipeClose() {
      var swipeClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this._container) {
        return;
      }
      this._swipeClose = swipeClose;
    }
  }, {
    key: "setCloseDestory",
    value: function setCloseDestory() {
      var closeDestory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!this._container) {
        return;
      }
      this._closeDestory = closeDestory;
    }
  }, {
    key: "setOriginRect",
    value: function setOriginRect() {
      var originRect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (!this._container) {
        return;
      }
      this._originRect = originRect;
    }
  }, {
    key: "open",
    value: function open() {
      var _this2 = this;
      if (!this._container || !this._isClose) {
        return;
      }
      this._isClose = false;
      (0, _dom.setStyle)(this._container, {
        display: 'block'
      });
      // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
      // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
      this.resetItemSize();
      var x = 0;
      var y = 0;
      var k = 0.01;
      if (this._originRect && this._rectSize) {
        var _this$_originRect = this._originRect,
          left = _this$_originRect.left,
          top = _this$_originRect.top,
          width = _this$_originRect.width,
          height = _this$_originRect.height;
        var _ref2 = this._rectSize || {},
          _ref2$left = _ref2.left,
          _left = _ref2$left === void 0 ? 0 : _ref2$left,
          _ref2$top = _ref2.top,
          _top = _ref2$top === void 0 ? 0 : _ref2$top,
          _ref2$width = _ref2.width,
          _width = _ref2$width === void 0 ? 0 : _ref2$width,
          _ref2$height = _ref2.height,
          _height = _ref2$height === void 0 ? 0 : _ref2$height;
        x = left + width / 2 - (_left + _width / 2);
        y = top + height / 2 - (_top + _height / 2);
        k = width / _width || 0.01;
      }
      this.originTransform(x, y, k, 0, 0);
      setTimeout(function () {
        _this2.originTransform(0, 0, 1, 1, 300);
      }, 1);
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;
      if (!this._container || this._isClose) {
        return;
      }
      this._isClose = true;
      var x = 0;
      var y = 0;
      var k = 0.01;
      if (this._originRect && this._rectSize) {
        var _this$_originRect2 = this._originRect,
          left = _this$_originRect2.left,
          top = _this$_originRect2.top,
          width = _this$_originRect2.width,
          height = _this$_originRect2.height;
        var _ref3 = this._rectSize || {},
          _ref3$left = _ref3.left,
          _left = _ref3$left === void 0 ? 0 : _ref3$left,
          _ref3$top = _ref3.top,
          _top = _ref3$top === void 0 ? 0 : _ref3$top,
          _ref3$width = _ref3.width,
          _width = _ref3$width === void 0 ? 0 : _ref3$width,
          _ref3$height = _ref3.height,
          _height = _ref3$height === void 0 ? 0 : _ref3$height;
        x = left + width / 2 - (_left + _width / 2);
        y = top + height / 2 - (_top + _height / 2);
        k = width / _width || 0.01;
      }
      // 需要把放大的图片归位到原始大小
      var _ref4 = this._image || {},
        entity = _ref4.entity;
      if (entity) {
        entity.reset();
      }
      this.originTransform(x, y, k, 0, 300).then(function () {
        if (_this3._closeDestory) {
          _this3.destory();
        } else if (_this3._container) {
          (0, _dom.setStyle)(_this3._container, {
            display: 'none'
          });
        }
      });
    }
  }, {
    key: "originTransform",
    value: function originTransform(x, y, k, o) {
      var duration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var backdrop = this._backdrop;
      if (backdrop) {
        var _ref5 = this._image || {},
          wrapper = _ref5.wrapper;
        if (wrapper) {
          (0, _dom.setStyle)(wrapper, {
            overflow: 'visible',
            transform: "translate(".concat(x, "px,").concat(y, "px) scale(").concat(k, ")"),
            transition: duration > 0 ? "transform ".concat(duration, "ms") : ''
          });
        }
        (0, _dom.setStyle)(backdrop, {
          opacity: o,
          transition: duration > 0 ? "opacity ".concat(duration, "ms") : ''
        });
        if (duration > 0) {
          return new Promise(function (resolve) {
            backdrop.ontransitionend = function (e) {
              // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
              if (e.target === backdrop && e.propertyName === 'opacity') {
                backdrop.ontransitionend = null;
                if (wrapper) {
                  (0, _dom.setStyle)(wrapper, {
                    overflow: 'hidden',
                    transition: 'none'
                  });
                }
                (0, _dom.setStyle)(backdrop, {
                  transition: 'none'
                });
                resolve();
              }
            };
          });
        }
      }
      return Promise.resolve();
    }
  }]);
  return Picture;
}();
var _default = Picture;
exports.default = _default;