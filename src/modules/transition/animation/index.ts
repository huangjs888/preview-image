/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-14 09:42:52
 * @Description: ******
 */

import { requestAnimationFrame, cancelAnimationFrame } from './raf';

const delayCall = (callback: IAnimationCallBack, delay: number) => {
  if (delay > 0) {
    return +setTimeout(callback, delay);
  }
  callback(Math.abs(delay));
  return 0;
};

class Animation {
  duration: number; // 动画执行持续时间
  easing: IAnimationEasing; // 动画执行时变换函数
  delay: number; // 动画延迟多久执行
  _delay: number = 0; // 延迟执行剩余delay时间
  _frameId: number = 0; // 当前正在执行帧的id
  _elapsed: number = 0; // 本次动画已经消耗的时间
  _sleepId: number = 0; // 当前正在休眠计时id
  _delayId: number = 0; // 当前delay计时id
  _tick: IAnimationCallBack | null = null; // 每一帧动画执行函数
  _delayFn: IAnimationCallBack | null = null; // 延迟执行需要执行的函数
  constructor({ duration, easing, delay }: IAnimationOptions = {}) {
    this.duration = typeof duration !== 'number' || duration <= 0 ? 0 : duration;
    this.easing = typeof easing !== 'function' ? (v) => v : easing;
    this.delay = typeof delay !== 'number' ? 0 : delay;
  }
  start(frameFn: IAnimationCallBack) {
    // 只有从未开始过或着已经结束了的动画可以再开始
    if (!this._tick && !this._delayFn) {
      const { duration, easing, delay } = this;
      this._delayFn = (elapsed) => {
        this._delayId = 0;
        this._delayFn = null;
        this._delay = 0;
        if (duration > 0) {
          const tick: IAnimationCallBack = (last) => {
            // 本帧时间戳，last：上一帧时间戳
            const now = Date.now();
            // 累计已经耗用的时间
            this._elapsed += now - last;
            if (this._elapsed < duration) {
              // 开启下一帧
              this._frameId = requestAnimationFrame(() => tick(now));
              // 每一帧的进度
              frameFn(easing(this._elapsed / duration));
            } else {
              // 执行完毕后清除
              this._tick = null;
              this._frameId = 0;
              this._elapsed = 0;
              frameFn(1);
            }
          };
          this._tick = tick;
          // 第一次直接用掉这些时间
          this._elapsed = elapsed || 0;
          tick(Date.now());
        } else {
          // duration为0，直接运行到最后
          frameFn(1);
        }
      };
      // 记录延迟开始时间戳
      this._delay = Date.now();
      // 延迟执行
      this._delayId = delayCall(this._delayFn, delay);
    }
  }
  restart() {
    if (this._tick || this._delayFn) {
      // 只有动画在延迟、动画、休眠，停止的时候可以restart
      // 重启之前先停止一切
      this.stop();
      if (this._tick) {
        // 动画、休眠，停止状态，停止后，启动帧继续运行
        this._tick(Date.now());
      }
      if (this._delayFn) {
        const delay = this.delay + this._delay;
        // 更新时间戳
        this._delay += Date.now();
        // 延迟状态，停止后，开启新的延迟
        this._delayId = delayCall(this._delayFn, delay);
      }
    }
  }
  sleep(time: number) {
    if (!time || time <= 0) {
      // 没有设置休眠时间，则不做任何操作
      return;
    }
    if (this._tick || this._delayFn) {
      // 只有动画在延迟、动画、休眠，停止的时候可以进行休眠
      // 这里注意，停止状态的时候点休眠，相当于延迟restart，时间一到会重启动画
      // sleep之前先停止一切
      this.stop();
      // 启动本次休眠
      this._sleepId = +setTimeout(() => {
        this._sleepId = 0;
        // 到时间后重启动画
        this.restart();
      }, time);
    }
  }
  stop() {
    if (this._tick || this._delayFn) {
      if (this._delayId) {
        // 如果正在delay，则停止delay
        clearTimeout(this._delayId);
        this._delayId = 0;
        // 停止延迟时，已耗用时间
        this._delay -= Date.now();
      }
      if (this._frameId) {
        // 如果正在运行，即正在动画，则停止动画
        cancelAnimationFrame(this._frameId);
        this._frameId = 0;
      }
      if (this._sleepId) {
        // 如果正在sleep，则停止sleep
        clearTimeout(this._sleepId);
        this._sleepId = 0;
      }
    }
  }
  end() {
    if (this._tick || this._delayFn) {
      // 只有动画在延迟、动画、休眠，停止的时候可以直接end
      // end之前先停止一切
      this.stop();
      if (this._tick) {
        // 动画、休眠，停止状态，停止后，启动帧运行到最后
        this._tick(Date.now() + this._elapsed - this.duration);
      }
      if (this._delayFn) {
        // 延迟状态，停止后，直接运行到最后
        this._delayFn(this.duration);
      }
    }
  }
}

type IAnimationCallBack = (v: number) => void;

export type IAnimationEasing = (v: number) => number;

export type IAnimationOptions = {
  duration?: number; // 动画持续时间
  easing?: IAnimationEasing; // 动画变换函数
  delay?: number; // 动画延迟多久执行，负数的话，会在第一次把这个时间内的变化一次性用掉，具体看css3-transition-delay
};

export default Animation;
