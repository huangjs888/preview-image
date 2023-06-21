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
 * @LastEditTime: 2023-05-09 14:46:25
 * @Description: ******
 */
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    (0, _classCallCheck2.default)(this, EventTarget);
    (0, _defineProperty2.default)(this, "events", {});
    this.events = {};
  }
  (0, _createClass2.default)(EventTarget, [{
    key: "one",
    value: function one(type, handler, single) {
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
    }
  }, {
    key: "on",
    value: function on(type, handler, single) {
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
        // 需要把独立事件删除，相当于解绑独立事件
        events.pool.splice(events.single, 1);
        events.single = -1;
      }
      this.events[type] = events;
    }
  }, {
    key: "off",
    value: function off(type, handler, single) {
      if (typeof type === 'undefined') {
        // 没有type则删除全部事件
        this.events = {};
      } else if (typeof handler === 'undefined') {
        // 删除type下的所有事件
        delete this.events[type];
      } else if (single) {
        var events = this.events[type];
        if (events && events.single !== -1) {
          // 删除独立程序事件
          events.pool.splice(events.single, 1);
          events.single = -1;
        }
      } else {
        var _events = this.events[type];
        if (_events) {
          // 检查并删除事件池内事件
          for (var i = _events.pool.length - 1; i >= 0; i--) {
            if (_events.pool[i] === handler && i !== _events.single) {
              _events.pool.splice(i, 1);
              // 因为相同事件只会有一个，所以删除后不需要再检查了
              break;
            }
          }
        }
      }
    }
  }, {
    key: "trigger",
    value: function trigger(type, event) {
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
    }
  }]);
  return EventTarget;
}();
exports.default = EventTarget;