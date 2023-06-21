/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-21 13:34:18
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
// 解决0.1+0.2不等于0.3的问题
export function fixDecimal(value: number, places: number = 15) {
  const multiple = Math.pow(10, places);
  return Math.round(value * multiple) / multiple;
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
// 传入的a是函数，就返回函数执行结果，否则直接返回a
export function execute(fn: any, ...args: any) {
  return typeof fn === 'function' ? fn(...args) : fn;
}
// 判断v是否在min和max之间
export function isBetween(v: number, [min, max]: number[]) {
  return min <= v && v <= max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
export function between(v: number, [min, max]: number[], _?: boolean) {
  return Math.max(Math.min(v, max), min);
}
// 跟随手指移动，旋转或缩放时的阻尼算法
export function performDamping(
  v: number,
  [min, max]: number[],
  k: boolean = false, // 是否使用积计算（主要是缩放情况），否则使用和算法
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
  k: boolean = false, // 是否使用积计算（主要是缩放情况），否则使用和算法
) {
  if (v < min || v > max) {
    const m = v < min ? min : max;
    return k ? m * damping(v / m, 0.4, true) : m + damping(v - m, 0.8, true);
  }
  return v;
}
export function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}
export function easeOutQuart(t: number) {
  return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
}
