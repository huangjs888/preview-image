/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-19 16:49:23
 * @Description: ******
 */

// 阻尼函数
function bounce(x: number, max: number) {
  let y = Math.abs(x);
  y = (0.82231 * max) / (1 + 4338.47 / Math.pow(y, 1.14791));
  return Math.round(x < 0 ? -y : y);
}
function bounce2(value: number, friction: number, inverse: boolean = false) {
  if (value === 0) {
    return 0;
  }
  if (friction <= 0) {
    return 1;
  }
  const v = value || 1;
  let f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return (Math.pow(Math.abs(v), f) * v) / Math.abs(v);
}

export function adjustAngle(
  value: number,
  [min, max]: number[],
  damping: boolean,
) {
  return damping ? 0 : Math.max(Math.min(value, max), min);
}
export function adjustScale(
  value: number,
  [min, max]: number[],
  damping: boolean,
) {
  let newVal = value;
  if (value < min) {
    newVal = min * (damping ? bounce2(value / min, 0.4) : 1);
  } else if (value > max) {
    newVal = max * (damping ? bounce2(value / max, 0.4) : 1);
  }
  return newVal;
}
export function adjustXY(
  value: number,
  [min, max]: number[],
  damping: boolean,
) {
  let newVal = value;
  if (value < min) {
    newVal = min + (damping ? bounce2(value - min, 0.8) : 0);
  } else if (value > max) {
    newVal = max + (damping ? bounce2(value - max, 0.8) : 0);
  }
  return newVal;
}

// value是offset值，max是点在target边界上时的offset值，threshold是点max减去分界点的offset值，0 <= threshold <= max
export function adjustOffset(value: number, threshold: number, max: number) {
  let newVal = Math.abs(value);
  const k = threshold / max;
  if (newVal < 2 * max && newVal > max + threshold) {
    newVal = (newVal - k * 2 * max) / (1 - k);
  } else if (newVal > max - threshold) {
    newVal = max;
  } else {
    newVal = newVal / (1 - k);
  }
  return newVal * (value > 0 ? 1 : -1);
}
export function adjustSwipeXY(
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
  return newVal;
}

export const checkScale = (k?: number) => typeof k === 'number' && k > 0;
export const isBetween = (x: number, [min, max]: number[]) =>
  min < x && x < max;
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
    duration: 2000,
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
