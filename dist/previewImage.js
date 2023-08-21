(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PreviewImage"] = factory();
	else
		root["PreviewImage"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@huangjs888/damping/es/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/damping/es/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   performDamping: function() { return /* binding */ performDamping; },
/* harmony export */   revokeDamping: function() { return /* binding */ revokeDamping; }
/* harmony export */ });
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 14:59:57
 * @Description: ******
 */

function damping(value, max, expo, revoke) {
  if (revoke === void 0) {
    revoke = false;
  }
  if (value < 1 || max < 1 ||
  // 反算的时候value必须小于max
  revoke && value > max || expo <= 0 || expo > 1) {
    return value;
  }
  if (revoke) {
    return Math.pow((max - 1) * value / (max - value), 1 / expo);
  }
  return max / (1 + (max - 1) / Math.pow(value, expo));
}
// 阻尼值
function performDamping(value, option) {
  if (option === void 0) {
    option = {};
  }
  if (value === 0) {
    return 0;
  }
  var _option = option,
    _option$max = _option.max,
    max = _option$max === void 0 ? 9999 : _option$max,
    _option$mode = _option.mode,
    mode = _option$mode === void 0 ? 0 : _option$mode,
    _option$expo = _option.expo,
    expo = _option$expo === void 0 ? 0.88 : _option$expo;
  var _value = Math.abs(value);
  if (_value < 1) {
    if (mode === 1) {
      // 倒数模式
      _value = 1 / damping(1 / _value, max, expo);
    } else {
      // 加1模式
      _value = damping(_value + 1, max, expo) - 1;
    }
  } else {
    _value = damping(_value, max, expo);
  }
  return _value * (value > 0 ? 1 : -1);
}
// 阻尼原值
function revokeDamping(value, option) {
  if (option === void 0) {
    option = {};
  }
  if (value === 0) {
    return 0;
  }
  var _option2 = option,
    _option2$max = _option2.max,
    max = _option2$max === void 0 ? 9999 : _option2$max,
    _option2$mode = _option2.mode,
    mode = _option2$mode === void 0 ? 0 : _option2$mode,
    _option2$expo = _option2.expo,
    expo = _option2$expo === void 0 ? 0.88 : _option2$expo;
  var _value = Math.abs(value);
  if (_value < 1) {
    if (mode === 1) {
      // 倒数模式
      _value = 1 / damping(1 / _value, max, expo, true);
    } else {
      // 加1模式
      _value = damping(_value + 1, max, expo, true) - 1;
    }
  } else {
    _value = damping(_value, max, expo, true);
  }
  return _value * (value > 0 ? 1 : -1);
}

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/event.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/event.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EventTarget; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/splice */ "./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0__);

/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:33:48
 * @Description: ******
 */
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    this.events = {};
    this.events = {};
  }
  var _proto = EventTarget.prototype;
  _proto.one = function one(type, handler, single) {
    var _this = this;
    var onceHandler = typeof handler === 'function' ? function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 该事件只执行一次，执行完就解除事件
      handler.apply(null, args);
      _this.off(type, onceHandler, single);
    } : handler;
    this.on(type, onceHandler, single);
  };
  _proto.on = function on(type, handler, single) {
    var events = this.events[type] || {
      pool: [],
      single: -1
    };
    if (typeof handler === 'function') {
      if (single) {
        // 该事件只能注册一次，每次注册都会替换上次注册的，类似于dom属性事件赋值注册比如element.onclick = ()=>{}
        if (events.single === -1) {
          // 记录该单独事件在所有事件的位置
          events.single = events.pool.push(handler) - 1;
        } else {
          events.pool[events.single] = handler;
        }
      } else {
        // 该事件可以注册多次，执行时，会遍历全部事件全部执行，类似于dom的addEventListener
        // 注册进去之前会检查是否有相同的处理程序，如果有，则不再添加（独立程序不参与）
        var unregistered = true;
        for (var i = 0, len = events.pool.length; i < len; i++) {
          if (events.pool[i] === handler && i !== events.single) {
            unregistered = false;
            break;
          }
        }
        if (unregistered) {
          events.pool.push(handler);
        }
      }
    } else if (single && events.single !== -1) {
      var _context;
      // 需要把独立事件删除，相当于解绑独立事件
      _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context = events.pool).call(_context, events.single, 1);
      events.single = -1;
    }
    this.events[type] = events;
  };
  _proto.off = function off(type, handler, single) {
    if (typeof type === 'undefined') {
      // 没有type则删除全部事件
      this.events = {};
    } else if (typeof handler === 'undefined') {
      // 删除type下的所有事件
      delete this.events[type];
    } else if (single) {
      var events = this.events[type];
      if (events && events.single !== -1) {
        var _context2;
        // 删除独立程序事件
        _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context2 = events.pool).call(_context2, events.single, 1);
        events.single = -1;
      }
    } else {
      var _events = this.events[type];
      if (_events) {
        // 检查并删除事件池内事件
        for (var i = _events.pool.length - 1; i >= 0; i--) {
          if (_events.pool[i] === handler && i !== _events.single) {
            var _context3;
            _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context3 = _events.pool).call(_context3, i, 1);
            // 因为相同事件只会有一个，所以删除后不需要再检查了
            break;
          }
        }
      }
    }
  };
  _proto.emit = function emit(type, event) {
    var events = this.events[type];
    if (events) {
      // 循环执行事件池里的事件
      for (var i = 0, len = events.pool.length; i < len; i++) {
        var handler = events.pool[i];
        if (typeof handler === 'function') {
          var immediatePropagation = handler.apply(null, [event, type]);
          // 返回值为false，则阻止后于该事件注册的同类型事件触发
          if (immediatePropagation === false) {
            break;
          }
        }
      }
    }
  };
  return EventTarget;
}();


/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/gesture.js":
/*!********************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/gesture.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/assertThisInitialized */ "./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/inheritsLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./node_modules/@huangjs888/gesture/es/event.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./node_modules/@huangjs888/gesture/es/util.js");


/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:13:10
 * @Description: ******
 */



function started(event) {
  var _this = this;
  var _getEventPoints = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event, true),
    points = _getEventPoints.points,
    isFirst = _getEventPoints.isFirst;
  if (!points) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  // 表示第一次放入手指（点）
  if (isFirst) {
    // 第一次点击，如果存在wheel没执行，需要执行掉
    if (this._wheelTimerEnd) {
      window.clearTimeout(this._wheelTimerEnd.timer);
      this._wheelTimerEnd.wheelEnd();
      this._wheelTimerEnd = null;
    }
    this._pointer0 = null;
    this._pointer1 = null;
  } else {
    if (this._pointer0) {
      this._pointer0.changed = false;
    }
    if (this._pointer1) {
      this._pointer1.changed = false;
    }
  }
  // 如果当前事件元素之外的屏幕上有手指（点），此时在事件元素上放一个手指（点），points会包含该手指（点）
  // 循环保存放在屏幕上的手指（点），这里只会保存最多两个，忽略超过三个的手指（点）（只对单指和双指情形处理）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    var p = [t.pageX, t.pageY];
    var pointer = {
      start: p,
      previous: p,
      current: p,
      identifier: t.identifier,
      changed: true
    };
    if (!this._pointer0) {
      this._pointer0 = pointer;
    } else if (!this._pointer1 && this._pointer0.identifier !== t.identifier) {
      this._pointer1 = pointer;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  this._swipePoints = null;
  this._rotateAngle = 0;
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  var pointer0 = this._pointer0;
  var pointer1 = this._pointer1;
  if (pointer1 && pointer0) {
    this._firstPointer = null;
    newEvent.pointers = [pointer0, pointer1];
    newEvent.getPoint = function () {
      return (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.current, pointer1.current);
    };
    this.emit('gestureStart', newEvent);
  }
  // 单指start
  else if (pointer0) {
    newEvent.pointers = [pointer0];
    newEvent.getPoint = function () {
      return pointer0.current;
    };
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(function () {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      _this._preventTap = true;
      _this._preventSingleTap = true;
      _this._preventDoubleTap = true;
      _this._longTapTimer = null;
      _this._firstPointer = null;
      newEvent.waitTime = _this.longTapInterval;
      _this.emit('longTap', newEvent);
    }, this.longTapInterval);
    var firstPointer = this._firstPointer;
    var singleTapTimer = this._singleTapTimer;
    if (singleTapTimer && firstPointer && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(firstPointer.current, pointer0.current) < this.doubleTapDistance) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指（点），或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      window.clearTimeout(singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
      newEvent.getPoint = function () {
        return firstPointer.current;
      };
    } else {
      this._firstPointer = pointer0;
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.emit('pointerStart', newEvent);
}
function moved(event) {
  var _getEventPoints2 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event),
    points = _getEventPoints2.points;
  if (!points) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环更新手指（点）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    var p = [t.pageX, t.pageY];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = p;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      this._pointer1.previous = this._pointer1.current;
      this._pointer1.current = p;
    }
  }
  // 手指（点）移动至少要有一个手指（点）移动超过touchMoveDistance才会触发移动事件

  var pointer0 = this._pointer0;
  var pointer1 = this._pointer1;
  if (pointer0 && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(pointer0.start, pointer0.current) > this.touchMoveDistance || pointer1 && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(pointer1.start, pointer1.current) > this.touchMoveDistance) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    this._firstPointer = null;
    if (this._longTapTimer) {
      window.clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (pointer1 && pointer0) {
      newEvent.pointers = [pointer0, pointer1];
      var start0 = pointer0.start,
        previous0 = pointer0.previous,
        current0 = pointer0.current;
      var start1 = pointer1.start,
        previous1 = pointer1.previous,
        current1 = pointer1.current;
      // 双指平移
      var eCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(current0, current1);
      var mCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(previous0, previous1);
      var sCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(start0, start1);
      newEvent.getPoint = function (whichOne) {
        return whichOne === 'start' ? sCenter : whichOne === 'previous' ? mCenter : eCenter;
      };
      newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(mCenter, eCenter);
      newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - mCenter[0];
      newEvent.moveX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - mCenter[1];
      newEvent.moveY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      var eDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(current0, current1);
      var mDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(previous0, previous1);
      var sDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(start0, start1);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / mDistance;
        newEvent.moveScale = eDistance / sDistance;
      }
      var eAngle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(current0, current1);
      var mAngle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(previous0, previous1);
      // const sAngle = getAngle(start0, start1);
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
      this._rotateAngle += angle;
      newEvent.moveAngle = this._rotateAngle;
      this.emit('rotate', newEvent);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        this.emit('scale', newEvent);
      }
      this.emit('multiPan', newEvent);
      this.emit('gestureMove', newEvent);
    }
    // 单指移动
    else if (pointer0) {
      newEvent.pointers = [pointer0];
      var start = pointer0.start,
        previous = pointer0.previous,
        current = pointer0.current;
      newEvent.getPoint = function (whichOne) {
        return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
      };
      newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(previous, current);
      newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(start, current);
      newEvent.deltaX = current[0] - previous[0];
      newEvent.moveX = current[0] - start[0];
      newEvent.deltaY = current[1] - previous[1];
      newEvent.moveY = current[1] - start[1];
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
        point: current,
        timestamp: _timestamp
      });
      this._swipePoints = _swipePoints;
      // 触发单指平移事件
      this.emit('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.emit('pointerMove', newEvent);
  }
}
function ended(event) {
  var _this2 = this;
  var _getEventPoints3 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event),
    points = _getEventPoints3.points;
  if (!points) {
    return;
  }
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  // 临时保存当前手指（点）
  var pointer0 = null;
  var pointer1 = null;
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环删除已经拿开的手指（点）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      pointer0 = this._pointer0;
      this._pointer0 = null;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      pointer1 = this._pointer1;
      this._pointer1 = null;
    }
  }
  // 双指变单指
  if (this._pointer1 && !this._pointer0) {
    this._pointer0 = this._pointer1;
    this._pointer1 = null;
    pointer1 = pointer0;
    pointer0 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指（点）
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    if (this._pointer1) {
      // 剩余两指
      newEvent.pointers.push(this._pointer1);
    } else if (pointer1) {
      // 剩余一指
      newEvent.leavePointers = [pointer1];
    }
    var start = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.start, this._pointer1 ? this._pointer1.start : pointer1 ? pointer1.start : []);
    var previous = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.previous, this._pointer1 ? this._pointer1.previous : pointer1 ? pointer1.previous : []);
    var current = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.current, this._pointer1 ? this._pointer1.current : pointer1 ? pointer1.current : []);
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    };
    this.emit('gestureEnd', newEvent);
  }
  // 全部拿开
  else if (pointer0) {
    // 多指的最后一指抬起，仅仅一指抬起
    newEvent.leavePointers = [pointer0];
    if (pointer1) {
      // 双指同时抬起
      newEvent.leavePointers.push(pointer1);
    }
    var _start = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.start, pointer1.start) : pointer0.start;
    var _previous = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.previous, pointer1.previous) : pointer0.previous;
    var _current = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.current, pointer1.current) : pointer0.current;
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? _start : whichOne === 'previous' ? _previous : _current;
    };
    if (!this._preventTap) {
      this.emit('tap', newEvent);
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(function () {
        _this2._singleTapTimer = null;
        newEvent.delayTime = _this2.doubleTapInterval;
        _this2.emit('singleTap', newEvent);
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      // 双击点使用第一次的点
      var firstPointer = this._firstPointer;
      if (firstPointer) {
        newEvent.getPoint = function () {
          return firstPointer.current;
        };
      }
      newEvent.intervalTime = this.doubleTapInterval;
      this.emit('doubleTap', newEvent);
    }
    // this._swipePoints存在表示开始了swipe行为
    if (this._swipePoints) {
      var _this$_swipePoints = this._swipePoints,
        prev = _this$_swipePoints[0],
        next = _this$_swipePoints[1];
      // 最后一次移动的点即为swipe终点
      var endPos = next[next.length - 1];
      // 最后一次移动点的时间减去手指（点）抬起的时间，此间隔时间需小于等待时间raiseDuration，否则视为停止swipe
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
        var velocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getVelocity)(endPos.timestamp - startPos.timestamp, (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(startPos.point, endPos.point));
        // swipe速率需要大于swipeVelocity，否则忽略不计，不视为swipe
        if (velocity > this.swipeVelocity) {
          // 滑动方向与x夹角
          var angle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(startPos.point, endPos.point);
          // 惯性的方向
          newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(startPos.point, endPos.point);
          newEvent.angle = angle;
          newEvent.velocity = velocity;
          // 给出按照velocity速度滑动，当速度减到0时的计算函数：
          // 当给出时间t，即在t时间内速度减到0，求出滑动的距离：
          // 当给出减速度a，即在减速度a的作用下，速度减到0，求出滑动的距离，和消耗的时间：
          // 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
          // 减速度某个时间的速度：v = v0 - a * t
          // s为滑动距离，v末速度为0，v0初速度为velocity
          newEvent.swipeComputed = function (factor, _velocity) {
            if (_velocity === void 0) {
              _velocity = velocity;
            }
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
            var _getVector = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getVector)(distance, angle),
              stretchX = _getVector[0],
              stretchY = _getVector[1];
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

          this.emit('swipe', newEvent);
        }
      }
    }
  }
  this.emit('pointerEnd', newEvent);
  /* // 只剩下一根在上面了，以下事件交给用户自行放在pointerEnd事件里自行判断
  if (this._pointer0 && !this._pointer1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._pointer0.start = this._pointer0.previous = this._pointer0.current;
    // 同时可以触发一次start事件
    newEvent.pointers = [this._pointer0];
    newEvent.pointer = this._pointer0;
    this.emit('pointerStart', newEvent);
  } */
}

function canceled(event) {
  event.stopImmediatePropagation();
  this.emit('pointerCancel', {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  });
  ended.apply(this, [event]);
}
function scrolled() {
  if (this._singleTapTimer) {
    window.clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  if (this._wheelTimerEnd) {
    window.clearTimeout(this._wheelTimerEnd.timer);
    this._wheelTimerEnd = null;
  }
  this._firstPointer = null;
  this._pointer0 = null;
  this._pointer1 = null;
  this._preventTap = true;
  this._swipePoints = null;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
}
function downed(event) {
  var that = this;
  window.addEventListener('mousemove', mousemoved);
  window.addEventListener('mouseup', mouseupped);
  window.addEventListener('blur', blured);
  window.addEventListener('dragstart', dragstarted, {
    capture: true,
    passive: false
  });
  if ('onselectstart' in window.document.documentElement) {
    window.addEventListener('selectstart', dragstarted, {
      capture: true,
      passive: false
    });
  }
  function unbind() {
    window.removeEventListener('mousemove', mousemoved);
    window.removeEventListener('mouseup', mouseupped);
    window.removeEventListener('blur', blured);
    window.removeEventListener('dragstart', dragstarted);
    if ('onselectstart' in window.document.documentElement) {
      window.removeEventListener('selectstart', dragstarted);
    }
  }
  function blured(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    unbind();
  }
  function dragstarted(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function mousemoved(e) {
    if (event.button === 0) {
      moved.apply(that, [e]);
    } else {
      e.preventDefault();
      e.stopImmediatePropagation();
      var newEvent = {
        currentTarget: that.element,
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: function getPoint() {
          return [0, 0];
        }
      };
      var point = [e.pageX, e.pageY];
      if (that._pointer0) {
        that._pointer0.previous = that._pointer0.current;
        that._pointer0.current = point;
        newEvent.pointers = [that._pointer0];
        var _that$_pointer = that._pointer0,
          start = _that$_pointer.start,
          previous = _that$_pointer.previous,
          current = _that$_pointer.current;
        newEvent.getPoint = function (whichOne) {
          return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
        };
        newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(previous, current);
        newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(start, current);
        newEvent.deltaX = current[0] - previous[0];
        newEvent.moveX = current[0] - start[0];
        newEvent.deltaY = current[1] - previous[1];
        newEvent.moveY = current[1] - start[1];
        // 根据移动距离计算：1度 = 4px; 正值顺时针，负值逆时针
        newEvent.angle = newEvent.deltaX / 4;
        newEvent.moveAngle = newEvent.moveX / 4;
        that.emit('rotate', newEvent);
      }
    }
  }
  function mouseupped(e) {
    unbind();
    if (event.button === 0) {
      ended.apply(that, [e]);
    } else {
      e.stopImmediatePropagation();
      var newEvent = {
        currentTarget: that.element,
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: function getPoint() {
          return [0, 0];
        }
      };
      var point = [e.pageX, e.pageY];
      if (that._pointer0) {
        var pointer0 = that._pointer0;
        that._pointer0 = null;
        pointer0.previous = pointer0.current;
        pointer0.current = point;
        newEvent.leavePointers = [pointer0];
        var start = pointer0.start,
          previous = pointer0.previous,
          current = pointer0.current;
        newEvent.getPoint = function (whichOne) {
          return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
        };
      }
      newEvent.angle = 0 / 0;
      that.emit('rotate', newEvent);
    }
  }
  if (event.button === 0) {
    started.apply(that, [event]);
  } else {
    event.preventDefault();
    event.stopImmediatePropagation();
    // 如果存在wheel没执行，需要执行掉
    if (that._wheelTimerEnd) {
      window.clearTimeout(that._wheelTimerEnd.timer);
      that._wheelTimerEnd.wheelEnd();
      that._wheelTimerEnd = null;
    }
    var point = [event.pageX, event.pageY];
    that._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true
    };
  }
}
function wheeled(event) {
  var _this3 = this;
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  var point = [event.pageX, event.pageY];
  if (this._wheelTimerEnd) {
    if (this._pointer0) {
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = point;
    }
    window.clearTimeout(this._wheelTimerEnd.timer);
    // wheelRoll
  } else {
    this._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true
    };
    // wheelstart
  }

  var wheelEnd = function wheelEnd() {
    _this3._pointer0 = null;
    _this3._wheelTimerEnd = null;
    newEvent.timestamp = Date.now();
    // 表示滚轮结束，不参与计算
    newEvent.scale = 0 / 0;
    _this3.emit('scale', newEvent);
    // wheelEnd
  };

  this._wheelTimerEnd = {
    wheelEnd: wheelEnd,
    timer: window.setTimeout(wheelEnd, this.wheelDelay),
    scale: this._wheelTimerEnd ? this._wheelTimerEnd.scale : 1
  };
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    var _this$_pointer = this._pointer0,
      start = _this$_pointer.start,
      previous = _this$_pointer.previous,
      current = _this$_pointer.current;
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    };
    var scale = Math.pow(2, -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002));
    this._wheelTimerEnd.scale *= scale;
    newEvent.moveScale = this._wheelTimerEnd.scale;
    newEvent.scale = scale;
    this.emit('scale', newEvent);
  }
}
var Gesture = /*#__PURE__*/function (_EventTarget) {
  (0,_babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Gesture, _EventTarget);
  function Gesture(element, options) {
    var _this4;
    _this4 = _EventTarget.call(this) || this;
    _this4._rotateAngle = 0;
    _this4._singleTapTimer = null;
    _this4._longTapTimer = null;
    _this4._wheelTimerEnd = null;
    _this4._preventTap = true;
    _this4._swipePoints = null;
    _this4._preventSingleTap = true;
    _this4._preventDoubleTap = true;
    _this4._firstPointer = null;
    _this4._pointer0 = null;
    _this4._pointer1 = null;
    _this4._destory = null;
    var tempElement;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    _this4.element = tempElement;
    var _ref = options || {},
      wheelDelay = _ref.wheelDelay,
      longTapInterval = _ref.longTapInterval,
      doubleTapInterval = _ref.doubleTapInterval,
      doubleTapDistance = _ref.doubleTapDistance,
      touchMoveDistance = _ref.touchMoveDistance,
      swipeVelocity = _ref.swipeVelocity,
      swipeDuration = _ref.swipeDuration,
      raiseDuration = _ref.raiseDuration;
    _this4.wheelDelay = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(wheelDelay, 350, 1);
    _this4.longTapInterval = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(longTapInterval, 750, 1);
    _this4.doubleTapInterval = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(doubleTapInterval, 250, 1);
    _this4.doubleTapDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(doubleTapDistance, 30, 1);
    _this4.touchMoveDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(touchMoveDistance, 3, 0);
    _this4.swipeVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(swipeVelocity, 0.3, 0);
    _this4.swipeDuration = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(swipeDuration, 100, 1);
    _this4.raiseDuration = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(raiseDuration, 100, 1);
    // 注册触摸事件
    var tmscrolled = scrolled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
    if ((0,_util__WEBPACK_IMPORTED_MODULE_3__.isTouchable)(_this4.element)) {
      var touchstarted = started.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchmoved = moved.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchended = ended.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchcanceled = canceled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('touchstart', touchstarted, false);
      _this4.element.addEventListener('touchmove', touchmoved, false);
      _this4.element.addEventListener('touchend', touchended, false);
      _this4.element.addEventListener('touchcancel', touchcanceled, false);
      window.addEventListener('scroll', tmscrolled);
      _this4._destory = function () {
        _this4.element.removeEventListener('touchstart', touchstarted);
        _this4.element.removeEventListener('touchmove', touchmoved);
        _this4.element.removeEventListener('touchend', touchended);
        _this4.element.removeEventListener('touchcancel', touchcanceled);
        window.removeEventListener('scroll', tmscrolled);
      };
    } else {
      // 注册触摸事件
      var mousedowned = downed.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('mousedown', mousedowned, false);
      var mousewheeled = wheeled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('wheel', mousewheeled, false);
      window.addEventListener('scroll', tmscrolled);
      _this4._destory = function () {
        _this4.element.removeEventListener('mousedown', mousedowned);
        _this4.element.removeEventListener('wheel', mousewheeled);
        window.removeEventListener('scroll', tmscrolled);
      };
    }
    return _this4;
  }
  var _proto = Gesture.prototype;
  _proto.isTouch = function isTouch() {
    return (0,_util__WEBPACK_IMPORTED_MODULE_3__.isTouchable)(this.element);
  };
  _proto.destory = function destory() {
    // 解除所有事件
    _EventTarget.prototype.off.call(this);
    scrolled.apply(this);
    // 解除手势事件
    if (this._destory) {
      this._destory();
      this._destory = null;
    }
  };
  return Gesture;
}(_event__WEBPACK_IMPORTED_MODULE_2__["default"]); // 双（多）指结束
/**
 * swipe思路:
 * 根据移动停止前swipeDuration时间内移动的距离和时间算出速度，
 * 速度大于swipeVelocity，并且移动停止后到手指（点）抬起时间间隔小于raiseDuration即为swipe
 * 移动停止就是最后一次触发move事件
 * 0. start 清空_swipePoints
 * 1. move 每swipeDuration时间内所移动的点分为一组，只保留上一次swipeDuration时间组和这一次swipeDuration时间组，存储在_swipePoints内
 * 2. end 松开手时, 在_swipePoints内找到起终点，根据起终点距离和时间差算出速度，然后算出其他值
 */
