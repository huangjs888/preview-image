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
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _transition = _interopRequireWildcard(require("@huangjs888/transition"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var Gallery = /*#__PURE__*/function () {
  // 当前容器位置和尺寸

  // swiper位移值
  // 过渡对象
  // 手势对象
  // 是否被视作单点移动
  // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
  // 判断是内部的图片移动，还是外部swiper移动，还是直接关闭
  function Gallery(_ref) {
    var _this = this;
    var ele = _ref.container,
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
      _ref$swipeClose = _ref.swipeClose,
      swipeClose = _ref$swipeClose === void 0 ? true : _ref$swipeClose,
      _ref$closeDestory = _ref.closeDestory,
      closeDestory = _ref$closeDestory === void 0 ? true : _ref$closeDestory,
      _ref$backdropColor = _ref.backdropColor,
      backdropColor = _ref$backdropColor === void 0 ? '#000f' : _ref$backdropColor,
      originRect = _ref.originRect,
      press = _ref.press,
      longPress = _ref.longPress,
      onChange = _ref.onChange,
      onResize = _ref.onResize,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
    (0, _classCallCheck2.default)(this, Gallery);
    (0, _defineProperty2.default)(this, "_container", null);
    (0, _defineProperty2.default)(this, "_substance", null);
    (0, _defineProperty2.default)(this, "_backdrop", null);
    (0, _defineProperty2.default)(this, "_indicator", null);
    (0, _defineProperty2.default)(this, "_itemGap", 0);
    (0, _defineProperty2.default)(this, "_direction", 'horizontal');
    (0, _defineProperty2.default)(this, "_rectSize", null);
    (0, _defineProperty2.default)(this, "_isClose", true);
    (0, _defineProperty2.default)(this, "_swipeClose", false);
    (0, _defineProperty2.default)(this, "_closeDestory", false);
    (0, _defineProperty2.default)(this, "_originRect", null);
    (0, _defineProperty2.default)(this, "_press", null);
    (0, _defineProperty2.default)(this, "_longPress", null);
    (0, _defineProperty2.default)(this, "_onChange", null);
    (0, _defineProperty2.default)(this, "_removeResize", null);
    (0, _defineProperty2.default)(this, "_images", null);
    (0, _defineProperty2.default)(this, "_activeIndex", -1);
    (0, _defineProperty2.default)(this, "_translate", 0);
    (0, _defineProperty2.default)(this, "_transition", null);
    (0, _defineProperty2.default)(this, "_gesture", null);
    (0, _defineProperty2.default)(this, "_onePoint", false);
    (0, _defineProperty2.default)(this, "_fgBehavior", 0);
    (0, _defineProperty2.default)(this, "_moveTarget", 'none');
    var container = this._container = (0, _dom.createContainer)(ele);
    this._backdrop = (0, _dom.createBackdrop)(backdropColor, container);
    var substance = this._substance = (0, _dom.createSubstance)(direction === 'vertical', container);
    var indicator = this._indicator = (0, _dom.createIndicator)(direction === 'vertical', hasIndicator && imageUrls.length > 1, container);
    var gesture = this._gesture = _events.default.apply(this, [container]);
    this._images = imageUrls.map(function (url, index) {
      var image = {
        wrapper: (0, _dom.createItemWrapper)(index === 0, direction === 'vertical', hasLoading, itemGap, substance),
        indicator: (0, _dom.createItemIndicator)(direction === 'vertical', indicator),
        url: url,
        width: 0,
        height: 0,
        options: _objectSpread({
          rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
          scalation: !gesture.isTouch() ? [0.1, 10] : undefined
        }, options)
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        (0, _image.default)(image).then(function (okay) {
          return okay && _this.resetItemSize(index);
        });
      }
      return image;
    });
    // 创建过度
    this._transition = new _transition.default({
      element: substance,
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
    this._swipeClose = swipeClose;
    this._closeDestory = closeDestory;
    this._originRect = originRect || null;
    this._press = press || null;
    this._longPress = longPress || null;
    this._onChange = onChange || null;
    this.slide(activeIndex, {
      duration: 0
    });
    // 浏览器窗口变化重新计算容器尺寸和所有图片尺寸
    var resize = function resize() {
      _this.resetSize();
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
  (0, _createClass2.default)(Gallery, [{
    key: "resetSize",
    value: function resetSize() {
      if (!this._container || !this._substance || !this._images) {
        return;
      }
      // 容器宽高设置
      var _this$_container$getB = this._container.getBoundingClientRect(),
        left = _this$_container$getB.left,
        top = _this$_container$getB.top,
        width = _this$_container$getB.width,
        height = _this$_container$getB.height;
      this._rectSize = {
        left: left,
        top: top,
        width: width,
        height: height
      };
      var length = this._images.length;
      if (length > 0) {
        (0, _dom.setStyle)(this._substance, {
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
        var _ref2 = this._images[this._activeIndex] || {},
          lastOne = _ref2.indicator;
        if (lastOne) {
          (0, _dom.setStyle)(lastOne, {
            width: 7,
            height: 7,
            opacity: 0.6
          });
        }
        var _ref3 = this._images[_index] || {},
          thisOne = _ref3.indicator;
        if (thisOne) {
          (0, _dom.setStyle)(thisOne, {
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
        if (isChange && typeof _this3._onChange === 'function') {
          _this3._onChange();
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
      this._isClose = true;
      this._transition = null;
      this._rectSize = null;
      this._originRect = null;
      this._images = null;
      this._press = null;
      this._longPress = null;
      this._onChange = null;
      this._substance = null;
      this._backdrop = null;
      this._indicator = null;
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
      var _this6 = this;
      if (!this._container || !this._isClose) {
        return;
      }
      this._isClose = false;
      (0, _dom.setStyle)(this._container, {
        display: 'block'
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
      var x = 0;
      var y = 0;
      var k = 0.01;
      if (this._originRect && this._rectSize) {
        var _this$_originRect = this._originRect,
          left = _this$_originRect.left,
          top = _this$_originRect.top,
          width = _this$_originRect.width,
          height = _this$_originRect.height;
        var _ref4 = this._rectSize || {},
          _ref4$left = _ref4.left,
          _left = _ref4$left === void 0 ? 0 : _ref4$left,
          _ref4$top = _ref4.top,
          _top = _ref4$top === void 0 ? 0 : _ref4$top,
          _ref4$width = _ref4.width,
          _width = _ref4$width === void 0 ? 0 : _ref4$width,
          _ref4$height = _ref4.height,
          _height = _ref4$height === void 0 ? 0 : _ref4$height;
        x = left + width / 2 - (_left + _width / 2);
        y = top + height / 2 - (_top + _height / 2);
        k = width / _width || 0.01;
      }
      this.originTransform(x, y, k, 0, 0);
      setTimeout(function () {
        _this6.originTransform(0, 0, 1, 1, 300).then(function () {
          if (_this6._indicator) {
            (0, _dom.setStyle)(_this6._indicator, {
              display: 'flex'
            });
          }
        });
      }, 1);
    }
  }, {
    key: "close",
    value: function close() {
      var _this7 = this;
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
        var _ref5 = this._rectSize || {},
          _ref5$left = _ref5.left,
          _left = _ref5$left === void 0 ? 0 : _ref5$left,
          _ref5$top = _ref5.top,
          _top = _ref5$top === void 0 ? 0 : _ref5$top,
          _ref5$width = _ref5.width,
          _width = _ref5$width === void 0 ? 0 : _ref5$width,
          _ref5$height = _ref5.height,
          _height = _ref5$height === void 0 ? 0 : _ref5$height;
        x = left + width / 2 - (_left + _width / 2);
        y = top + height / 2 - (_top + _height / 2);
        k = width / _width || 0.01;
      }
      // 需要把放大的图片归位到原始大小
      var _ref6 = this._images && this._images[this._activeIndex] || {},
        entity = _ref6.entity;
      if (entity) {
        entity.reset();
      }
      if (this._indicator) {
        (0, _dom.setStyle)(this._indicator, {
          display: 'none'
        });
      }
      this.originTransform(x, y, k, 0, 300).then(function () {
        if (_this7._closeDestory) {
          _this7.destory();
        } else if (_this7._container) {
          (0, _dom.setStyle)(_this7._container, {
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
        var _ref7 = this._images && this._images[this._activeIndex] || {},
          wrapper = _ref7.wrapper;
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
  return Gallery;
}();
var _default = Gallery;
exports.default = _default;