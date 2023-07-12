/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-12 16:09:13
 * @Description: ******
 */

import EventTarget from './event';
import {
  fixOption,
  isTouchable,
  getDirection,
  getDistance,
  getAngle,
  getCenter,
  getVelocity,
  getVector,
} from './util';

const isCurrentTarget = (target: HTMLElement, currentTarget: HTMLElement) => {
  let _target: HTMLElement | null = target;
  while (_target && _target !== currentTarget) {
    _target = _target.parentNode as HTMLElement;
  }
  return !!_target;
};

function touchstarted(this: Gesture, event: TouchEvent) {
  const _touches = event.touches;
  if (!_touches) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const newEvent: GEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    toucheIds: [],
  };
  // 忽略掉注册事件元素之外的手指
  const touches: Touch[] = Array.prototype.filter.call(event.touches, (t) =>
    isCurrentTarget(
      t.target as HTMLElement,
      event.currentTarget as HTMLElement,
    ),
  );
  // const touches = _touches;
  // 表示第一次放入手指
  if (event.changedTouches.length === touches.length) {
    this._touch0 = null;
    this._touch1 = null;
  }
  // 如果当前事件元素之外的屏幕上有手指，此时在事件元素上放一个手指，touches会包含该手指
  // 循环保存放在屏幕上的手指，这里只会保存最多两个，忽略超过三个的手指（只对单指和双指情形处理）
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p = [t.pageX, t.pageY];
    const touch = [p, p, p, [t.identifier]];
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
    newEvent.toucheIds.push(this._touch0[3][0], this._touch1[3][0]);
    this._firstPoint = null;
    newEvent.point = getCenter(this._touch0[0], this._touch1[0]);
    this.emit('gestureStart', newEvent);
  }
  // 单指start
  else if (this._touch0) {
    newEvent.toucheIds.push(this._touch0[3][0]);
    newEvent.point = this._touch0[0];
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(() => {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      this._preventTap = true;
      this._preventSingleTap = true;
      this._preventDoubleTap = true;
      this._longTapTimer = null;
      if (this._touch0) {
        newEvent.waitTime = this.longTapInterval;
        this.emit('longTap', newEvent);
      }
    }, this.longTapInterval);
    if (
      this._singleTapTimer &&
      this._firstPoint &&
      getDistance(this._firstPoint, this._touch0[0]) < this.doubleTapDistance
    ) {
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
  this.emit('touchStart', newEvent);
}

function touchmoved(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const newEvent: GEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    toucheIds: [],
  };
  // 循环更新手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p = [t.pageX, t.pageY];
    if (this._touch0 && this._touch0[3][0] === t.identifier) {
      this._touch0[1] = this._touch0[2];
      this._touch0[2] = p;
    } else if (this._touch1 && this._touch1[3][0] === t.identifier) {
      this._touch1[1] = this._touch1[2];
      this._touch1[2] = p;
    }
  }
  // 手指移动至少要有一个手指移动超过touchMoveDistance才会触发移动事件
  if (
    (this._touch0 &&
      getDistance(this._touch0[0], this._touch0[2]) > this.touchMoveDistance) ||
    (this._touch1 &&
      getDistance(this._touch1[0], this._touch1[2]) > this.touchMoveDistance)
  ) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    this._firstPoint = null;
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (this._touch1 && this._touch0) {
      newEvent.toucheIds.push(this._touch0[3][0], this._touch1[3][0]);
      // 双指平移
      const eCenter = getCenter(this._touch0[2], this._touch1[2]);
      const mCenter = getCenter(this._touch0[1], this._touch1[1]);
      const sCenter = getCenter(this._touch0[0], this._touch1[0]);
      newEvent.point = eCenter;
      newEvent.direction = getDirection(mCenter, eCenter);
      newEvent.moveDirection = getDirection(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - mCenter[0];
      newEvent.moveX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - mCenter[1];
      newEvent.moveY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      const eDistance = getDistance(this._touch0[2], this._touch1[2]);
      const mDistance = getDistance(this._touch0[1], this._touch1[1]);
      const sDistance = getDistance(this._touch0[0], this._touch1[0]);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / mDistance;
        newEvent.moveScale = eDistance / sDistance;
      }
      const eAngle = getAngle(this._touch0[2], this._touch1[2]);
      const mAngle = getAngle(this._touch0[1], this._touch1[1]);
      // const sAngle = getAngle(this._touch0[0], this._touch1[0]);
      // 这里计算的三个angle均是向量（第一个参数为起点，第二个为终点）与x正半轴之间的夹角
      // 方向朝向y轴正半轴的为正值[0,180]，朝向y轴负半轴的为负值[-180,0]
      // 注意，这里坐标轴是页面坐标，x轴向右正方向，y轴向下正方向，原点在左上角
      let angle = eAngle - mAngle;
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
      const moveAngle = (this._rotateAngle || 0) + angle;
      newEvent.moveAngle = this._rotateAngle = moveAngle;
      this.emit('rotate', newEvent);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        this.emit('pinch', newEvent);
      }
      this.emit('multiPan', newEvent);
      this.emit('gestureMove', newEvent);
    }
    // 单指移动
    else if (this._touch0) {
      newEvent.toucheIds.push(this._touch0[3][0]);
      const _timestamp = Date.now();
      // 第一次移动this._swipePoints为null
      const _swipePoints = this._swipePoints || [[], []];
      const _duration =
        _timestamp -
        ((_swipePoints[1][0] ? _swipePoints[1][0].timestamp : 0) || 0);
      // 当前时间与本阶段初始时间之差大于计入swipe的时间(swipeDuration)，则本阶段过时，下阶段开启
      if (_duration > this.swipeDuration) {
        // 将本阶段作为上一阶段，开启下一阶段作为本阶段
        _swipePoints[0] = _swipePoints[1];
        _swipePoints[1] = [];
      }
      // 将当前移动点和时间存入本阶段
      _swipePoints[1].push({
        point: this._touch0[2],
        timestamp: _timestamp,
      });
      this._swipePoints = _swipePoints;
      newEvent.point = this._touch0[2];
      newEvent.direction = getDirection(this._touch0[1], this._touch0[2]);
      newEvent.moveDirection = getDirection(this._touch0[0], this._touch0[2]);
      newEvent.deltaX = this._touch0[2][0] - this._touch0[1][0];
      newEvent.moveX = this._touch0[2][0] - this._touch0[0][0];
      newEvent.deltaY = this._touch0[2][1] - this._touch0[1][1];
      newEvent.moveY = this._touch0[2][1] - this._touch0[0][1];
      // 触发单指平移事件
      this.emit('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.emit('touchMove', newEvent);
  }
}