/* harmony default export */ __webpack_exports__["default"] = (Gesture);

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventTarget: function() { return /* reexport safe */ _event__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event */ "./node_modules/@huangjs888/gesture/es/event.js");
/* harmony import */ var _gesture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gesture */ "./node_modules/@huangjs888/gesture/es/gesture.js");
/*
 * @Author: Huangjs
 * @Date: 2023-07-26 16:28:53
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 10:50:40
 * @Description: ******
 */





/* harmony default export */ __webpack_exports__["default"] = (_gesture__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/util.js":
/*!*****************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/util.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fixOption: function() { return /* binding */ fixOption; },
/* harmony export */   getAngle: function() { return /* binding */ getAngle; },
/* harmony export */   getCenter: function() { return /* binding */ getCenter; },
/* harmony export */   getDirection: function() { return /* binding */ getDirection; },
/* harmony export */   getDistance: function() { return /* binding */ getDistance; },
/* harmony export */   getEventPoints: function() { return /* binding */ getEventPoints; },
/* harmony export */   getVector: function() { return /* binding */ getVector; },
/* harmony export */   getVelocity: function() { return /* binding */ getVelocity; },
/* harmony export */   isTouchable: function() { return /* binding */ isTouchable; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/filter */ "./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0__);

/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:23:53
 * @Description: ******
 */

var isCurrentTarget = function isCurrentTarget(target, currentTarget) {
  var _target = target;
  while (_target && _target !== currentTarget) {
    _target = _target.parentNode;
  }
  return !!_target;
};
function fixOption(value, defaultValue, minVal) {
  return typeof value !== 'number' || value < minVal ? defaultValue : value;
}
function isTouchable(ele) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}
function getEventPoints(event, started) {
  if (started === void 0) {
    started = false;
  }
  if (event instanceof TouchEvent) {
    if (started) {
      var touches = _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0___default()(Array.prototype).call(event.touches, function (t) {
        return isCurrentTarget(t.target, event.currentTarget);
      });
      return {
        points: touches,
        isFirst: event.changedTouches.length === touches.length
      };
    }
    return {
      points: event.changedTouches
    };
  }
  return {
    points: [{
      pageX: event.pageX,
      pageY: event.pageY,
      identifier: -1
    }],
    isFirst: started
  };
}
function getDistance(_ref, _ref2) {
  var x0 = _ref[0],
    y0 = _ref[1];
  var x1 = _ref2[0],
    y1 = _ref2[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }
  return 0;
}
function getAngle(_ref3, _ref4) {
  var x0 = _ref3[0],
    y0 = _ref3[1];
  var x1 = _ref4[0],
    y1 = _ref4[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  }
  return 0;
}
function getCenter(_ref5, _ref6) {
  var x0 = _ref5[0],
    y0 = _ref5[1];
  var x1 = _ref6[0],
    y1 = _ref6[1];
  var ok0 = typeof x0 === 'number' && typeof y0 === 'number';
  var ok1 = typeof x1 === 'number' && typeof y1 === 'number';
  return !ok0 && !ok1 ? [0, 0] : ok0 && !ok1 ? [x0, y0] : !ok0 && ok1 ? [x1, y1] : [(x0 + x1) / 2, (y0 + y1) / 2];
}
function getDirection(_ref7, _ref8) {
  var x0 = _ref7[0],
    y0 = _ref7[1];
  var x1 = _ref8[0],
    y1 = _ref8[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    var x = x0 - x1;
    var y = y0 - y1;
    if (x !== y) {
      return Math.abs(x) >= Math.abs(y) ? x0 - x1 > 0 ? 'Left' : 'Right' : y0 - y1 > 0 ? 'Up' : 'Down';
    }
  }
  return 'None';
}
function getVelocity(deltaTime, distance) {
  if (typeof distance !== 'number' || distance === 0 || typeof deltaTime !== 'number' || deltaTime === 0) {
    return 0;
  }
  return distance / deltaTime;
}

//根据数值，与水平夹角，计算x和y的分量值
function getVector(value, angle) {
  if (typeof value !== 'number' || typeof angle !== 'number') {
    return [0, 0];
  }
  var rad = angle * Math.PI / 180;
  return [value * Math.cos(rad), value * Math.sin(rad)];
}

/***/ }),

/***/ "./node_modules/@huangjs888/load-image/es/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@huangjs888/load-image/es/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; },
/* harmony export */   hijackImage: function() { return /* binding */ hijackImage; },
/* harmony export */   loadImageBase: function() { return /* binding */ loadImageBase; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/assign */ "./node_modules/@babel/runtime-corejs3/core-js/object/assign.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/url */ "./node_modules/@babel/runtime-corejs3/core-js/url.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/get-own-property-descriptor */ "./node_modules/@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/concat */ "./node_modules/@babel/runtime-corejs3/core-js/instance/concat.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4__);





function _extends() {
  _extends = (_babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default()) ? _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default().bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:38:49
 * @Description: ******
 */

// 关于HTTP缓存问题：
// 1，直接使用new Image()，或者img元素，当相同的图片url再次访问，浏览器会直接使用缓存图片（强缓存），不会向后端发送任何请求，即使后端响应头设置了协商缓存字段要求协商缓存，浏览器依然使用的是强缓存，不会出现304。但是除非后端设置响应头Cache-Control为no-store，此时图片会重新请求。
// 2，这里使用ajax请求图片，会严格按照http缓存机制来，比如后端设置响应头Cache-Control为maxage=xxx，就会使用强缓存，后端响应头设置了协商缓存字段，就会使用协商缓存，会有304验证等。
// 3，这里面注意XMLHttpRequest在第二次请求协商缓存的时候，除非请求主动设置了协商缓存字段，此时响应才会真正返回304（且不会去读缓存数据），否则都会自动转换成200，并读取缓存数据返回。
// 4，HTTP缓存时存在disk或memory里的，靠浏览器默认去读取，ajax还会发一次304请求，如果不想这样浪费请求时间，并且确定图片不会变化，其实可以自己做缓存，可以将请求的数据（也可以转base64）存入到IndexDB，下次请求之前先从中取，没有再请求
/* const lastModified: { [key in string]: string } = {};
const etag: { [key in string]: string } = {}; */
var proxy = function proxy(url, progress) {
  return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1___default())(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        typeof progress === 'function' && progress(e);
      }
    };
    xhr.onloadend = function (e) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        /* let modified = xhr.getResponseHeader('Last-Modified');
        if (modified) {
          lastModified[url] = modified;
        }
        modified = xhr.getResponseHeader('Etag');
        if (modified) {
          etag[url] = modified;
        } */
        // URL.createObjectURL对应资源此时是存在内存里，浏览器关闭或主动revoke会释放掉
        // resolve里面使用完url之后记得及时释放掉，释放内存后，地址就无效了
        resolve(_babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2___default().createObjectURL(xhr.response));
      } else {
        reject(e);
      }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    /* if (lastModified[url]) {
      // 此种模式，http先是有个OPTIONS请求，再有一个304请求
      xhr.setRequestHeader('If-Modified-Since', lastModified[url]);
    }
    if (etag[url]) {
      // 此种模式，只有304请求
      xhr.setRequestHeader('If-None-Match', etag[url]);
    }
    xhr.setRequestHeader('Cache-Control', 'no-cache'); */
    xhr.send();
  });
};

// 对image.src进行劫持，一劳永逸
var isHijack = false;
function hijackImage() {
  if (isHijack) {
    return;
  }
  // 这里对HTMLImageElement元素的src进行重写，再设置src的时候使用ajax获取图片资源，目的是监听image的onprogress事件生效
  var _HTMLImageElement = HTMLImageElement,
    prototype = _HTMLImageElement.prototype;
  var descriptor = _babel_runtime_corejs3_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_3___default()(prototype, 'src');
  if (descriptor) {
    isHijack = true;
    Object.defineProperty(prototype, 'src', _extends({}, descriptor, {
      set: function set(value) {
        var _this = this;
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        if (descriptor.set) {
          var setter = descriptor.set;
          if (value && value.indexOf('blob:') !== 0) {
            proxy(value, this.onprogress).then(function (url) {
              var _context;
              var onload = _this.onload;
              _this.onload = function (e) {
                // 释放内存
                _babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2___default().revokeObjectURL(url);
                onload && onload.apply(this, [e]);
              };
              // 图片资源加载完成后会缓存，缓存数据丢给image原始src操作（这里就会多个数据转存的时间）
              setter.apply(_this, _babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4___default()(_context = [url]).call(_context, args));
            }).catch(function () {
              var _context2;
              // 出现跨域等无法加载图片情况，会重新丢给image原始src操作
              setter.apply(_this, _babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4___default()(_context2 = [value]).call(_context2, args));
            });
          } else {
            var _context3;
            // blob图片直接丢给image原始src操作
            setter.apply(this, _babel_runtime_corejs3_core_js_instance_concat__WEBPACK_IMPORTED_MODULE_4___default()(_context3 = [value]).call(_context3, args));
          }
        }
      }
    }));
    return function () {
      isHijack = false;
      // 删除劫持
      Object.defineProperty(prototype, 'src', descriptor);
    };
  }
  return;
}

// 原始图片加载
var loadImageBase = function loadImageBase(url, progress) {
  return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1___default())(function (resolve, reject) {
    var image = new Image();
    var off = function off() {
      image.onload = null;
      image.onprogress = null;
      image.onerror = null;
    };
    image.onload = function () {
      resolve(image);
      off();
    };
    image.onerror = function (e) {
      reject(e);
      off();
    };
    if (typeof progress === 'function') {
      image.onprogress = function (e) {
        return progress(e.loaded / e.total);
      };
    }
    image.src = url;
  });
};
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(url, progress) {
  // 加载图片需要进度条的使用proxy代理加载
  if (typeof progress === 'function') {
    return proxy(url, function (e) {
      return progress(e.loaded / e.total);
    }).then(function (_url) {
      return (
        // 该loadImageBase成功后会把then里return的image抛给外面调用者的then
        // 该loadImageBase失败后会先走下面catch的loadImageBase，而不是直接抛到外面调用者的catch
        loadImageBase(_url).then(function (image) {
          _babel_runtime_corejs3_core_js_url__WEBPACK_IMPORTED_MODULE_2___default().revokeObjectURL(_url);
          return image;
        })
      );
    })
    // 该loadImageBase成功后会抛给外面调用者的then
    // 该loadImageBase失败后会抛到外面调用者的catch
    .catch(function () {
      return loadImageBase(url);
    });
  } else {
    return loadImageBase(url);
  }
}

/***/ }),

/***/ "./node_modules/@huangjs888/transform/es/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@huangjs888/transform/es/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Matrix: function() { return /* reexport safe */ _matrix__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrix */ "./node_modules/@huangjs888/transform/es/matrix.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform */ "./node_modules/@huangjs888/transform/es/transform.js");
/*
 * @Author: Huangjs
 * @Date: 2023-07-26 16:28:46
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:41:08
 * @Description: ******
 */





/* harmony default export */ __webpack_exports__["default"] = (_transform__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/@huangjs888/transform/es/matrix.js":
/*!*********************************************************!*\
  !*** ./node_modules/@huangjs888/transform/es/matrix.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-14 16:40:44
 * @Description: ******
 */

var DEG_TO_RAD = Math.PI / 180;
var Matrix = {
  // 将矩阵 lhm 与矩阵 rhm 相乘，然后保存到矩阵 rm 中
  multiply: function multiply(rm, lhm, rhm) {
    var a11 = lhm[0];
    var a12 = lhm[4];
    var a13 = lhm[8];
    var a14 = lhm[12];
    var a21 = lhm[1];
    var a22 = lhm[5];
    var a23 = lhm[9];
    var a24 = lhm[13];
    var a31 = lhm[2];
    var a32 = lhm[6];
    var a33 = lhm[10];
    var a34 = lhm[14];
    var a41 = lhm[3];
    var a42 = lhm[7];
    var a43 = lhm[11];
    var a44 = lhm[15];
    var b11 = rhm[0];
    var b12 = rhm[1];
    var b13 = rhm[2];
    var b14 = rhm[3];
    var b21 = rhm[4];
    var b22 = rhm[5];
    var b23 = rhm[6];
    var b24 = rhm[7];
    var b31 = rhm[8];
    var b32 = rhm[9];
    var b33 = rhm[10];
    var b34 = rhm[11];
    var b41 = rhm[12];
    var b42 = rhm[13];
    var b43 = rhm[14];
    var b44 = rhm[15];
    rm[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    rm[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    rm[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    rm[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    rm[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    rm[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    rm[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    rm[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    rm[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    rm[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    rm[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    rm[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    rm[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    rm[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    rm[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    rm[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
  },
  // 将矩阵 m 设置为初始矩阵
  identity: function identity(m) {
    for (var i = 0; i < 16; i++) {
      m[i] = 0;
    }
    for (var _i = 0; _i < 16; _i += 5) {
      m[_i] = 1;
    }
  },
  // 将矩阵 m 按照 x, y, z 平移
  translate: function translate(m, x, y, z) {
    for (var i = 0; i < 4; i++) {
      m[12 + i] += m[i] * x + m[4 + i] * y + m[8 + i] * z;
    }
  },
  // 将矩阵 m 按照 x, y, z 缩放
  scale: function scale(m, x, y, z) {
    for (var i = 0; i < 4; i++) {
      m[i] *= x;
      m[4 + i] *= y;
      m[8 + i] *= z;
    }
  },
  // 将矩阵 m 围绕 x, y, z 旋转a度
  rotate: function rotate(m, a, x, y, z) {
    var rm = new Float32Array(16);
    rm[3] = 0;
    rm[7] = 0;
    rm[11] = 0;
    rm[12] = 0;
    rm[13] = 0;
    rm[14] = 0;
    rm[15] = 1;
    var ra = a * DEG_TO_RAD;
    var s = Math.sin(ra);
    var c = Math.cos(ra);
    if (x === 1 && y === 0 && z === 0) {
      // x轴
      rm[5] = c;
      rm[10] = c;
      rm[6] = s;
      rm[9] = -s;
      rm[1] = 0;
      rm[2] = 0;
      rm[4] = 0;
      rm[8] = 0;
      rm[0] = 1;
    } else if (x === 0 && y === 0 && z === 0) {
      // y轴
      rm[0] = c;
      rm[10] = c;
      rm[8] = s;
      rm[2] = -s;
      rm[1] = 0;
      rm[4] = 0;
      rm[6] = 0;
      rm[9] = 0;
      rm[5] = 1;
    } else if (x === 0 && y === 0 && z === 1) {
      // z轴
      rm[0] = c;
      rm[5] = c;
      rm[1] = s;
      rm[4] = -s;
      rm[2] = 0;
      rm[6] = 0;
      rm[8] = 0;
      rm[9] = 0;
      rm[10] = 1;
    } else {
      var len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        var recipLen = 1 / len;
        x *= recipLen;
        y *= recipLen;
        z *= recipLen;
      }
      var nc = 1 - c;
      var xy = x * y;
      var yz = y * z;
      var zx = z * x;
      var xs = x * s;
      var ys = y * s;
      var zs = z * s;
      rm[0] = x * x * nc + c;
      rm[4] = xy * nc - zs;
      rm[8] = zx * nc + ys;
      rm[1] = xy * nc + zs;
      rm[5] = y * y * nc + c;
      rm[9] = yz * nc - xs;
      rm[2] = zx * nc - ys;
      rm[6] = yz * nc + xs;
      rm[10] = z * z * nc + c;
    }
    Matrix.multiply(m, m, rm);
  },
  // 将矩阵 m 按照欧拉角 xa, ya, za 旋转
  rotateEuler: function rotateEuler(m, xa, ya, za) {
    var rm = new Float32Array(16);
    var xra = xa * DEG_TO_RAD;
    var yra = ya * DEG_TO_RAD;
    var zra = za * DEG_TO_RAD;
    var cx = Math.cos(xra);
    var sx = Math.sin(xra);
    var cy = Math.cos(yra);
    var sy = Math.sin(yra);
    var cz = Math.cos(zra);
    var sz = Math.sin(zra);
    var cxsy = cx * sy;
    var sxsy = sx * sy;
    rm[0] = cy * cz;
    rm[1] = -cy * sz;
    rm[2] = sy;
    rm[3] = 0;
    rm[4] = cxsy * cz + cx * sz;
    rm[5] = -cxsy * sz + cx * cz;
    rm[6] = -sx * cy;
    rm[7] = 0;
    rm[8] = -sxsy * cz + sx * sz;
    rm[9] = sxsy * sz + sx * cz;
    rm[10] = cx * cy;
    rm[11] = 0;
    rm[12] = 0;
    rm[13] = 0;
    rm[14] = 0;
    rm[15] = 1;
    Matrix.multiply(m, m, rm);
  },
  // 将矩阵 m 进行perspective变换
  perspective: function perspective(m, fovy, aspect, zNear, zFar) {
    var f = 1 / Math.tan(fovy * (Math.PI / 360.0));
    var rangeReciprocal = 1 / (zNear - zFar);
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (zFar + zNear) * rangeReciprocal;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * zFar * zNear * rangeReciprocal;
    m[15] = 0;
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Matrix);

/***/ }),

/***/ "./node_modules/@huangjs888/transform/es/transform.js":
/*!************************************************************!*\
  !*** ./node_modules/@huangjs888/transform/es/transform.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Transform; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_slice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/slice */ "./node_modules/@babel/runtime-corejs3/core-js/instance/slice.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_slice__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_slice__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./matrix */ "./node_modules/@huangjs888/transform/es/matrix.js");

/*
 * @Author: Huangjs
 * @Date: 2023-04-27 18:24:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:31:23
 * @Description: ******
 */


var Transform = /*#__PURE__*/function () {
  function Transform(t) {
    this.a = t.a;
    this.k = t.k;
    this.x = t.x;
    this.y = t.y;
  }
  Transform.identity = function identity() {
    return new Transform({
      a: 0,
      k: 1,
      x: 0,
      y: 0
    });
  };
  var _proto = Transform.prototype;
  _proto.toRaw = function toRaw() {
    var raw = {};
    if (typeof this.a === 'number') {
      raw.a = this.a;
    }
    if (typeof this.k === 'number') {
      raw.k = this.k;
    }
    if (typeof this.x === 'number') {
      raw.x = this.x;
    }
    if (typeof this.y === 'number') {
      raw.y = this.y;
    }
    return raw;
  };
  _proto.toString = function toString() {
    var _this$a = this.a,
      a = _this$a === void 0 ? 0 : _this$a,
      _this$k = this.k,
      k = _this$k === void 0 ? 1 : _this$k,
      _this$x = this.x,
      x = _this$x === void 0 ? 0 : _this$x,
      _this$y = this.y,
      y = _this$y === void 0 ? 0 : _this$y;
    var matrix = new Float32Array(16);
    _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].identity(matrix);
    _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].translate(matrix, x, y, 0);
    _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].scale(matrix, k, k, k);
    // 这里使用负值，实际matrix3d里负值为顺时针
    _matrix__WEBPACK_IMPORTED_MODULE_1__["default"].rotate(matrix, -a, 0, 0, 1);
    return "matrix3d(" + _babel_runtime_corejs3_core_js_instance_slice__WEBPACK_IMPORTED_MODULE_0___default()(Array.prototype).call(matrix).join(',') + ")";
  };
  return Transform;
}();


/***/ }),

/***/ "./node_modules/@huangjs888/transition/es/animation.js":
/*!*************************************************************!*\
  !*** ./node_modules/@huangjs888/transition/es/animation.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:44:19
 * @Description: ******
 */

var requestAnimationFrame = window.requestAnimationFrame || function () {
  var last = 0;
  // setTimeout时间并不精确，这里做了校准
  return function (fn) {
    var now = Date.now();
    var delay = Math.max(0, 16 - (now - last));
    last = now + delay;
    return window.setTimeout(fn, delay);
  };
}();
var cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
  return window.clearTimeout(id);
};
var callDelay = function callDelay(callback, delay) {
  if (delay > 0) {
    window.setTimeout(callback, delay);
  } else {
    callback(Math.abs(delay));
  }
};
var Animation = /*#__PURE__*/function () {
  // 每一帧动画执行函数
  function Animation(_ref) {
    var duration = _ref.duration,
      easing = _ref.easing,
      delay = _ref.delay;
    // 动画执行持续时间
    // 动画执行时变换函数
    // 动画延迟多久执行
    this._frameId = 0;
    // 当前正在执行帧的id
    this._sleepId = 0;
    // 当前正在休眠计时id
    this._elapsed = 0;
    // 本次动画已经消耗的时间
    this._tick = null;
    this.duration = typeof duration !== 'number' || duration <= 0 ? 0 : duration;
    this.easing = typeof easing !== 'function' ? function (v) {
      return v;
    } : easing;
    this.delay = typeof delay !== 'number' ? 0 : delay;
  }
  var _proto = Animation.prototype;
  _proto.start = function start(frameFn) {
    var _this = this;
    // 只有全新的开始才会运行
    if (this._frameId === 0 && this._elapsed === 0) {
      var duration = this.duration,
        easing = this.easing,
        delay = this.delay;
      if (duration > 0) {
        var tick = function tick(last) {
          // 本帧时间戳，last：上一帧时间戳
          var now = Date.now();
          // 累计已经耗用的时间
          _this._elapsed += now - last;
          if (_this._elapsed < duration) {
            // 开启下一帧
            _this._frameId = requestAnimationFrame(function () {
              return tick(now);
            });
            // 每一帧的进度
            frameFn(easing(_this._elapsed / duration));
          } else {
            frameFn(1);
            // 执行完毕后清除
            _this._tick = null;
            _this._frameId = 0;
            _this._elapsed = 0;
          }
        };
        this._tick = tick;
        // 执行第一帧
        callDelay(function (elapsed) {
          if (elapsed === void 0) {
            elapsed = 0;
          }
          // 第一次直接用掉这些时间
          _this._elapsed = elapsed;
          tick(Date.now());
        }, delay);
      } else {
        callDelay(function () {
          frameFn(1);
        }, delay);
      }
    }
  };
  _proto.restart = function restart() {
    // restart之前先停止运行
    this.stop();
    // 停止后启动帧，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      // 启动帧
      this._tick(Date.now());
    }
  };
  _proto.sleep = function sleep(time) {
    var _this2 = this;
    // 这里注意，如果动画先停止，再点休眠，时间一到会再重启动画，相当于delay一下再restart
    if (typeof time !== 'number' || time <= 0) {
      return;
    }
    // sleep之前先停止运行
    this.stop();
    // 停止后启动休眠，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      this._sleepId = window.setTimeout(function () {
        // 到时间后重启动画
        _this2.restart();
      }, time);
    }
  };
  _proto.stop = function stop() {
    // 如果在sleep，要先清除sleep
    window.clearTimeout(this._sleepId);
    // 清掉还未运行的帧
    cancelAnimationFrame(this._frameId);
    this._frameId = 0;
  };
  _proto.end = function end() {
    // end之前先停止运行
    this.stop();
    // 停止后直接运行最后一帧结束动画，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      this._elapsed = this.duration;
      this._tick(Date.now());
    }
  };
  return Animation;
}();
/* harmony default export */ __webpack_exports__["default"] = (Animation);

/***/ }),

/***/ "./node_modules/@huangjs888/transition/es/easing.js":
/*!**********************************************************!*\
  !*** ./node_modules/@huangjs888/transition/es/easing.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEase: function() { return /* binding */ createEase; },
/* harmony export */   createEaseInOut: function() { return /* binding */ createEaseInOut; },
/* harmony export */   easeInOutQuad: function() { return /* binding */ easeInOutQuad; },
/* harmony export */   easeOutInQuad: function() { return /* binding */ easeOutInQuad; },
/* harmony export */   easeOutQuad: function() { return /* binding */ easeOutQuad; },
/* harmony export */   easeOutQuart: function() { return /* binding */ easeOutQuart; }
/* harmony export */ });
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-19 14:47:27
 * @Description: ******
 */

