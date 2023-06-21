"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TAProperty = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _animation = _interopRequireDefault(require("./animation"));
var _excluded = ["precision", "transition", "cancel"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var TAProperty = /*#__PURE__*/(0, _createClass2.default)(
// 过渡需要变化的值
function TAProperty(value) {
  (0, _classCallCheck2.default)(this, TAProperty);
  this.value = value;
});
exports.TAProperty = TAProperty;
var Transition = /*#__PURE__*/function () {
  // 过渡的元素
  // 当前将要过渡的动画应用在元素的哪个属性上
  // 当前将要过渡的动画属性的实时值

  // 该属性执行所有过渡的动画集合
  function Transition(_ref) {
    var element = _ref.element,
      propertyName = _ref.propertyName,
      propertyValue = _ref.propertyValue;
    (0, _classCallCheck2.default)(this, Transition);
    (0, _defineProperty2.default)(this, "_animation", []);
    this.element = element;
    // 将驼峰转换为连字符-，style.setProperty只支持连字符-，不支持驼峰（不生效）
    this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.element.style.setProperty(this.propertyName, propertyValue.toString());
    this.propertyValue = propertyValue;
  }
  (0, _createClass2.default)(Transition, [{
    key: "bind",
    value: function bind(value) {
      // 这里直接做一次校准
      var element = this.element,
        propertyName = this.propertyName,
        propertyValue = this.propertyValue;
      var newValue = {};
      Object.keys(value).forEach(function (key) {
        var val = value[key];
        if (typeof val === 'number') {
          newValue[key] = val;
        }
      });
      propertyValue.value = newValue;
      element.style.setProperty(propertyName, propertyValue.toString());
    }
  }, {
    key: "apply",
    value: function apply(deltaValue, options) {
      var _this = this;
      return new Promise(function (resolve) {
        var _options$precision = options.precision,
          precision = _options$precision === void 0 ? {} : _options$precision,
          _options$transition = options.transition,
          transition = _options$transition === void 0 ? function () {} : _options$transition,
          _options$cancel = options.cancel,
          cancel = _options$cancel === void 0 ? true : _options$cancel,
          restOptions = (0, _objectWithoutProperties2.default)(options, _excluded);
        var element = _this.element,
          propertyName = _this.propertyName,
          propertyValue = _this.propertyValue;
        var produced = {};
        // 做一次精度筛选
        Object.keys(deltaValue).forEach(function (key) {
          var val = deltaValue[key];
          if (typeof val === 'number') {
            // 大于精度的先存起来，后面启用动画
            if (Math.abs(val) > (precision[key] || 0)) {
              produced[key] = val;
            } else {
              // 小于精度的直接累加到value
              if (typeof propertyValue.value[key] === 'number') {
                propertyValue.value[key] += val;
              }
            }
          }
        });
        var producedKeys = Object.keys(produced);
        // 存在需要执行动画的增量(大于精度的)，进行动画处理
        if (producedKeys.length > 0) {
          // 存储每一帧动画后还有多少剩余没有执行
          var remainValue = _objectSpread({}, produced);
          // 创建动画，并存储到this
          var animation = new _animation.default(restOptions);
          _this._animation.push({
            animation: animation,
            remainValue: remainValue,
            cancel: cancel
          });
          // 开启动画
          animation.start(function (progress) {
            // 根据动画进度对value进行累加
            producedKeys.forEach(function (key) {
              var unconsumed = produced[key] * (1 - progress);
              if (typeof propertyValue.value[key] === 'number') {
                propertyValue.value[key] += remainValue[key] - unconsumed;
              }
              remainValue[key] = unconsumed;
            });
            // 每帧动画后应用到元素并执行帧回调
            element.style.setProperty(propertyName, propertyValue.toString());
            transition(propertyValue.value);
            if (progress === 1) {
              // 动画结束后删除集合中的这个动画对象
              var index = _this._animation.findIndex(function (a) {
                return animation === a.animation;
              });
              // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
              if (index !== -1) {
                _this._animation.splice(index, 1);
              }
              resolve(propertyValue.value);
            }
          });
        } else {
          // 不存在需要执行动画的增量(小于精度的)，就直接将精度筛选时累加的值应用到元素并执行帧回调
          element.style.setProperty(propertyName, propertyValue.toString());
          transition(propertyValue.value);
          resolve(propertyValue.value);
        }
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var end = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      // end是告诉动画取消时是停留在当前还是执行到终点
      var remainValues = [];
      this._animation = this._animation.filter(function (_ref2) {
        var animation = _ref2.animation,
          remainValue = _ref2.remainValue,
          cancel = _ref2.cancel;
        if (cancel) {
          animation[end ? 'end' : 'stop']();
          // 存储剩余没有执行的部分返回给调用者
          remainValues.push(remainValue);
          return false;
        }
        return true;
      });
      return remainValues;
    }
  }, {
    key: "transitioning",
    value: function transitioning() {
      return this._animation.length !== 0;
    }
  }]);
  return Transition;
}();
exports.default = Transition;