function touchended(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.stopPropagation();
  const newEvent: GEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [0, 0],
    toucheIds: [],
  };
  // 临时保存当前手指
  let touch0: number[][] | null = null;
  let touch1: number[][] | null = null;
  // 循环删除已经拿开的手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
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
    newEvent.toucheIds.push(this._touch0[3][0]);
    newEvent.point = getCenter(
      this._touch0[2],
      this._touch1 ? this._touch1[2] : touch1 ? touch1[2] : [],
    );
    this.emit('gestureEnd', newEvent);
  }
  // 全部拿开（双指同时抬起，最后一指抬起，仅仅一指抬起）
  else if (touch0) {
    newEvent.point = touch1 ? getCenter(touch0[2], touch1[2]) : touch0[2];
    if (!this._preventTap) {
      this.emit('tap', newEvent);
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(() => {
        this._singleTapTimer = null;
        newEvent.delayTime = this.doubleTapInterval;
        this.emit('singleTap', newEvent);
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      // 双击点使用第一次的点
      if (this._firstPoint) {
        newEvent.point = this._firstPoint;
      }
      newEvent.intervalTime = this.doubleTapInterval;
      this.emit('doubleTap', newEvent);
    }
    // this._swipePoints存在表示开始了swipe行为
    if (this._swipePoints) {
      const [prev, next] = this._swipePoints;
      // 最后一次移动的点即为swipe终点
      const endPos = next[next.length - 1];
      // 最后一次移动点的时间减去手指抬起的时间，此间隔时间需小于等待时间raiseDuration，否则视为停止swipe
      if (Date.now() - endPos.timestamp <= this.raiseDuration) {
        // 找到计入swipe的时间(swipeDuration)内的swipe起点
        let startPos = next[0];
        for (let i = prev.length - 1; i >= 0; i--) {
          if (endPos.timestamp - prev[i].timestamp <= this.swipeDuration) {
            startPos = prev[i];
          } else {
            break;
          }
        }
        // 根据swipe起点和终点的距离差与时间差算出swipe抬起时速率
        const velocity = getVelocity(
          endPos.timestamp - startPos.timestamp,
          getDistance(startPos.point, endPos.point),
        );
        // swipe速率需要大于swipeVelocity，否则忽略不计，不视为swipe
        if (velocity > this.swipeVelocity) {
          // 滑动方向与x夹角
          const angle = getAngle(startPos.point, endPos.point);
          // 惯性的方向
          newEvent.direction = getDirection(startPos.point, endPos.point);
          newEvent.angle = angle;
          newEvent.velocity = velocity;
          // 给出按照velocity速度滑动，当速度减到0时的计算函数：
          // 当给出时间t，即在t时间内速度减到0，求出滑动的距离：
          // 当给出减速度a，即在减速度a的作用下，速度减到0，求出滑动的距离，和消耗的时间：
          // 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
          // 减速度某个时间的速度：v = v0 - a * t
          // s为滑动距离，v末速度为0，v0初速度为velocity
          newEvent.swipeComputed = (
            factor: number,
            _velocity: number = velocity,
          ) => {
            // 因子大于1可以认为传入的是时间毫秒数
            let duration = 0;
            let deceleration = 0;
            let distance = 0;
            if (factor > 1) {
              duration = factor;
              deceleration = _velocity / duration;
              distance = (_velocity * duration) / 2;
            }
            // 因子小于1可以认为传入的是减速度（减速如果大于1一般太大了，不符合使用场景）
            else if (factor > 0) {
              deceleration = factor;
              duration = _velocity / deceleration;
              distance = (_velocity * _velocity) / (2 * deceleration);
            }
            const [stretchX, stretchY] = getVector(distance, angle);
            return {
              duration, // swipe速率减到0花费的时间
              stretchX, // x方向swipe惯性距离（抬起后，继续移动的距离）
              stretchY, // y方向swipe惯性距离（抬起后，继续移动的距离）
              deceleration, // swipe速率减到0的减速度
            };
          };
          this.emit('swipe', newEvent);
        }
      }
    }
  }
  this.emit('touchEnd', newEvent);
  /* // 只剩下一根在上面了，以下事件交给用户自行放在touchEnd事件里自行判断
  if (this._touch0 && !this._touch1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._touch0[0] = this._touch0[1] = this._touch0[2];
    // 同时可以触发一次start事件
    newEvent.point = this._touch0[0];
    this.emit('touchStart', newEvent);
  } */
}

function touchcanceled(this: Gesture, event: TouchEvent) {
  event.stopPropagation();
  this.emit('touchCancel', {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    point: [],
    toucheIds: [],
  });
  touchended.apply(this, [event]);
}

function scrollcanceled(this: Gesture) {
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

class Gesture extends EventTarget<GType, GEvent> {
  element: HTMLElement;
  longTapInterval: number;
  doubleTapInterval: number;
  doubleTapDistance: number;
  touchMoveDistance: number;
  swipeVelocity: number;
  swipeDuration: number;
  raiseDuration: number;
  _rotateAngle: number | null = null;
  _singleTapTimer: number | null = null;
  _longTapTimer: number | null = null;
  _preventTap: boolean = true;
  _swipePoints: any[] | null = null;
  _preventSingleTap: boolean = true;
  _preventDoubleTap: boolean = true;
  _firstPoint: number[] | null = null;
  _touch0: number[][] | null = null; // 保存第一个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]
  _touch1: number[][] | null = null; // 保存第二个触摸点x,y值: [startPoint, prevMovePoint, MovePoint, identifier]
  _destory: (() => void) | null = null;
  constructor(element: HTMLElement | string, options?: GOptions) {
    super();
    let tempElement: HTMLElement | null;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    this.element = tempElement;
    const {
      longTapInterval,
      doubleTapInterval,
      doubleTapDistance,
      touchMoveDistance,
      swipeVelocity,
      swipeDuration,
      raiseDuration,
    } = options || {};
    this.longTapInterval = fixOption(longTapInterval, 750, 500);
    this.doubleTapInterval = fixOption(doubleTapInterval, 250, 200);
    this.doubleTapDistance = fixOption(doubleTapDistance, 30, 1);
    this.touchMoveDistance = fixOption(touchMoveDistance, 3, 0);
    this.swipeVelocity = fixOption(swipeVelocity, 0.3, 0);
    this.swipeDuration = fixOption(swipeDuration, 100, 1);
    this.raiseDuration = fixOption(raiseDuration, 100, 1);
    // 注册触摸事件
    if (isTouchable(this.element)) {
      const started = touchstarted.bind(this);
      const moved = touchmoved.bind(this);
      const ended = touchended.bind(this);
      const canceled = touchcanceled.bind(this);
      this.element.addEventListener('touchstart', started, false);
      this.element.addEventListener('touchmove', moved, false);
      this.element.addEventListener('touchend', ended, false);
      this.element.addEventListener('touchcancel', canceled, false);
      const scrolled = scrollcanceled.bind(this);
      window.addEventListener('scroll', scrolled);
      this._destory = () => {
        this.element.removeEventListener('touchstart', started);
        this.element.removeEventListener('touchmove', moved);
        this.element.removeEventListener('touchend', ended);
        this.element.removeEventListener('touchcancel', canceled);
        window.removeEventListener('scroll', scrolled);
      };
    }
  }
  done() {
    return !!this._destory;
  }
  destory() {
    // 解除所有事件
    super.off();
    scrollcanceled.apply(this);
    // 解除手势事件
    if (this._destory) {
      this._destory();
      this._destory = null;
    }
  }
}
export type Direction = 'Left' | 'Right' | 'Up' | 'Down' | 'None';

export type GType =
  | 'pan' // 单指平移
  | 'tap' // 单指轻点（快，双击时会触发）
  | 'swipe' // 单指快速滑动
  | 'singleTap' // 单指点击（有延迟，双击时不触发）
  | 'longTap' // 单指长按
  | 'doubleTap' // 单指双击
  | 'multiPan' // 双指平移
  | 'pinch' // 双指拿捏
  | 'rotate' // 双指旋转
  | 'touchStart' // 触摸开始
  | 'touchMove' // 触摸移动
  | 'touchEnd' // 触摸抬起
  | 'touchCancel' // 触摸取消
  | 'gestureStart' // 双（多）指开始
  | 'gestureMove' // 双（多）指移动
  | 'gestureEnd'; // 双（多）指结束

/**
 * swipe思路:
 * 根据移动停止前swipeDuration时间内移动的距离和时间算出速度，
 * 速度大于swipeVelocity，并且移动停止后到手指抬起时间间隔小于raiseDuration即为swipe
 * 移动停止就是最后一次触发move事件
 * 0. touchstart 清空_swipePoints
 * 1. touchmove 每swipeDuration时间内所移动的点分为一组，只保留上一次swipeDuration时间组和这一次swipeDuration时间组，存储在_swipePoints内
 * 2. touchend 松开手时, 在_swipePoints内找到起终点，根据起终点距离和时间差算出速度，然后算出其他值
 */

export type GEvent = {
  currentTarget: HTMLElement;
  sourceEvent: TouchEvent;
  timestamp: number;
  toucheIds: number[]; // 当前触摸点ID
  point: number[]; // 当前事件变化的点，如果多个点（两个），取中心点
  scale?: number; // 移动的缩放比例（和上一个点比较）
  angle?: number; // 移动的旋转角度（和上一个点比较）swipe角度
  deltaX?: number; // x方向移动的距离（和上一个点比较）
  deltaY?: number; // y方向移动的距离（和上一个点比较）
  direction?: Direction; // 移动时的方向（和上一个点比较）swipe方向
  moveScale?: number; // 移动的缩放比例（和起点比较）
  moveAngle?: number; // 移动的旋转角度（和起点比较）
  moveX?: number; // x方向移动的距离（和起点比较）
  moveY?: number; // y方向移动的距离（和起点比较）
  moveDirection?: Direction; // 移动时的方向（和起点比较）
  velocity?: number; // swipe阶段速率（不是从起点到终点的速率）
  waitTime?: number; // 长按等待时间
  delayTime?: number; // 点击延迟时间
  intervalTime?: number; // 双击间隔时间
  swipeComputed?: (
    factor: number,
    _velocity?: number,
  ) => {
    duration: number; // swipe速率减到0花费的时间
    stretchX: number; // x方向swipe惯性距离（抬起后，继续移动的距离）
    stretchY: number; // y方向swipe惯性距离（抬起后，继续移动的距离）
    deceleration: number; // swipe速率减到0的减速度
  };
};

export type GOptions = {
  longTapInterval?: number; // 设置长按等待时间阈值，单位ms
  doubleTapInterval?: number; // 设置双击时间间隔，单位ms
  doubleTapDistance?: number; // 双击两次点击的位置距离触发阈值
  touchMoveDistance?: number; // 移动阈值，超过这个值才算移动
  swipeVelocity?: number; // swipe阶段的速率大于这个值才会触发swipe
  swipeDuration?: number; // 移动过程中计入swipe的时间范围，即：最后一次移动事件向前推swipeDuration时间内，作为swipe阶段
  raiseDuration?: number; // 最后一次移动到手指抬起的时间间隔，小于这个值才会触发swipe
};

export default Gesture;
