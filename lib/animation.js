"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-21 12:28:44
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
  // 动画执行持续时间
  // 动画执行时变换函数
  // 动画延迟多久执行
  // 当前正在执行帧的id
  // 当前正在休眠计时id
  // 本次动画已经消耗的时间
  // 每一帧动画执行函数
  function Animation(_ref) {
    var duration = _ref.duration,
      easing = _ref.easing,
      delay = _ref.delay;
    (0, _classCallCheck2.default)(this, Animation);
    (0, _defineProperty2.default)(this, "_frameId", 0);
    (0, _defineProperty2.default)(this, "_sleepId", 0);
    (0, _defineProperty2.default)(this, "_elapsed", 0);
    (0, _defineProperty2.default)(this, "_tick", null);
    this.duration = typeof duration !== 'number' || duration <= 0 ? 0 : duration;
    this.easing = typeof easing !== 'function' ? function (v) {
      return v;
    } : easing;
    this.delay = typeof delay !== 'number' ? 0 : delay;
  }
  (0, _createClass2.default)(Animation, [{
    key: "start",
    value: function start(frameFn) {
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
          callDelay(function () {
            var elapsed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
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
    }
  }, {
    key: "restart",
    value: function restart() {
      // restart之前先停止运行
      this.stop();
      // 停止后启动帧，只有动画已经开始并且未结束才可以
      if (this._elapsed < this.duration && this._tick) {
        // 启动帧
        this._tick(Date.now());
      }
    }
  }, {
    key: "sleep",
    value: function sleep(time) {
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
    }
  }, {
    key: "stop",
    value: function stop() {
      // 如果在sleep，要先清除sleep
      window.clearTimeout(this._sleepId);
      // 清掉还未运行的帧
      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
    }
  }, {
    key: "end",
    value: function end() {
      // end之前先停止运行
      this.stop();
      // 停止后直接运行最后一帧结束动画，只有动画已经开始并且未结束才可以
      if (this._elapsed < this.duration && this._tick) {
        this._elapsed = this.duration;
        this._tick(Date.now());
      }
    }
  }]);
  return Animation;
}();
var _default = Animation;
exports.default = _default;