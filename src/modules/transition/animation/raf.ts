/*
 * @Author: Huangjs
 * @Date: 2023-08-23 17:02:10
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-01 15:18:11
 * @Description: ******
 */

const root: any = typeof window === 'undefined' ? global : window;
const vendors = ['moz', 'webkit'];
let raf = root.requestAnimationFrame;
let caf = root.cancelAnimationFrame || root.cancelRequestAnimationFrame;
if (!raf || !caf) {
  for (var i = 0; i < vendors.length; i++) {
    raf = root[`${vendors[i]}RequestAnimationFrame`];
    caf =
      root[`${vendors[i]}CancelAnimationFrame`] || root[`${vendors[i]}CancelRequestAnimationFrame`];
  }
}
if (!raf || !caf) {
  raf = (function () {
    let last = 0;
    // setTimeout时间并不精确，这里做了校准
    return function (fn: () => void) {
      const now = Date.now();
      const delay = Math.max(0, 16 - (now - last));
      last = now + delay;
      return window.setTimeout(fn, delay);
    };
  })();
  caf = function (id: number) {
    return window.clearTimeout(id);
  };
}

export const requestAnimationFrame = raf;
export const cancelAnimationFrame = caf;