// 对于函数 s = f(t)
// 函数平移(x,y)（函数自变量t变为t-x，整体结果s+y）
// 函数缩放 k 倍（函数自变量t变为t/k，整体结果s*k）
// 先平移再缩放：s = (f((t/k)-x)+y)*k
// 先缩放再平移：s = (f((t-x)/k)*k)+y

var baseEase = {
  linear: function linear(t) {
    return t;
  },
  inQuad: function inQuad(t) {
    return t * t;
  },
  outQuad: function outQuad(t) {
    return 1 - (1 - t) * (1 - t);
  },
  inCubic: function inCubic(t) {
    return t * t * t;
  },
  outCubic: function outCubic(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t);
  },
  inQuart: function inQuart(t) {
    return t * t * t * t;
  },
  outQuart: function outQuart(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
  },
  inQuint: function inQuint(t) {
    return t * t * t * t * t;
  },
  outQuint: function outQuint(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t);
  }
};
// 取值easeFn函数变量的某一段转成easing函数，a为开始变量值，b为结束变量值
function createEase(a, b, easeFn) {
  if (a === void 0) {
    a = 0;
  }
  if (b === void 0) {
    b = 1;
  }
  if (easeFn === void 0) {
    easeFn = baseEase.linear;
  }
  var k = 1 / (b - a);
  if (!k || k <= 0) {
    return function () {
      return 0;
    };
  }
  // easeFn先平移( -a , -easeFn(a) )，再缩放 k 倍
  // 接着使函数值也在(0,1)之间，即：经上述变换之后的函数，另变量为1，求函数值，函数再除以该函数值得到最终的函数
  return function (t) {
    return (easeFn(t / k + a) - easeFn(a)) * k / ((easeFn(1 / k + a) - easeFn(a)) * k);
  };
}
// 把两个easing函数连接转成新的easing函数，k为比例
function createEaseInOut(k, easeIn, easeOut) {
  if (k === void 0) {
    k = 1 / 2;
  }
  if (easeIn === void 0) {
    easeIn = baseEase.linear;
  }
  if (easeOut === void 0) {
    easeOut = baseEase.linear;
  }
  if (k <= 0) {
    return easeOut;
  }
  if (k >= 1) {
    return easeIn;
  }
  return function (t) {
    return t <= k ?
    // easeIn直接缩放k
    easeIn(t / k) * k :
    // easeOut衔接easeIn，需要先平移( k/(1-k) , k/(1-k) )，再缩放 1-k
    (easeOut(t / (1 - k) - k / (1 - k)) + k / (1 - k)) * (1 - k);
  };
}
var easeInOutQuad = createEaseInOut(1 / 2, baseEase.outQuad, baseEase.inQuad);
var easeOutInQuad = createEaseInOut(1 / 2, baseEase.inQuad, baseEase.outQuad);
var easeOutQuad = baseEase.outQuad;
var easeOutQuart = baseEase.outQuart;


/***/ }),

/***/ "./node_modules/@huangjs888/transition/es/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@huangjs888/transition/es/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Animation: function() { return /* reexport safe */ _animation__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   TAProperty: function() { return /* reexport safe */ _transition__WEBPACK_IMPORTED_MODULE_1__.TAProperty; },
/* harmony export */   createEase: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.createEase; },
/* harmony export */   createEaseInOut: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.createEaseInOut; },
/* harmony export */   easeInOutQuad: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.easeInOutQuad; },
/* harmony export */   easeOutInQuad: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.easeOutInQuad; },
/* harmony export */   easeOutQuad: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.easeOutQuad; },
/* harmony export */   easeOutQuart: function() { return /* reexport safe */ _easing__WEBPACK_IMPORTED_MODULE_2__.easeOutQuart; }
/* harmony export */ });
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation */ "./node_modules/@huangjs888/transition/es/animation.js");
/* harmony import */ var _transition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transition */ "./node_modules/@huangjs888/transition/es/transition.js");
/* harmony import */ var _easing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./easing */ "./node_modules/@huangjs888/transition/es/easing.js");
/*
 * @Author: Huangjs
 * @Date: 2023-07-26 16:28:46
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 10:49:30
 * @Description: ******
 */







/* harmony default export */ __webpack_exports__["default"] = (_transition__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/@huangjs888/transition/es/transition.js":
/*!**************************************************************!*\
  !*** ./node_modules/@huangjs888/transition/es/transition.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TAProperty: function() { return /* binding */ TAProperty; },
/* harmony export */   "default": function() { return /* binding */ Transition; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/assign */ "./node_modules/@babel/runtime-corejs3/core-js/object/assign.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/keys */ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_find_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/find-index */ "./node_modules/@babel/runtime-corejs3/core-js/instance/find-index.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_find_index__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_find_index__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/splice */ "./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/filter */ "./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./animation */ "./node_modules/@huangjs888/transition/es/animation.js");






var _excluded = ["precision", "before", "after", "cancel"];
function _extends() {
  _extends = (_babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default()) ? _babel_runtime_corejs3_core_js_object_assign__WEBPACK_IMPORTED_MODULE_0___default().bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:32:06
 * @Description: ******
 */


var TAProperty =
// 过渡需要变化的值
function TAProperty(value) {
  this.value = value;
}
// 要实现该值转变为style的字符串方法
;
var Transition = /*#__PURE__*/function () {
  // 该属性执行所有过渡的动画集合
  function Transition(_ref) {
    var element = _ref.element,
      propertyName = _ref.propertyName,
      propertyValue = _ref.propertyValue;
    // 过渡的元素
    // 当前将要过渡的动画应用在元素的哪个属性上
    // 当前将要过渡的动画属性的实时值
    this._animation = [];
    this.element = element;
    // 将驼峰转换为 - 连字符，style.setProperty只支持 - 连字符，不支持驼峰（不生效）
    this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.element.style.setProperty(this.propertyName, propertyValue.toString());
    this.propertyValue = propertyValue;
  }
  var _proto = Transition.prototype;
  _proto.bind = function bind(value) {
    // 这里直接做一次校准
    var element = this.element,
      propertyName = this.propertyName,
      propertyValue = this.propertyValue;
    var newValue = {};
    _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(value).forEach(function (key) {
      var val = value[key];
      if (typeof val === 'number') {
        newValue[key] = val;
      }
    });
    propertyValue.value = newValue;
    element.style.setProperty(propertyName, propertyValue.toString());
  };
  _proto.apply = function apply(deltaValue, options) {
    var _this = this;
    return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default())(function (resolve) {
      var _options$precision = options.precision,
        precision = _options$precision === void 0 ? {} : _options$precision,
        _options$before = options.before,
        before = _options$before === void 0 ? function () {} : _options$before,
        _options$after = options.after,
        after = _options$after === void 0 ? function () {} : _options$after,
        _options$cancel = options.cancel,
        cancel = _options$cancel === void 0 ? true : _options$cancel,
        restOptions = _objectWithoutPropertiesLoose(options, _excluded);
      var element = _this.element,
        propertyName = _this.propertyName,
        propertyValue = _this.propertyValue;
      var produced = {};
      // 做一次精度筛选
      _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(deltaValue).forEach(function (key) {
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
      var producedKeys = _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(produced);
      // 存在需要执行动画的增量(大于精度的)，进行动画处理
      if (producedKeys.length > 0) {
        // 存储每一帧动画后还有多少剩余没有执行
        var remainValue = _extends({}, produced);
        // 创建动画，并存储到this
        var animation = new _animation__WEBPACK_IMPORTED_MODULE_6__["default"](restOptions);
        _this._animation.push({
          animation: animation,
          remainValue: remainValue,
          cancel: cancel
        });
        // 开启动画
        animation.start(function (progress) {
          var next = before(progress, propertyValue.value);
          if (next !== false) {
            var _progress = progress;
            if (typeof next === 'number') {
              _progress = next;
            }
            // 根据动画进度对value进行累加
            producedKeys.forEach(function (key) {
              // 总的需要消费数减去已经消费的部分，即为这一帧之后未消费的部分，_progress为已消费的进度
              var unconsumed = produced[key] * (1 - _progress);
              if (typeof propertyValue.value[key] === 'number') {
                // 上一帧未消费的部分减去这一帧之后未消费的部分，即为本次需要消费的部分
                propertyValue.value[key] += remainValue[key] - unconsumed;
              }
              // 更新最新剩余未消费的
              remainValue[key] = unconsumed;
            });
            // 每帧动画后应用到元素并执行帧回调
            element.style.setProperty(propertyName, propertyValue.toString());
          }
          after(progress, propertyValue.value);
          if (progress === 1) {
            var _context;
            // 动画结束后删除集合中的这个动画对象
            var index = _babel_runtime_corejs3_core_js_instance_find_index__WEBPACK_IMPORTED_MODULE_3___default()(_context = _this._animation).call(_context, function (a) {
              return animation === a.animation;
            });
            // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
            if (index !== -1) {
              var _context2;
              _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_4___default()(_context2 = _this._animation).call(_context2, index, 1);
            }
            resolve(propertyValue.value);
          }
        });
      } else {
        // 不存在需要执行动画的增量(小于精度的)，就直接将精度筛选时累加的值应用到元素并执行帧回调
        element.style.setProperty(propertyName, propertyValue.toString());
        resolve(propertyValue.value);
      }
    });
  };
  _proto.cancel = function cancel(end) {
    var _context3;
    if (end === void 0) {
      end = false;
    }
    // end是告诉动画取消时是停留在当前还是执行到终点
    var remainValues = [];
    this._animation = _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_5___default()(_context3 = this._animation).call(_context3, function (_ref2) {
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
  };
  _proto.transitioning = function transitioning() {
    return this._animation.length !== 0;
  };
  return Transition;
}();


/***/ }),

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBackdrop: function() { return /* binding */ createBackdrop; },
/* harmony export */   createContainer: function() { return /* binding */ createContainer; },
/* harmony export */   createError: function() { return /* binding */ createError; },
/* harmony export */   createIndicator: function() { return /* binding */ createIndicator; },
/* harmony export */   createItemIndicator: function() { return /* binding */ createItemIndicator; },
/* harmony export */   createItemWrapper: function() { return /* binding */ createItemWrapper; },
/* harmony export */   createLoading: function() { return /* binding */ createLoading; },
/* harmony export */   createSubstance: function() { return /* binding */ createSubstance; },
/* harmony export */   setStyle: function() { return /* binding */ setStyle; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/keys */ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _svgIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./svgIcon */ "./src/svgIcon.ts");

/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:24:30
 * @Description: ******
 */


var autoPxReg = /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
function setStyle(ele, css) {
  if (ele) {
    var cssText = '';
    _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(css).forEach(function (k) {
      var key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      if (css[k] !== 0 && !css[k]) {
        // 删除
        ele.style.setProperty(key, '');
      } else {
        var suffix = typeof css[k] === 'number' && /^[a-z]/.test(key) && autoPxReg.test("-" + key) ? 'px' : '';
        var val = "" + css[k] + suffix;
        cssText += key + ":" + val + ";";
      }
    });
    if (cssText) {
      ele.style.cssText += cssText;
    }
  }
  return ele;
}
function createContainer(element) {
  var ele;
  try {
    if (typeof element === 'string') {
      ele = document.querySelector(element);
    } else {
      ele = element;
    }
  } catch (e) {
    ele = null;
  }
  if (!ele || !(ele instanceof HTMLElement)) {
    ele = setStyle(document.createElement('div'), {
      position: 'fixed',
      left: '0px',
      top: '0px',
      zIndex: '9999',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'none'
    });
    document.body.appendChild(ele);
  } else {
    setStyle(ele, {
      display: 'none'
    });
    ele.innerHTML = '';
  }
  return ele;
}
function createSubstance(isVertical, element) {
  var substance = setStyle(document.createElement('div'), {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row'
  });
  element.appendChild(substance);
  return substance;
}
function createBackdrop(background, element) {
  var backdrop = setStyle(document.createElement('div'), {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: background
  });
  element.appendChild(backdrop);
  return backdrop;
}
function createIndicator(isVertical, hasIndicator, element) {
  var indicator = null;
  if (hasIndicator) {
    indicator = setStyle(document.createElement('div'), {
      position: 'absolute',
      bottom: isVertical ? '0px' : '16px',
      right: isVertical ? '16px' : 'auto',
      width: isVertical ? 'auto' : '100%',
      height: isVertical ? '100%' : 'auto',
      display: 'none',
      flexDirection: isVertical ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center'
    });
    element.appendChild(indicator);
  }
  return indicator;
}
function createItemIndicator(isVertical, element) {
  var item = null;
  if (element) {
    item = setStyle(document.createElement('span'), {
      borderRadius: '100%',
      width: 7,
      height: 7,
      display: 'inline-block',
      margin: isVertical ? '5px 0' : '0 5px',
      background: '#fff',
      opacity: 0.6
    });
    element.appendChild(item);
  }
  return item;
}
function createItemWrapper(isFirst, isVertical, hasLoading, itemGap, element) {
  var wrapper = setStyle(document.createElement('div'), {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
    marginTop: isVertical && !isFirst ? itemGap : 0,
    marginLeft: isVertical || isFirst ? 0 : itemGap
  });
  if (hasLoading) {
    createLoading(wrapper);
  }
  element.appendChild(wrapper);
  return wrapper;
}
function createLoading(element) {
  var loading = setStyle(document.createElement('span'), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    width: 32,
    height: 32,
    display: 'inline-block'
  });
  loading.innerHTML = _svgIcon__WEBPACK_IMPORTED_MODULE_1__.loadingIcon;
  element.appendChild(loading);
}
function createError(element) {
  var error = setStyle(document.createElement('div'), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%,-50%,0)',
    width: '100%',
    color: '#fff',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.88
  });
  error.innerHTML = "\n    <span style=\"width: 72px;height: 72px;\">\n      " + _svgIcon__WEBPACK_IMPORTED_MODULE_1__.errorIcon + "\n    </span>\n    <span style=\"margin-top:16px;\">\u56FE\u7247\u52A0\u8F7D\u5931\u8D25</span>\n  ";
  element.appendChild(error);
}

/***/ }),

/***/ "./src/entity/index.ts":
/*!*****************************!*\
  !*** ./src/entity/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/inheritsLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/map */ "./node_modules/@babel/runtime-corejs3/core-js/instance/map.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/keys */ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @huangjs888/transition */ "./node_modules/@huangjs888/transition/es/index.js");
/* harmony import */ var _huangjs888_transform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @huangjs888/transform */ "./node_modules/@huangjs888/transform/es/index.js");
/* harmony import */ var _huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @huangjs888/damping */ "./node_modules/@huangjs888/damping/es/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/entity/utils.ts");





/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 09:27:38
 * @Description: ******
 */





