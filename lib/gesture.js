"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _event = _interopRequireDefault(require("./event"));
var _util = require("./util");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var isCurrentTarget = function isCurrentTarget(target, currentTarget) {
  var _target = target;
  while (_target && _target !== currentTarget) {
    _target = _target.parentNode;
  }
  return !!_target;
};
function touchstarted(event) {
  var _this = this;
  var _touches = event.touches;
  if (!_touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    preventDefault: function preventDefault() {
      return event.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      return event.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      return event.stopImmediatePropagation();
    }
  };
  // 忽略掉注册事件元素之外的手指
  var touches = Array.prototype.filter.call(event.touches, function (t) {
    return isCurrentTarget(t.target, event.currentTarget);
  });
  // const touches = _touches;
  // 表示第一次放入手指
  if (event.changedTouches.length === touches.length) {
    this._touch0 = null;
    this._touch1 = null;
  }
  // 如果当前事件元素之外的屏幕上有手指，此时在事件元素上放一个手指，touches会包含该手指
  // 循环保存放在屏幕上的手指，这里只会保存最多两个，忽略超过三个的手指（只对单指和双指情形处理）
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    var p = [t.pageX, t.pageY];
    var touch = [p, p, p, [t.identifier]];
    if (!this._touch0) {
      this._touch0 = touch;
    } else if (!this._touch1 && this._touch0[3][0] !== t.identifier) {
      this._touch1 = touch;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  this._swipePoints = null;
  this._rotateAngle = null;
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  if (this._touch1 && this._touch0) {
    newEvent.point = (0, _util.getCenter)(this._touch0[0], this._touch1[0]);
    this.trigger('gestureStart', newEvent);
  }
  // 单指start
  else if (this._touch0) {
    newEvent.point = this._touch0[0];
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(function () {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      _this._preventTap = true;
      _this._preventSingleTap = true;
      _this._preventDoubleTap = true;
      _this._longTapTimer = null;
      if (_this._touch0) {
        newEvent.waitTime = _this.longTapInterval;
        _this.trigger('longTap', newEvent);
      }
    }, this.longTapInterval);
    if (this._singleTapTimer && this._firstPoint && (0, _util.getDistance)(this._firstPoint, this._touch0[0]) < this.doubleTapDistance) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指，或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      clearTimeout(this._singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
      newEvent.point = this._firstPoint;
    } else {
      this._firstPoint = this._touch0[0];
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.trigger('touchStart', newEvent);
}
function touchmoved(event) {
  var touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    preventDefault: function preventDefault() {
      return event.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      return event.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      return event.stopImmediatePropagation();
    }
  };
  // 循环更新手指
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    var p = [t.pageX, t.pageY];
    if (this._touch0 && this._touch0[3][0] === t.identifier) {
      this._touch0[1] = this._touch0[2];
      this._touch0[2] = p;
    } else if (this._touch1 && this._touch1[3][0] === t.identifier) {
      this._touch1[1] = this._touch1[2];
      this._touch1[2] = p;
    }
  }
  // 手指移动至少要有一个手指移动超过touchMoveDistance才会触发移动事件
  if (this._touch0 && (0, _util.getDistance)(this._touch0[0], this._touch0[2]) > this.touchMoveDistance || this._touch1 && (0, _util.getDistance)(this._touch1[0], this._touch1[2]) > this.touchMoveDistance) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (this._touch1 && this._touch0) {
      // 双指平移
      var eCenter = (0, _util.getCenter)(this._touch0[2], this._touch1[2]);
      var mCenter = (0, _util.getCenter)(this._touch0[1], this._touch1[1]);
      var sCenter = (0, _util.getCenter)(this._touch0[0], this._touch1[0]);
      newEvent.point = eCenter;
      newEvent.direction = (0, _util.getDirection)(mCenter, eCenter);
      newEvent.moveDirection = (0, _util.getDirection)(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - mCenter[0];
      newEvent.moveX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - mCenter[1];
      newEvent.moveY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      var eDistance = (0, _util.getDistance)(this._touch0[2], this._touch1[2]);
      var mDistance = (0, _util.getDistance)(this._touch0[1], this._touch1[1]);
      var sDistance = (0, _util.getDistance)(this._touch0[0], this._touch1[0]);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / mDistance;
        newEvent.moveScale = eDistance / sDistance;
      }
      var eAngle = (0, _util.getAngle)(this._touch0[2], this._touch1[2]);
      var mAngle = (0, _util.getAngle)(this._touch0[1], this._touch1[1]);
      // const sAngle = getAngle(this._touch0[0], this._touch1[0]);
      // 这里计算的三个angle均是向量（第一个参数为起点，第二个为终点）与x正半轴之间的夹角
      // 方向朝向y轴正半轴的为正值[0,180]，朝向y轴负半轴的为负值[-180,0]
      // 注意，这里坐标轴是页面坐标，x轴向右正方向，y轴向下正方向，原点在左上角
      var angle = eAngle - mAngle;
      if (angle < -180) {
        // 此种情况属于顺时针转动时mAngle突然由正变为负值（比如由178度顺时针旋转4度都-178度）
        // 这种情况，因为eAngle和mAngle是两次相邻的移动事件，间隔角度很小（4度）而不会是很大的（-356度）
        angle += 360;
      } else if (angle > 180) {
        // 和上面相反逆时针转动（比如由-178逆时针旋转4度到178）
        angle -= 360;
      }
      // 双指旋转本次和上一次的角度，正值顺时针，负值逆时针
      newEvent.angle = angle;
      // 双指旋转起点到终点的总旋转角度，正值顺时针，负值逆时针
      // 这里不能直接使用eAngle-sAngle，否则顺逆时针分不清，需要通过angle累加
      var moveAngle = (this._rotateAngle || 0) + angle;
      newEvent.moveAngle = this._rotateAngle = moveAngle;
      this.trigger('rotate', newEvent);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        this.trigger('pinch', newEvent);
      }
      this.trigger('multiPan', newEvent);
      this.trigger('gestureMove', newEvent);
    }
    // 单指移动
    else if (this._touch0) {
      var _timestamp = Date.now();
      // 第一次移动this._swipePoints为null
      var _swipePoints = this._swipePoints || [[], []];
      var _duration = _timestamp - ((_swipePoints[1][0] ? _swipePoints[1][0].timestamp : 0) || 0);
      // 当前时间与本阶段初始时间之差大于计入swipe的时间(swipeDuration)，则本阶段过时，下阶段开启
      if (_duration > this.swipeDuration) {
        // 将本阶段作为上一阶段，开启下一阶段作为本阶段
        _swipePoints[0] = _swipePoints[1];
        _swipePoints[1] = [];
      }
      // 将当前移动点和时间存入本阶段
      _swipePoints[1].push({
        point: this._touch0[2],
        timestamp: _timestamp
      });
      this._swipePoints = _swipePoints;
      newEvent.point = this._touch0[2];
      newEvent.direction = (0, _util.getDirection)(this._touch0[1], this._touch0[2]);
      newEvent.moveDirection = (0, _util.getDirection)(this._touch0[0], this._touch0[2]);
      newEvent.deltaX = this._touch0[2][0] - this._touch0[1][0];
      newEvent.moveX = this._touch0[2][0] - this._touch0[0][0];
      newEvent.deltaY = this._touch0[2][1] - this._touch0[1][1];
      newEvent.moveY = this._touch0[2][1] - this._touch0[0][1];
      // 触发单指平移事件
      this.trigger('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.trigger('touchMove', newEvent);
  }
}
function touchended(event) {
  var _this2 = this;
  var touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    preventDefault: function preventDefault() {
      return event.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      return event.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      return event.stopImmediatePropagation();
    }
  };
  // 临时保存当前手指
  var touch0 = null;
  var touch1 = null;
  // 循环删除已经拿开的手指
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    if (this._touch0 && this._touch0[3][0] === t.identifier) {
      touch0 = this._touch0;
      this._touch0 = null;
    } else if (this._touch1 && this._touch1[3][0] === t.identifier) {
      touch1 = this._touch1;
      this._touch1 = null;
    }
  }
  // 双指变单指
  if (this._touch1 && !this._touch0) {
    this._touch0 = this._touch1;
    this._touch1 = null;
    touch1 = touch0;
    touch0 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指
  if (this._touch0) {
    newEvent.point = (0, _util.getCenter)(this._touch0[2], this._touch1 ? this._touch1[2] : touch1 ? touch1[2] : []);
    this.trigger('gestureEnd', newEvent);
  }
  // 全部拿开（双指同时抬起，最后一指抬起，仅仅一指抬起）
  else if (touch0) {
    newEvent.point = touch1 ? (0, _util.getCenter)(touch0[2], touch1[2]) : touch0[2];
    if (!this._preventTap) {
      this.trigger('tap', newEvent);
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(function () {
        _this2._singleTapTimer = null;
        newEvent.delayTime = _this2.doubleTapInterval;
        _this2.trigger('singleTap', newEvent);
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      // 双击点使用第一次的点
      if (this._firstPoint) {
        newEvent.point = this._firstPoint;
      }
      newEvent.intervalTime = this.doubleTapInterval;
      this.trigger('doubleTap', newEvent);
    }
    // this._swipePoints存在表示开始了swipe行为
    if (this._swipePoints) {
      var _this$_swipePoints = (0, _slicedToArray2.default)(this._swipePoints, 2),
        prev = _this$_swipePoints[0],
        next = _this$_swipePoints[1];
      // 最后一次移动的点即为swipe终点
      var endPos = next[next.length - 1];
      // 最后一次移动点的时间减去手指抬起的时间，此间隔时间需小于等待时间raiseDuration，否则视为停止swipe
      if (Date.now() - endPos.timestamp <= this.raiseDuration) {
        // 找到计入swipe的时间(swipeDuration)内的swipe起点
        var startPos = next[0];
        for (var _i = prev.length - 1; _i >= 0; _i--) {
          if (endPos.timestamp - prev[_i].timestamp <= this.swipeDuration) {
            startPos = prev[_i];
          } else {
            break;
          }
        }
        // 根据swipe起点和终点的距离差与时间差算出swipe抬起时速率
        var velocity = (0, _util.getVelocity)(endPos.timestamp - startPos.timestamp, (0, _util.getDistance)(startPos.point, endPos.point));
        // swipe速率需要大于swipeVelocity，否则忽略不计，不视为swipe
        if (velocity > this.swipeVelocity) {
          // 滑动方向与x夹角
          var angle = (0, _util.getAngle)(startPos.point, endPos.point);
          // 惯性的方向
          newEvent.direction = (0, _util.getDirection)(startPos.point, endPos.point);
          newEvent.angle = angle;
          newEvent.velocity = velocity;
          // 给出按照velocity速度滑动，当速度减到0时的计算函数：
          // 当给出时间t，即在t时间内速度减到0，求出滑动的距离：
          // 当给出减速度a，即在减速度a的作用下，速度减到0，求出滑动的距离，和消耗的时间：
          // 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
          // 减速度某个时间的速度：v = v0 - a * t
          // s为滑动距离，v末速度为0，v0初速度为velocity
          newEvent.swipeComputed = function (factor) {
            var _velocity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : velocity;
            // 因子大于1可以认为传入的是时间毫秒数
            var duration = 0;
            var deceleration = 0;
            var distance = 0;
            if (factor > 1) {
              duration = factor;
              deceleration = _velocity / duration;
              distance = _velocity * duration / 2;
            }
            // 因子小于1可以认为传入的是减速度（减速如果大于1一般太大了，不符合使用场景）
            else if (factor > 0) {
              deceleration = factor;
              duration = _velocity / deceleration;
              distance = _velocity * _velocity / (2 * deceleration);
            }
            var _getVector = (0, _util.getVector)(distance, angle),
              _getVector2 = (0, _slicedToArray2.default)(_getVector, 2),
              stretchX = _getVector2[0],
              stretchY = _getVector2[1];
            return {
              duration: duration,
              // swipe速率减到0花费的时间
              stretchX: stretchX,
              // x方向swipe惯性距离（抬起后，继续移动的距离）
              stretchY: stretchY,
              // y方向swipe惯性距离（抬起后，继续移动的距离）
              deceleration: deceleration // swipe速率减到0的减速度
            };
          };

          this.trigger('swipe', newEvent);
        }
      }
    }
  }
  this.trigger('touchEnd', newEvent);
  // 只剩下一根在上面了
  if (this._touch0 && !this._touch1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._touch0[0] = this._touch0[1] = this._touch0[2];
    // 同时可以触发一次start事件
    newEvent.point = this._touch0[0];
    this.trigger('touchStart', newEvent);
  }
}
function touchcanceled(event) {
  this.trigger('touchCancel', {
    currentTarget: this.element,
    point: [],
    timestamp: Date.now(),
    sourceEvent: event,
    preventDefault: function preventDefault() {
      return event.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      return event.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      return event.stopImmediatePropagation();
    }
  });
  touchended.apply(this, [event]);
}
function scrollcanceled() {
  if (this._singleTapTimer) {
    clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  this._firstPoint = null;
  this._touch0 = null;
  this._touch1 = null;
  this._preventTap = true;
  this._swipePoints = null;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  this._rotateAngle = null;
}
var Gesture = /*#__PURE__*/function (_EventTarget) {
  (0, _inherits2.default)(Gesture, _EventTarget);
  var _super = _createSuper(Gesture);
  // 保存第一个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]
  // 保存第二个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]

  function Gesture(element, options) {
    var _this3;
    (0, _classCallCheck2.default)(this, Gesture);
    _this3 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_rotateAngle", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_singleTapTimer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_longTapTimer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_swipePoints", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventSingleTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventDoubleTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_firstPoint", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_touch0", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_touch1", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_destory", null);
    var tempElement;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    _this3.element = tempElement;
    var _ref = options || {},
      longTapInterval = _ref.longTapInterval,
      doubleTapInterval = _ref.doubleTapInterval,
      doubleTapDistance = _ref.doubleTapDistance,
      touchMoveDistance = _ref.touchMoveDistance,
      swipeVelocity = _ref.swipeVelocity,
      swipeDuration = _ref.swipeDuration,
      raiseDuration = _ref.raiseDuration;
    _this3.longTapInterval = (0, _util.fixOption)(longTapInterval, 750, 500);
    _this3.doubleTapInterval = (0, _util.fixOption)(doubleTapInterval, 250, 200);
    _this3.doubleTapDistance = (0, _util.fixOption)(doubleTapDistance, 30, 1);
    _this3.touchMoveDistance = (0, _util.fixOption)(touchMoveDistance, 3, 0);
    _this3.swipeVelocity = (0, _util.fixOption)(swipeVelocity, 0.3, 0);
    _this3.swipeDuration = (0, _util.fixOption)(swipeDuration, 100, 1);
    _this3.raiseDuration = (0, _util.fixOption)(raiseDuration, 100, 1);
    // 注册触摸事件
    if ((0, _util.isTouchable)(_this3.element)) {
      var started = touchstarted.bind((0, _assertThisInitialized2.default)(_this3));
      var moved = touchmoved.bind((0, _assertThisInitialized2.default)(_this3));
      var ended = touchended.bind((0, _assertThisInitialized2.default)(_this3));
      var canceled = touchcanceled.bind((0, _assertThisInitialized2.default)(_this3));
      _this3.element.addEventListener('touchstart', started, false);
      _this3.element.addEventListener('touchmove', moved, false);
      _this3.element.addEventListener('touchend', ended, false);
      _this3.element.addEventListener('touchcancel', canceled, false);
      var scrolled = scrollcanceled.bind((0, _assertThisInitialized2.default)(_this3));
      window.addEventListener('scroll', scrolled);
      _this3._destory = function () {
        _this3.element.removeEventListener('touchstart', started);
        _this3.element.removeEventListener('touchmove', moved);
        _this3.element.removeEventListener('touchend', ended);
        _this3.element.removeEventListener('touchcancel', canceled);
        window.removeEventListener('scroll', scrolled);
      };
    }
    return _this3;
  }
  (0, _createClass2.default)(Gesture, [{
    key: "done",
    value: function done() {
      return !!this._destory;
    }
  }, {
    key: "destory",
    value: function destory() {
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(Gesture.prototype), "off", this).call(this);
      scrollcanceled.apply(this);
      // 解除手势事件
      if (this._destory) {
        this._destory();
        this._destory = null;
      }
    }
  }]);
  return Gesture;
}(_event.default);
var _default = Gesture;
exports.default = _default;