/*
 * @Author: Huangjs
 * @Date: 2023-04-27 18:24:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-25 13:12:56
 * @Description: ******
 */

import Matrix from './matrix';

export type Type = 'a' | 'k' | 'x' | 'y';

export type Transform = {
  [key in Type]?: number;
};

export function each(
  transform: Transform,
  callback: (k: Type, v: number | undefined) => void | boolean,
) {
  const keys = Object.keys(transform);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i] as Type;
    if (callback(key, transform[key]) === false) {
      break;
    }
  }
}

export function matrix3d(transform: Transform): string {
  const { a = 0, k = 1, x = 0, y = 0 } = transform;
  const matrix = new Float32Array(16);
  Matrix.identity(matrix);
  Matrix.translate(matrix, x, y, 0);
  Matrix.scale(matrix, k, k, k);
  // 这里使用负值，实际matrix3d里负值为顺时针
  Matrix.rotate(matrix, -a, 0, 0, 1);
  return `matrix3d(${Array.prototype.slice.call(matrix).join(',')})`;
}

export function identity(): Transform {
  return {
    a: 0,
    k: 1,
    x: 0,
    y: 0,
  };
}