var Entity = /*#__PURE__*/function () {
  function Entity(_ref) {
    var element = _ref.element,
      sizeInfo = _ref.sizeInfo,
      dblAdjust = _ref.dblAdjust,
      dblScale = _ref.dblScale,
      damping = _ref.damping,
      rotation = _ref.rotation,
      scalation = _ref.scalation,
      translation = _ref.translation;
    // 当前手势操作之后的变换对象
    // 当前渐变对象
    this._dblAdjust = true;
    this._dblScale = 0;
    // 双击放大比例和是否调整放大时的中心点
    this._damping = [];
    // 可以进行阻尼的变换
    this._rotation = [];
    // 旋转范围
    this._scalation = [];
    // 缩放范围
    this._translation = [];
    // 平移范围
    this._sizeInfo = {
      containerCenter: [0, 0],
      containerWidth: 0,
      containerHeight: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      elementWidth: 0,
      elementHeight: 0
    };
    var _element;
    try {
      if (typeof element === 'string') {
        _element = document.querySelector(element);
      } else {
        _element = element;
      }
    } catch (e) {
      _element = null;
    }
    if (!_element || !(_element instanceof HTMLElement)) {
      _element = document.createElement('div');
    }
    _element.style.opacity = '0';
    _element.innerHTML = '';
    this._element = _element;
    this._transform = new _huangjs888_transform__WEBPACK_IMPORTED_MODULE_6__["default"]({
      a: 0,
      k: 1,
      x: 0,
      y: 0
    });
    // 创建过渡
    this._transition = new _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__["default"]({
      element: this._element,
      propertyName: 'transform',
      propertyValue: new ( /*#__PURE__*/function (_TAProperty) {
        (0,_babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(_class2, _TAProperty);
        function _class2() {
          return _TAProperty.apply(this, arguments) || this;
        }
        var _proto2 = _class2.prototype;
        _proto2.toString = function toString() {
          // 这里注意，在不存在任何过渡动画的时候，这里的this.value应该和上面的this._transform内的每项值应该是相等的
          // 但是由于 0.1+0.2!==0.3 的问题，导致经过各种计算后，其值并不是完全相等，存在极小的精度问题
          return new _huangjs888_transform__WEBPACK_IMPORTED_MODULE_6__["default"](this.value).toString();
        };
        return _class2;
      }(_huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__.TAProperty))(this._transform.toRaw())
    });
    this.setSizeInfo(sizeInfo); // 设置尺寸
    this.setDblAdjust(dblAdjust); // 设置双击是否调整中心点
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
  }
  var _proto = Entity.prototype;
  _proto.getElement = function getElement() {
    return this._element;
  };
  _proto.getTransform = function getTransform() {
    return this._transform;
  };
  _proto.getSizeInfo = function getSizeInfo() {
    return this._sizeInfo;
  };
  _proto.setSizeInfo = function setSizeInfo(sizeInfo) {
    if (sizeInfo) {
      var containerCenter = sizeInfo.containerCenter,
        containerWidth = sizeInfo.containerWidth,
        containerHeight = sizeInfo.containerHeight,
        naturalWidth = sizeInfo.naturalWidth,
        naturalHeight = sizeInfo.naturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var boxAspectRatio = containerWidth / containerHeight;
      var width = naturalWidth;
      if (aspectRatio >= boxAspectRatio) {
        width = containerWidth;
      } else if (aspectRatio >= 1 / 2.2) {
        // 0.4545454545...
        //微信 iphone 横竖屏和微信 android 竖屏时
        width = containerHeight * aspectRatio;
      } /* else if (aspectRatio >= 0.4) {
        // 微信 android 横屏时
        width = containerHeight * aspectRatio;
        } */else {
        // 微信 iphone 是取 containerWidth 和 naturalWidth 最小值
        width = Math.min(containerWidth, naturalWidth);
        // 微信 android 直接是取 containerWidth;
        // width = containerWidth;
      }

      var height = width / aspectRatio;
      this._element.style.opacity = '1';
      this._element.style.width = width + "px";
      this._element.style.height = height + "px";
      this._sizeInfo = {
        containerCenter: containerCenter,
        containerWidth: containerWidth,
        containerHeight: containerHeight,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        elementWidth: width,
        elementHeight: height
      };
      this.reset();
    }
  };
  _proto.setRotation = function setRotation(a) {
    if (a && typeof a[0] === 'number' && typeof a[1] === 'number' && a[1] >= a[0]) {
      // 最大范围 -Infinity 到 + Infinity
      this._rotation = a;
      return;
    }
    // 测微信得到的结论，是不给旋转的
    // 如果设置不合理，则取默认
    this._rotation = function () {
      return [0, 0];
    };
  };
  _proto.getRotation = function getRotation() {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_8__.effectuate)(this._rotation);
  };
  _proto.setScalation = function setScalation(k) {
    var _this = this;
    if (k && typeof k[0] === 'number' && typeof k[1] === 'number' && k[1] >= k[0] && k[0] > 0) {
      this._scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
    // 如果设置不合理，则取默认
    this._scalation = function () {
      return [1, 2 * _this.getDblScale()];
    };
  };
  _proto.getScalation = function getScalation() {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_8__.effectuate)(this._scalation);
  };
  _proto.setTranslation = function setTranslation(xy) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  };
  _proto.getTranslation = function getTranslation(k) {
    return [this.getXTranslation(k), this.getYTranslation()];
  };
  _proto.setXTranslation = function setXTranslation(x) {
    var _this2 = this;
    if (x && typeof x[0] === 'number' && typeof x[1] === 'number' && x[1] >= x[0]) {
      this._translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this._translation[0] = function (k) {
      var _this2$getSizeInfo = _this2.getSizeInfo(),
        containerWidth = _this2$getSizeInfo.containerWidth,
        elementWidth = _this2$getSizeInfo.elementWidth;
      var bx = Math.max((elementWidth * k - containerWidth) / 2, 0);
      return [-bx, bx];
    };
  };
  _proto.getXTranslation = function getXTranslation(k) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_8__.effectuate)(this._translation[0], k || this._transform.k || 1);
  };
  _proto.setYTranslation = function setYTranslation(y) {
    var _this3 = this;
    if (y && typeof y[0] === 'number' && typeof y[1] === 'number' && y[1] >= y[0]) {
      this._translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this._translation[1] = function (k) {
      var _this3$getSizeInfo = _this3.getSizeInfo(),
        containerHeight = _this3$getSizeInfo.containerHeight,
        elementHeight = _this3$getSizeInfo.elementHeight;
      var by = Math.max((elementHeight * k - containerHeight) / 2, 0);
      return [-by, by];
    };
  };
  _proto.getYTranslation = function getYTranslation(k) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_8__.effectuate)(this._translation[1], k || this._transform.k || 1);
  };
  _proto.setDblScale = function setDblScale(k) {
    var _this4 = this;
    if (typeof k === 'number' && k > 0) {
      this._dblScale = k;
      return;
    }
    // 测微信得到的结论，双击放大比例是
    // 1，容器宽/元素宽 和 容器高/元素高 的最大值
    // 2，元素实际宽/容器宽 和 元素实际高/容器高 的最小值
    // 3，在1、2两个值和数值2这三个之中的最大值
    this._dblScale = function () {
      var _this4$getSizeInfo = _this4.getSizeInfo(),
        containerWidth = _this4$getSizeInfo.containerWidth,
        containerHeight = _this4$getSizeInfo.containerHeight,
        naturalWidth = _this4$getSizeInfo.naturalWidth,
        naturalHeight = _this4$getSizeInfo.naturalHeight,
        elementWidth = _this4$getSizeInfo.elementWidth,
        elementHeight = _this4$getSizeInfo.elementHeight;
      return Math.max(2, Math.max(containerWidth / elementWidth, containerHeight / elementHeight), Math.min(naturalWidth / containerWidth, naturalHeight / containerHeight)) || 1;
    };
  };
  _proto.getDblScale = function getDblScale() {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_8__.effectuate)(this._dblScale);
  };
  _proto.setDblAdjust = function setDblAdjust(aj) {
    if (aj === void 0) {
      aj = true;
    }
    this._dblAdjust = aj;
  };
  _proto.getDblAdjust = function getDblAdjust() {
    return this._dblAdjust;
  };
  _proto.isDamping = function isDamping(key) {
    return this._damping && this._damping.indexOf(key) !== -1;
  };
  _proto.setDamping = function setDamping(damping) {
    if (damping) {
      this._damping = damping;
      return;
    }
    // 如果不设置，默认只对缩放比例和位移进行阻尼
    this._damping = ['scale', 'translate'];
  };
  _proto.rotate = function rotate(a) {
    // 负数顺时针，正数逆时针
    // 在原来的基础上再旋转 a
    return this.transform({
      a: a
    });
  };
  _proto.rotateTo = function rotateTo(a) {
    // 负数顺时针，正数逆时针
    // 直接旋转到 a
    return this.transformTo({
      a: a
    });
  };
  _proto.scale = function scale(k, point) {
    // 在原来的基础上相对 point 点缩放 k
    return this.transform({
      k: k
    }, point);
  };
  _proto.scaleTo = function scaleTo(k, point) {
    // 直接相对 point 点缩放到 k
    return this.transformTo({
      k: k
    }, point);
  };
  _proto.translate = function translate(x, y) {
    // 在原来的基础上平移 x, y
    return this.transform({
      x: x,
      y: y
    });
  };
  _proto.translateTo = function translateTo(x, y) {
    // 直接平移到 x, y
    return this.transformTo({
      x: x,
      y: y
    });
  };
  _proto.translateX = function translateX(x) {
    // 在原来的基础上横向平移 x
    return this.transform({
      x: x
    });
  };
  _proto.translateXTo = function translateXTo(x) {
    // 直接横向平移到 x
    return this.transformTo({
      x: x
    });
  };
  _proto.translateY = function translateY(y) {
    // 在原来的基础上竖向平移  y
    return this.transform({
      y: y
    });
  };
  _proto.translateYTo = function translateYTo(y) {
    // 直接竖向平移到 y
    return this.transformTo({
      y: y
    });
  };
  _proto.transform = function transform(transformRaw, point, options) {
    var _this$getTransform = this.getTransform(),
      _this$getTransform$a = _this$getTransform.a,
      ta = _this$getTransform$a === void 0 ? 0 : _this$getTransform$a,
      _this$getTransform$k = _this$getTransform.k,
      tk = _this$getTransform$k === void 0 ? 1 : _this$getTransform$k,
      _this$getTransform$x = _this$getTransform.x,
      tx = _this$getTransform$x === void 0 ? 0 : _this$getTransform$x,
      _this$getTransform$y = _this$getTransform.y,
      ty = _this$getTransform$y === void 0 ? 0 : _this$getTransform$y;
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
  };
  _proto.transformTo = function transformTo(transformRaw, point, options) {
    var _point = point;
    var _options = options;
    if (!options && !Array.isArray(point)) {
      _options = point;
      _point = undefined;
    }
    var _a = transformRaw.a,
      _k = transformRaw.k,
      _x = transformRaw.x,
      _y = transformRaw.y;
    var _transformRaw = {};
    if (typeof _a === 'number') {
      _transformRaw.a = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_a, this.getRotation());
    }
    if (typeof _k === 'number') {
      var k = _transformRaw.k = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_k, this.getScalation());
      if (Array.isArray(_point)) {
        var _this$computeOffset = this.computeOffset(_point, k),
          ox = _this$computeOffset[0],
          oy = _this$computeOffset[1];
        var _this$_transform = this._transform,
          _this$_transform$x = _this$_transform.x,
          tx = _this$_transform$x === void 0 ? 0 : _this$_transform$x,
          _this$_transform$y = _this$_transform.y,
          ty = _this$_transform$y === void 0 ? 0 : _this$_transform$y;
        _transformRaw.x = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)((typeof _x === 'number' ? _x : tx) + ox, this.getXTranslation(k));
        _transformRaw.y = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)((typeof _y === 'number' ? _y : ty) + oy, this.getYTranslation(k));
      } else {
        if (typeof _x === 'number') {
          _transformRaw.x = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_x, this.getXTranslation(k));
        }
        if (typeof _y === 'number') {
          _transformRaw.y = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_y, this.getYTranslation(k));
        }
      }
    } else {
      if (typeof _x === 'number') {
        _transformRaw.x = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_x, this.getXTranslation());
      }
      if (typeof _y === 'number') {
        _transformRaw.y = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(_y, this.getYTranslation());
      }
    }
    return this.transitionRun(_transformRaw, _options);
  };
  _proto.transitionRun = function transitionRun(transformRaw, options) {
    var _this5 = this;
    if (options === void 0) {
      options = {};
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._transform = new _huangjs888_transform__WEBPACK_IMPORTED_MODULE_6__["default"](transformRaw);
      this._transition.bind(transformRaw);
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default().resolve(transformRaw);
    }
    var a = transformRaw.a,
      k = transformRaw.k,
      x = transformRaw.x,
      y = transformRaw.y;
    var _this$getTransform2 = this.getTransform(),
      _this$getTransform2$a = _this$getTransform2.a,
      ta = _this$getTransform2$a === void 0 ? 0 : _this$getTransform2$a,
      _this$getTransform2$k = _this$getTransform2.k,
      tk = _this$getTransform2$k === void 0 ? 1 : _this$getTransform2$k,
      _this$getTransform2$x = _this$getTransform2.x,
      tx = _this$getTransform2$x === void 0 ? 0 : _this$getTransform2$x,
      _this$getTransform2$y = _this$getTransform2.y,
      ty = _this$getTransform2$y === void 0 ? 0 : _this$getTransform2$y;
    var deltaValue = {};
    var precision = {};
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
    return this._transition.apply(deltaValue, (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      precision: precision,
      cancel: true,
      duration: 500,
      easing: _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__.easeOutQuart
    }, options)).then(function (value) {
      if (!_this5.isTransitioning()) {
        // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
        _this5._transition.bind(_this5._transform.toRaw());
      }
      return value;
    });
  };
  _proto.transitionCancel = function transitionCancel() {
    var _context,
      _this6 = this;
    // cancel返回值是动画未执行的部分
    return _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3___default()(_context = this._transition.cancel()).call(_context, function (value) {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      var _this6$getTransform = _this6.getTransform(),
        _this6$getTransform$a = _this6$getTransform.a,
        ta = _this6$getTransform$a === void 0 ? 0 : _this6$getTransform$a,
        _this6$getTransform$k = _this6$getTransform.k,
        tk = _this6$getTransform$k === void 0 ? 1 : _this6$getTransform$k,
        _this6$getTransform$x = _this6$getTransform.x,
        tx = _this6$getTransform$x === void 0 ? 0 : _this6$getTransform$x,
        _this6$getTransform$y = _this6$getTransform.y,
        ty = _this6$getTransform$y === void 0 ? 0 : _this6$getTransform$y;
      _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_4___default()(value).forEach(function (key) {
        var val = value[key];
        if (key === 'a') {
          _this6._transform.a = ta - val;
        } else if (key === 'k') {
          _this6._transform.k = tk - val;
        } else if (key === 'x') {
          _this6._transform.x = tx - val;
        } else if (key === 'y') {
          _this6._transform.y = ty - val;
        }
      });
    }).length;
  };
  _proto.isTransitioning = function isTransitioning() {
    return this._transition.transitioning();
  };
  _proto.reset = function reset(duration) {
    if (duration === void 0) {
      duration = 0;
    }
    var a = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(0, this.getRotation()); // 初始角度a
    var k = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(1, this.getScalation()); // 初始比例k
    var x = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(0, this.getXTranslation(k)); // 初始位移x
    var y = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(0, this.getYTranslation(k)); //初始位移y
    this.transitionRun({
      a: a,
      k: k,
      x: x,
      y: y
    }, {
      duration: duration
    });
  };
  _proto.computeOffset = function computeOffset(point, k, adjust) {
    if (adjust === void 0) {
      adjust = false;
    }
    var _this$getSizeInfo = this.getSizeInfo(),
      containerCenter = _this$getSizeInfo.containerCenter,
      containerWidth = _this$getSizeInfo.containerWidth,
      containerHeight = _this$getSizeInfo.containerHeight,
      elementWidth = _this$getSizeInfo.elementWidth,
      elementHeight = _this$getSizeInfo.elementHeight;
    var _this$getTransform3 = this.getTransform(),
      _this$getTransform3$k = _this$getTransform3.k,
      tk = _this$getTransform3$k === void 0 ? 1 : _this$getTransform3$k,
      _this$getTransform3$x = _this$getTransform3.x,
      tx = _this$getTransform3$x === void 0 ? 0 : _this$getTransform3$x,
      _this$getTransform3$y = _this$getTransform3.y,
      ty = _this$getTransform3$y === void 0 ? 0 : _this$getTransform3$y;
    var dk = k / tk;
    var cx = containerCenter[0],
      cy = containerCenter[1];
    var ox = (typeof point[0] === 'number' ? point[0] : cx) - (cx + tx);
    var oy = (typeof point[1] === 'number' ? point[1] : cy) - (cy + ty);
    if (adjust) {
      // 思路：对元素进行划线分界
      // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
      // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
      // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
      // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
      // 5，元素左右计算方式如同上下方式一样得到ox
      // 测微信得到的结论
      // 这个偏移量需要要向着边缘点发散
      var cw = containerWidth / 1;
      var ch = containerHeight / 1;
      var ew = elementWidth / tk;
      var eh = elementHeight / tk;
      ox = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(ew - (cw - ew) / (dk - 1), [0, ew]) * (0,_utils__WEBPACK_IMPORTED_MODULE_8__.ratioOffset)(ox / ew, dk, (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(cw / ew, [1, 2])) || 0;
      oy = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(eh - (ch - eh) / (dk - 1), [0, eh]) * (0,_utils__WEBPACK_IMPORTED_MODULE_8__.ratioOffset)(oy / eh, dk, (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(ch / eh, [1, 2])) || 0;
    }
    ox *= 1 - dk;
    oy *= 1 - dk;
    return [ox, oy];
  };
  _proto.moveBounce = function moveBounce(angle, scale, deltaX, deltaY, point) {
    if (point === void 0) {
      point = [];
    }
    var _this$getTransform4 = this.getTransform(),
      _this$getTransform4$a = _this$getTransform4.a,
      a = _this$getTransform4$a === void 0 ? 0 : _this$getTransform4$a,
      _this$getTransform4$k = _this$getTransform4.k,
      k = _this$getTransform4$k === void 0 ? 1 : _this$getTransform4$k,
      _this$getTransform4$x = _this$getTransform4.x,
      x = _this$getTransform4$x === void 0 ? 0 : _this$getTransform4$x,
      _this$getTransform4$y = _this$getTransform4.y,
      y = _this$getTransform4$y === void 0 ? 0 : _this$getTransform4$y;
    var aRange = this.getRotation();
    if (this.isDamping('rotate')) {
      // 先把当前值反算出阻尼之前的原值
      var ba = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(a, aRange);
      a = ba + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(a - ba, {
        max: 180
      });
      // 再对总值进行总体阻尼计算
      ba = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(a += angle, aRange);
      a = ba + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.performDamping)(a - ba, {
        max: 180
      });
    } else {
      a = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(a += angle, aRange);
    }
    var kRange = this.getScalation();
    if (this.isDamping('scale')) {
      // 先把当前值反算出阻尼之前的原值
      var bk = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(k, kRange);
      k = bk * (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(k / bk, {
        max: 2,
        mode: 1
      });
      // 再对总值进行总体阻尼计算
      bk = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(k *= scale, kRange);
      k = bk * (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.performDamping)(k / bk, {
        max: 2,
        mode: 1
      });
    } else {
      k = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(k *= scale, kRange);
    }
    var _this$computeOffset2 = this.computeOffset(point, k),
      ox = _this$computeOffset2[0],
      oy = _this$computeOffset2[1];
    if (this.isDamping('scale')) {
      var _this$getSizeInfo2 = this.getSizeInfo(),
        xMax = _this$getSizeInfo2.containerWidth,
        yMax = _this$getSizeInfo2.containerHeight;
      // 先把当前值反算出阻尼之前的原值
      var bx = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(x, this.getXTranslation());
      x = bx + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(x - bx, {
        max: xMax
      });
      // 再对总值进行总体阻尼计算
      bx = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(x += ox + deltaX, this.getXTranslation(k));
      x = bx + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.performDamping)(x - bx, {
        max: xMax
      });
      // 先把当前值反算出阻尼之前的原值
      var by = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(y, this.getYTranslation());
      y = by + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(y - by, {
        max: yMax
      });
      // 再对总值进行总体阻尼计算
      by = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(y += oy + deltaY, this.getYTranslation(k));
      y = by + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.performDamping)(y - by, {
        max: yMax
      });
    } else {
      x = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(x += ox + deltaX, this.getXTranslation(k));
      y = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(y += oy + deltaY, this.getYTranslation(k));
    }
    this.transitionRun({
      a: a,
      k: k,
      x: x,
      y: y
    }, {
      duration: 0
    });
  };
  _proto.resetBounce = function resetBounce(point, cancel) {
    if (point === void 0) {
      point = [];
    }
    if (cancel === void 0) {
      cancel = false;
    }
    var _this$getTransform5 = this.getTransform(),
      _this$getTransform5$a = _this$getTransform5.a,
      a = _this$getTransform5$a === void 0 ? 0 : _this$getTransform5$a,
      _this$getTransform5$k = _this$getTransform5.k,
      k = _this$getTransform5$k === void 0 ? 1 : _this$getTransform5$k,
      _this$getTransform5$x = _this$getTransform5.x,
      x = _this$getTransform5$x === void 0 ? 0 : _this$getTransform5$x,
      _this$getTransform5$y = _this$getTransform5.y,
      y = _this$getTransform5$y === void 0 ? 0 : _this$getTransform5$y;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('rotate')) {
      var ba = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(a, this.getRotation());
      a = ba + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(a - ba, {
        max: 180
      });
    }
    if (this.isDamping('scale')) {
      var bk = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(k, this.getScalation());
      k = bk * (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(k / bk, {
        max: 2,
        mode: 1
      });
    }
    if (this.isDamping('translate')) {
      var _this$getSizeInfo3 = this.getSizeInfo(),
        xMax = _this$getSizeInfo3.containerWidth,
        yMax = _this$getSizeInfo3.containerHeight;
      var bx = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(x, this.getXTranslation());
      x = bx + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(x - bx, {
        max: xMax
      });
      var by = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(y, this.getYTranslation());
      y = by + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_7__.revokeDamping)(y - by, {
        max: yMax
      });
    } // 重置之前是双指移动，是不允许取消动画的
    this.transformTo({
      a: a,
      k: k,
      x: x,
      y: y
    }, point, {
      cancel: cancel
    });
  };
  _proto.dblScale = function dblScale(point) {
    if (point === void 0) {
      point = [];
    }
    // 这三个比例都是用保留三位小数的结果进行比较
    // 其实这里的3应该用1/屏幕的宽高算出的小数位数
    // 此刻比例和位移
    var tk = this.getTransform().k || 1;
    // 双击变化的比例
    var dk = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(this.getDblScale(), this.getScalation());
    // 再次双击恢复的比例（初始比例）
    var bk = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(1, this.getScalation());
    // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
    // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
    if (dk > bk && tk <= bk || dk < bk && tk >= bk) {
      if (this.getDblAdjust()) {
        // 需要调整的情况，自己算偏移量，并且旋转置为0
        var _this$computeOffset3 = this.computeOffset(point, dk, this.getDblAdjust()),
          ox = _this$computeOffset3[0],
          oy = _this$computeOffset3[1];
        var _this$getTransform6 = this.getTransform(),
          _this$getTransform6$x = _this$getTransform6.x,
          tx = _this$getTransform6$x === void 0 ? 0 : _this$getTransform6$x,
          _this$getTransform6$y = _this$getTransform6.y,
          ty = _this$getTransform6$y === void 0 ? 0 : _this$getTransform6$y;
        this.transformTo({
          a: 0,
          k: dk,
          x: tx + ox,
          y: ty + oy
        }, {
          cancel: false
        });
      } else {
        // 交给transformTo
        this.transformTo({
          k: dk
        }, point, {
          cancel: false
        });
      }
    } else {
      // 再次双击恢复
      if (this.getDblAdjust()) {
        // 需要调整的情况，置为初始状态
        this.transformTo({
          a: 0,
          k: bk,
          x: 0,
          y: 0
        }, {
          cancel: false
        });
      } else {
        // 交给transformTo
        this.transformTo({
          k: bk
        }, point, {
          cancel: false
        });
      }
    }
  };
  _proto.swipeBounce = function swipeBounce(duration, stretch, key, transition) {
    var _this7 = this;
    var sizeInfo = this.getSizeInfo();
    var maxBounce = sizeInfo[key === 'x' ? 'containerWidth' : 'containerHeight'];
    var xyScale = 1.2 * this.getDblScale();
    var xyPos = this.getTransform()[key] || 0;
    var xyRange = this.getTranslation()[key === 'x' ? 0 : 1];
    var sign = stretch > 0 ? 1 : -1;
    // 对距离进行优化(最大值是当前双击比例下图片宽度)
    var _stretch = Math.max(1, Math.min(Math.abs(stretch), xyScale * maxBounce)) * sign;
    // 对时间进行优化
    var _duration = Math.max(800, Math.min(2500, duration));
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_8__.isBetween)(xyPos + _stretch, xyRange)) {
      var _this$transitionRun;
      // 如果加上惯性滑动距离之后图片未超出边界，则图片直接移动
      this.transitionRun((_this$transitionRun = {}, _this$transitionRun[key] = xyPos + _stretch, _this$transitionRun), {
        easing: _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__.easeOutQuad,
        duration: _duration
      });
    } else {
      // 根据边界算出到达边界要走的的距离，有可能松开时已经超出边界，此时xySwipe是需要减掉的超出部分距离
      var _xySwipe = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(xyPos + _stretch, xyRange) - xyPos;
      var _xyBounce = 0;
      if (this.isDamping('translate')) {
        // 计算速度时，如果松开时超出边界，xySwipe视作0，其实得到的就是初始速度
        var velocity = ((0,_utils__WEBPACK_IMPORTED_MODULE_8__.isBetween)(xyPos, xyRange) ? Math.sqrt(1 - Math.abs(_xySwipe / _stretch)) : 1) * (2 * Math.abs(_stretch) / _duration);
        // 根据到达边界时速度的大小计算出将要Damping的距离（一个与速度成正比计算方式，最大值不能超过容器宽度的1/4）
        _xyBounce = Math.min(30 * velocity, maxBounce / 4) * sign;
      }
      if (typeof transition === 'function') {
        // 交给调用者去计算分配如何transition，并使用回调计算transition配置
        transition(key, _xySwipe, _xyBounce, function (xyMove) {
          // 根据实际走的距离xyMove算出时间占比
          var kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
          return {
            duration: kt * _duration,
            easing: _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__.easeOutQuad
          };
        });
      } else {
        // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
        var xyMove = Math.max((_xySwipe + _xyBounce) * sign, 0) * sign;
        // 整个减速运动中，移动xyMove的时间占比
        var kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
        if (xyMove === 0) {
          var _this$transitionRun2;
          // 如果swipe抬起没有移动的距离，则直接归位
          this.transitionRun((_this$transitionRun2 = {}, _this$transitionRun2[key] = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(xyPos + xyMove, xyRange), _this$transitionRun2));
        } else {
          var _this$transitionRun3;
          // 先移动xyMove距离
          this.transitionRun((_this$transitionRun3 = {}, _this$transitionRun3[key] = xyPos + xyMove, _this$transitionRun3), {
            duration: kt * _duration,
            easing: _huangjs888_transition__WEBPACK_IMPORTED_MODULE_5__.easeOutQuad
          }).then(function () {
            var _this7$transitionRun;
            // 移动后归位
            _this7.transitionRun((_this7$transitionRun = {}, _this7$transitionRun[key] = (0,_utils__WEBPACK_IMPORTED_MODULE_8__.between)(xyPos + xyMove, xyRange), _this7$transitionRun));
          });
        }
      }
    }
  };
  return Entity;
}();
/* harmony default export */ __webpack_exports__["default"] = (Entity);

