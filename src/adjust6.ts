/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-22 15:36:17
 * @Description: ******
 */

function bounce(value: number, friction: number, inverse: boolean = false) {
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
export function adjustAngle(
  damping: boolean,
  [min, max]: number[],
  value: number,
  delta: number = 0,
) {
  if (min === 0 && max === 0) {
    return 0;
  }
  if (damping) {
    let newVal = value;
    if (value < min) {
      newVal = min + bounce(value - min, 0.8, true);
    } else if (value > max) {
      newVal = max + bounce(value - max, 0.8, true);
    }
    // 恢复后加上delta部分
    newVal += delta;
    // 最终总体上再进行damping
    if (newVal < min) {
      newVal = min + bounce(newVal - min, 0.8);
    } else if (newVal > max) {
      newVal = max + bounce(newVal - max, 0.8);
    }
    return newVal;
  }
  // 如果是非damping，即使value还有已经被damping的部分，依然是在[min, max]之外的，最终是被切掉的，所以无需考虑恢复damping部分
  return Math.max(Math.min(value + delta, max), min);
}
export function adjustScale(
  damping: boolean,
  [min, max]: number[],
  value: number,
  delta: number = 1,
) {
  if (damping) {
    let newVal = value;
    // 注意：如果传入的value在[min, max]之外，且不包含damping部分，
    // 在调用方法之前，应该将其拆分，value传入边界值，多余的部分放在delta里
    // 默认value在[min, max]之外，多的部分一定是damping过的
    // value部分含有damping过的值，恢复damping部分
    if (value < min) {
      newVal = min * bounce(value / min, 0.4, true);
    } else if (value > max) {
      newVal = max * bounce(value / max, 0.4, true);
    }
    // 恢复后加上delta部分
    newVal *= delta;
    // 最终总体上再进行damping
    if (newVal < min) {
      newVal = min * bounce(newVal / min, 0.4);
    } else if (newVal > max) {
      newVal = max * bounce(newVal / max, 0.4);
    }
    return newVal;
  }
  // 如果是非damping，即使value还有已经被damping的部分，依然是在[min, max]之外的，最终是被切掉的，所以无需考虑恢复damping部分
  return Math.max(Math.min(value * delta, max), min);
}
export function adjustXY(
  damping: boolean,
  [min, max]: number[],
  value: number,
  delta: number = 0,
) {
  if (damping) {
    let newVal = value;
    // 注意：如果传入的value在[min, max]之外，且不包含damping部分，
    // 在调用方法之前，应该将其拆分，value传入边界值，多余的部分放在delta里
    // 默认value在[min, max]之外，多的部分一定是damping过的
    // value部分含有damping过的值，恢复damping部分
    if (value < min) {
      newVal = min + bounce(value - min, 0.8, true);
    } else if (value > max) {
      newVal = max + bounce(value - max, 0.8, true);
    }
    // 恢复后加上delta部分
    newVal += delta;
    // 最终总体上再进行damping
    if (newVal < min) {
      newVal = min + bounce(newVal - min, 0.8);
    } else if (newVal > max) {
      newVal = max + bounce(newVal - max, 0.8);
    }
    return Math.round(newVal);
  }
  // 如果是非damping，即使value还有已经被damping的部分，依然是在[min, max]之外的，最终是被切掉的，所以无需考虑恢复damping部分
  return Math.max(Math.min(Math.round(value + delta), max), min);
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
  return Math.round(newVal);
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
