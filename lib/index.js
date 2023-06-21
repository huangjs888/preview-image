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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _gesture = _interopRequireDefault(require("./gesture"));
var _transition = _interopRequireWildcard(require("./transition"));
var _transform = _interopRequireDefault(require("./transform"));
var _adjust = require("./adjust");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function transition(transformRaw) {
  var _this = this;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deltaValue = {};
  var precision = {};
  var _this$_transform = this._transform,
    _this$_transform$a = _this$_transform.a,
    ta = _this$_transform$a === void 0 ? 0 : _this$_transform$a,
    _this$_transform$k = _this$_transform.k,
    tk = _this$_transform$k === void 0 ? 1 : _this$_transform$k,
    _this$_transform$x = _this$_transform.x,
    tx = _this$_transform$x === void 0 ? 0 : _this$_transform$x,
    _this$_transform$y = _this$_transform.y,
    ty = _this$_transform$y === void 0 ? 0 : _this$_transform$y;
  var a = transformRaw.a,
    k = transformRaw.k,
    x = transformRaw.x,
    y = transformRaw.y;
  if (typeof a === 'number') {
    deltaValue.a = (this._transform.a = a) - ta;
    // 角度精度按照屏幕尺寸一般暂时设置为0.001
    precision.a = 0.001;
  }
  if (typeof k === 'number') {
    deltaValue.k = (this._transform.k = k) - tk;
    // 缩放精度按照屏幕尺寸一般暂时设置为0.001
    precision.k = 0.001;
  }
  if (typeof x === 'number') {
    deltaValue.x = (this._transform.x = x) - tx;
    // 像素精度都在1px
    precision.x = 1;
  }
  if (typeof y === 'number') {
    deltaValue.y = (this._transform.y = y) - ty;
    // 像素精度都在1px
    precision.y = 1;
  }
  return this._transition.apply(deltaValue, _objectSpread({
    precision: precision,
    duration: 400,
    easing: _adjust.easeOutQuart,
    cancel: true
  }, options)).then(function (value) {
    if (!_this._transition.transitioning()) {
      // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
      _this._transition.bind(_this._transform.toRaw());
    }
    return value;
  });
}
var touchStart = function touchStart(e) {
  var _this2 = this;
  if (e.sourceEvent.touches.length > 1) {
    // 当单指未触发移动，接着放了另外的手指，则认为开启了双指操作，手指为2个
    if (this._fingers === 0) {
      this._fingers = 2;
    }
  }
  var _this$_transform2 = this._transform,
    _this$_transform2$a = _this$_transform2.a,
    ta = _this$_transform2$a === void 0 ? 0 : _this$_transform2$a,
    _this$_transform2$k = _this$_transform2.k,
    tk = _this$_transform2$k === void 0 ? 1 : _this$_transform2$k,
    _this$_transform2$x = _this$_transform2.x,
    tx = _this$_transform2$x === void 0 ? 0 : _this$_transform2$x,
    _this$_transform2$y = _this$_transform2.y,
    ty = _this$_transform2$y === void 0 ? 0 : _this$_transform2$y;
  this._transition.cancel().forEach(function (value) {
    // 取消动画（返回值是动画未执行的部分）后应该把this._transform内的值减掉还未执行的部分
    Object.keys(value).forEach(function (key) {
      var val = value[key];
      if (key === 'a') {
        _this2._transform.a = ta - val;
      } else if (key === 'k') {
        _this2._transform.k = tk - val;
      } else if (key === 'x') {
        _this2._transform.x = tx - val;
      } else if (key === 'y') {
        _this2._transform.y = ty - val;
      }
    });
    // 曲线救国 1：
    // _firstPoint和_preventSingleTap是_gesture内部记录判断是否执行doubleTap的内部参数
    // 这里注入设置，目的是使停止动画的这一次触摸忽略不参与记录判断doubleTap
    _this2._gesture._firstPoint = null;
    _this2._gesture._preventSingleTap = true;
  });
};
var touchMove = function touchMove(e) {
  if (e.sourceEvent.touches.length === 1 && this._fingers === 0) {
    // 当触发移动时，若只有一个手指在界面上，就认为一直只有一个手指，即使后面再放手指
    this._fingers = 1;
  }
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  var point = e.point,
    _e$angle = e.angle,
    angle = _e$angle === void 0 ? 0 : _e$angle,
    _e$scale = e.scale,
    scale = _e$scale === void 0 ? 1 : _e$scale,
    _e$deltaX = e.deltaX,
    deltaX = _e$deltaX === void 0 ? 0 : _e$deltaX,
    _e$deltaY = e.deltaY,
    deltaY = _e$deltaY === void 0 ? 0 : _e$deltaY;
  var _this$_transform3 = this._transform,
    _this$_transform3$a = _this$_transform3.a,
    ta = _this$_transform3$a === void 0 ? 0 : _this$_transform3$a,
    _this$_transform3$k = _this$_transform3.k,
    tk = _this$_transform3$k === void 0 ? 1 : _this$_transform3$k,
    _this$_transform3$x = _this$_transform3.x,
    tx = _this$_transform3$x === void 0 ? 0 : _this$_transform3$x,
    _this$_transform3$y = _this$_transform3.y,
    ty = _this$_transform3$y === void 0 ? 0 : _this$_transform3$y;
  var rotation = this.rotation,
    scalation = this.scalation,
    translation = this.translation;
  var _translation = (0, _slicedToArray2.default)(translation, 2),
    translationX = _translation[0],
    translationY = _translation[1];
  var transformRaw = {};
  if (this._fingers === 1) {
    // _fingers为1的时候，只进行位移，不进行旋转和缩放，相当于单指移动
    // 曲线救国 2：
    // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
    // 这里拿出来是为了阻止双指移动时改变了_rotateAngle类型，仅仅是让touchEnd的时候可以取消动画
    this._gesture._rotateAngle = null;
    var adjustTranlate = _adjust.between;
    var _tx = tx;
    var _ty = ty;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('translate')) {
      _tx = (0, _adjust.revokeDamping)(tx, (0, _adjust.execute)(translationX, tk));
      _ty = (0, _adjust.revokeDamping)(ty, (0, _adjust.execute)(translationY, tk));
      adjustTranlate = _adjust.performDamping;
    }
    transformRaw = {
      a: ta,
      k: tk,
      x: adjustTranlate(_tx + deltaX, (0, _adjust.execute)(translationX)),
      y: adjustTranlate(_ty + deltaY, (0, _adjust.execute)(translationY))
    };
  } else {
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    var adjustRotate = _adjust.between;
    var _ta = ta;
    if (this.isDamping('rotate')) {
      _ta = (0, _adjust.revokeDamping)(ta, (0, _adjust.execute)(rotation));
      adjustRotate = _adjust.performDamping;
    }
    var adjustScale = _adjust.between;
    var _tk = tk;
    if (this.isDamping('scale')) {
      _tk = (0, _adjust.revokeDamping)(tk, (0, _adjust.execute)(scalation), true);
      adjustScale = _adjust.performDamping;
    }
    var _adjustTranlate = _adjust.between;
    var _tx2 = tx;
    var _ty2 = ty;
    if (this.isDamping('translate')) {
      _tx2 = (0, _adjust.revokeDamping)(tx, (0, _adjust.execute)(translationX, tk));
      _ty2 = (0, _adjust.revokeDamping)(ty, (0, _adjust.execute)(translationY, tk));
      _adjustTranlate = _adjust.performDamping;
    }
    // 把原值进行各项变化，再进行总体阻尼计算
    var a = adjustRotate(_ta + angle, (0, _adjust.execute)(rotation));
    var k = adjustScale(_tk * scale, (0, _adjust.execute)(scalation), true);
    var _this$getCenterOffset = this.getCenterOffset(point, k),
      _this$getCenterOffset2 = (0, _slicedToArray2.default)(_this$getCenterOffset, 2),
      ox = _this$getCenterOffset2[0],
      oy = _this$getCenterOffset2[1];
    var x = _adjustTranlate(_tx2 + ox + deltaX, (0, _adjust.execute)(translationX, k));
    var y = _adjustTranlate(_ty2 + oy + deltaY, (0, _adjust.execute)(translationY, k));
    transformRaw = {
      a: a,
      k: k,
      x: x,
      y: y
    };
  }
  // 这里移动时不需要动画，可以直接进行绑定赋值
  this._transform = new _transform.default(transformRaw);
  this._transition.bind(transformRaw);
};
var touchEnd = function touchEnd(e) {
  if (e.sourceEvent.touches.length === 0 && this._fingers !== 0) {
    // 手指全部抬起时，手指数目置为0
    this._fingers = 0;
  }
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  var rotation = this.rotation,
    scalation = this.scalation,
    translation = this.translation;
  var _translation2 = (0, _slicedToArray2.default)(translation, 2),
    translationX = _translation2[0],
    translationY = _translation2[1];
  var _this$_transform4 = this._transform,
    _this$_transform4$a = _this$_transform4.a,
    ta = _this$_transform4$a === void 0 ? 0 : _this$_transform4$a,
    _this$_transform4$k = _this$_transform4.k,
    tk = _this$_transform4$k === void 0 ? 1 : _this$_transform4$k,
    _this$_transform4$x = _this$_transform4.x,
    tx = _this$_transform4$x === void 0 ? 0 : _this$_transform4$x,
    _this$_transform4$y = _this$_transform4.y,
    ty = _this$_transform4$y === void 0 ? 0 : _this$_transform4$y;
  // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
  if (this.isDamping('rotate')) {
    ta = (0, _adjust.revokeDamping)(ta, (0, _adjust.execute)(rotation));
  }
  if (this.isDamping('scale')) {
    tk = (0, _adjust.revokeDamping)(tk, (0, _adjust.execute)(scalation), true);
  }
  if (this.isDamping('translate')) {
    tx = (0, _adjust.revokeDamping)(tx, (0, _adjust.execute)(translationX, tk));
    ty = (0, _adjust.revokeDamping)(ty, (0, _adjust.execute)(translationY, tk));
  }
  this.transformTo({
    a: ta,
    k: tk,
    x: tx,
    y: ty
  }, e.point, {
    // 曲线救国 3：
    // _rotateAngle是_gesture内部记录双指累计旋转角度的参数
    // 这里拿出来是为了判断抬起之前是否进行过双指移动行为（如果未移动或单指是null），从而判断是否可以取消动画
    cancel: typeof this._gesture._rotateAngle !== 'number'
  });
};
var doubleTap = function doubleTap(e) {
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  var dblScale = this.dblScale,
    scalation = this.scalation;
  var _execute = (0, _adjust.execute)(dblScale),
    value = _execute.value,
    adjust = _execute.adjust;
  // 这三个比例都是用保留三位小数的结果进行比较
  // 其实这里的3应该用1/屏幕的宽高算出的小数位数
  // 此刻比例和位移
  var tk = this._transform.k || 1;
  // 双击变化的比例
  var dk = (0, _adjust.between)(value, (0, _adjust.execute)(scalation));
  // 再次双击恢复的比例（初始比例）
  var bk = (0, _adjust.between)(1, (0, _adjust.execute)(scalation));
  // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
  // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
  if (dk > bk && tk <= bk || dk < bk && tk >= bk) {
    if (adjust) {
      // 需要调整的情况，自己算偏移量，并且旋转置为0
      var _this$getCenterOffset3 = this.getCenterOffset(e.point, dk, adjust),
        _this$getCenterOffset4 = (0, _slicedToArray2.default)(_this$getCenterOffset3, 2),
        ox = _this$getCenterOffset4[0],
        oy = _this$getCenterOffset4[1];
      var _this$_transform5 = this._transform,
        _this$_transform5$x = _this$_transform5.x,
        tx = _this$_transform5$x === void 0 ? 0 : _this$_transform5$x,
        _this$_transform5$y = _this$_transform5.y,
        ty = _this$_transform5$y === void 0 ? 0 : _this$_transform5$y;
      this.transformTo({
        a: 0,
        k: dk,
        x: tx + ox,
        y: ty + oy
      });
    } else {
      // 交给transformTo
      this.transformTo({
        k: dk
      }, e.point);
    }
  } else {
    // 再次双击恢复
    if (adjust) {
      // 需要调整的情况，置为初始状态
      this.transformTo({
        a: 0,
        k: bk,
        x: 0,
        y: 0
      });
    } else {
      // 交给transformTo
      this.transformTo({
        k: bk
      }, e.point);
    }
  }
};
var swipe = function swipe(e) {
  var _this3 = this;
  if (this.transforming()) {
    // 若存在正在进行的渐变动画，则不做任何操作
    return;
  }
  var _e$velocity = e.velocity,
    velocity = _e$velocity === void 0 ? 0 : _e$velocity,
    swipeComputed = e.swipeComputed;
  if (velocity > 0 && swipeComputed) {
    var _this$getContainerSiz = this.getContainerSize(),
      width = _this$getContainerSiz.width,
      height = _this$getContainerSiz.height;
    var _this$_transform6 = this._transform,
      _this$_transform6$k = _this$_transform6.k,
      tk = _this$_transform6$k === void 0 ? 1 : _this$_transform6$k,
      _this$_transform6$x = _this$_transform6.x,
      tx = _this$_transform6$x === void 0 ? 0 : _this$_transform6$x,
      _this$_transform6$y = _this$_transform6.y,
      ty = _this$_transform6$y === void 0 ? 0 : _this$_transform6$y;
    // 设置减速度为 0.003，获取当速度减为 0 时的滑动距离和时间
    // 减速度为 0.003，这个需要测微信
    var _swipeComputed = swipeComputed(0.003, velocity > 3 ? 2 + Math.pow(velocity - 2, 1 / 3) : velocity // 对速度进行一个限制
      ),
      duration = _swipeComputed.duration,
      stretchX = _swipeComputed.stretchX,
      stretchY = _swipeComputed.stretchY;
    var _duration = Math.max(1200, Math.min(duration, 2500));
    // 判断x方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    var translationX = (0, _adjust.execute)(this.translation[0], tk);
    if ((0, _adjust.isBetween)(tx, translationX)) {
      var x = tx + stretchX;
      var t = _duration;
      if (!(0, _adjust.isBetween)(x, translationX)) {
        x = (0, _adjust.between)(x, translationX);
        var ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        if (this.isDamping('translate')) {
          var v = ratio * (2 * Math.abs(stretchX) / duration);
          x += width * Math.min(v / 20, 1 / 4) * (stretchX > 0 ? 1 : -1);
          ratio = Math.sqrt(1 - Math.abs((x - tx) / stretchX));
        }
        t = Math.max(t * (1 - ratio), 400);
      }
      // x方向进行惯性位移
      transition.apply(this, [{
        x: x
      }, {
        easing: _adjust.easeOutQuad,
        duration: t
      }]).then(function () {
        // 惯性位移后超出边界，则归位
        if (!(0, _adjust.isBetween)(x, translationX)) {
          transition.apply(_this3, [{
            x: (0, _adjust.between)(x, translationX)
          }]);
        }
      });
    } else {
      // 直接归位
      transition.apply(this, [{
        x: (0, _adjust.between)(tx, translationX)
      }]);
    }
    // 判断y方向此刻是否超出边界，如果超出，直接归位，未超出，则惯性位移
    var translationY = (0, _adjust.execute)(this.translation[1], tk);
    if ((0, _adjust.isBetween)(ty, translationY)) {
      var y = ty + stretchY;
      var _t = _duration;
      if (!(0, _adjust.isBetween)(y, translationY)) {
        y = (0, _adjust.between)(y, translationY);
        var _ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        if (this.isDamping('translate')) {
          var _v = _ratio * (2 * Math.abs(stretchY) / duration);
          y += height * Math.min(_v / 20, 1 / 4) * (stretchY > 0 ? 1 : -1);
          _ratio = Math.sqrt(1 - Math.abs((y - ty) / stretchY));
        }
        _t = Math.max(_t * (1 - _ratio), 400);
      }
      // y方向进行惯性位移
      transition.apply(this, [{
        y: y
      }, {
        easing: _adjust.easeOutQuad,
        duration: _t
      }]).then(function () {
        // 惯性位移后超出边界，则归位
        if (!(0, _adjust.isBetween)(y, translationY)) {
          transition.apply(_this3, [{
            y: (0, _adjust.between)(y, translationY)
          }]);
        }
      });
    } else {
      // 直接归位
      transition.apply(this, [{
        y: (0, _adjust.between)(ty, translationY)
      }]);
    }
  }
};
var ImageView = /*#__PURE__*/function () {
  // 可以进行阻尼的变换
  // 双击放大比例和是否调整放大时的中心点
  // 旋转范围
  // 缩放范围
  // 平移范围

  // 当前渐变对象
  function ImageView(_ref) {
    var container = _ref.container,
      element = _ref.element,
      damping = _ref.damping,
      dblScale = _ref.dblScale,
      rotation = _ref.rotation,
      scalation = _ref.scalation,
      translation = _ref.translation;
    (0, _classCallCheck2.default)(this, ImageView);
    (0, _defineProperty2.default)(this, "damping", []);
    (0, _defineProperty2.default)(this, "dblScale", {});
    (0, _defineProperty2.default)(this, "rotation", []);
    (0, _defineProperty2.default)(this, "scalation", []);
    (0, _defineProperty2.default)(this, "translation", []);
    (0, _defineProperty2.default)(this, "_fingers", 0);
    this.container = container;
    this.element = element;
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
    var a = (0, _adjust.between)(0, (0, _adjust.execute)(this.rotation)); // 初始角度a
    var k = (0, _adjust.between)(1, (0, _adjust.execute)(this.scalation)); // 初始比例k
    var x = (0, _adjust.between)(0, (0, _adjust.execute)(this.translation[0], k)); // 初始位移x
    var y = (0, _adjust.between)(0, (0, _adjust.execute)(this.translation[1], k)); //初始位移y
    this._transform = new _transform.default({
      a: a,
      k: k,
      x: x,
      y: y
    });
    // 创建过渡
    this._transition = new _transition.default({
      element: this.element,
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
            // 这里注意，在不存在任何过渡动画的时候，这里的this.value应该和上面的this._transform内的每项值应该是相等的
            // 但是由于 0.1+0.2!==0.3 的问题，导致经过各种计算后，其值并不是完全相等，存在极小的精度问题
            return new _transform.default(this.value).toString();
          }
        }]);
        return _class;
      }(_transition.TAProperty))(this._transform.toRaw())
    });
    // 绑定手势
    var gesture = new _gesture.default(this.container);
    if (gesture.done()) {
      gesture.on('touchStart', touchStart.bind(this));
      gesture.on('touchMove', touchMove.bind(this));
      gesture.on('doubleTap', doubleTap.bind(this));
      gesture.on('swipe', swipe.bind(this));
      gesture.on('touchEnd', touchEnd.bind(this));
    }
    this._gesture = gesture;
  }
  (0, _createClass2.default)(ImageView, [{
    key: "destory",
    value: function destory() {
      // 销毁手势事件
      this._gesture.destory();
    }
  }, {
    key: "isDamping",
    value: function isDamping(key) {
      return this.damping && this.damping.indexOf(key) !== -1;
    }
  }, {
    key: "setDamping",
    value: function setDamping(damping) {
      if (damping) {
        this.damping = damping;
        return;
      }
      this.damping = ['scale', 'translate']; // 如果不设置，默认只对缩放比例和位移进行阻尼
    }
  }, {
    key: "setDblScale",
    value: function setDblScale(k) {
      var _this4 = this;
      // 如果直接传入数字，那么adjust为false，value为传入的数字
      if (typeof k === 'number' && k > 0) {
        this.dblScale = {
          adjust: false,
          value: +k
        };
        return;
      }
      var adjust = true;
      if (k && typeof k !== 'number') {
        // 如果传入对象，且value是数字，那么adjust为传入的!!adjust，value为传入的value
        if (typeof k.value === 'number' && k.value > 0) {
          this.dblScale = {
            adjust: !!k.adjust,
            value: k.value
          };
          return;
        }
        // 如果传入对象，且value不是数字，那么adjust只有传入false才是false，其它都是true
        adjust = k.adjust !== false;
      }
      // 如果传入的不是数字也不是对象，或者传入对象，但是对象里的value不是数字，那么value取下面的计算
      // adjust取上面的adjust（即除非对象里adjust确切传入了false，否则都默认为true）
      // 测微信得到的结论，双击放大比例是
      // 1，元素宽与容器宽之比，元素高与容器高之比的最大值
      // 2，元素实际宽与元素宽之比，元素实际高与元素高之比的最小值
      // 3，在1、2两个值和数值2这三个之中的最大值
      this.dblScale = function () {
        var _this4$getContainerSi = _this4.getContainerSize(),
          cw = _this4$getContainerSi.width,
          ch = _this4$getContainerSi.height;
        var _this4$getElClientSiz = _this4.getElClientSize(),
          ew = _this4$getElClientSiz.width,
          eh = _this4$getElClientSiz.height;
        var _this4$getElNaturalSi = _this4.getElNaturalSize(),
          nw = _this4$getElNaturalSi.width,
          nh = _this4$getElNaturalSi.height;
        return {
          adjust: adjust,
          value: Math.max(2, Math.max(cw / ew, ch / eh), Math.min(nw / cw, nh / ch))
        };
      };
    }
  }, {
    key: "setRotation",
    value: function setRotation(a) {
      if (a && typeof a[0] === 'number' && typeof a[1] === 'number' && a[1] >= a[0]) {
        this.rotation = a; // 最大范围 -Infinity 到 + Infinity
        return;
      }
      // 测微信得到的结论，是不给旋转的
      this.rotation = function () {
        return [0, 0];
      }; // 如果设置不合理，则取默认
    }
  }, {
    key: "setScalation",
    value: function setScalation(k) {
      var _this5 = this;
      if (k && typeof k[0] === 'number' && typeof k[1] === 'number' && k[1] >= k[0] && k[0] > 0) {
        this.scalation = k; // 最大范围 0 到 +Infinity (不等于0)
        return;
      }
      // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
      this.scalation = function () {
        return [1, 2 * (0, _adjust.execute)(_this5.dblScale).value];
      }; // 如果设置不合理，则取默认
    }
  }, {
    key: "setTranslation",
    value: function setTranslation(xy) {
      this.setXTranslation(xy && xy[0]);
      this.setYTranslation(xy && xy[1]);
    }
  }, {
    key: "setXTranslation",
    value: function setXTranslation(x) {
      var _this6 = this;
      if (x && typeof x[0] === 'number' && typeof x[1] === 'number' && x[1] >= x[0]) {
        this.translation[0] = x; // 最大范围 -Infinity 到 + Infinity
        return;
      }
      // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
      this.translation[0] = function () {
        var k = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this6._transform.k || 1;
        var _this6$getContainerSi = _this6.getContainerSize(),
          cw = _this6$getContainerSi.width;
        var _this6$getElClientSiz = _this6.getElClientSize(),
          ew = _this6$getElClientSiz.width;
        var bx = Math.max((ew * k - cw) / 2, 0);
        return [-bx, bx];
      };
    }
  }, {
    key: "setYTranslation",
    value: function setYTranslation(y) {
      var _this7 = this;
      if (y && typeof y[0] === 'number' && typeof y[1] === 'number' && y[1] >= y[0]) {
        this.translation[1] = y; // 最大范围 -Infinity 到 +Infinity
        return;
      }
      // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
      this.translation[1] = function () {
        var k = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this7._transform.k || 1;
        var _this7$getContainerSi = _this7.getContainerSize(),
          ch = _this7$getContainerSi.height;
        var _this7$getElClientSiz = _this7.getElClientSize(),
          eh = _this7$getElClientSiz.height;
        var by = Math.max((eh * k - ch) / 2, 0);
        return [-by, by];
      };
    }
  }, {
    key: "getElClientSize",
    value: function getElClientSize() {
      // 获取目标元素初始化设置的宽高（不是进行缩放后的宽高，也不是原始宽高）
      var _this$element = this.element,
        clientWidth = _this$element.clientWidth,
        clientHeight = _this$element.clientHeight;
      return {
        width: clientWidth,
        height: clientHeight
      };
    }
  }, {
    key: "getElNaturalSize",
    value: function getElNaturalSize() {
      // 获取目标元素的实际原始宽高（一般是img元素才有的）
      var element = this.element;
      if ('naturalWidth' in element && 'naturalHeight' in element) {
        return {
          width: element.naturalWidth,
          height: element.naturalHeight
        };
      }
      return this.getElClientSize();
    }
  }, {
    key: "getContainerSize",
    value: function getContainerSize() {
      // 获取容器元素的原始宽高
      var _this$container = this.container,
        clientWidth = _this$container.clientWidth,
        clientHeight = _this$container.clientHeight;
      return {
        width: clientWidth,
        height: clientHeight
      };
    }
  }, {
    key: "getContainerCenter",
    value: function getContainerCenter() {
      // 获取容器中心点位置
      var _this$container$getBo = this.container.getBoundingClientRect(),
        left = _this$container$getBo.left,
        top = _this$container$getBo.top,
        width = _this$container$getBo.width,
        height = _this$container$getBo.height;
      return [left + width / 2, top + height / 2];
    }
  }, {
    key: "getCenterOffset",
    value: function getCenterOffset(point, k) {
      var adjust = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _this$_transform7 = this._transform,
        _this$_transform7$k = _this$_transform7.k,
        tk = _this$_transform7$k === void 0 ? 1 : _this$_transform7$k,
        _this$_transform7$x = _this$_transform7.x,
        tx = _this$_transform7$x === void 0 ? 0 : _this$_transform7$x,
        _this$_transform7$y = _this$_transform7.y,
        ty = _this$_transform7$y === void 0 ? 0 : _this$_transform7$y;
      var dk = k / tk;
      var _this$getContainerCen = this.getContainerCenter(),
        _this$getContainerCen2 = (0, _slicedToArray2.default)(_this$getContainerCen, 2),
        cx = _this$getContainerCen2[0],
        cy = _this$getContainerCen2[1];
      var ox = point[0] - (cx + tx);
      var oy = point[1] - (cy + ty);
      if (adjust) {
        // 思路：对元素进行划线分界
        // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
        // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
        // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
        // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
        // 5，元素左右计算方式如同上下方式一样得到ox
        // 测微信得到的结论
        // 这个偏移量需要要向着边缘点发散
        var _this$getContainerSiz2 = this.getContainerSize(),
          cw = _this$getContainerSiz2.width,
          ch = _this$getContainerSiz2.height;
        var _this$getElClientSize = this.getElClientSize(),
          width = _this$getElClientSize.width,
          height = _this$getElClientSize.height;
        var ew = width / tk;
        var eh = height / tk;
        ox = (0, _adjust.between)(ew - (cw - ew) / (dk - 1), [0, ew]) * (0, _adjust.ratioOffset)(ox / ew, dk, (0, _adjust.between)(cw / ew, [1, 2]));
        oy = (0, _adjust.between)(eh - (ch - eh) / (dk - 1), [0, eh]) * (0, _adjust.ratioOffset)(oy / eh, dk, (0, _adjust.between)(ch / eh, [1, 2]));
      }
      ox *= 1 - dk;
      oy *= 1 - dk;
      return [ox, oy];
    }
    // 负数顺时针，正数逆时针
  }, {
    key: "rotate",
    value: function rotate(a) {
      // 在原来的基础上再旋转 a
      return this.transform({
        a: a
      });
    }
    // 负数顺时针，正数逆时针
  }, {
    key: "rotateTo",
    value: function rotateTo(a) {
      // 直接旋转到 a
      return this.transformTo({
        a: a
      });
    }
  }, {
    key: "scale",
    value: function scale(k, point) {
      // 在原来的基础上相对 point 点缩放 k
      return this.transform({
        k: k
      }, point);
    }
  }, {
    key: "scaleTo",
    value: function scaleTo(k, point) {
      // 直接相对 point 点缩放到 k
      return this.transformTo({
        k: k
      }, point);
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      // 在原来的基础上平移 x, y
      return this.transform({
        x: x,
        y: y
      });
    }
  }, {
    key: "translateTo",
    value: function translateTo(x, y) {
      // 直接平移到 x, y
      return this.transformTo({
        x: x,
        y: y
      });
    }
  }, {
    key: "translateX",
    value: function translateX(x) {
      // 在原来的基础上横向平移 x
      return this.transform({
        x: x
      });
    }
  }, {
    key: "translateXTo",
    value: function translateXTo(x) {
      // 直接横向平移到 x
      return this.transformTo({
        x: x
      });
    }
  }, {
    key: "translateY",
    value: function translateY(y) {
      // 在原来的基础上竖向平移  y
      return this.transform({
        y: y
      });
    }
  }, {
    key: "translateYTo",
    value: function translateYTo(y) {
      // 直接竖向平移到 y
      return this.transformTo({
        y: y
      });
    }
  }, {
    key: "transform",
    value: function transform(transformRaw, point, options) {
      var _this$_transform8 = this._transform,
        _this$_transform8$a = _this$_transform8.a,
        ta = _this$_transform8$a === void 0 ? 0 : _this$_transform8$a,
        _this$_transform8$k = _this$_transform8.k,
        tk = _this$_transform8$k === void 0 ? 1 : _this$_transform8$k,
        _this$_transform8$x = _this$_transform8.x,
        tx = _this$_transform8$x === void 0 ? 0 : _this$_transform8$x,
        _this$_transform8$y = _this$_transform8.y,
        ty = _this$_transform8$y === void 0 ? 0 : _this$_transform8$y;
      var a = transformRaw.a,
        k = transformRaw.k,
        x = transformRaw.x,
        y = transformRaw.y;
      if (typeof a === 'number') {
        a += ta;
      }
      if (typeof k === 'number') {
        k *= tk;
      }
      if (typeof x === 'number') {
        x += tx;
      }
      if (typeof y === 'number') {
        y += ty;
      }
      return this.transformTo({
        a: a,
        k: k,
        x: x,
        y: y
      }, point, options);
    }
  }, {
    key: "transformTo",
    value: function transformTo(transformRaw, point, options) {
      var _point = point;
      var _options = options;
      if (!options && !Array.isArray(point)) {
        _options = point;
        _point = undefined;
      }
      var rotation = this.rotation,
        scalation = this.scalation,
        translation = this.translation;
      var _translation3 = (0, _slicedToArray2.default)(translation, 2),
        translationX = _translation3[0],
        translationY = _translation3[1];
      var _a = transformRaw.a,
        _k = transformRaw.k,
        _x = transformRaw.x,
        _y = transformRaw.y;
      var _transformRaw = {};
      if (typeof _a === 'number') {
        _transformRaw.a = (0, _adjust.between)(_a, (0, _adjust.execute)(rotation));
      }
      if (typeof _k === 'number') {
        var k = _transformRaw.k = (0, _adjust.between)(_k, (0, _adjust.execute)(scalation));
        if (Array.isArray(_point)) {
          var _this$getCenterOffset5 = this.getCenterOffset(_point, k),
            _this$getCenterOffset6 = (0, _slicedToArray2.default)(_this$getCenterOffset5, 2),
            ox = _this$getCenterOffset6[0],
            oy = _this$getCenterOffset6[1];
          var _this$_transform9 = this._transform,
            _this$_transform9$x = _this$_transform9.x,
            tx = _this$_transform9$x === void 0 ? 0 : _this$_transform9$x,
            _this$_transform9$y = _this$_transform9.y,
            ty = _this$_transform9$y === void 0 ? 0 : _this$_transform9$y;
          _transformRaw.x = (0, _adjust.between)((typeof _x === 'number' ? _x : tx) + ox, (0, _adjust.execute)(translationX, k));
          _transformRaw.y = (0, _adjust.between)((typeof _y === 'number' ? _y : ty) + oy, (0, _adjust.execute)(translationY, k));
        } else {
          if (typeof _x === 'number') {
            _transformRaw.x = (0, _adjust.between)(_x, (0, _adjust.execute)(translationX, k));
          }
          if (typeof _y === 'number') {
            _transformRaw.y = (0, _adjust.between)(_y, (0, _adjust.execute)(translationY, k));
          }
        }
      } else {
        if (typeof _x === 'number') {
          _transformRaw.x = (0, _adjust.between)(_x, (0, _adjust.execute)(translationX));
        }
        if (typeof _y === 'number') {
          _transformRaw.y = (0, _adjust.between)(_y, (0, _adjust.execute)(translationY));
        }
      }
      return transition.apply(this, [_transformRaw, _objectSpread({
        cancel: false
      }, _options || {})]);
    }
  }, {
    key: "transforming",
    value: function transforming() {
      return this._transition.transitioning();
    }
  }]);
  return ImageView;
}();
var _default = ImageView;
exports.default = _default;