/***/ }),

/***/ "./src/entity/utils.ts":
/*!*****************************!*\
  !*** ./src/entity/utils.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   between: function() { return /* binding */ between; },
/* harmony export */   effectuate: function() { return /* binding */ effectuate; },
/* harmony export */   fixDecimal: function() { return /* binding */ fixDecimal; },
/* harmony export */   isBetween: function() { return /* binding */ isBetween; },
/* harmony export */   ratioOffset: function() { return /* binding */ ratioOffset; }
/* harmony export */ });
/*
 * @Author: Huangjs
 * @Date: 2023-06-26 09:46:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 15:49:45
 * @Description: ******
 */

// 解决0.1+0.2不等于0.3的问题
function fixDecimal(value, places) {
  if (places === void 0) {
    places = 15;
  }
  var multiple = Math.pow(10, places);
  return Math.round(value * multiple) / multiple;
}
// 算出双击时offset的比例
function ratioOffset(v, k, t) {
  if (v <= (1 - k) / (2 * k)) {
    return -1 / 2;
  } else if (v >= (1 + k - 2 * t) / (2 * k)) {
    return 1 / 2;
  } else {
    return (v - (1 - t) / (2 * k)) / (1 - t / k);
  }
}
// 传入的a是函数，就返回函数执行结果，否则直接返回a
function effectuate(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return typeof fn === 'function' ? fn.apply(void 0, args) : fn;
}
// 判断v是否在min和max之间
function isBetween(v, _ref) {
  var min = _ref[0],
    max = _ref[1];
  return min <= v && v <= max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
function between(v, _ref2, _) {
  var min = _ref2[0],
    max = _ref2[1];
  return Math.max(Math.min(v, max), min);
}

/***/ }),

/***/ "./src/events/doubleTap.ts":
/*!*********************************!*\
  !*** ./src/events/doubleTap.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ doubleTap; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:10
 * @Description: ******
 */


function doubleTap(e) {
  if (this._isClose) {
    return;
  }
  var point = e.getPoint();
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    var translate = -this._activeIndex * this.getItemSize();
    var diff = Math.round(this._translate - translate);
    if (diff === 0) {
      var _ref = this._images && this._images[this._activeIndex] || {},
        entity = _ref.entity;
      if (entity) {
        if (entity.isTransitioning()) {
          return;
        }
        entity.dblScale(point);
      }
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      _entity.dblScale(point);
    }
  }
}

/***/ }),

/***/ "./src/events/index.ts":
/*!*****************************!*\
  !*** ./src/events/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ bindGesture; }
/* harmony export */ });
/* harmony import */ var _huangjs888_gesture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @huangjs888/gesture */ "./node_modules/@huangjs888/gesture/es/index.js");
/* harmony import */ var _rotate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rotate */ "./src/events/rotate.ts");
/* harmony import */ var _scale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scale */ "./src/events/scale.ts");
/* harmony import */ var _swipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./swipe */ "./src/events/swipe.ts");
/* harmony import */ var _longTap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./longTap */ "./src/events/longTap.ts");
/* harmony import */ var _singleTap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./singleTap */ "./src/events/singleTap.ts");
/* harmony import */ var _doubleTap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./doubleTap */ "./src/events/doubleTap.ts");
/* harmony import */ var _pointerStart__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pointerStart */ "./src/events/pointerStart.ts");
/* harmony import */ var _pointerMove__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pointerMove */ "./src/events/pointerMove.ts");
/* harmony import */ var _pointerEnd__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pointerEnd */ "./src/events/pointerEnd.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:25
 * @Description: ******
 */











function bindGesture(element) {
  // 绑定手势
  var gesture = new _huangjs888_gesture__WEBPACK_IMPORTED_MODULE_0__["default"](element);
  gesture.on('pointerStart', _pointerStart__WEBPACK_IMPORTED_MODULE_7__["default"].bind(this));
  gesture.on('pointerMove', _pointerMove__WEBPACK_IMPORTED_MODULE_8__["default"].bind(this));
  gesture.on('pointerEnd', _pointerEnd__WEBPACK_IMPORTED_MODULE_9__["default"].bind(this));
  gesture.on('swipe', _swipe__WEBPACK_IMPORTED_MODULE_3__["default"].bind(this));
  gesture.on('longTap', _longTap__WEBPACK_IMPORTED_MODULE_4__["default"].bind(this));
  gesture.on('singleTap', _singleTap__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this));
  gesture.on('doubleTap', _doubleTap__WEBPACK_IMPORTED_MODULE_6__["default"].bind(this));
  gesture.on('rotate', _rotate__WEBPACK_IMPORTED_MODULE_1__["default"].bind(this));
  gesture.on('scale', _scale__WEBPACK_IMPORTED_MODULE_2__["default"].bind(this));
  return gesture;
}

/***/ }),

/***/ "./src/events/longTap.ts":
/*!*******************************!*\
  !*** ./src/events/longTap.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ longTap; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:33
 * @Description: ******
 */


function longTap() {
  if (this._isClose) {
    return;
  }
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (typeof this._longPress === 'function') {
      this._longPress();
    }
  }
}

/***/ }),

/***/ "./src/events/pointerEnd.ts":
/*!**********************************!*\
  !*** ./src/events/pointerEnd.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerEnd; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../popup */ "./src/popup.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 10:52:26
 * @Description: ******
 */



function pointerEnd(e) {
  if (this._isClose) {
    return;
  }
  var target = '';
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    target = this._moveTarget;
  }
  // 单指抬起的情况才可以取消动画
  var cancel = this._fgBehavior === 1 || e.leavePointers.length === 1;
  if (e.pointers.length === 0) {
    // 抬起最后一根手指时，重置以下参数
    this._fgBehavior = 0;
    if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      this._moveTarget = 'none';
    }
  } else if (this._fgBehavior === 1) {
    // 多指视作单指时，抬起非最后一根手指，不做任何操作
    if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      // 微信这种情况下是slide了，其实我觉得吧，可以不用，影响不大
      if (target === 'outside') {
        var size = this.getItemSize();
        var index = size === 0 ? 0 : -this._translate / this.getItemSize();
        this.slide(Math.round(index));
      }
    }
    return;
  }
  var point = e.getPoint();
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity,
      wrapper = _ref.wrapper;
    if (target === 'closures') {
      (0,_popup__WEBPACK_IMPORTED_MODULE_1__.popupTransform)({
        el: this._backdrop,
        o: 1
      }, {
        el: wrapper || null,
        x: 0,
        y: 0,
        k: 1
      }, {
        el: null
      }, 300);
      return;
    }
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      entity.resetBounce(point, cancel);
    }
    // 只有在swiper的时候才会下一张
    var _size = this.getItemSize();
    var _index = this._activeIndex;
    if (target === 'outside') {
      _index = _size === 0 ? 0 : -this._translate / this.getItemSize();
    }
    // Math.round代表移动超过一半，就下一张，后续可以加入阈值参数判断, slide方法里会更新_activeIndex
    this.slide(Math.round(_index));
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      _entity.resetBounce(point, cancel);
    }
  }
}

/***/ }),

/***/ "./src/events/pointerMove.ts":
/*!***********************************!*\
  !*** ./src/events/pointerMove.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerMove; }
/* harmony export */ });
/* harmony import */ var _huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @huangjs888/damping */ "./node_modules/@huangjs888/damping/es/index.js");
/* harmony import */ var _entity_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../entity/utils */ "./src/entity/utils.ts");
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../popup */ "./src/popup.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:53
 * @Description: ******
 */





var minScale = 0.3; // swipeClose下拉最小缩放比例
var minOpacity = 0.01; // swipeClose下拉最小透明度
var isRightDown = function isRightDown(direction, _ref, _ref2) {
  var x0 = _ref[0],
    y0 = _ref[1];
  var x1 = _ref2[0],
    y1 = _ref2[1];
  if (direction === 'vertical') {
    return Math.abs(x0 - x1) > 4 * Math.abs(y0 - y1) && x0 - x1 <= 0;
  } else {
    return Math.abs(y0 - y1) > 4 * Math.abs(x0 - x1) && y0 - y1 <= 0;
  }
};
function pointerMove(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointers.length === 1) {
    // 第一根手指放上去，然后直接移动，此时标记为1
    this._fgBehavior = 1;
  }
  var onePointer = false;
  if (e.pointers.length === 1 || this._fgBehavior === 1) {
    onePointer = true;
  }
  var point = e.getPoint();
  var point0 = e.getPoint('previous');
  var direction = e.direction,
    _e$angle = e.angle,
    angle = _e$angle === void 0 ? 0 : _e$angle,
    _e$scale = e.scale,
    scale = _e$scale === void 0 ? 1 : _e$scale,
    _e$deltaX = e.deltaX,
    deltaX = _e$deltaX === void 0 ? 0 : _e$deltaX,
    _e$deltaY = e.deltaY,
    deltaY = _e$deltaY === void 0 ? 0 : _e$deltaY;
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_2__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref3 = this._images && this._images[this._activeIndex] || {},
      entity = _ref3.entity,
      wrapper = _ref3.wrapper;
    var length = (this._images || []).length;
    if (entity) {
      if (entity.isTransitioning()) {
        return;
      }
      var _entity$getTransform = entity.getTransform(),
        _entity$getTransform$ = _entity$getTransform.x,
        tx = _entity$getTransform$ === void 0 ? 0 : _entity$getTransform$,
        _entity$getTransform$2 = _entity$getTransform.y,
        ty = _entity$getTransform$2 === void 0 ? 0 : _entity$getTransform$2;
      var _entity$getTranslatio = entity.getTranslation(),
        xRange = _entity$getTranslatio[0],
        yRange = _entity$getTranslatio[1];
      // 如果x方向没有可以移动的范围，则判断向上还是向下使用deltaY的正负，否则使用direction值
      var fixedX = xRange[0] === 0 && xRange[1] === 0;
      // 如果y方向没有可以移动的范围，则判断向左还是向右使用deltaX的正负，否则使用direction值
      var fixedY = yRange[0] === 0 && yRange[1] === 0;
      if (this._moveTarget === 'none') {
        // 多指或者不满足以下条件的，则做图片操作
        this._moveTarget = 'inside';
        if (onePointer) {
          // 是否是边缘图片
          var isFirst = this._activeIndex === 0;
          var isLast = this._activeIndex === length - 1;
          var rightDown = isRightDown(this._direction, point0, point);
          // 单指行为时，根据图片位置，判断后续为外部swiper操作还是内部图片操作
          if (this._direction === 'vertical') {
            if (this._swipeClose && tx >= xRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果x的范围是[0,0]，则判断上下移动，直接根据deltaY的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              var upMove = fixedX ? deltaY < 0 : direction === 'Up';
              var downMove = fixedX ? deltaY > 0 : direction === 'Down';
              // 如果图片上边抵达或超出上边界，仍然向下滑动（不是第一张图）
              // 或者下边抵达或超出下边界，仍然向上滑动（不是最后一张图），则为swiper，反之为图片操作
              // 因为第一张图片和最后一张都是边缘图片（边缘图片向两边swipe时，是没有上一张或下一张的），无需外部swipe操作，直接走内部图片操作
              if (ty <= yRange[0] && upMove && !isLast || ty >= yRange[1] && downMove && !isFirst) {
                this._moveTarget = 'outside';
              }
            }
          } else {
            if (this._swipeClose && ty >= yRange[1] && rightDown) {
              this._moveTarget = 'closures';
            } else {
              // 如果y的范围是[0,0]，则判断左右移动，直接根据deltaX的正负
              // 否则需要根据移动方向（因为移动方向是按照45度分开的）
              var leftMove = fixedY ? deltaX < 0 : direction === 'Left';
              var rightMove = fixedY ? deltaX > 0 : direction === 'Right';
              // 如果图片左边抵达或超出左边界，仍然向右滑动（不是第一张图）
              // 或者右边抵达或超出右边界，仍然向左滑动（不是最后一张图），则为swiper操作，反之为图片操作
              if (tx <= xRange[0] && leftMove && !isLast || tx >= xRange[1] && rightMove && !isFirst) {
                this._moveTarget = 'outside';
              }
            }
          }
        }
      }
      // 进入内部图片操作
      if (this._moveTarget === 'inside') {
        var translate = -this._activeIndex * this.getItemSize();
        // 计算出外部swiper移动的原始距离
        var diff = (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.revokeDamping)(this._translate - translate, {
          max: this.getItemSize()
        });
        var _deltaX = deltaX;
        var _deltaY = deltaY;
        // 把swiper移动的原始距离加进去
        if (this._direction === 'vertical') {
          _deltaY += diff;
        } else {
          _deltaX += diff;
        }
        if (onePointer) {
          var _delta = 0;
          if (this._direction === 'vertical') {
            _delta = _deltaY;
            // 竖向的时候固定x
            _deltaX = fixedX ? 0 : _deltaX;
            // 内部图片，最多移动到边界
            _deltaY = (0,_entity_utils__WEBPACK_IMPORTED_MODULE_1__.between)(_deltaY + ty, yRange) - ty;
            // 超出部分由外部swiper移动
            _delta -= _deltaY;
          } else {
            _delta = _deltaX;
            // 内部图片，最多移动到边界
            _deltaX = (0,_entity_utils__WEBPACK_IMPORTED_MODULE_1__.between)(_deltaX + tx, xRange) - tx;
            // 横向的时候固定y
            _deltaY = fixedY ? 0 : _deltaY;
            // 超出部分由外部swiper移动
            _delta -= _deltaX;
          }
          // 内部图片需要移动的距离
          entity.moveBounce(0, 1, _deltaX, _deltaY, point);
          // 外部swiper需要移动的距离
          this.transitionRun(translate + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.performDamping)(_delta, {
            max: this.getItemSize()
          }), {
            duration: 0
          });
        } else {
          entity.moveBounce(angle, scale, _deltaX, _deltaY, point);
          if (diff !== 0) {
            // 多指移动前，将外部swiper移动的部分归位（内部image会把swiper的距离加进去）
            this.transitionRun(translate, {
              duration: 0
            });
          }
        }
        return;
      }
    } else {
      if (this._moveTarget === 'none') {
        this._moveTarget = this._swipeClose && isRightDown(this._direction, point0, point) ? 'closures' : 'outside';
      }
    }
    if (this._moveTarget === 'closures') {
      var _e$moveX = e.moveX,
        moveX = _e$moveX === void 0 ? 0 : _e$moveX,
        _e$moveY = e.moveY,
        moveY = _e$moveY === void 0 ? 0 : _e$moveY;
      var _ref4 = this._rectSize || {},
        _ref4$width = _ref4.width,
        width = _ref4$width === void 0 ? 0 : _ref4$width,
        _ref4$height = _ref4.height,
        height = _ref4$height === void 0 ? 0 : _ref4$height,
        _ref4$left = _ref4.left,
        left = _ref4$left === void 0 ? 0 : _ref4$left,
        _ref4$top = _ref4.top,
        top = _ref4$top === void 0 ? 0 : _ref4$top;
      var k = Math.min(Math.max(1 - ((this._direction === 'vertical' ? moveX / width : moveY / height) || 0), minScale), 1);
      var o = minOpacity + (k - minScale) * (1 - minOpacity) / (1 - minScale);
      var x = 0;
      var y = 0;
      if (wrapper) {
        var _x = 0;
        var _y = 0;
        var _k = 1;
        if (wrapper.style.transform) {
          var styles = wrapper.style.transform.split('(');
          var _styles$1$split$0$spl = styles[1].split(')')[0].split(','),
            xs = _styles$1$split$0$spl[0],
            ys = _styles$1$split$0$spl[1];
          var ks = styles[2].split(')')[0];
          _x = parseFloat(xs);
          _y = parseFloat(ys);
          _k = parseFloat(ks);
        }
        x = _x + deltaX + (point[0] - (_x + left + width / 2)) * (1 - k / _k);
        y = _y + deltaY + (point[1] - (_y + top + height / 2)) * (1 - k / _k);
      }
      (0,_popup__WEBPACK_IMPORTED_MODULE_3__.popupTransform)({
        el: this._backdrop,
        o: o
      }, {
        el: wrapper || null,
        x: x,
        y: y,
        k: k
      }, {
        el: null
      });
      return;
    }
    // 非内部图片操作，均是外部swiper操作
    var swiperRange = [(1 - length) * this.getItemSize(), 0];
    // 先把当前值反算出阻尼之前的原值
    var bt = (0,_entity_utils__WEBPACK_IMPORTED_MODULE_1__.between)(this._translate, swiperRange);
    var t = bt + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.revokeDamping)(this._translate - bt, {
      max: this.getItemSize()
    });
    // 再对总值进行总体阻尼计算
    bt = (0,_entity_utils__WEBPACK_IMPORTED_MODULE_1__.between)(t += this._direction === 'vertical' ? deltaY : deltaX, swiperRange);
    t = bt + (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.performDamping)(t - bt, {
      max: this.getItemSize()
    });
    this.transitionRun(t, {
      duration: 0
    });
  } else {
    var _ref5 = this._image || {},
      _entity = _ref5.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      if (onePointer) {
        // 实现单指move
        _entity.moveBounce(0, 1, deltaX, deltaY, point);
      } else {
        // 双指move
        _entity.moveBounce(angle, scale, deltaX, deltaY, point);
      }
    }
  }
}

/***/ }),

/***/ "./src/events/pointerStart.ts":
/*!************************************!*\
  !*** ./src/events/pointerStart.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerStart; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var _entity_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../entity/utils */ "./src/entity/utils.ts");
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");


var _excluded = ["x", "y"];
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 10:36:57
 * @Description: ******
 */



function pointerStart(e) {
  if (this._isClose) {
    return;
  }
  if (this._fgBehavior === 0 && e.pointers.length > 1) {
    // 第一根手指放上去，紧接着再放一根手指（或者直接一下子放了两个手指），此时标记为2
    this._fgBehavior = 2;
  }
  var stopCount = 0;
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_3__["default"]) {
    stopCount += this.transitionCancel();
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    var length = (this._images || []).length;
    if (entity) {
      stopCount += entity.transitionCancel();
      // @@@1： 此处逻辑和swipe手势函数里 @@@2 逻辑是处理同一个问题（二选一，微信用的是这个效果）
      // 这里是在手指放上去时直接恢复到边界，那边是在真正要slide到上(下)一张时恢复到边界
      // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
      // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
      // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
      var _entity$getTransform = entity.getTransform(),
        _entity$getTransform$ = _entity$getTransform.x,
        tx = _entity$getTransform$ === void 0 ? 0 : _entity$getTransform$,
        _entity$getTransform$2 = _entity$getTransform.y,
        ty = _entity$getTransform$2 === void 0 ? 0 : _entity$getTransform$2,
        rest = (0,_babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(_entity$getTransform, _excluded);
      var _entity$getTranslatio = entity.getTranslation(),
        xRange = _entity$getTranslatio[0],
        yRange = _entity$getTranslatio[1];
      // 是否是边缘图片
      var isFirst = this._activeIndex === 0;
      var isLast = this._activeIndex === length - 1;
      if (this._direction === 'vertical') {
        if (!(0,_entity_utils__WEBPACK_IMPORTED_MODULE_2__.isBetween)(tx, xRange) && (ty <= yRange[0] && !isLast || ty >= yRange[1] && !isFirst)) {
          // 非边缘图片，且y方向超出边界，x方向也超出边界的，x给予恢复到边界
          entity.transitionRun((0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
            x: (0,_entity_utils__WEBPACK_IMPORTED_MODULE_2__.between)(tx, xRange),
            y: ty
          }, rest), {
            duration: 0
          });
        }
      } else {
        if (!(0,_entity_utils__WEBPACK_IMPORTED_MODULE_2__.isBetween)(ty, yRange) && (tx <= xRange[0] && !isLast || tx >= xRange[1] && !isFirst)) {
          // 非边缘图片，且x方向超出边界，y方向也超出边界的，y给予恢复到边界
          entity.transitionRun((0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
            x: tx,
            y: (0,_entity_utils__WEBPACK_IMPORTED_MODULE_2__.between)(ty, yRange)
          }, rest), {
            duration: 0
          });
        }
      }
    }
  } else {
    // 取消动画
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      stopCount += _entity.transitionCancel();
    }
  }
  if (stopCount > 0 && this._gesture) {
    // 如果有动画停止，则阻止所有单指点击相关事件（就像是移动了一下一样）
    // 曲线救国：这里使用注入设置，以达到阻止的目的
    this._gesture._preventTap = true;
    this._gesture._preventSingleTap = true;
    this._gesture._preventDoubleTap = true;
    this._gesture._firstPointer = null;
    if (this._gesture._longTapTimer) {
      clearTimeout(this._gesture._longTapTimer);
      this._gesture._longTapTimer = null;
    }
  }
}

/***/ }),

/***/ "./src/events/rotate.ts":
/*!******************************!*\
  !*** ./src/events/rotate.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rotate; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 15:56:28
 * @Description: ******
 */


function rotate(e) {
  if (this._isClose) {
    return;
  }
  // 只有鼠标操作才可以，touch操作被放入到pointerMove中了
  if (this._gesture && this._gesture.isTouch()) {
    return;
  }
  var _e$angle = e.angle,
    a = _e$angle === void 0 ? 0 : _e$angle;
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    var translate = -this._activeIndex * this.getItemSize();
    var diff = Math.round(this._translate - translate);
    if (diff === 0) {
      var _ref = this._images && this._images[this._activeIndex] || {},
        entity = _ref.entity;
      if (entity) {
        if (entity.isTransitioning()) {
          return;
        }
        // 表示停止缩放，应该重置
        if (isNaN(a)) {
          entity.resetBounce();
        } else {
          entity.moveBounce(a, 1, 0, 0);
        }
      }
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      // 表示停止缩放，应该重置
      if (isNaN(a)) {
        _entity.resetBounce();
      } else {
        _entity.moveBounce(a, 1, 0, 0);
      }
    }
  }
}

