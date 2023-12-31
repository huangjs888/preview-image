/*
 * @Author: Huangjs
 * @Date: 2023-06-26 09:46:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-20 10:19:12
 * @Description: ******
 */

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
export function effectuate(fn: any, ...args: any) {
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

export function getSizePosition(element?: Element | null) {
  if (element) {
    const { left, top, width, height } = element.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2, w: width, h: height };
  }
  return { x: 0, y: 0, w: 0, h: 0 };
}

export function preventDefault(e: Event) {
  return e.preventDefault();
}

export function debounce(func: () => void, wait = 0) {
  // 缓存一个定时器id
  let timer: number = 0;
  return (...args: any) => {
    // 频繁每次调用，则清空定时器，忽略实际函数，然后开启新的计时器
    if (timer) clearTimeout(timer);
    // wait时间内没有再调用，则执行实际函数
    timer = +setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}
