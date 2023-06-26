/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-25 10:29:03
 * @Description: ******
 */

type IHandler<E, T> = (event: E, type?: T) => boolean | void;

export default class EventTarget<T extends string, E> {
  events: {
    [key in T]?: {
      pool: Array<IHandler<E, T>>;
      single: number;
    };
  } = {};
  constructor() {
    this.events = {};
  }
  one(type: T, handler: IHandler<E, T>, single?: boolean) {
    const onceHandler =
      typeof handler === 'function'
        ? (...args: [E, T?]) => {
            // 该事件只执行一次，执行完就解除事件
            handler.apply(null, args);
            this.off(type, onceHandler, single);
          }
        : handler;
    this.on(type, onceHandler, single);
  }
  on(type: T, handler: IHandler<E, T>, single?: boolean) {
    const events = this.events[type] || {
      pool: [],
      single: -1,
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
        let unregistered = true;
        for (let i = 0, len = events.pool.length; i < len; i++) {
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
  off(type?: T, handler?: IHandler<E, T>, single?: boolean) {
    if (typeof type === 'undefined') {
      // 没有type则删除全部事件
      this.events = {};
    } else if (typeof handler === 'undefined') {
      // 删除type下的所有事件
      delete this.events[type];
    } else if (single) {
      const events = this.events[type];
      if (events && events.single !== -1) {
        // 删除独立程序事件
        events.pool.splice(events.single, 1);
        events.single = -1;
      }
    } else {
      const events = this.events[type];
      if (events) {
        // 检查并删除事件池内事件
        for (let i = events.pool.length - 1; i >= 0; i--) {
          if (events.pool[i] === handler && i !== events.single) {
            events.pool.splice(i, 1);
            // 因为相同事件只会有一个，所以删除后不需要再检查了
            break;
          }
        }
      }
    }
  }
  emit(type: T, event: E) {
    const events = this.events[type];
    if (events) {
      // 循环执行事件池里的事件
      for (let i = 0, len = events.pool.length; i < len; i++) {
        const handler = events.pool[i];
        if (typeof handler === 'function') {
          const immediatePropagation = handler.apply(null, [event, type]);
          // 返回值为false，则阻止后于该事件注册的同类型事件触发
          if (immediatePropagation === false) {
            break;
          }
        }
      }
    }
  }
}
