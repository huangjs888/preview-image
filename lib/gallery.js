"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _transition = _interopRequireWildcard(require("@huangjs888/transition"));
var _image = _interopRequireDefault(require("./image"));
var _events = _interopRequireDefault(require("./events"));
var _dom = require("./dom");
var _popup = require("./popup");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 15:02:11
 * @Description: ******
 */
var Gallery = /*#__PURE__*/function () {
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
      onImageEnd = _ref.onImageEnd,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
    this._container = null;
    this._substance = null;
    this._backdrop = null;
    this._indicator = null;
    this._itemGap = 0;
    this._direction = 'horizontal';
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
    this._images = null;
    this._activeIndex = 0;
    this._translate = 0;
    // swiper位移值
    this._transition = null;
    // 过渡对象
    this._gesture = null;
    // 手势对象
    this._fgBehavior = 0;
    // 当第一根手指放上去后，接着有三种行为：0: 直接拿开 1: 直接移动 2: 再放一根手指
    this._moveTarget = 'none';
    var container = this._container = (0, _dom.createContainer)(ele);
    this._backdrop = (0, _dom.createBackdrop)(backdropColor, container);
    var substance = this._substance = (0, _dom.createSubstance)(direction === 'vertical', container);
    var indicator = this._indicator = (0, _dom.createIndicator)(direction === 'vertical', hasIndicator && imageUrls.length > 1, container);
    var gesture = this._gesture = _events.default.apply(this, [container]);
    this._images = (0, _map.default)(imageUrls).call(imageUrls, function (url, index) {
      var image = {
        wrapper: (0, _dom.createItemWrapper)(index === 0, direction === 'vertical', hasLoading, itemGap, substance),
        indicator: (0, _dom.createItemIndicator)(direction === 'vertical', indicator),
        url: url,
        width: 0,
        height: 0,
        options: (0, _extends2.default)({
          rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
          scalation: !gesture.isTouch() ? [0.1, 10] : undefined
        }, options)
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        (0, _image.default)(image).then(function (okay) {
          if (okay) {
            _this.resetItemSize(index);
          }
          if (typeof okay === 'boolean' && typeof _this._onImageEnd === 'function') {
            _this._onImageEnd(index, okay);
          }
        });
      }
      return image;
    });
    // 创建过度
    this._transition = new _transition.default({
      element: substance,
      propertyName: 'transform',
      propertyValue: new ( /*#__PURE__*/function (_TAProperty) {
        (0, _inheritsLoose2.default)(_class2, _TAProperty);
        function _class2() {
          return _TAProperty.apply(this, arguments) || this;
        }
        var _proto2 = _class2.prototype;
        _proto2.toString = function toString() {
          return "translate" + (direction === 'vertical' ? 'Y' : 'X') + "(" + this.value.translate + "px)";
        };
        return _class2;
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
    this._onImageEnd = onImageEnd || null;
    this._activeIndex = activeIndex;
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
  var _proto = Gallery.prototype;
  _proto.resetSize = function resetSize() {
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
  };
  _proto.resetItemSize = function resetItemSize(index) {
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
  };
  _proto.getItemSize = function getItemSize() {
    if (!this._rectSize) {
      return 0;
    }
    var _this$_rectSize2 = this._rectSize,
      width = _this$_rectSize2.width,
      height = _this$_rectSize2.height;
    var wh = this._direction === 'vertical' ? height : width;
    return wh === 0 ? 0 : wh + this._itemGap;
  };
  _proto.slide = function slide(index, options, open) {
    var _this3 = this;
    if (open === void 0) {
      open = false;
    }
    if (!this._images || this._images.length === 0) {
      return _promise.default.resolve();
    }
    var _index = Math.max(Math.min(index, this._images.length - 1), 0);
    var isChange = open || this._activeIndex !== _index;
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
        if (okay) {
          _this3.resetItemSize(_index);
        }
        if (typeof okay === 'boolean' && typeof _this3._onImageEnd === 'function') {
          _this3._onImageEnd(_index, okay);
        }
      });
    }
    var _translate = -_index * this.getItemSize();
    return this.transitionRun(_translate, options).then(function (v) {
      if (isChange && typeof _this3._onChange === 'function') {
        _this3._onChange();
      }
      return v;
    });
  };
  _proto.next = function next(options) {
    return this.slide(this._activeIndex + 1, options);
  };
  _proto.prev = function prev(options) {
    return this.slide(this._activeIndex - 1, options);
  };
  _proto.transitionRun = function transitionRun(translate, options) {
    var _this4 = this;
    if (options === void 0) {
      options = {};
    }
    var delta = translate - this._translate;
    if (delta === 0 || !this._transition) {
      return _promise.default.resolve({
        translate: this._translate
      });
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._translate = translate;
      this._transition.bind({
        translate: translate
      });
      return _promise.default.resolve({
        translate: translate
      });
    }
    this._translate = translate;
    return this._transition.apply({
      translate: delta
    }, (0, _extends2.default)({
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
  };
  _proto.transitionCancel = function transitionCancel() {
    var _context,
      _this5 = this;
    if (!this._transition) {
      return 0;
    }
    // cancel返回值是动画未执行的部分
    return (0, _map.default)(_context = this._transition.cancel()).call(_context, function (value) {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      _this5._translate -= value.translate;
    }).length;
  };
  _proto.isTransitioning = function isTransitioning() {
    if (!this._transition) {
      return false;
    }
    return this._transition.transitioning();
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
    var _this6 = this;
    if (!this._container || !this._isClose) {
      return;
    }
    this._isClose = false;
    var backdrop = this._backdrop,
      container = this._container;
    (0, _dom.setStyle)(container, {
      display: 'block'
    });
    // 设置容器宽高尺寸
    this.resetSize();
    // 非懒加载模式下，初始化显示的图片如果加载很快，还没open就加载完成触发了resetItemSize
    // 由于此时container没有尺寸，图片也不会计算尺寸，那就需要在打开时再次计算一下
    // 初始化图加载很慢的情况，或懒加载模式下，虽然此时container有尺寸，但由于图片还未加载，所以计算无效
    this.resetItemSize();
    this.slide(this._activeIndex, {
      duration: 0
    }, true);
    var _ref4 = this._images && this._images[this._activeIndex] || {},
      _ref4$wrapper = _ref4.wrapper,
      wrapper = _ref4$wrapper === void 0 ? null : _ref4$wrapper,
      entity = _ref4.entity;
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
    } : {}), 300).then(function () {
      if (_this6._indicator) {
        (0, _dom.setStyle)(_this6._indicator, {
          display: 'flex'
        });
      }
    });
  };
  _proto.close = function close() {
    var _this7 = this;
    if (!this._container || this._isClose) {
      return;
    }
    this._isClose = true;
    var _ref5 = this._images && this._images[this._activeIndex] || {},
      _ref5$wrapper = _ref5.wrapper,
      wrapper = _ref5$wrapper === void 0 ? null : _ref5$wrapper,
      entity = _ref5.entity;
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
    if (this._indicator) {
      (0, _dom.setStyle)(this._indicator, {
        display: 'none'
      });
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
      if (_this7._closeDestory) {
        _this7.destory();
      } else if (_this7._container) {
        (0, _dom.setStyle)(_this7._container, {
          display: 'none'
        });
      }
    });
  };
  return Gallery;
}();
var _default = Gallery;
exports.default = _default;