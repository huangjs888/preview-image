/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-23 16:55:13
 * @Description: ******
 */

// 对于函数 s = f(t)
// 函数平移(x,y)（函数自变量t变为t-x，整体结果f(t)+y）
// 函数缩放 k 倍（函数自变量t变为t/k，整体结果f(t)*k）
// 先平移再缩放：s = (f((t/k)-x)+y)*k
// 先缩放再平移：s = (f((t-x)/k)*k)+y

export type EaseFn = (t: number) => number;

const baseEase: { [key in string]: EaseFn } = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - (1 - t) * (1 - t) * (1 - t),
  inQuart: (t) => t * t * t * t,
  outQuart: (t) => 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t),
  inQuint: (t) => t * t * t * t * t,
  outQuint: (t) => 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t),
};
// 取值easeFn函数变量的某一段转成easing函数，a为开始变量值，b为结束变量值
export function createEase(a: number = 0, b: number = 1, easeFn: EaseFn = baseEase.linear): EaseFn {
  const k = 1 / (b - a);
  if (!k || k <= 0) {
    return () => 0;
  }
  // easeFn先平移( -a , -easeFn(a) )，再缩放 k 倍
  // 接着使函数值也在(0,1)之间，即：经上述变换之后的函数，另变量为1，求函数值，函数再除以该函数值得到最终的函数
  return (t: number) =>
    ((easeFn(t / k + a) - easeFn(a)) * k) / ((easeFn(1 / k + a) - easeFn(a)) * k);
}
// 把两个easing函数连接转成新的easing函数，k为比例
export function createEaseInOut(
  k: number = 1 / 2,
  easeIn: EaseFn = baseEase.linear,
  easeOut: EaseFn = baseEase.linear,
): EaseFn {
  if (k <= 0) {
    return easeOut;
  }
  if (k >= 1) {
    return easeIn;
  }
  return (t: number) =>
    t <= k
      ? // easeIn直接缩放k
        easeIn(t / k) * k
      : // easeOut衔接easeIn，需要先平移( k/(1-k) , k/(1-k) )，再缩放 1-k
        (easeOut(t / (1 - k) - k / (1 - k)) + k / (1 - k)) * (1 - k);
}
const easeInOutQuad = createEaseInOut(1 / 2, baseEase.outQuad, baseEase.inQuad);
const easeOutInQuad = createEaseInOut(1 / 2, baseEase.inQuad, baseEase.outQuad);
const easeOutQuad = baseEase.outQuad;
const easeOutQuart = baseEase.outQuart;

export { easeInOutQuad, easeOutInQuad, easeOutQuad, easeOutQuart };
