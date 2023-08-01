"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _transition = _interopRequireWildcard(require("@huangjs888/transition"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
var _excluded = ["container", "imageUrls", "activeIndex", "direction", "itemGap", "hasLoading", "hasIndicator", "isLazy", "options"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Gallery = /*#__PURE__*/function () {
  // 滑动方向

  // 手势对象
  // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  // 判断是内部的图片移动，还是外部swiper移动，还是直接关闭

  function Gallery(_ref) {
    var _this = this;
    var container = _ref.container,
      _ref$imageUrls = _ref.imageUrls,
      imageUrls = _ref$imageUrls === void 0 ? [] : _ref$imageUrls,
      _ref$activeIndex = _ref.activeIndex,
      activeIndex = _ref$activeIndex === void 0 ? 0 : _ref$activeIndex,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'horizontal' : _ref$direction,
      _ref$itemGap = _ref.itemGap,
      itemGap = _ref$itemGap === void 0 ? 20 : _ref$itemGap,
      _ref$hasLoading = _ref.hasLoading,
      hasLoading = _ref$hasLoading === void 0 ? true : _ref$hasLoading,
      _ref$hasIndicator = _ref.hasIndicator,
      hasIndicator = _ref$hasIndicator === void 0 ? true : _ref$hasIndicator,
      _ref$isLazy = _ref.isLazy,
      isLazy = _ref$isLazy === void 0 ? true : _ref$isLazy,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options,
      events = (0, _objectWithoutProperties2.default)(_ref, _excluded);
    (0, _classCallCheck2.default)(this, Gallery);
    (0, _defineProperty2.default)(this, "container", null);
    (0, _defineProperty2.default)(this, "contentEl", null);
    (0, _defineProperty2.default)(this, "_itemGap", 0);
    (0, _defineProperty2.default)(this, "_direction", 'horizontal');
    (0, _defineProperty2.default)(this, "_rectSize", null);
    (0, _defineProperty2.default)(this, "_events", null);
    (0, _defineProperty2.default)(this, "_images", null);
    (0, _defineProperty2.default)(this, "_activeIndex", -1);
    (0, _defineProperty2.default)(this, "_translate", 0);
    (0, _defineProperty2.default)(this, "_transition", null);
    (0, _defineProperty2.default)(this, "_gesture", null);
    (0, _defineProperty2.default)(this, "_fgBehavior", 0);
    (0, _defineProperty2.default)(this, "_moveTarget", 'none');
    (0, _defineProperty2.default)(this, "_removeResize", null);
    var _container = this.container = (0, _dom.createContainer)(container);
    var contentEl = this.contentEl = (0, _dom.createContent)(direction === 'vertical', _container);
    var indicator = (0, _dom.createIndicator)(direction === 'vertical', hasIndicator && imageUrls.length > 1, this.container);
    this._images = imageUrls.map(function (url, index) {
      var image = {
        wrapper: (0, _dom.createWrapper)(index === 0, direction === 'vertical', hasLoading, itemGap, contentEl),
        indicator: (0, _dom.createIndicatorItem)(direction === 'vertical', indicator),
        url: url,
        width: 0,
        height: 0,
        options: options
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        (0, _image.default)(image).then(function (okay) {
          return okay && _this.resetItemSize(index);
        });
      }
      return image;
    });
    this._gesture = _events.default.apply(this, [_container]);
    // 创建过度
    this._transition = new _transition.default({
      element: this.contentEl,
      propertyName: 'transform',
      propertyValue: new ( /*#__PURE__*/function (_TAProperty) {
        (0, _inherits2.default)(_class, _TAProperty);
        var _super = _createSuper(_class);
        function _class() {
          (0, _classCallCheck2.default)(this, _class);
          return _super.apply(this, arguments);
        }
        (0, _createClass2.default)(_class, [{
          key: "toString",
          value: function toString() {
            return "translate".concat(direction === 'vertical' ? 'Y' : 'X', "(").concat(this.value.translate, "px)");
          }
        }]);
        return _class;
      }(_transition.TAProperty))({
        translate: this._translate
      })
    });
    this._itemGap = itemGap;
    this._direction = direction;
    this._events = events;
    this.slide(activeIndex, {
      duration: 0
    });
    // 浏览器窗口变化重新计算容器尺寸和所有图片尺寸
    var resize = function resize() {
      _this.resetSize();
      _this.resetItemSize();
    };
    window.addEventListener('resize', resize);
    this._removeResize = function () {
      window.removeEventListener('resize', resize);
    };
  }
  (0, _createClass2.default)(Gallery, [{
    key: "resetSize",
    value: function resetSize() {
      if (!this.container || !this.contentEl || !this._images) {
        return;
      }
      // 容器宽高设置
      var _this$container$getBo = this.container.getBoundingClientRect(),
        left = _this$container$getBo.left,
        top = _this$container$getBo.top,
        width = _this$container$getBo.width,
        height = _this$container$getBo.height;
      this._rectSize = {
        left: left,
        top: top,
        width: width,
        height: height
      };
      var length = this._images.length;
      if (length > 0) {
        (0, _dom.setStyle)(this.contentEl, {
          width: this._direction === 'vertical' ? width : width * length + (length - 1) * this._itemGap,
          height: this._direction === 'vertical' ? height * length + (length - 1) * this._itemGap : height
        });
      }
    }
  }, {
    key: "resetItemSize",
    value: function resetItemSize(index) {
      var _this2 = this;
      if (!this._rectSize || !this._images) {
        return;
      }
      var _this$_rectSize = this._rectSize,
        left = _this$_rectSize.left,
        top = _this$_rectSize.top,
        width = _this$_rectSize.width,
        height = _this$_rectSize.height;
      var resize = function resize(image) {
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
          if (_this2._direction !== 'vertical' && elementHeight > height) {
            (0, _dom.setStyle)(image.wrapper, {
              alignItems: 'flex-start'
            });
          }
        }
      };
      if (typeof index === 'number') {
        resize(this._images[index]);
      } else {
        this._images.forEach(resize);
      }
    }
  }, {
    key: "getItemSize",
    value: function getItemSize() {
      if (!this._rectSize) {
        return 0;
      }
      var _this$_rectSize2 = this._rectSize,
        width = _this$_rectSize2.width,
        height = _this$_rectSize2.height;
      var wh = this._direction === 'vertical' ? height : width;
      return wh === 0 ? 0 : wh + this._itemGap;
    }
  }, {
    key: "slide",
    value: function slide(index, options) {
      var _this3 = this;
      if (!this._images || this._images.length === 0) {
        return Promise.resolve();
      }
      var _index = Math.max(Math.min(index, this._images.length - 1), 0);
      var isChange = this._activeIndex !== _index;
      if (isChange) {
        var lastIndicator = (this._images[this._activeIndex] || {}).indicator;
        if (lastIndicator) {
          (0, _dom.setStyle)(lastIndicator, {
            width: 7,
            height: 7,
            opacity: 0.6
          });
        }
        var thisIndicator = (this._images[_index] || {}).indicator;
        if (thisIndicator) {
          (0, _dom.setStyle)(thisIndicator, {
            width: 8,
            height: 8,
            opacity: 1
          });
        }
        this._activeIndex = _index;
        (0, _image.default)(this._images[_index]).then(
        // lazy的时候，滑到这里才加载图片，所以加载成功后需要计算该图片尺寸
        function (okay) {
          return okay && _this3.resetItemSize(_index);
        });
      }
      var _translate = -_index * this.getItemSize();
      return this.transitionRun(_translate, options).then(function (v) {
        if (isChange && _this3._events && typeof _this3._events.onChange === 'function') {
          _this3._events.onChange();
        }
        return v;
      });
    }
  }, {
    key: "next",
    value: function next(options) {
      return this.slide(this._activeIndex + 1, options);
    }
  }, {
    key: "prev",
    value: function prev(options) {
      return this.slide(this._activeIndex - 1, options);
    }
  }, {
    key: "transitionRun",
    value: function transitionRun(translate) {
      var _this4 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var delta = translate - this._translate;
      if (delta === 0 || !this._transition) {
        return Promise.resolve({
          translate: this._translate
        });
      }
      if (typeof options.duration === 'number' && options.duration <= 0) {
        // 这里移动时不需要动画，可以直接进行绑定赋值
        this._translate = translate;
        this._transition.bind({
          translate: translate
        });
        return Promise.resolve({
          translate: translate
        });
      }
      this._translate = translate;
      return this._transition.apply({
        translate: delta
      }, _objectSpread({
        precision: {
          translate: 1
        },
        cancel: true,
        duration: 500,
        easing: _transition.easeOutQuart
      }, options)).then(function (value) {
        if (!_this4.isTransitioning()) {
          // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
          if (_this4._transition) {
            _this4._transition.bind({
              translate: _this4._translate
            });
          }
        }
        return value;
      });
    }
  }, {
    key: "transitionCancel",
    value: function transitionCancel() {
      var _this5 = this;
      if (!this._transition) {
        return 0;
      }
      // cancel返回值是动画未执行的部分
      return this._transition.cancel().map(function (value) {
        // 取消动画时应该把this._transform内的值减掉还未执行的部分
        _this5._translate -= value.translate;
      }).length;
    }
  }, {
    key: "isTransitioning",
    value: function isTransitioning() {
      if (!this._transition) {
        return false;
      }
      return this._transition.transitioning();
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
      this._transition = null;
      this._rectSize = null;
      this._images = null;
      this._events = null;
      this.contentEl = null;
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
      // 设置容器宽高尺寸
      this.resetSize();
      // 要计算每一张图片尺寸
      // 初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
      // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在这里再次计算一下
      this.resetItemSize();
      // 计算完尺寸，自然要将当前activeIndex的图片展示出来，要计算一下swiper的位移
      if (this._transition) {
        this._translate = -this._activeIndex * this.getItemSize();
        this._transition.bind({
          translate: this._translate
        });
      }
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
      var _this6 = this;
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
          _this6.destory();
        }
      };
      container.addEventListener('transitionend', transitionend);
    }
  }]);
  return Gallery;
}();
var _default = Gallery;
exports.default = _default;