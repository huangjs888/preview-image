/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 16:58:10
 * @Description: ******
 */

import { loadingIcon, errorIcon } from './svgIcon';

const autoPxReg =
  /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
export function setStyle(
  ele: HTMLElement,
  css: { [key: string]: string | number | undefined },
) {
  if (ele) {
    Object.keys(css).forEach((k: string) => {
      if (typeof css[k] === 'undefined') {
        return;
      }
      const key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      const val =
        typeof css[k] === 'number' &&
        /^[a-z]/.test(key) &&
        autoPxReg.test(`-${key}`)
          ? `${css[k]}px`
          : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
}

export function createContainer(element?: HTMLElement | string) {
  let ele: HTMLElement | null | undefined;
  try {
    if (typeof element === 'string') {
      ele = document.querySelector(element) as HTMLElement;
    } else {
      ele = element;
    }
  } catch (e) {
    ele = null;
  }
  if (!ele || !(ele instanceof HTMLElement)) {
    ele = setStyle(document.createElement('div'), {
      position: 'fixed',
      left: '0px',
      top: '0px',
      zIndex: '9999',
      width: '100%',
      height: '100%',
      background: 'black',
      overflow: 'hidden',
      display: 'none',
    });
    document.body.appendChild(ele);
  } else {
    setStyle(ele, {
      display: 'none',
    });
    ele.innerHTML = '';
  }
  return ele;
}

export function createContent(isVertical: boolean, element: HTMLElement) {
  const contentEl = setStyle(document.createElement('div'), {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
  });
  element.appendChild(contentEl);
  return contentEl;
}

export function createIndicator(
  isVertical: boolean,
  hasIndicator: boolean,
  element: HTMLElement,
) {
  let indicator = null;
  if (hasIndicator) {
    indicator = setStyle(document.createElement('div'), {
      position: 'absolute',
      bottom: isVertical ? '0px' : '16px',
      right: isVertical ? '16px' : 'auto',
      width: isVertical ? 'auto' : '100%',
      height: isVertical ? '100%' : 'auto',
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
    });
    element.appendChild(indicator);
  }
  return indicator;
}

export function createIndicatorItem(
  isVertical: boolean,
  element: HTMLElement | null,
) {
  let item = null;
  if (element) {
    item = setStyle(document.createElement('span'), {
      borderRadius: '100%',
      width: 7,
      height: 7,
      display: 'inline-block',
      margin: isVertical ? '5px 0' : '0 5px',
      background: '#fff',
      opacity: 0.6,
    });
    element.appendChild(item);
  }
  return item;
}

export function createWrapper(
  isFirst: boolean,
  isVertical: boolean,
  hasLoading: boolean,
  itemGap: number,
  element: HTMLElement,
) {
  const wrapper = setStyle(document.createElement('div'), {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
    marginTop: isVertical && !isFirst ? itemGap : 0,
    marginLeft: isVertical || isFirst ? 0 : itemGap,
  });
  if (hasLoading) {
    const loading = setStyle(document.createElement('span'), {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -16,
      marginLeft: -16,
      width: 32,
      height: 32,
      display: 'inline-block',
    });
    loading.innerHTML = loadingIcon;
    wrapper.appendChild(loading);
  }
  element.appendChild(wrapper);

  return wrapper;
}

export function createError(element: HTMLElement) {
  const error = setStyle(document.createElement('div'), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%,-50%,0)',
    width: '100%',
    color: '#fff',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.88,
  });
  error.innerHTML = `
    <span style="width: 72px;height: 72px;">
      ${errorIcon}
    </span>
    <span style="margin-top:16px;">图片加载失败</span>
  `;
  element.appendChild(error);
}
