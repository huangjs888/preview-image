"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Gallery: true,
  SingleGallery: true,
  Entity: true,
  loadImage: true
};
Object.defineProperty(exports, "Entity", {
  enumerable: true,
  get: function get() {
    return _entity.default;
  }
});
Object.defineProperty(exports, "Gallery", {
  enumerable: true,
  get: function get() {
    return _gallery.default;
  }
});
Object.defineProperty(exports, "SingleGallery", {
  enumerable: true,
  get: function get() {
    return _singleGallery.default;
  }
});
exports.default = previewImage;
Object.defineProperty(exports, "loadImage", {
  enumerable: true,
  get: function get() {
    return _image.default;
  }
});
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _gallery = _interopRequireWildcard(require("./gallery"));
Object.keys(_gallery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _gallery[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _gallery[key];
    }
  });
});
var _singleGallery = _interopRequireWildcard(require("./singleGallery"));
Object.keys(_singleGallery).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _singleGallery[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _singleGallery[key];
    }
  });
});
var _entity = _interopRequireWildcard(require("./entity"));
Object.keys(_entity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _entity[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _entity[key];
    }
  });
});
var _image = _interopRequireWildcard(require("./image"));
Object.keys(_image).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _image[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _image[key];
    }
  });
});
var _excluded = ["urls", "current", "showMenu"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function previewImage(_ref) {
  var urls = _ref.urls,
    current = _ref.current,
    showMenu = _ref.showMenu,
    restOption = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var index = !current ? 0 : urls.indexOf(current);
  var gallery = new _gallery.default(_objectSpread(_objectSpread({
    imageUrls: urls,
    activeIndex: index
  }, restOption), {}, {
    longTap: function longTap() {
      typeof showMenu === 'function' && showMenu();
    },
    singleTap: function singleTap() {
      gallery.close();
    },
    downSwipe: function downSwipe() {
      gallery.close();
      // 阻止downSwipe后效果回弹
      return true;
    }
  }));
  gallery.open();
}