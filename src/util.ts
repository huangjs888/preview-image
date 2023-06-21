/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-06-20 10:49:25
 * @Description: ******
 */

export function fixOption(
  value: number | undefined,
  defaultValue: number,
  minVal: number,
) {
  return typeof value !== 'number' || value < minVal ? defaultValue : value;
}

export function isTouchable(ele: HTMLElement) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}

export function getDistance([x0, y0]: number[], [x1, y1]: number[]) {
  if (
    typeof x0 === 'number' &&
    typeof x1 === 'number' &&
    typeof y0 === 'number' &&
    typeof y1 === 'number'
  ) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }
  return 0;
}

export function getAngle([x0, y0]: number[], [x1, y1]: number[]) {
  if (
    typeof x0 === 'number' &&
    typeof x1 === 'number' &&
    typeof y0 === 'number' &&
    typeof y1 === 'number'
  ) {
    return (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  }
  return 0;
}

export function getCenter([x0, y0]: number[], [x1, y1]: number[]) {
  const ok0 = typeof x0 === 'number' && typeof y0 === 'number';
  const ok1 = typeof x1 === 'number' && typeof y1 === 'number';
  return !ok0 && !ok1
    ? [0, 0]
    : ok0 && !ok1
    ? [x0, y0]
    : !ok0 && ok1
    ? [x1, y1]
    : [(x0 + x1) / 2, (y0 + y1) / 2];
}

export function getDirection([x0, y0]: number[], [x1, y1]: number[]) {
  if (
    typeof x0 === 'number' &&
    typeof x1 === 'number' &&
    typeof y0 === 'number' &&
    typeof y1 === 'number'
  ) {
    const x = x0 - x1;
    const y = y0 - y1;
    if (x !== y) {
      return Math.abs(x) >= Math.abs(y)
        ? x0 - x1 > 0
          ? 'Left'
          : 'Right'
        : y0 - y1 > 0
        ? 'Up'
        : 'Down';
    }
  }
  return 'None';
}

export function getVelocity(deltaTime: number, distance: number) {
  if (
    typeof distance !== 'number' ||
    distance === 0 ||
    typeof deltaTime !== 'number' ||
    deltaTime === 0
  ) {
    return 0;
  }
  return distance / deltaTime;
}

//根据数值，与水平夹角，计算x和y的分量值
export function getVector(value: number, angle: number) {
  if (typeof value !== 'number' || typeof angle !== 'number') {
    return [0, 0];
  }
  const rad = (angle * Math.PI) / 180;
  return [value * Math.cos(rad), value * Math.sin(rad)];
}