/***/ }),

/***/ "./src/events/scale.ts":
/*!*****************************!*\
  !*** ./src/events/scale.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ scale; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 16:23:15
 * @Description: ******
 */


function scale(e) {
  if (this._isClose) {
    return;
  }
  // 只有鼠标操作才可以，touch操作被放入到pointerMove中了
  if (this._gesture && this._gesture.isTouch()) {
    return;
  }
  // const point = e.getPoint();
  var _e$scale = e.scale,
    k = _e$scale === void 0 ? 1 : _e$scale;
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    // diff===0表示目前没有进行任何move操作（使用Math.round，因为像素精确到1）
    var translate = -this._activeIndex * this.getItemSize();
    var diff = Math.round(this._translate - translate);
    if (diff === 0) {
      var _ref = this._images && this._images[this._activeIndex] || {},
        entity = _ref.entity;
      if (entity) {
        if (entity.isTransitioning()) {
          return;
        }
        // 表示停止缩放，应该重置
        if (isNaN(k)) {
          entity.resetBounce();
        } else {
          entity.moveBounce(0, k, 0, 0 /* , point */);
        }
      }
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      // 表示停止缩放，应该重置
      if (isNaN(k)) {
        _entity.resetBounce();
      } else {
        _entity.moveBounce(0, k, 0, 0 /* , point */);
      }
    }
  }
}

/***/ }),

/***/ "./src/events/singleTap.ts":
/*!*********************************!*\
  !*** ./src/events/singleTap.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ singleTap; }
/* harmony export */ });
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:21:03
 * @Description: ******
 */


function singleTap() {
  if (this._isClose) {
    return;
  }
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._press === 'function') {
      this._press();
    }
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity && _entity.isTransitioning()) {
      return;
    }
    if (typeof this._press === 'function') {
      this._press();
    }
  }
}

/***/ }),

/***/ "./src/events/swipe.ts":
/*!*****************************!*\
  !*** ./src/events/swipe.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ swipe; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../gallery */ "./src/gallery.ts");

/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:41:16
 * @Description: ******
 */


function swipe(e) {
  var _this = this;
  if (this._isClose) {
    return;
  }
  if (this instanceof _gallery__WEBPACK_IMPORTED_MODULE_1__["default"]) {
    if (this.isTransitioning()) {
      return;
    }
    var _ref = this._images && this._images[this._activeIndex] || {},
      entity = _ref.entity;
    if (this._moveTarget === 'inside' && entity) {
      if (entity.isTransitioning()) {
        return;
      }
      var _e$velocity = e.velocity,
        velocity = _e$velocity === void 0 ? 0 : _e$velocity,
        swipeComputed = e.swipeComputed;
      if (velocity > 0 && swipeComputed) {
        var transition = function transition(key, xySwipe, xyBounce, option) {
          if (_this instanceof _gallery__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            var translate = -_this._activeIndex * _this.getItemSize();
            // 不等于0，表示未达到边界
            if (xySwipe !== 0) {
              var _entity$transitionRun;
              var _option = option(xySwipe + xyBounce),
                _duration = _option.duration,
                easing = _option.easing;
              // 因为是两个过渡，这里同时触发，分别在before里设置先后发生，使两个过度连贯进行
              _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0___default().all([
              // 图片走到边界距离xySwipe
              entity.transitionRun((_entity$transitionRun = {}, _entity$transitionRun[key] = (entity.getTransform()[key] || 0) + xySwipe, _entity$transitionRun), {
                duration: _duration,
                easing: easing,
                before: function before(progress) {
                  // 先走 xySwipe ，走完之后，后面就一直 1
                  // 根据总路程 xySwipe + xyBounce，计算走 xySwipe 实际的进度
                  var s = Math.abs(xySwipe);
                  var sb = Math.abs(xySwipe + xyBounce);
                  return Math.min(sb * progress, s) / s;
                }
              }),
              // 外部走damping距离xyBounce
              _this.transitionRun(_this._translate + xyBounce, {
                duration: _duration,
                easing: easing,
                before: function before(progress) {
                  // 后走 xyBounce ，没走之前，前面一直 0
                  // 根据总路程 xySwipe + xyBounce，计算走 xyBounce 的实际的进度
                  var s = Math.abs(xySwipe);
                  var b = Math.abs(xyBounce);
                  var sb = Math.abs(xySwipe + xyBounce);
                  return Math.max(sb * progress - s, 0) / b;
                }
              })]).then(function () {
                // 外部归位
                if (_this instanceof _gallery__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                  _this.transitionRun(translate);
                }
              });
            } else {
              // 已经Damping的部分，即超出部分的距离
              var diff = _this._translate - translate;
              var sign = diff > 0 ? 1 : -1;
              // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
              var xyMove = Math.max((xyBounce - diff) * sign, 0) * sign;
              var _option2 = option(xyMove),
                _duration2 = _option2.duration,
                _easing = _option2.easing;
              if (xyMove === 0) {
                // 外部直接归位
                _this.transitionRun(translate);
              } else {
                _this.transitionRun(_this._translate + xyMove, {
                  duration: _duration2,
                  easing: _easing
                }).then(function () {
                  // 外部归位
                  if (_this instanceof _gallery__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                    _this.transitionRun(translate);
                  }
                });
              }
            }
          }
        };
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        var _swipeComputed = swipeComputed(0.003),
          duration = _swipeComputed.duration,
          stretchX = _swipeComputed.stretchX,
          stretchY = _swipeComputed.stretchY;
        if (this._direction === 'vertical') {
          var xRange = entity.getXTranslation();
          // 竖向的时候固定x
          if (!(xRange[0] === 0 && xRange[1] === 0)) {
            entity.swipeBounce(duration, stretchX, 'x');
          }
          entity.swipeBounce(duration, stretchY, 'y', transition);
        } else {
          entity.swipeBounce(duration, stretchX, 'x', transition);
          var yRange = entity.getYTranslation();
          // 横向的时候固定y
          if (!(yRange[0] === 0 && yRange[1] === 0)) {
            entity.swipeBounce(duration, stretchY, 'y');
          }
        }
      }
      return;
    }
    if (this._moveTarget === 'closures') {
      if (entity && entity.isTransitioning()) {
        return;
      }
      // 如果滑动方向是向下的或向右的，执行关闭操作
      if (this._swipeClose && e.direction === 'Down') {
        this.close();
        this._moveTarget = 'none';
      }
      return;
    }
    var size = this.getItemSize();
    var index = size === 0 ? 0 : -this._translate / this.getItemSize();
    this.slide(index > this._activeIndex ? Math.ceil(index) : Math.floor(index));
    // @@@2： 此处逻辑和touchstart手势函数里 @@@1 逻辑是处理里同一个问题（二选一，微信用的是@@@1效果）
    // 这里是在真正要slide到上(下)一张时恢复到边界，那里是在手指放上去时直接恢复到边界
    // 在非边缘图片damping恢复时，此时手指放上去后，恢复动画停止了
    // 但是如果此时手指移动操作命中外部swipe到上(下)一张的逻辑，则内部图片的damping无法恢复到边界
    // 因为此时swipe手势函数内正在执行上(下)一张图片过渡，touchend内reset不会被执行
    /* if (entity) {
        // 这里在slide时把内部图片reset
        entity.reset();
      } */
  } else {
    var _ref2 = this._image || {},
      _entity = _ref2.entity;
    if (_entity) {
      if (_entity.isTransitioning()) {
        return;
      }
      var _e$velocity2 = e.velocity,
        _velocity = _e$velocity2 === void 0 ? 0 : _e$velocity2,
        _swipeComputed2 = e.swipeComputed;
      if (_velocity > 0 && _swipeComputed2) {
        // 按照0.003的减速度减速运行得到减速到0时的时间和x，y方向的分量距离
        var _swipeComputed3 = _swipeComputed2(0.003),
          _duration3 = _swipeComputed3.duration,
          _stretchX = _swipeComputed3.stretchX,
          _stretchY = _swipeComputed3.stretchY;
        _entity.swipeBounce(_duration3, _stretchX, 'x');
        _entity.swipeBounce(_duration3, _stretchY, 'y');
      }
    }
  }
}

/***/ }),

