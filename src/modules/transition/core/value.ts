/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-06 15:57:42
 * @Description: ******
 */

import { type ICSSValue } from './index';

export default class Value {
  value: ICSSValue; // 传入css属性值，对象或值的形式
  precision?: ICSSValue; // 传入精度，与value对应
  transform?: (v: ICSSValue) => string; // 传入实现该value转变为style的字符串方法
  constructor(
    value: number | ICSSValue,
    precision?: number | ICSSValue,
    transform?: (v: ICSSValue) => string,
  ) {
    const _value = (this.value = typeof value === 'number' ? { default: value } : value);
    if (typeof precision === 'number') {
      const _precision: ICSSValue = {};
      Object.keys(_value).forEach((k) => {
        _precision[k] = precision || 0;
      });
      this.precision = _precision;
    } else if (precision) {
      this.precision = precision;
    }
    if (typeof transform === 'function') {
      this.transform = transform;
    }
  }
  toRaw() {
    const raw: {
      value: ICSSValue;
      precision?: ICSSValue;
      transform?: (v: ICSSValue) => string;
    } = { value: this.value };
    if (this.precision) {
      raw.precision = this.precision;
    }
    if (this.transform) {
      raw.transform = this.transform;
    }
    return raw;
  }
}
