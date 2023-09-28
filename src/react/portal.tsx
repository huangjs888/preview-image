/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-20 17:03:40
 * @Description: ******
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM, useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { getScrollBarSize, isBodyOverflowing } from '../modules/lightdom';

function getContainer(container?: IContainer) {
  if (container === false) {
    return false;
  }
  if (!canUseDOM()) {
    return null;
  }
  let _container: any = container;
  if (typeof container === 'string') {
    _container = document.querySelector(container);
  }
  if (typeof container === 'function') {
    _container = container();
  }
  return _container || null;
}

type IElement = Element | DocumentFragment | null;

export type IContainer = false | string | IElement | (() => IElement);

export type IPortalProps = {
  container?: IContainer;
  lockOverflow?: boolean;
  destroy?: boolean;
  children?: React.ReactNode;
};

export default ({ container, destroy, lockOverflow, children }: IPortalProps) => {
  const [specifyEle, setSpecifyEle] = React.useState<IElement | null | false>(() =>
    getContainer(container),
  );
  const [defalutEle] = React.useState<IElement | null>(() => {
    if (!canUseDOM()) {
      return null;
    }
    return document.createElement('div');
  });

  useIsomorphicLayoutEffect(() => setSpecifyEle(getContainer(container)), [container]);

  const defaultEleRender = !destroy && specifyEle === null;
  useIsomorphicLayoutEffect(() => {
    if (defaultEleRender) {
      defalutEle && document.body.appendChild(defalutEle);
    } else {
      defalutEle?.parentElement?.removeChild(defalutEle);
    }
    return () => {
      defalutEle?.parentElement?.removeChild(defalutEle);
    };
  }, [defalutEle, defaultEleRender]);

  const finalEle = specifyEle ?? defalutEle;
  const lock =
    lockOverflow && canUseDOM() && (finalEle === defalutEle || finalEle === document.body);
  const overflowRef = React.useRef<string>('');
  useIsomorphicLayoutEffect(() => {
    const body = document.body;
    const html = body.parentElement;
    if (lock) {
      const isOverflow = isBodyOverflowing();
      const scrollbarSize = getScrollBarSize(body).width;
      const width = isOverflow ? `calc(100% - ${scrollbarSize}px)` : '';
      const overflow = [];
      overflow[0] = body.style.overflow;
      body.style.overflow = 'hidden';
      overflow[1] = body.style.width;
      body.style.width = width;
      if (html) {
        overflow[2] = html.style.overflow;
        html.style.overflow = 'hidden';
        overflow[3] = html.style.width;
        html.style.width = width;
      }
      overflowRef.current = overflow.join('-');
    } else {
      const overflow = overflowRef.current.split('-');
      overflowRef.current = '';
      body.style.overflow = overflow[0];
      body.style.width = overflow[1];
      if (html) {
        html.style.overflow = overflow[2];
        html.style.width = overflow[3];
      }
    }
    return () => {
      const overflow = overflowRef.current.split('-');
      overflowRef.current = '';
      body.style.overflow = overflow[0];
      body.style.width = overflow[1];
      if (html) {
        html.style.overflow = overflow[2];
        html.style.width = overflow[3];
      }
    };
  }, [lock]);

  if (destroy || !canUseDOM() || finalEle === null) {
    return null;
  }
  return (
    <React.Fragment>
      {finalEle === false ? children : ReactDOM.createPortal(children, finalEle)}
    </React.Fragment>
  );
};
