/*
 * @Author: Huangjs
 * @Date: 2023-08-24 16:40:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-07 13:16:35
 * @Description: ******
 */

import React from 'react';

// 父组件传来的数据不断变化，但是最返回的包装数据是始终不变的，防止因为父组件传来的数据变化增加不必需要的渲染
export function useStableMemo<T>(data: T) {
  const dataRef = React.useRef<{ data: T }>({ data });
  dataRef.current.data = data;
  return React.useMemo(() => dataRef.current, []);
}
