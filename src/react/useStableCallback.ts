/*
 * @Author: Huangjs
 * @Date: 2023-08-24 16:40:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-08 10:22:12
 * @Description: ******
 */

import React from 'react';

// 父组件传来的callback不断变化，但是最返回的callback是始终不变的，防止因为父组件传来的callback变化增加不必需要的渲染
export function useStableCallback<T extends Function>(callback: T) {
  const callbackRef = React.useRef<T>(callback);
  callbackRef.current = callback;
  return React.useCallback((...args: any) => callbackRef.current(...args), []);
}
