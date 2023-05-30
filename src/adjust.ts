/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-30 10:32:31
 * @Description: ******
 */

// 阻尼算法逻辑
function damping(value: number, friction: number, inverse: boolean = false) {
  if (value === 0) {
    return 0;
  }
  if (friction <= 0) {
    return 1;
  }
  const v = value || 1;
  let f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return Math.pow(Math.abs(v), f) * (v > 0 ? 1 : -1);
}
// 算出双击时offset的比例
export function ratioOffset(v: number, k: number, t: number) {
  if (v <= (1 - k) / (2 * k)) {
    return -1 / 2;
  } else if (v >= (1 + k - 2 * t) / (2 * k)) {
    return 1 / 2;
  } else {
    return (v - (1 - t) / (2 * k)) / (1 - t / k);
  }
}
// swipe时惯性滑动超出边界的阻尼算法
export function swipeDamping(
  value: number,
  velocity: number,
  [min, max]: number[],
  size: number,
) {
  let newVal = value;
  const delta = Math.abs((size / 15) * velocity);
  if (value < min) {
    newVal = Math.max(min - size / 5, min - delta);
  } else if (value > max) {
    newVal = Math.min(max + size / 5, max + delta);
  }
  return Math.round(newVal);
}
// 跟随手指移动，旋转或缩放时的阻尼算法
export function performDamping(
  v: number,
  [min, max]: number[],
  k: boolean = false, // 是否使用乘计算（主要是缩放情况），否则使用加减算法
) {
  if (v < min || v > max) {
    const m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4) : m + damping(v - m, 0.8);
  }
  return v;
}
// 跟随手指移动，旋转或缩放时恢复阻尼算法的原值
export function revokeDamping(
  v: number,
  [min, max]: number[],
  k: boolean = false,
) {
  if (v < min || v > max) {
    const m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4, true) : m + damping(v - m, 0.8, true);
  }
  return v;
}
// 判断v是否在min和max之间
export function isBetween(v: number, [min, max]: number[]) {
  return min < v && v < max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
export function between(v: number, [min, max]: number[]) {
  return Math.max(Math.min(v, max), min);
}
// 传入的所有参数类型全是number返回true，否则返回false
export function isNumber(...args: any[]) {
  return args.filter((a) => typeof a !== 'number').length === 0;
}
// 传入的a是函数，就返回函数执行结果，否则直接返回a
export function execute(a: any, ...args: any) {
  return typeof a === 'function' ? a(...args) : a;
}
// 渐变动画配置参数
export const easingOptions = {
  // swipe终点超出边界时，整体移动的transition配置
  swipeBounce: {
    duration: 400,
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (t: number) {
      return t * (2 - t);
    },
  },
  // swipe终点未超出边界时，整体移动的的transition配置
  swipe: {
    duration: 2500,
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t: number) {
      return 1 - --t * t * t * t;
    },
  },
  // swipe超出边界后归位的transition配置
  // 同时也是手指移动缩放超出边界后归位的配置（默认配置）
  bounce: {
    duration: 300,
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t: number) {
      return 1 - --t * t * t * t;
    },
  },
};
