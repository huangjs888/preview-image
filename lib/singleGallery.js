"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
var _excluded = ["container", "url", "hasLoading", "options"];
// this._events还要重新整理一下
// 测试重复调用open，close等以及destory后，在调用方法，报啥错误？
// 对于destory的，已经open的需要加个状态标记，同样的方法不该重复调用。
var SingleGallery = /*#__PURE__*/function () {
  // 手势对象
  // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指

  function SingleGallery(_ref) {
    var _this = this;
    var container = _ref.container,
      _ref$url = _ref.url,
      url = _ref$url === void 0 ? '' : _ref$url,
      _ref$hasLoading = _ref.hasLoading,
      hasLoading = _ref$hasLoading === void 0 ? true : _ref$hasLoading,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options,
      events = (0, _objectWithoutProperties2.default)(_ref, _excluded);
    (0, _classCallCheck2.default)(this, SingleGallery);
    (0, _defineProperty2.default)(this, "container", null);
    (0, _defineProperty2.default)(this, "_events", null);
    (0, _defineProperty2.default)(this, "_image", null);
    (0, _defineProperty2.default)(this, "_gesture", null);
    (0, _defineProperty2.default)(this, "_fgBehavior", 0);
    (0, _defineProperty2.default)(this, "_removeResize", null);
    var _container = this.container = (0, _dom.createContainer)(container);
    this._image = {
      wrapper: (0, _dom.createWrapper)(true, false, hasLoading, 0, _container),
      url: url,
      width: 0,
      height: 0,
      options: options
    };
    (0, _image.default)(this._image).then(function (okay) {
      return okay && _this.resetItemSize();
    });
    this._gesture = _events.default.apply(this, [_container]);
    this._events = events;
    // 浏览器窗口变化重置
    var resize = function resize() {
      return _this.resetItemSize();
    };
    window.addEventListener('resize', resize);
    this._removeResize = function () {
      window.removeEventListener('resize', resize);
    };
  }
  (0, _createClass2.default)(SingleGallery, [{
    key: "resetItemSize",
    value: function resetItemSize() {
      var container = this.container;
      if (!container) {
        return;
      }
      var _container$getBoundin = container.getBoundingClientRect(),
        left = _container$getBoundin.left,
        top = _container$getBoundin.top,
        width = _container$getBoundin.width,
        height = _container$getBoundin.height;
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
      this._image = null;
      this._events = null;
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }
    }
  }, {
    key: "open",
    value: function open() {
      var container = this.container;
      if (!container || container.style.display === 'block') {
        return;
      }
      (0, _dom.setStyle)(container, {
        display: 'block',
        opacity: 0
      });
      // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
      // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
      this.resetItemSize();
      // resetSize会触发回流，让opacity=0已经生效，所以后续的不需要放到setTimeout里了
      (0, _dom.setStyle)(container, {
        opacity: 1,
        transition: 'opacity 0.4s'
      });
      var transitionend = function transitionend(ee) {
        if (ee.target === container && ee.propertyName === 'opacity') {
          container.removeEventListener('transitionend', transitionend);
          container.ontransitionend = null;
          (0, _dom.setStyle)(container, {
            transition: 'none'
          });
        }
      };
      container.addEventListener('transitionend', transitionend);
    }
  }, {
    key: "close",
    value: function close() {
      var _this2 = this;
      var container = this.container;
      if (!container) {
        return;
      }
      (0, _dom.setStyle)(container, {
        opacity: 0,
        transition: 'opacity 0.4s'
      });
      var transitionend = function transitionend(ee) {
        if (ee.target === container && ee.propertyName === 'opacity') {
          container.removeEventListener('transitionend', transitionend);
          (0, _dom.setStyle)(container, {
            transition: 'none'
          });
          _this2.destory();
        }
      };
      container.addEventListener('transitionend', transitionend);
    }
  }]);
  return SingleGallery;
}();
var _default = SingleGallery;
exports.default = _default;