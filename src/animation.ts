/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-26 14:30:14
 * @Description: ******
 */

import EventTarget from './event';

const requestAnimationFrame =
  window.requestAnimationFrame ||
  (function () {
    let last = 0;
    // setTimeout时间并不精确，这里做了校准
    return function (fn: () => void) {
      const now = Date.now();
      const delay = Math.max(0, 16 - (now - last));
      last = now + delay;
      return window.setTimeout(fn, delay);
    };
  })();

const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  function (id: number) {
    return window.clearTimeout(id);
  };

const animate = function animate(
  this: Animation,
  frameFn: (v: number) => void,
  duration: number,
  easing: Easing,
) {
  const start = Date.now();
  const dest = start + duration;
  const step = () => {
    if (this._progress < 0) {
      return;
    }
    const now = Date.now();
    // 时间用完，执行最后一帧
    if (now >= dest) {
      frameFn(1);
      this.trigger('run', { progress: 1, timestamp: now });
      this.trigger('end', { progress: 1, timestamp: now });
      // cancelAnimationFrame(this._frameId);
      this._progress = -1;
      return;
    }
    const progress = (this._progress = easing((now - start) / duration));
    frameFn(progress);
    this.trigger('run', { progress, timestamp: now });
    this._frameId = requestAnimationFrame(step);
  };
  // 假设动画正在进行，此时又再次开始，开始之前应该先取消上一次动画
  cancelAnimationFrame(this._frameId);
  this._progress = 0;
  // 立即执行第一帧
  step();
  this.trigger('start', { progress: 0, timestamp: start });
};

class Animation extends EventTarget<AType, AEvent> {
  duration: number; // 动画持续时间
  easing: Easing; // 动画变换函数
  _frameId: number = 0; // 当前正在执行帧的id
  _progress: number = -1; // 当前执行的进度，-1表示没有进行动画
  constructor(options: AOptions) {
    super();
    this.duration =
      !options.duration || options.duration <= 0 ? 0 : options.duration;
    this.easing = options.easing || ((v) => v);
  }
  start(
    frameFn: (v: number) => void,
    duration: number = this.duration,
    easing: Easing = this.easing,
  ) {
    if (duration === 0) {
      // requestAnimationFrame(() => {
      const now = Date.now();
      this.trigger('start', { progress: 0, timestamp: now });
      frameFn(1);
      this.trigger('run', { progress: 1, timestamp: now });
      this.trigger('end', { progress: 1, timestamp: now });
      // });
      return;
    }
    animate.apply(this, [frameFn, duration, easing]);
  }
  stop() {
    if (this._progress > 0) {
      const progress = this._progress;
      this._progress = -1;
      cancelAnimationFrame(this._frameId);
      this.trigger('cancel', {
        progress,
        timestamp: Date.now(),
      });
    }
  }
}

export type Easing = (v: number) => number;

export type AType =
  | 'start' // 动画开始
  | 'run' // 动画运行
  | 'end' // 动画结束
  | 'cancel'; // 动画取消

export type AEvent = { progress: number; timestamp: number };

export type AOptions = {
  duration?: number; // 动画持续时间
  easing?: Easing; // 动画变换函数
};

export default Animation;
