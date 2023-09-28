/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 15:31:35
 * @Description: ******
 */

import React from 'react';

export function useChanged<T>(
  value: T,
  compare = (prev: T | void, next: T) => prev !== next,
): boolean {
  const propsRef = React.useRef<T>(value);
  const changed = compare(propsRef.current, value);
  if (changed) {
    propsRef.current = value;
  }
  return changed;
}
