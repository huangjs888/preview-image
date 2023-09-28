/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-04 14:42:32
 * @Description: ******
 */

import Value from './value';
import { type ICSSValue, type ICSSProperties, type ICSSOptionProperties } from '.';

export function delta(
  startCSSProperties: ICSSProperties,
  endCSSProperties: ICSSProperties,
): ICSSProperties {
  const finalCSSProperties: ICSSProperties = {};
  Object.keys(startCSSProperties).forEach((name) => {
    const startCSSValue = startCSSProperties[name].value;
    const { value: endCSSValue, precision, ...restItem } = endCSSProperties[name];
    let deltaCSSValue: ICSSValue | null = null;
    Object.keys(startCSSValue).forEach((key) => {
      const deltaValue = endCSSValue[key] - startCSSValue[key];
      if (Math.abs(deltaValue) > (precision[key] || 0)) {
        if (!deltaCSSValue) {
          deltaCSSValue = {};
        }
        deltaCSSValue[key] = deltaValue;
      }
    });
    if (deltaCSSValue) {
      finalCSSProperties[name] = { value: deltaCSSValue, precision, ...restItem };
    }
  });
  return finalCSSProperties;
}
export function union(
  oldCSSProperties: ICSSProperties,
  newCSSProperties: ICSSOptionProperties,
): ICSSProperties {
  const finalCSSProperties: ICSSProperties = {
    ...oldCSSProperties,
  };
  if (newCSSProperties instanceof Value) {
    const oldCSSName = Object.keys(oldCSSProperties)[0];
    if (oldCSSName) {
      const oldCSSValue = oldCSSProperties[oldCSSName];
      const newCSSValue = newCSSProperties.toRaw();
      finalCSSProperties[oldCSSName] = {
        ...oldCSSValue,
        ...newCSSValue,
        value: {
          ...oldCSSValue.value,
          ...newCSSValue.value,
        },
      };
    }
  } else {
    Object.keys(newCSSProperties).forEach((name) => {
      const oldCSSValue = oldCSSProperties[name];
      const newCSSValue = newCSSProperties[name].toRaw();
      if (oldCSSValue) {
        finalCSSProperties[name] = {
          ...oldCSSValue,
          ...newCSSValue,
          value: {
            ...oldCSSValue.value,
            ...newCSSValue.value,
          },
        };
      } else {
        finalCSSProperties[name] = {
          transform: (v) =>
            Object.keys(v)
              .map((k) => v[k])
              .join(' '),
          precision: {},
          ...newCSSValue,
        };
      }
    });
  }
  return finalCSSProperties;
}
