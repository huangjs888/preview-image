/*
 * @Author: Huangjs
 * @Date: 2023-08-18 10:01:01
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 10:33:22
 * @Description: ******
 */

import { setStyle } from './dom';
export function popupTransform(backdrop, wrapper, element, duration = 0) {
  if (backdrop.el) {
    if (wrapper.el) {
      const {
        el: _el,
        x,
        y,
        k
      } = wrapper;
      setStyle(_el, {
        overflow: 'visible',
        transform: `translate(${x || 0}px,${y || 0}px) scale(${k || 0.01})`,
        transition: duration > 0 ? `transform ${duration}ms` : ''
      });
    }
    if (element.el) {
      const {
        el: _el2,
        w,
        h
      } = element;
      setStyle(_el2, {
        width: w || 0,
        height: h || 0,
        objectFit: 'cover',
        transition: duration > 0 ? `width ${duration}ms, height ${duration}ms` : ''
      });
    }
    const {
      el,
      o
    } = backdrop;
    setStyle(el, {
      opacity: o || 0,
      transition: duration > 0 ? `opacity ${duration}ms` : ''
    });
    if (duration > 0) {
      return new Promise(resolve => {
        el.ontransitionend = e => {
          // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
          if (e.target === el && e.propertyName === 'opacity') {
            el.ontransitionend = null;
            if (wrapper.el) {
              setStyle(wrapper.el, {
                overflow: 'hidden',
                transition: ''
              });
            }
            if (element.el) {
              setStyle(element.el, {
                objectFit: '',
                transition: ''
              });
            }
            setStyle(el, {
              transition: ''
            });
            resolve();
          }
        };
      });
    }
  }
  return Promise.resolve();
}
export function popupComputedSize(originRect, continerRect, elementSize) {
  if (originRect && continerRect) {
    const {
      left: ol,
      top: ot,
      width: ow,
      height: oh
    } = originRect;
    const {
      left: rl,
      top: rt,
      width: rw,
      height: rh
    } = continerRect;
    const x = ol + ow / 2 - (rl + rw / 2);
    const y = ot + oh / 2 - (rt + rh / 2);
    let ew = rw;
    let eh = rh;
    if (elementSize) {
      ew = elementSize.width;
      eh = elementSize.height;
    }
    const rat = ew / eh > ow / oh;
    const k = rat ? oh / eh : ow / ew;
    const w = rat ? eh * (ow / oh) : ew;
    const h = rat ? eh : ew / (ow / oh);
    return {
      x,
      y,
      k,
      w,
      h
    };
  }
  return {
    x: 0,
    y: 0,
    k: 0.01,
    w: 0,
    h: 0
  };
}