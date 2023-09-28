/*
 * @Author: Huangjs
 * @Date: 2023-08-24 16:40:36
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-20 14:29:15
 * @Description: ******
 */

import React from 'react';

export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export const useIsomorphicLayoutEffect = canUseDOM() ? React.useLayoutEffect : React.useEffect;
