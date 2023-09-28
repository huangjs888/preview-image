/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 15:35:55
 * @Description: ******
 */

import React from 'react';
import { useChanged } from './useChanged';

export function useForceUpdate() {
  const setState = React.useState({})[1];
  return React.useCallback(() => setState({}), [setState]);
}

type Updater<T> = (updater: T | ((origin: T) => T)) => void;
export function useDerivedState<T>(
  value: T | (() => T),
  useCompare = (prev: T, next: T) => (useChanged(next) ? next : prev),
): [T, Updater<T>] {
  const _value = typeof value === 'function' ? (value as () => T)() : value;
  const nowValueRef = React.useRef<T>(_value);
  nowValueRef.current = useCompare(nowValueRef.current, _value);
  const forceUpdate = useForceUpdate();
  const updateValue: Updater<T> = React.useCallback(
    (v) => {
      const val = typeof v === 'function' ? (v as (origin: T) => T)(nowValueRef.current) : v;
      // 是否需要比较？
      if (val !== nowValueRef.current) {
        nowValueRef.current = val;
        forceUpdate();
      }
    },
    [forceUpdate],
  );
  return [nowValueRef.current, updateValue];
}
