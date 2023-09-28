/*
 * @Author: Huangjs
 * @Date: 2023-08-24 16:40:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-24 16:40:43
 * @Description: ******
 */

import React from 'react';

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
);

export const useIsomorphicLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;