/***/ "./src/gallery.ts":
/*!************************!*\
  !*** ./src/gallery.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/inheritsLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/map */ "./node_modules/@babel/runtime-corejs3/core-js/instance/map.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _huangjs888_transition__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @huangjs888/transition */ "./node_modules/@huangjs888/transition/es/index.js");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./image */ "./src/image.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events */ "./src/events/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./popup */ "./src/popup.ts");




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
    var container = this._container = (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createContainer)(ele);
    this._backdrop = (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createBackdrop)(backdropColor, container);
    var substance = this._substance = (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createSubstance)(direction === 'vertical', container);
    var indicator = this._indicator = (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createIndicator)(direction === 'vertical', hasIndicator && imageUrls.length > 1, container);
    var gesture = this._gesture = _events__WEBPACK_IMPORTED_MODULE_6__["default"].apply(this, [container]);
    this._images = _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(imageUrls).call(imageUrls, function (url, index) {
      var image = {
        wrapper: (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createItemWrapper)(index === 0, direction === 'vertical', hasLoading, itemGap, substance),
        indicator: (0,_dom__WEBPACK_IMPORTED_MODULE_7__.createItemIndicator)(direction === 'vertical', indicator),
        url: url,
        width: 0,
        height: 0,
        options: (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
          rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
          scalation: !gesture.isTouch() ? [0.1, 10] : undefined
        }, options)
      };
      if (!isLazy) {
        // 图片如果加载过慢，show的时候图片因为没有对象，不会计算尺寸，所以这里在加载成功的时候计算一下
        (0,_image__WEBPACK_IMPORTED_MODULE_5__["default"])(image).then(function (okay) {
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
    this._transition = new _huangjs888_transition__WEBPACK_IMPORTED_MODULE_4__["default"]({
      element: substance,
      propertyName: 'transform',
      propertyValue: new ( /*#__PURE__*/function (_TAProperty) {
        (0,_babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(_class2, _TAProperty);
        function _class2() {
          return _TAProperty.apply(this, arguments) || this;
        }
        var _proto2 = _class2.prototype;
        _proto2.toString = function toString() {
          return "translate" + (direction === 'vertical' ? 'Y' : 'X') + "(" + this.value.translate + "px)";
        };
        return _class2;
      }(_huangjs888_transition__WEBPACK_IMPORTED_MODULE_4__.TAProperty))({
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
      (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(this._substance, {
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
          (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(image.wrapper, {
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
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3___default().resolve();
    }
    var _index = Math.max(Math.min(index, this._images.length - 1), 0);
    var isChange = open || this._activeIndex !== _index;
    if (isChange) {
      var _ref2 = this._images[this._activeIndex] || {},
        lastOne = _ref2.indicator;
      if (lastOne) {
        (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(lastOne, {
          width: 7,
          height: 7,
          opacity: 0.6
        });
      }
      var _ref3 = this._images[_index] || {},
        thisOne = _ref3.indicator;
      if (thisOne) {
        (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(thisOne, {
          width: 8,
          height: 8,
          opacity: 1
        });
      }
      this._activeIndex = _index;
      (0,_image__WEBPACK_IMPORTED_MODULE_5__["default"])(this._images[_index]).then(
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
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3___default().resolve({
        translate: this._translate
      });
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._translate = translate;
      this._transition.bind({
        translate: translate
      });
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_3___default().resolve({
        translate: translate
      });
    }
    this._translate = translate;
    return this._transition.apply({
      translate: delta
    }, (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
      precision: {
        translate: 1
      },
      cancel: true,
      duration: 500,
      easing: _huangjs888_transition__WEBPACK_IMPORTED_MODULE_4__.easeOutQuart
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
    return _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context = this._transition.cancel()).call(_context, function (value) {
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
    (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(container, {
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
    var _popupComputedSize = (0,_popup__WEBPACK_IMPORTED_MODULE_8__.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize.x,
      y = _popupComputedSize.y,
      k = _popupComputedSize.k,
      w = _popupComputedSize.w,
      h = _popupComputedSize.h;
    (0,_popup__WEBPACK_IMPORTED_MODULE_8__.popupTransform)({
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
    (0,_popup__WEBPACK_IMPORTED_MODULE_8__.popupTransform)({
      el: backdrop,
      o: 1
    }, {
      el: wrapper,
      x: 0,
      y: 0,
      k: 1
    }, (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
      el: elementEl
    }, elementSize ? {
      w: elementSize.width,
      h: elementSize.height
    } : {}), 300).then(function () {
      if (_this6._indicator) {
        (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(_this6._indicator, {
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
      (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(this._indicator, {
        display: 'none'
      });
    }
    var _popupComputedSize2 = (0,_popup__WEBPACK_IMPORTED_MODULE_8__.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize2.x,
      y = _popupComputedSize2.y,
      k = _popupComputedSize2.k,
      w = _popupComputedSize2.w,
      h = _popupComputedSize2.h;
    (0,_popup__WEBPACK_IMPORTED_MODULE_8__.popupTransform)({
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
        (0,_dom__WEBPACK_IMPORTED_MODULE_7__.setStyle)(_this7._container, {
          display: 'none'
        });
      }
    });
  };
  return Gallery;
}();
/* harmony default export */ __webpack_exports__["default"] = (Gallery);

/***/ }),

/***/ "./src/image.ts":
/*!**********************!*\
  !*** ./src/image.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _huangjs888_load_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @huangjs888/load-image */ "./node_modules/@huangjs888/load-image/es/index.js");
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity */ "./src/entity/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");


/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 17:26:59
 * @Description: ******
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(image) {
  var _ref = image || {},
    wrapper = _ref.wrapper,
    entity = _ref.entity,
    url = _ref.url,
    options = _ref.options;
  // 未定义表示还未加载过图片，null表示已经加载了，只是还没加载完或加载失败
  if (typeof entity === 'undefined') {
    image.entity = null;
    return (0,_huangjs888_load_image__WEBPACK_IMPORTED_MODULE_2__["default"])(url).then(function (ele) {
      image.entity = new _entity__WEBPACK_IMPORTED_MODULE_3__["default"]((0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        element: ele
      }, options));
      image.width = ele.naturalWidth;
      image.height = ele.naturalHeight;
      wrapper.innerHTML = '';
      wrapper.appendChild(ele);
      return true;
    }).catch(function () {
      // 这里可以加一个错误的提示
      wrapper.innerHTML = '';
      (0,_dom__WEBPACK_IMPORTED_MODULE_4__.createError)(wrapper);
      return false;
    });
  }
  return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_1___default().resolve();
}

/***/ }),

/***/ "./src/picture.ts":
/*!************************!*\
  !*** ./src/picture.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image */ "./src/image.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./events */ "./src/events/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popup */ "./src/popup.ts");






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
    var container = this._container = (0,_dom__WEBPACK_IMPORTED_MODULE_3__.createContainer)(ele);
    this._backdrop = (0,_dom__WEBPACK_IMPORTED_MODULE_3__.createBackdrop)(backdropColor, container);
    var gesture = this._gesture = _events__WEBPACK_IMPORTED_MODULE_2__["default"].apply(this, [container]);
    this._image = {
      wrapper: (0,_dom__WEBPACK_IMPORTED_MODULE_3__.createItemWrapper)(true, false, hasLoading, 0, container),
      url: url,
      width: 0,
      height: 0,
      options: (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        rotation: !gesture.isTouch() ? [-Number.MAX_VALUE, Number.MAX_VALUE] : undefined,
        scalation: !gesture.isTouch() ? [0.1, 10] : undefined
      }, options)
    };
    (0,_image__WEBPACK_IMPORTED_MODULE_1__["default"])(this._image).then(function (okay) {
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
        (0,_dom__WEBPACK_IMPORTED_MODULE_3__.setStyle)(image.wrapper, {
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
    (0,_dom__WEBPACK_IMPORTED_MODULE_3__.setStyle)(container, {
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
    var _popupComputedSize = (0,_popup__WEBPACK_IMPORTED_MODULE_4__.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize.x,
      y = _popupComputedSize.y,
      k = _popupComputedSize.k,
      w = _popupComputedSize.w,
      h = _popupComputedSize.h;
    (0,_popup__WEBPACK_IMPORTED_MODULE_4__.popupTransform)({
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
    (0,_popup__WEBPACK_IMPORTED_MODULE_4__.popupTransform)({
      el: backdrop,
      o: 1
    }, {
      el: wrapper,
      x: 0,
      y: 0,
      k: 1
    }, (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
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
    var _popupComputedSize2 = (0,_popup__WEBPACK_IMPORTED_MODULE_4__.popupComputedSize)(this._originRect, this._rectSize, elementSize),
      x = _popupComputedSize2.x,
      y = _popupComputedSize2.y,
      k = _popupComputedSize2.k,
      w = _popupComputedSize2.w,
      h = _popupComputedSize2.h;
    (0,_popup__WEBPACK_IMPORTED_MODULE_4__.popupTransform)({
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
        (0,_dom__WEBPACK_IMPORTED_MODULE_3__.setStyle)(_this2._container, {
          display: 'none'
        });
      }
    });
  };
  return Picture;
}();
/* harmony default export */ __webpack_exports__["default"] = (Picture);

/***/ }),

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   popupComputedSize: function() { return /* binding */ popupComputedSize; },
/* harmony export */   popupTransform: function() { return /* binding */ popupTransform; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");

/*
 * @Author: Huangjs
 * @Date: 2023-08-18 10:01:01
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 10:33:22
 * @Description: ******
 */


function popupTransform(backdrop, wrapper, element, duration) {
  if (duration === void 0) {
    duration = 0;
  }
  if (backdrop.el) {
    if (wrapper.el) {
      var _el = wrapper.el,
        x = wrapper.x,
        y = wrapper.y,
        k = wrapper.k;
      (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(_el, {
        overflow: 'visible',
        transform: "translate(" + (x || 0) + "px," + (y || 0) + "px) scale(" + (k || 0.01) + ")",
        transition: duration > 0 ? "transform " + duration + "ms" : ''
      });
    }
    if (element.el) {
      var _el2 = element.el,
        w = element.w,
        h = element.h;
      (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(_el2, {
        width: w || 0,
        height: h || 0,
        objectFit: 'cover',
        transition: duration > 0 ? "width " + duration + "ms, height " + duration + "ms" : ''
      });
    }
    var el = backdrop.el,
      o = backdrop.o;
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, {
      opacity: o || 0,
      transition: duration > 0 ? "opacity " + duration + "ms" : ''
    });
    if (duration > 0) {
      return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0___default())(function (resolve) {
        el.ontransitionend = function (e) {
          // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
          if (e.target === el && e.propertyName === 'opacity') {
            el.ontransitionend = null;
            if (wrapper.el) {
              (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(wrapper.el, {
                overflow: 'hidden',
                transition: ''
              });
            }
            if (element.el) {
              (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(element.el, {
                objectFit: '',
                transition: ''
              });
            }
            (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, {
              transition: ''
            });
            resolve();
          }
        };
      });
    }
  }
  return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_0___default().resolve();
}
function popupComputedSize(originRect, continerRect, elementSize) {
  if (originRect && continerRect) {
    var ol = originRect.left,
      ot = originRect.top,
      ow = originRect.width,
      oh = originRect.height;
    var rl = continerRect.left,
      rt = continerRect.top,
      rw = continerRect.width,
      rh = continerRect.height;
    var x = ol + ow / 2 - (rl + rw / 2);
    var y = ot + oh / 2 - (rt + rh / 2);
    var ew = rw;
    var eh = rh;
    if (elementSize) {
      ew = elementSize.width;
      eh = elementSize.height;
    }
    var rat = ew / eh > ow / oh;
    var k = rat ? oh / eh : ow / ew;
    var w = rat ? eh * (ow / oh) : ew;
    var h = rat ? eh : ew / (ow / oh);
    return {
      x: x,
      y: y,
      k: k,
      w: w,
      h: h
    };
  }
  return {
    x: 0,
    y: 0,
    k: 0.01,
    w: 0,
    h: 0
  };
}

/***/ }),

/***/ "./src/svgIcon.ts":
/*!************************!*\
  !*** ./src/svgIcon.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   errorIcon: function() { return /* binding */ errorIcon; },
/* harmony export */   loadingIcon: function() { return /* binding */ loadingIcon; },
/* harmony export */   loadingIcon2: function() { return /* binding */ loadingIcon2; }
/* harmony export */ });
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 13:44:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 13:51:09
 * @Description: ******
 */
var loadingIcon = "\n  <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 80 80\">\n    <defs>\n      <linearGradient\n        x1=\"94.0869141%\"\n        y1=\"0%\"\n        x2=\"94.0869141%\"\n        y2=\"90.559082%\"\n        id=\"linearGradient-1\"\n      >\n        <stop stop-color=\"#fff\" stop-opacity=\"0\" offset=\"0%\" />\n        <stop stop-color=\"#fff\" stop-opacity=\"0.3\" offset=\"100%\" />\n      </linearGradient>\n      <linearGradient\n        x1=\"100%\"\n        y1=\"8.67370605%\"\n        x2=\"100%\"\n        y2=\"90.6286621%\"\n        id=\"linearGradient-2\"\n      >\n        <stop stop-color=\"#fff\" offset=\"0%\" />\n        <stop stop-color=\"#fff\" stop-opacity=\"0.3\" offset=\"100%\" />\n      </linearGradient>\n    </defs>\n    <g\n      stroke=\"none\"\n      stroke-width=\"1\"\n      fill=\"none\"\n      fill-rule=\"evenodd\"\n      opacity=\"0.9\"\n    >\n      <g>\n        <path\n          d=\"M40,0 C62.09139,0 80,17.90861 80,40 C80,62.09139 62.09139,80 40,80 L40,73 C58.2253967,73 73,58.2253967 73,40 C73,21.7746033 58.2253967,7 40,7 L40,0 Z\"\n          fill=\"url(#linearGradient-1)\"\n        />\n        <path\n          d=\"M40,0 L40,7 C21.7746033,7 7,21.7746033 7,40 C7,58.2253967 21.7746033,73 40,73 L40,80 C17.90861,80 0,62.09139 0,40 C0,17.90861 17.90861,0 40,0 Z\"\n          fill=\"url(#linearGradient-2)\"\n        />\n        <circle id=\"Oval\" fill=\"#fff\" cx=\"40.5\" cy=\"3.5\" r=\"3.5\" />\n      </g>\n      <animateTransform\n        attributeName=\"transform\"\n        begin=\"0s\"\n        dur=\"1s\"\n        type=\"rotate\"\n        values=\"0 40 40;360 40 40\"\n        repeatCount=\"indefinite\"\n      />\n    </g>\n  </svg>\n";
var loadingIcon2 = "\n  <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 32 32\">\n    <circle\n      cx=\"16\"\n      cy=\"16\"\n      r=\"14\"\n      fill=\"none\"\n      stroke=\"#666\"\n      stroke-width=\"4\"\n    />\n    <circle\n      cx=\"16\"\n      cy=\"16\"\n      r=\"14\"\n      fill=\"none\"\n      stroke=\"#fff\"\n      stroke-width=\"4\"\n      stroke-dasharray=\"30\"\n      stroke-dashoffset=\"30\"\n      stroke-linecap=\"round\"\n    />\n    <animateTransform\n      attributeName=\"transform\"\n      dur=\"1s\"\n      type=\"rotate\"\n      from=\"0\" to=\"360\"\n      repeatCount=\"indefinite\"\n    />\n  </svg>\n";
var errorIcon = "\n  <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 24 24\" fill=\"#fff\">\n    <path\n      d=\"M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.763-15.864l.11 7.596h1.305l.11-7.596h-1.525zm.759 10.967c.512 0 .902-.383.902-.882 0-.5-.39-.882-.902-.882a.878.878 0 00-.896.882c0 .499.396.882.896.882z\" />\n  </svg>\n";

/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/bind.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/bind.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/bind */ "./node_modules/core-js-pure/stable/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/concat.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/concat.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/concat */ "./node_modules/core-js-pure/stable/instance/concat.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/filter.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/filter.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/filter */ "./node_modules/core-js-pure/stable/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/find-index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/find-index.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/find-index */ "./node_modules/core-js-pure/stable/instance/find-index.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/index-of.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/index-of.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/index-of */ "./node_modules/core-js-pure/stable/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/map.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/map.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/map */ "./node_modules/core-js-pure/stable/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/slice.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/slice.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/slice */ "./node_modules/core-js-pure/stable/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/splice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/splice.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/splice */ "./node_modules/core-js-pure/stable/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/assign.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/assign.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/assign */ "./node_modules/core-js-pure/stable/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/create.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/create.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/create */ "./node_modules/core-js-pure/stable/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/get-own-property-descriptor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/get-own-property-descriptor.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/get-own-property-descriptor */ "./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/keys */ "./node_modules/core-js-pure/stable/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/set-prototype-of.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/set-prototype-of.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/set-prototype-of */ "./node_modules/core-js-pure/stable/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/promise/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/promise/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/promise */ "./node_modules/core-js-pure/stable/promise/index.js");
__webpack_require__(/*! ../../modules/esnext.promise.with-resolvers */ "./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/url/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/actual/url/index.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/url */ "./node_modules/core-js-pure/stable/url/index.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/concat.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/concat.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.concat */ "./node_modules/core-js-pure/modules/es.array.concat.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').concat;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/filter.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/filter.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.filter */ "./node_modules/core-js-pure/modules/es.array.filter.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').filter;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/find-index.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/find-index.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.find-index */ "./node_modules/core-js-pure/modules/es.array.find-index.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').findIndex;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/index-of.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/index-of.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.index-of */ "./node_modules/core-js-pure/modules/es.array.index-of.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').indexOf;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/map.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.map */ "./node_modules/core-js-pure/modules/es.array.map.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').map;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/slice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/slice.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.slice */ "./node_modules/core-js-pure/modules/es.array.slice.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').slice;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/splice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/splice.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.splice */ "./node_modules/core-js-pure/modules/es.array.splice.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').splice;


/***/ }),

/***/ "./node_modules/core-js-pure/es/function/virtual/bind.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/es/function/virtual/bind.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.function.bind */ "./node_modules/core-js-pure/modules/es.function.bind.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Function').bind;


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/bind.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/bind.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../function/virtual/bind */ "./node_modules/core-js-pure/es/function/virtual/bind.js");

var FunctionPrototype = Function.prototype;

module.exports = function (it) {
  var own = it.bind;
  return it === FunctionPrototype || (isPrototypeOf(FunctionPrototype, it) && own === FunctionPrototype.bind) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/concat.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/concat.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/concat */ "./node_modules/core-js-pure/es/array/virtual/concat.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.concat;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.concat) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/filter.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/filter.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/filter */ "./node_modules/core-js-pure/es/array/virtual/filter.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.filter) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/find-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/find-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/find-index */ "./node_modules/core-js-pure/es/array/virtual/find-index.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.findIndex;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.findIndex) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/index-of.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/index-of.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/index-of */ "./node_modules/core-js-pure/es/array/virtual/index-of.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.indexOf) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/map.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/map.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/map */ "./node_modules/core-js-pure/es/array/virtual/map.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.map) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/slice.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/slice.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/slice */ "./node_modules/core-js-pure/es/array/virtual/slice.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.slice) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/splice.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/splice.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/splice */ "./node_modules/core-js-pure/es/array/virtual/splice.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.splice;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.splice) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/assign.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/assign.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.assign */ "./node_modules/core-js-pure/modules/es.object.assign.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.assign;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/create.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/create.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.create */ "./node_modules/core-js-pure/modules/es.object.create.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

var Object = path.Object;

module.exports = function create(P, D) {
  return Object.create(P, D);
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/get-own-property-descriptor.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/get-own-property-descriptor.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.get-own-property-descriptor */ "./node_modules/core-js-pure/modules/es.object.get-own-property-descriptor.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

var Object = path.Object;

var getOwnPropertyDescriptor = module.exports = function getOwnPropertyDescriptor(it, key) {
  return Object.getOwnPropertyDescriptor(it, key);
};

if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/keys.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/keys.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.keys */ "./node_modules/core-js-pure/modules/es.object.keys.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.keys;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/set-prototype-of.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/set-prototype-of.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.set-prototype-of */ "./node_modules/core-js-pure/modules/es.object.set-prototype-of.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.setPrototypeOf;


/***/ }),

/***/ "./node_modules/core-js-pure/es/promise/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/promise/index.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.aggregate-error */ "./node_modules/core-js-pure/modules/es.aggregate-error.js");
__webpack_require__(/*! ../../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.object.to-string */ "./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.promise */ "./node_modules/core-js-pure/modules/es.promise.js");
__webpack_require__(/*! ../../modules/es.promise.all-settled */ "./node_modules/core-js-pure/modules/es.promise.all-settled.js");
__webpack_require__(/*! ../../modules/es.promise.any */ "./node_modules/core-js-pure/modules/es.promise.any.js");
__webpack_require__(/*! ../../modules/es.promise.finally */ "./node_modules/core-js-pure/modules/es.promise.finally.js");
__webpack_require__(/*! ../../modules/es.string.iterator */ "./node_modules/core-js-pure/modules/es.string.iterator.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/concat.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/concat.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/concat */ "./node_modules/core-js-pure/full/instance/concat.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/filter.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/filter.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/filter */ "./node_modules/core-js-pure/full/instance/filter.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/find-index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/find-index.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/find-index */ "./node_modules/core-js-pure/full/instance/find-index.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/map.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/map.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/map */ "./node_modules/core-js-pure/full/instance/map.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/slice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/slice.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/slice */ "./node_modules/core-js-pure/full/instance/slice.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/splice.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/splice.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/splice */ "./node_modules/core-js-pure/full/instance/splice.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/object/assign.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/features/object/assign.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/object/assign */ "./node_modules/core-js-pure/full/object/assign.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/object/get-own-property-descriptor.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/core-js-pure/features/object/get-own-property-descriptor.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/object/get-own-property-descriptor */ "./node_modules/core-js-pure/full/object/get-own-property-descriptor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/object/keys.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/features/object/keys.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/object/keys */ "./node_modules/core-js-pure/full/object/keys.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/promise/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/features/promise/index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/promise */ "./node_modules/core-js-pure/full/promise/index.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/url/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/features/url/index.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/url */ "./node_modules/core-js-pure/full/url/index.js");


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/bind.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/bind.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/bind */ "./node_modules/core-js-pure/actual/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/concat.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/concat.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/concat */ "./node_modules/core-js-pure/actual/instance/concat.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/filter.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/filter */ "./node_modules/core-js-pure/actual/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/find-index.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/find-index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/find-index */ "./node_modules/core-js-pure/actual/instance/find-index.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/index-of.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/index-of.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/index-of */ "./node_modules/core-js-pure/actual/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/map.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/map.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/map */ "./node_modules/core-js-pure/actual/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/slice.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/slice.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/slice */ "./node_modules/core-js-pure/actual/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/splice.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/splice.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/splice */ "./node_modules/core-js-pure/actual/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/assign.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/assign */ "./node_modules/core-js-pure/actual/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/create.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/create */ "./node_modules/core-js-pure/actual/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/get-own-property-descriptor */ "./node_modules/core-js-pure/actual/object/get-own-property-descriptor.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/keys.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/keys */ "./node_modules/core-js-pure/actual/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/set-prototype-of */ "./node_modules/core-js-pure/actual/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/promise/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/promise/index.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/promise */ "./node_modules/core-js-pure/actual/promise/index.js");
// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.aggregate-error */ "./node_modules/core-js-pure/modules/esnext.aggregate-error.js");
__webpack_require__(/*! ../../modules/esnext.promise.all-settled */ "./node_modules/core-js-pure/modules/esnext.promise.all-settled.js");
__webpack_require__(/*! ../../modules/esnext.promise.try */ "./node_modules/core-js-pure/modules/esnext.promise.try.js");
__webpack_require__(/*! ../../modules/esnext.promise.any */ "./node_modules/core-js-pure/modules/esnext.promise.any.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/url/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/full/url/index.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/url */ "./node_modules/core-js-pure/actual/url/index.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-callable.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-callable.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-constructor.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-possible-prototype.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-possible-prototype.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/add-to-unscopables.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/add-to-unscopables.js ***!
  \*******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-instance.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-instance.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-from.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-from.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-includes.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-includes.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-iteration.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-iteration.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js-pure/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-has-species-support.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-method-has-species-support.js ***!
  \*********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-is-strict.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-method-is-strict.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-set-length.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-set-length.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-slice-simple.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-slice-simple.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");

var $Array = Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-slice.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-slice.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-sort.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-sort.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js-pure/internals/array-slice-simple.js");

var floor = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice(array, 0, middle), comparefn),
    mergeSort(arraySlice(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

module.exports = mergeSort;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-constructor.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-species-constructor.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-species-create.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js-pure/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js ***!
  \*********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/check-correctness-of-iteration.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/check-correctness-of-iteration.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof-raw.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof-raw.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/copy-constructor-properties.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/copy-constructor-properties.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js-pure/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/correct-prototype-getter.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/correct-prototype-getter.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-iter-result-object.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-iter-result-object.js ***!
  \**************************************************************************/
/***/ (function(module) {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-non-enumerable-property.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property-descriptor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property-descriptor.js ***!
  \***************************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in-accessor.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in-accessor.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-ins.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-ins.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else defineBuiltIn(target, key, src[key], options);
  } return target;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-global-property.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-global-property.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/delete-property-or-throw.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/delete-property-or-throw.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/descriptors.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/descriptors.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/document-all.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/document-all.js ***!
  \*************************************************************/
/***/ (function(module) {

"use strict";

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/document-create-element.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/document-create-element.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js ***!
  \*****************************************************************************/
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/dom-iterables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/dom-iterables.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-browser.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-browser.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_DENO = __webpack_require__(/*! ../internals/engine-is-deno */ "./node_modules/core-js-pure/internals/engine-is-deno.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

module.exports = !IS_DENO && !IS_NODE
  && typeof window == 'object'
  && typeof document == 'object';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-deno.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-deno.js ***!
  \***************************************************************/
/***/ (function(module) {

"use strict";

/* global Deno -- Deno case */
module.exports = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-ios-pebble.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-ios-pebble.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-ios.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-ios.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-node.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-node.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

module.exports = typeof process != 'undefined' && classof(process) == 'process';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-webos-webkit.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-webos-webkit.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-user-agent.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-user-agent.js ***!
  \******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-v8-version.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-v8-version.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/entry-virtual.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/entry-virtual.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/enum-bug-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/enum-bug-keys.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-clear.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-clear.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-install.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-install.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var clearErrorStack = __webpack_require__(/*! ../internals/error-stack-clear */ "./node_modules/core-js-pure/internals/error-stack-clear.js");
var ERROR_STACK_INSTALLABLE = __webpack_require__(/*! ../internals/error-stack-installable */ "./node_modules/core-js-pure/internals/error-stack-installable.js");

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-installable.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-installable.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/export.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/export.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js-pure/internals/function-apply.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js-pure/internals/is-forced.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global : STATIC ? global[TARGET] : (global[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/fails.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/fails.js ***!
  \******************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-apply.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-apply.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-context.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-context.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-native.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-native.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var $Function = Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
module.exports = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-call.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-call.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-name.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-name.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-clause.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-built-in.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-built-in.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator-method.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-method.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-method.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/global.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/global.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || this || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js-pure/internals/has-own-property.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/has-own-property.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/hidden-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/hidden-keys.js ***!
  \************************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/host-report-errors.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/host-report-errors.js ***!
  \*******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/html.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/html.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ie8-dom-define.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ie8-dom-define.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/indexed-object.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/indexed-object.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/inspect-source.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/inspect-source.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/install-error-cause.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/install-error-cause.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/internal-state.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/internal-state.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array-iterator-method.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array-iterator-method.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-callable.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-callable.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js-pure/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-constructor.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js-pure/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-forced.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-forced.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-null-or-undefined.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-null-or-undefined.js ***!
  \*********************************************************************/
/***/ (function(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js-pure/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-pure.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-pure.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

module.exports = true;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-symbol.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-symbol.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterate.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterate.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-close.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-close.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-create-constructor.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-create-constructor.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-define.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-define.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js-pure/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators-core.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators-core.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators.js ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/length-of-array-like.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/length-of-array-like.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js-pure/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/math-trunc.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/math-trunc.js ***!
  \***********************************************************/
/***/ (function(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/microtask.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/microtask.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var macrotask = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js-pure/internals/task.js").set);
var Queue = __webpack_require__(/*! ../internals/queue */ "./node_modules/core-js-pure/internals/queue.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_IOS_PEBBLE = __webpack_require__(/*! ../internals/engine-is-ios-pebble */ "./node_modules/core-js-pure/internals/engine-is-ios-pebble.js");
var IS_WEBOS_WEBKIT = __webpack_require__(/*! ../internals/engine-is-webos-webkit */ "./node_modules/core-js-pure/internals/engine-is-webos-webkit.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var microtask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask) {
  var queue = new Queue();

  var flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }

  microtask = function (fn) {
    if (!queue.head) notify();
    queue.add(fn);
  };
}

module.exports = microtask;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/new-promise-capability.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/new-promise-capability.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/normalize-string-argument.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/normalize-string-argument.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-assign.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-assign.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-create.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-create.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js-pure/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js-pure/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-properties.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-properties.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-property.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-property.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-names.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-names.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-symbols.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-prototype-of.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-prototype-of.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-is-prototype-of.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-is-prototype-of.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys-internal.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys-internal.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-property-is-enumerable.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-set-prototype-of.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-set-prototype-of.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js-pure/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-to-string.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-to-string.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ordinary-to-primitive.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/own-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/own-keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/path.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/path.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/perform.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/perform.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-constructor-detection.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-constructor-detection.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js-pure/internals/is-forced.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js-pure/internals/inspect-source.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_BROWSER = __webpack_require__(/*! ../internals/engine-is-browser */ "./node_modules/core-js-pure/internals/engine-is-browser.js");
var IS_DENO = __webpack_require__(/*! ../internals/engine-is-deno */ "./node_modules/core-js-pure/internals/engine-is-deno.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-native-constructor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-native-constructor.js ***!
  \***************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

module.exports = global.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-resolve.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-resolve.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var newPromiseCapability = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js":
/*!************************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/queue.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/queue.js ***!
  \******************************************************/
/***/ (function(module) {

"use strict";

var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/require-object-coercible.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/require-object-coercible.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-species.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/set-species.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-to-string-tag.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/set-to-string-tag.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js-pure/internals/object-to-string.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-store.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-store.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js-pure/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.32.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.32.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/species-constructor.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/species-constructor.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js-pure/internals/a-constructor.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-multibyte.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-multibyte.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-punycode-to-ascii.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-punycode-to-ascii.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;

var $RangeError = RangeError;
var exec = uncurryThis(regexSeparators.exec);
var floor = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var toLowerCase = uncurryThis(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push(output, value);
        counter--;
      }
    } else {
      push(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  while (delta > baseMinusTMin * tMax >> 1) {
    delta = floor(delta / baseMinusTMin);
    k += base;
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push(output, fromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw $RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw $RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        var k = base;
        while (true) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
          k += base;
        }

        push(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        handledCPCount++;
      }
    }

    delta++;
    n++;
  }
  return join(output, '');
};

module.exports = function (input) {
  var encoded = [];
  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join(encoded, '.');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/symbol-constructor-detection.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/task.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/task.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js-pure/internals/function-apply.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js-pure/internals/html.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = global.location;
});

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    global.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-absolute-index.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-absolute-index.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-indexed-object.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-indexed-object.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-integer-or-infinity.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js-pure/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-length.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-length.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-primitive.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-primitive.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-property-key.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-property-key.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js-pure/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string-tag-support.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string-tag-support.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/try-to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/try-to-string.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/uid.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/uid.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/url-constructor-detection.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/url-constructor-detection.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var params = url.searchParams;
  var params2 = new URLSearchParams('a=1&a=2&b=3');
  var result = '';
  url.pathname = 'c%20d';
  params.forEach(function (value, key) {
    params['delete']('b');
    result += key + value;
  });
  params2['delete']('a', 2);
  // `undefined` case is a Chromium 117 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
  params2['delete']('b', undefined);
  return (IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')))
    || (!params.size && (IS_PURE || !DESCRIPTORS))
    || !params.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || params.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !params[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/use-symbol-as-uid.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/v8-prototype-define-bug.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/validate-arguments-length.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/validate-arguments-length.js ***!
  \**************************************************************************/
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/weak-map-basic-detection.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js-pure/internals/well-known-symbol.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/well-known-symbol.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js-pure/internals/copy-constructor-properties.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var installErrorCause = __webpack_require__(/*! ../internals/install-error-cause */ "./node_modules/core-js-pure/internals/install-error-cause.js");
var installErrorStack = __webpack_require__(/*! ../internals/error-stack-install */ "./node_modules/core-js-pure/internals/error-stack-install.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js-pure/internals/normalize-string-argument.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf($Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
else copyConstructorProperties($AggregateError, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.aggregate-error.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/es.aggregate-error.constructor */ "./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.concat.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.concat.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js-pure/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.filter.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.filter.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $filter = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js-pure/internals/array-iteration.js").filter);
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.find-index.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.find-index.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $findIndex = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js-pure/internals/array-iteration.js").findIndex);
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js-pure/internals/add-to-unscopables.js");

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-findindex -- testing
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.index-of.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.index-of.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var $indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").indexOf);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js-pure/internals/array-method-is-strict.js");

var nativeIndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: FORCED }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf(this, searchElement, fromIndex) || 0
      : $indexOf(this, searchElement, fromIndex);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.iterator.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.iterator.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js-pure/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.map.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $map = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js-pure/internals/array-iteration.js").map);
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.slice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.slice.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");
var nativeSlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return nativeSlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.splice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.splice.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var setArrayLength = __webpack_require__(/*! ../internals/array-set-length */ "./node_modules/core-js-pure/internals/array-set-length.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js-pure/internals/array-species-create.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var deletePropertyOrThrow = __webpack_require__(/*! ../internals/delete-property-or-throw */ "./node_modules/core-js-pure/internals/delete-property-or-throw.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    setArrayLength(O, len - actualDeleteCount + insertCount);
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.function.bind.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.function.bind.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind */ "./node_modules/core-js-pure/internals/function-bind.js");

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
$({ target: 'Function', proto: true, forced: Function.bind !== bind }, {
  bind: bind
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.assign.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.assign.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js-pure/internals/object-assign.js");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.create.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.create.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.get-own-property-descriptor.js":
/*!************************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.get-own-property-descriptor.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var nativeGetOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var FORCED = !DESCRIPTORS || fails(function () { nativeGetOwnPropertyDescriptor(1); });

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.keys.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.keys.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var nativeKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.set-prototype-of.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.set-prototype-of.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.to-string.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.to-string.js ***!
  \******************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all-settled.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.all-settled.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.all.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.any.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.any.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.catch.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.catch.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.constructor.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js-pure/internals/set-species.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js-pure/internals/species-constructor.js");
var task = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js-pure/internals/task.js").set);
var microtask = __webpack_require__(/*! ../internals/microtask */ "./node_modules/core-js-pure/internals/microtask.js");
var hostReportErrors = __webpack_require__(/*! ../internals/host-report-errors */ "./node_modules/core-js-pure/internals/host-report-errors.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var Queue = __webpack_require__(/*! ../internals/queue */ "./node_modules/core-js-pure/internals/queue.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var PromiseConstructorDetection = __webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.finally.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.finally.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js-pure/internals/species-constructor.js");
var promiseResolve = __webpack_require__(/*! ../internals/promise-resolve */ "./node_modules/core-js-pure/internals/promise-resolve.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/es.promise.constructor */ "./node_modules/core-js-pure/modules/es.promise.constructor.js");
__webpack_require__(/*! ../modules/es.promise.all */ "./node_modules/core-js-pure/modules/es.promise.all.js");
__webpack_require__(/*! ../modules/es.promise.catch */ "./node_modules/core-js-pure/modules/es.promise.catch.js");
__webpack_require__(/*! ../modules/es.promise.race */ "./node_modules/core-js-pure/modules/es.promise.race.js");
__webpack_require__(/*! ../modules/es.promise.reject */ "./node_modules/core-js-pure/modules/es.promise.reject.js");
__webpack_require__(/*! ../modules/es.promise.resolve */ "./node_modules/core-js-pure/modules/es.promise.resolve.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.race.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.race.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.reject.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.reject.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.resolve.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.resolve.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);
var promiseResolve = __webpack_require__(/*! ../internals/promise-resolve */ "./node_modules/core-js-pure/internals/promise-resolve.js");

var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.string.iterator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.iterator.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js-pure/internals/string-multibyte.js").charAt);
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.aggregate-error.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.aggregate-error.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.aggregate-error */ "./node_modules/core-js-pure/modules/es.aggregate-error.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.all-settled.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.all-settled.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.promise.all-settled.js */ "./node_modules/core-js-pure/modules/es.promise.all-settled.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.any.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.any.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.promise.any */ "./node_modules/core-js-pure/modules/es.promise.any.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.try.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.try.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$({ target: 'Promise', stat: true, forced: true }, {
  'try': function (callbackfn) {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(callbackfn);
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

// `Promise.withResolvers` method
// https://github.com/tc39/proposal-promise-with-resolvers
$({ target: 'Promise', stat: true }, {
  withResolvers: function withResolvers() {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    return {
      promise: promiseCapability.promise,
      resolve: promiseCapability.resolve,
      reject: promiseCapability.reject
    };
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.dom-collections.iterator.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js-pure/internals/dom-iterables.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.constructor.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js-pure/internals/define-built-ins.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var arraySort = __webpack_require__(/*! ../internals/array-sort */ "./node_modules/core-js-pure/internals/array-sort.js");

var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
var safeGetBuiltIn = function (name) {
  if (!DESCRIPTORS) return global[name];
  var descriptor = getOwnPropertyDescriptor(global, name);
  return descriptor && descriptor.value;
};

var nativeFetch = safeGetBuiltIn('fetch');
var NativeRequest = safeGetBuiltIn('Request');
var Headers = safeGetBuiltIn('Headers');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var RegExp = global.RegExp;
var TypeError = global.TypeError;
var decodeURIComponent = global.decodeURIComponent;
var encodeURIComponent = global.encodeURIComponent;
var charAt = uncurryThis(''.charAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var splice = uncurryThis([].splice);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = replace(it, plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = replace(result, percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replacements[match];
};

var serialize = function (it) {
  return replace(encodeURIComponent(it), find, replacer);
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
}, true);

var URLSearchParamsState = function (init) {
  this.entries = [];
  this.url = null;

  if (init !== undefined) {
    if (isObject(init)) this.parseObject(init);
    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
  }
};

URLSearchParamsState.prototype = {
  type: URL_SEARCH_PARAMS,
  bindURL: function (url) {
    this.url = url;
    this.update();
  },
  parseObject: function (object) {
    var iteratorMethod = getIteratorMethod(object);
    var iterator, next, step, entryIterator, entryNext, first, second;

    if (iteratorMethod) {
      iterator = getIterator(object, iteratorMethod);
      next = iterator.next;
      while (!(step = call(next, iterator)).done) {
        entryIterator = getIterator(anObject(step.value));
        entryNext = entryIterator.next;
        if (
          (first = call(entryNext, entryIterator)).done ||
          (second = call(entryNext, entryIterator)).done ||
          !call(entryNext, entryIterator).done
        ) throw TypeError('Expected sequence with length 2');
        push(this.entries, { key: $toString(first.value), value: $toString(second.value) });
      }
    } else for (var key in object) if (hasOwn(object, key)) {
      push(this.entries, { key: key, value: $toString(object[key]) });
    }
  },
  parseQuery: function (query) {
    if (query) {
      var attributes = split(query, '&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = split(attribute, '=');
          push(this.entries, {
            key: deserialize(shift(entry)),
            value: deserialize(join(entry, '='))
          });
        }
      }
    }
  },
  serialize: function () {
    var entries = this.entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      push(result, serialize(entry.key) + '=' + serialize(entry.value));
    } return join(result, '&');
  },
  update: function () {
    this.entries.length = 0;
    this.parseQuery(this.url.query);
  },
  updateURL: function () {
    if (this.url) this.url.update();
  }
};

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var state = setInternalState(this, new URLSearchParamsState(init));
  if (!DESCRIPTORS) this.size = state.entries.length;
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

defineBuiltIns(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 2);
    push(state.entries, { key: $toString(name), value: $toString(value) });
    if (!DESCRIPTORS) this.length++;
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name /* , value */) {
    var state = getInternalParamsState(this);
    var length = validateArgumentsLength(arguments.length, 1);
    var entries = state.entries;
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index];
      if (entry.key === key && (value === undefined || entry.value === value)) {
        splice(entries, index, 1);
        if (value !== undefined) break;
      } else index++;
    }
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name /* , value */) {
    var entries = getInternalParamsState(this).entries;
    var length = validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index++];
      if (entry.key === key && (value === undefined || entry.value === value)) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 1);
    var entries = state.entries;
    var found = false;
    var key = $toString(name);
    var val = $toString(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push(entries, { key: key, value: val });
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
  return getInternalParamsState(this).serialize();
}, { enumerable: true });

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS) defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
  get: function size() {
    return getInternalParamsState(this).entries.length;
  },
  configurable: true,
  enumerable: true
});

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, constructor: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL && isCallable(Headers)) {
  var headersHas = uncurryThis(HeadersPrototype.has);
  var headersSet = uncurryThis(HeadersPrototype.set);

  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(nativeFetch)) {
    $({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestPrototype);
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    $({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.delete.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.delete.js ***!
  \***************************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.has.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.has.js ***!
  \************************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/web.url-search-params.constructor */ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url-search-params.size.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url-search-params.size.js ***!
  \*************************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url.can-parse.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.can-parse.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");

var URL = getBuiltIn('URL');

// https://github.com/nodejs/node/issues/47505
// https://github.com/denoland/deno/issues/18893
var THROWS_WITHOUT_ARGUMENTS = USE_NATIVE_URL && fails(function () {
  URL.canParse();
});

// `URL.canParse` method
// https://url.spec.whatwg.org/#dom-url-canparse
$({ target: 'URL', stat: true, forced: !THROWS_WITHOUT_ARGUMENTS }, {
  canParse: function canParse(url) {
    var length = validateArgumentsLength(arguments.length, 1);
    var urlString = toString(url);
    var base = length < 2 || arguments[1] === undefined ? undefined : toString(arguments[1]);
    try {
      return !!new URL(urlString, base);
    } catch (error) {
      return false;
    }
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url.constructor.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.constructor.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.string.iterator */ "./node_modules/core-js-pure/modules/es.string.iterator.js");
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var USE_NATIVE_URL = __webpack_require__(/*! ../internals/url-constructor-detection */ "./node_modules/core-js-pure/internals/url-constructor-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js-pure/internals/object-assign.js");
var arrayFrom = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js-pure/internals/array-from.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js-pure/internals/array-slice-simple.js");
var codeAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js-pure/internals/string-multibyte.js").codeAt);
var toASCII = __webpack_require__(/*! ../internals/string-punycode-to-ascii */ "./node_modules/core-js-pure/internals/string-punycode-to-ascii.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var URLSearchParamsModule = __webpack_require__(/*! ../modules/web.url-search-params.constructor */ "./node_modules/core-js-pure/modules/web.url-search-params.constructor.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");

var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;

var NativeURL = global.URL;
var TypeError = global.TypeError;
var parseInt = global.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.0.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[a-z]/i;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable regexp/no-control-character -- safe */
var EOF;

// https://url.spec.whatwg.org/#ipv4-number-parser
var parseIPv4 = function (input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) == '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
      number = parseInt(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// https://url.spec.whatwg.org/#concept-ipv6-parser
// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return charAt(input, pointer);
  };

  if (chr() == ':') {
    if (charAt(input, 1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex == 8) return;
    if (chr() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (chr() == ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

// https://url.spec.whatwg.org/#host-serializing
var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    } return join(result, '.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
};

// https://url.spec.whatwg.org/#special-scheme
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

// https://url.spec.whatwg.org/#windows-drive-letter
var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && exec(ALPHA, charAt(string, 0))
    && ((second = charAt(string, 1)) == ':' || (!normalized && second == '|'));
};

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
    string.length == 2 ||
    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

// https://url.spec.whatwg.org/#single-dot-path-segment
var isSingleDot = function (segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

// https://url.spec.whatwg.org/#double-dot-path-segment
var isDoubleDot = function (segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

var URLState = function (url, isBase, base) {
  var urlString = $toString(url);
  var baseState, failure, searchParams;
  if (isBase) {
    failure = this.parse(urlString);
    if (failure) throw TypeError(failure);
    this.searchParams = null;
  } else {
    if (base !== undefined) baseState = new URLState(base, true);
    failure = this.parse(urlString, null, baseState);
    if (failure) throw TypeError(failure);
    searchParams = getInternalSearchParamsState(new URLSearchParams());
    searchParams.bindURL(this);
    this.searchParams = searchParams;
  }
};

URLState.prototype = {
  type: 'URL',
  // https://url.spec.whatwg.org/#url-parsing
  // eslint-disable-next-line max-statements -- TODO
  parse: function (input, stateOverride, base) {
    var url = this;
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, chr, bufferCodePoints, failure;

    input = $toString(input);

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
    }

    input = replace(input, TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      chr = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (chr && exec(ALPHA, chr)) {
            buffer += toLowerCase(chr);
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
            buffer += toLowerCase(chr);
          } else if (chr == ':') {
            if (stateOverride && (
              (url.isSpecial() != hasOwn(specialSchemes, buffer)) ||
              (buffer == 'file' && (url.includesCredentials() || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (url.isSpecial() && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (url.isSpecial() && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (url.isSpecial()) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              push(url.path, '');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && chr == '#') {
            url.scheme = base.scheme;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (chr == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (chr == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (chr == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr == '/' || (chr == '\\' && url.isSpecial())) {
            state = RELATIVE_SLASH;
          } else if (chr == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.path.length--;
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (url.isSpecial() && (chr == '/' || chr == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (chr == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (chr != '/' || charAt(buffer, pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (chr != '/' && chr != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (chr == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial())
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += chr;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (chr == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial())
          ) {
            if (url.isSpecial() && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (chr == '[') seenBracket = true;
            else if (chr == ']') seenBracket = false;
            buffer += chr;
          } break;

        case PORT:
          if (exec(DIGIT, chr)) {
            buffer += chr;
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial()) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (chr == '/' || chr == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (chr == EOF) {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
            } else if (chr == '?') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.shortenPath();
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (chr == '/' || chr == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
            if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = url.parseHost(buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += chr;
          break;

        case PATH_START:
          if (url.isSpecial()) {
            state = PATH;
            if (chr != '/' && chr != '\\') continue;
          } else if (!stateOverride && chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            state = PATH;
            if (chr != '/') continue;
          } break;

        case PATH:
          if (
            chr == EOF || chr == '/' ||
            (chr == '\\' && url.isSpecial()) ||
            (!stateOverride && (chr == '?' || chr == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              url.shortenPath();
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else if (isSingleDot(buffer)) {
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
              }
              push(url.path, buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                shift(url.path);
              }
            }
            if (chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(chr, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            if (chr == "'" && url.isSpecial()) url.query += '%27';
            else if (chr == '#') url.query += '%23';
            else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  },
  // https://url.spec.whatwg.org/#host-parsing
  parseHost: function (input) {
    var result, codePoints, index;
    if (charAt(input, 0) == '[') {
      if (charAt(input, input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(stringSlice(input, 1, -1));
      if (!result) return INVALID_HOST;
      this.host = result;
    // opaque host
    } else if (!this.isSpecial()) {
      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      this.host = result;
    } else {
      input = toASCII(input);
      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      this.host = result;
    }
  },
  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  cannotHaveUsernamePasswordPort: function () {
    return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
  },
  // https://url.spec.whatwg.org/#include-credentials
  includesCredentials: function () {
    return this.username != '' || this.password != '';
  },
  // https://url.spec.whatwg.org/#is-special
  isSpecial: function () {
    return hasOwn(specialSchemes, this.scheme);
  },
  // https://url.spec.whatwg.org/#shorten-a-urls-path
  shortenPath: function () {
    var path = this.path;
    var pathSize = path.length;
    if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.length--;
    }
  },
  // https://url.spec.whatwg.org/#concept-url-serializer
  serialize: function () {
    var url = this;
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (url.includesCredentials()) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  },
  // https://url.spec.whatwg.org/#dom-url-href
  setHref: function (href) {
    var failure = this.parse(href);
    if (failure) throw TypeError(failure);
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-origin
  getOrigin: function () {
    var scheme = this.scheme;
    var port = this.port;
    if (scheme == 'blob') try {
      return new URLConstructor(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !this.isSpecial()) return 'null';
    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
  },
  // https://url.spec.whatwg.org/#dom-url-protocol
  getProtocol: function () {
    return this.scheme + ':';
  },
  setProtocol: function (protocol) {
    this.parse($toString(protocol) + ':', SCHEME_START);
  },
  // https://url.spec.whatwg.org/#dom-url-username
  getUsername: function () {
    return this.username;
  },
  setUsername: function (username) {
    var codePoints = arrayFrom($toString(username));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.username = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-password
  getPassword: function () {
    return this.password;
  },
  setPassword: function (password) {
    var codePoints = arrayFrom($toString(password));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.password = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-host
  getHost: function () {
    var host = this.host;
    var port = this.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  },
  setHost: function (host) {
    if (this.cannotBeABaseURL) return;
    this.parse(host, HOST);
  },
  // https://url.spec.whatwg.org/#dom-url-hostname
  getHostname: function () {
    var host = this.host;
    return host === null ? '' : serializeHost(host);
  },
  setHostname: function (hostname) {
    if (this.cannotBeABaseURL) return;
    this.parse(hostname, HOSTNAME);
  },
  // https://url.spec.whatwg.org/#dom-url-port
  getPort: function () {
    var port = this.port;
    return port === null ? '' : $toString(port);
  },
  setPort: function (port) {
    if (this.cannotHaveUsernamePasswordPort()) return;
    port = $toString(port);
    if (port == '') this.port = null;
    else this.parse(port, PORT);
  },
  // https://url.spec.whatwg.org/#dom-url-pathname
  getPathname: function () {
    var path = this.path;
    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  },
  setPathname: function (pathname) {
    if (this.cannotBeABaseURL) return;
    this.path = [];
    this.parse(pathname, PATH_START);
  },
  // https://url.spec.whatwg.org/#dom-url-search
  getSearch: function () {
    var query = this.query;
    return query ? '?' + query : '';
  },
  setSearch: function (search) {
    search = $toString(search);
    if (search == '') {
      this.query = null;
    } else {
      if ('?' == charAt(search, 0)) search = stringSlice(search, 1);
      this.query = '';
      this.parse(search, QUERY);
    }
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-searchparams
  getSearchParams: function () {
    return this.searchParams.facade;
  },
  // https://url.spec.whatwg.org/#dom-url-hash
  getHash: function () {
    var fragment = this.fragment;
    return fragment ? '#' + fragment : '';
  },
  setHash: function (hash) {
    hash = $toString(hash);
    if (hash == '') {
      this.fragment = null;
      return;
    }
    if ('#' == charAt(hash, 0)) hash = stringSlice(hash, 1);
    this.fragment = '';
    this.parse(hash, FRAGMENT);
  },
  update: function () {
    this.query = this.searchParams.serialize() || null;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
  var state = setInternalState(that, new URLState(url, false, base));
  if (!DESCRIPTORS) {
    that.href = state.serialize();
    that.origin = state.getOrigin();
    that.protocol = state.getProtocol();
    that.username = state.getUsername();
    that.password = state.getPassword();
    that.host = state.getHost();
    that.hostname = state.getHostname();
    that.port = state.getPort();
    that.pathname = state.getPathname();
    that.search = state.getSearch();
    that.searchParams = state.getSearchParams();
    that.hash = state.getHash();
  }
};

var URLPrototype = URLConstructor.prototype;

var accessorDescriptor = function (getter, setter) {
  return {
    get: function () {
      return getInternalURLState(this)[getter]();
    },
    set: setter && function (value) {
      return getInternalURLState(this)[setter](value);
    },
    configurable: true,
    enumerable: true
  };
};

if (DESCRIPTORS) {
  // `URL.prototype.href` accessors pair
  // https://url.spec.whatwg.org/#dom-url-href
  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
  // `URL.prototype.origin` getter
  // https://url.spec.whatwg.org/#dom-url-origin
  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
  // `URL.prototype.protocol` accessors pair
  // https://url.spec.whatwg.org/#dom-url-protocol
  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
  // `URL.prototype.username` accessors pair
  // https://url.spec.whatwg.org/#dom-url-username
  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
  // `URL.prototype.password` accessors pair
  // https://url.spec.whatwg.org/#dom-url-password
  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
  // `URL.prototype.host` accessors pair
  // https://url.spec.whatwg.org/#dom-url-host
  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
  // `URL.prototype.hostname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hostname
  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
  // `URL.prototype.port` accessors pair
  // https://url.spec.whatwg.org/#dom-url-port
  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
  // `URL.prototype.pathname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-pathname
  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
  // `URL.prototype.search` accessors pair
  // https://url.spec.whatwg.org/#dom-url-search
  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
  // `URL.prototype.searchParams` getter
  // https://url.spec.whatwg.org/#dom-url-searchparams
  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
  // `URL.prototype.hash` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hash
  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
defineBuiltIn(URLPrototype, 'toString', function toString() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/web.url.constructor */ "./node_modules/core-js-pure/modules/web.url.constructor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.url.to-json.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.url.to-json.js ***!
  \**************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/bind.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/bind.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/bind */ "./node_modules/core-js-pure/es/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/concat.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/concat.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/concat */ "./node_modules/core-js-pure/es/instance/concat.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/filter.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/filter.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/filter */ "./node_modules/core-js-pure/es/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/find-index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/find-index.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/find-index */ "./node_modules/core-js-pure/es/instance/find-index.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/index-of.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/index-of.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/index-of */ "./node_modules/core-js-pure/es/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/map.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/map.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/map */ "./node_modules/core-js-pure/es/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/slice.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/slice.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/slice */ "./node_modules/core-js-pure/es/instance/slice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/splice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/splice.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/splice */ "./node_modules/core-js-pure/es/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/assign.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/assign.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/assign */ "./node_modules/core-js-pure/es/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/create.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/create.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/create */ "./node_modules/core-js-pure/es/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/get-own-property-descriptor */ "./node_modules/core-js-pure/es/object/get-own-property-descriptor.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/keys */ "./node_modules/core-js-pure/es/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/set-prototype-of.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/set-prototype-of.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/set-prototype-of */ "./node_modules/core-js-pure/es/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/promise/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/promise/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/promise */ "./node_modules/core-js-pure/es/promise/index.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/url/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/stable/url/index.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../web/url */ "./node_modules/core-js-pure/web/url.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/web/url-search-params.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/web/url-search-params.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../modules/web.url-search-params */ "./node_modules/core-js-pure/modules/web.url-search-params.js");
__webpack_require__(/*! ../modules/web.url-search-params.delete */ "./node_modules/core-js-pure/modules/web.url-search-params.delete.js");
__webpack_require__(/*! ../modules/web.url-search-params.has */ "./node_modules/core-js-pure/modules/web.url-search-params.has.js");
__webpack_require__(/*! ../modules/web.url-search-params.size */ "./node_modules/core-js-pure/modules/web.url-search-params.size.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.URLSearchParams;


/***/ }),

/***/ "./node_modules/core-js-pure/web/url.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js-pure/web/url.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./url-search-params */ "./node_modules/core-js-pure/web/url-search-params.js");
__webpack_require__(/*! ../modules/web.url */ "./node_modules/core-js-pure/modules/web.url.js");
__webpack_require__(/*! ../modules/web.url.can-parse */ "./node_modules/core-js-pure/modules/web.url.can-parse.js");
__webpack_require__(/*! ../modules/web.url.to-json */ "./node_modules/core-js-pure/modules/web.url.to-json.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.URL;


/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/concat.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/concat.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/concat */ "./node_modules/core-js-pure/features/instance/concat.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/filter */ "./node_modules/core-js-pure/features/instance/filter.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/find-index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/find-index.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/find-index */ "./node_modules/core-js-pure/features/instance/find-index.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/map.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/map.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/map */ "./node_modules/core-js-pure/features/instance/map.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/slice.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/slice.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/slice */ "./node_modules/core-js-pure/features/instance/slice.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/splice */ "./node_modules/core-js-pure/features/instance/splice.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/object/assign.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/object/assign.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/object/assign */ "./node_modules/core-js-pure/features/object/assign.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js ***!
  \*******************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/object/get-own-property-descriptor */ "./node_modules/core-js-pure/features/object/get-own-property-descriptor.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/object/keys.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/object/keys */ "./node_modules/core-js-pure/features/object/keys.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/promise.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/promise.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/promise */ "./node_modules/core-js-pure/features/promise/index.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/url.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/url.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/url */ "./node_modules/core-js-pure/features/url/index.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/assign.js */ "./node_modules/core-js-pure/full/object/assign.js");
/* harmony import */ var core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/bind.js */ "./node_modules/core-js-pure/full/instance/bind.js");


function _extends() {
  var _context;
  _extends = core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__ ? core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__(_context = core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__).call(_context) : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inheritsLoose; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_create_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/object/create.js */ "./node_modules/core-js-pure/full/object/create.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js");


function _inheritsLoose(subClass, superClass) {
  subClass.prototype = core_js_pure_features_object_create_js__WEBPACK_IMPORTED_MODULE_1__(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectWithoutPropertiesLoose; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/keys.js */ "./node_modules/core-js-pure/full/object/keys.js");
/* harmony import */ var core_js_pure_features_instance_index_of_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/index-of.js */ "./node_modules/core-js-pure/full/instance/index-of.js");


function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = core_js_pure_features_object_keys_js__WEBPACK_IMPORTED_MODULE_0__(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (core_js_pure_features_instance_index_of_js__WEBPACK_IMPORTED_MODULE_1__(excluded).call(excluded, key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/set-prototype-of.js */ "./node_modules/core-js-pure/full/object/set-prototype-of.js");
/* harmony import */ var core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/bind.js */ "./node_modules/core-js-pure/full/instance/bind.js");


function _setPrototypeOf(o, p) {
  var _context;
  _setPrototypeOf = core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__ ? core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__(_context = core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__).call(_context) : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: function() { return /* reexport safe */ _entity__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   Gallery: function() { return /* reexport safe */ _gallery__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   Picture: function() { return /* reexport safe */ _picture__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "default": function() { return /* binding */ previewImage; },
/* harmony export */   loadImage: function() { return /* reexport safe */ _image__WEBPACK_IMPORTED_MODULE_5__["default"]; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gallery */ "./src/gallery.ts");
/* harmony import */ var _picture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./picture */ "./src/picture.ts");
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity */ "./src/entity/index.ts");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./image */ "./src/image.ts");


var _excluded = ["urls", "current", "showMenu"];
/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 14:27:09
 * @Description: ******
 */










function previewImage(_ref) {
  var urls = _ref.urls,
    current = _ref.current,
    showMenu = _ref.showMenu,
    restOption = (0,_babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, _excluded);
  var index = !current ? 0 : urls.indexOf(current);
  var gallery = new _gallery__WEBPACK_IMPORTED_MODULE_2__["default"]((0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    imageUrls: urls,
    activeIndex: index,
    longPress: function longPress() {
      typeof showMenu === 'function' && showMenu();
    },
    press: function press() {
      gallery.close();
    }
  }, restOption));
  gallery.open();
}
}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=previewImage.js.map