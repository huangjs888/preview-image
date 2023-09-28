/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-28 09:36:43
 * @Description: ******
 */

let cached: number;
function measureScrollBarSize(fresh?: boolean) {
  if (typeof document === 'undefined') {
    return 0;
  }
  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';
    const outer = document.createElement('div');
    const outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.top = '0';
    outerStyle.left = '0';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';
    outer.appendChild(inner);
    document.body.appendChild(outer);
    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;
    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }
    document.body.removeChild(outer);
    cached = widthContained - widthScroll;
  }
  return cached;
}
function ensureSize(str: string) {
  const match = str.match(/^(.*)px$/);
  const value = Number(match?.[1]);
  return Number.isNaN(value) ? measureScrollBarSize() : value;
}
export function getScrollBarSize(target: Element | boolean) {
  if (typeof target === 'boolean') {
    const size = measureScrollBarSize(target);
    return {
      width: size,
      height: size,
    };
  }
  if (typeof document === 'undefined' || !target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }
  const { width, height } = getComputedStyle(target, '::-webkit-scrollbar');
  return {
    width: ensureSize(width),
    height: ensureSize(height),
  };
}

export function isBodyOverflowing() {
  return (
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth
  );
}

export function cssInject(id: string, cssText: string) {
  let style = document.querySelector(`#${id}`);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    style.appendChild(document.createTextNode(cssText));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
  }
}

export type ICSSStyle = { [key: string]: string | number | undefined };
const autoPxReg =
  /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
export function setStyle(el?: Element | null, style?: ICSSStyle) {
  if (el && style) {
    let cssText = '';
    Object.keys(style).forEach((key: string) => {
      // 转连字符
      const name = key.replace(/([A-Z])/g, '-$1').toLocaleLowerCase();
      // 转驼峰
      // const key = name.replace(/-(.?)/g, (t) => t.replace('-', '').toLocaleUpperCase());
      const value = style[key];
      if (value || value === 0) {
        const suffix =
          typeof value === 'number' && /^[a-z]/.test(name) && autoPxReg.test(`-${name}`)
            ? 'px'
            : '';
        cssText += `${name}: ${value}${suffix};`;
      } else {
        (el as HTMLElement | SVGElement).style.removeProperty(name);
      }
    });
    (el as HTMLElement | SVGElement).style.cssText += cssText;
  }
  return el;
}

export function hasClass(el?: Element | null, className?: string) {
  if (el && className) {
    return el.classList.contains(className);
  }
  return false;
}

export function addClass(el?: Element | null, className?: string | string[]) {
  if (el && className) {
    (Array.isArray(className) ? className : className.split(' ')).forEach(
      (c) => c && el.classList.add(c),
    );
  }
  return el;
}

export function removeClass(el?: Element | null, className?: string | string[]) {
  if (el && className) {
    (Array.isArray(className) ? className : className.split(' ')).forEach(
      (c) => c && el.classList.remove(c),
    );
  }
  return el;
}

export type IElement = string | Element | (() => Element | null | undefined) | null | undefined;

export function getElement(container?: IElement) {
  let _container: any = container;
  if (typeof container === 'string') {
    _container = document.querySelector(container);
  }
  if (typeof container === 'function') {
    _container = container();
  }
  return (_container || null) as Element | null;
}
type IChildren = string | number | boolean | null | undefined | Element;
type IProps = {
  className?: string | string[];
  style?: ICSSStyle;
  attrs?: {
    [key: string]: string;
  };
};
export function createElement(
  type?: string | IProps,
  props?: IProps | IChildren | IChildren[],
  children?: IChildren | IChildren[] | IElement,
  parent?: Element,
) {
  let _type: string;
  let _props: IProps;
  let _children: IChildren[];
  let _parent: IElement;
  if (typeof type === 'string') {
    _type = type;
    _props = (props || {}) as IProps;
    _children = (Array.isArray(children) ? children : [children]) as IChildren[];
    _parent = parent as IElement;
  } else {
    // 没有type的情况，参数向前推一个位置
    _type = 'div';
    _props = type || {};
    _children = (Array.isArray(props) ? props : [props]) as IChildren[];
    _parent = children as IElement;
  }
  const element = setStyle(
    addClass(document.createElement(_type), _props.className),
    _props.style,
  ) as Element;
  const _attrs = _props.attrs || {};
  Object.keys(_attrs).forEach((key) => {
    if (key !== 'innerHTML' && key !== 'className' && key !== 'style' && key in element) {
      (element as any)[key] = _attrs[key];
    }
  });
  _children.forEach((child) => {
    if (child instanceof Element) {
      element?.appendChild(child);
    } else if (element && typeof child !== 'undefined' && child !== null) {
      element.innerHTML = String(child);
    }
  });
  getElement(_parent)?.appendChild(element);
  return element;
}

export function getBBox(element?: Element | null) {
  if (element) {
    const { left, top, width, height } = element.getBoundingClientRect();
    return { left, top, width, height };
  }
  return { left: 0, top: 0, width: 0, height: 0 };
}
