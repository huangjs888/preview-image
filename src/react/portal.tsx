/*
 * @Author: Huangjs
 * @Date: 2023-08-08 16:47:13
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-11 14:51:33
 * @Description: ******
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM, useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { preventDefault } from '../utils';

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
  prevent?: boolean;
  destroy?: boolean;
  children?: React.ReactNode;
};

export default ({ container, destroy, prevent, children }: IPortalProps) => {
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
  const innerPrevent =
    prevent && canUseDOM() && (finalEle === defalutEle || finalEle === document.body);
  // const overflowRef = React.useRef<string>('');
  useIsomorphicLayoutEffect(() => {
    // Chrome 73之后，所有绑定在根节点（window,document,body）的scroll,wheel,mobile touch事件都会默认passive为true
    // 这就会导致事件内调用e.preventDefault()无效，还会报错：Unable to preventDefault inside passive event listener invocation.
    // 这里设置为false，并注册事件达到关闭浏览器的右键菜单，选择，滚动，缩放等默认行为
    // 阻止滚动行为，也可以统一在html和body标签上加入overflow：hidden
    // const body = document.body;
    // const html = body.parentElement;
    if (innerPrevent) {
      // 阻止web端右键菜单行为
      window.addEventListener('contextmenu', preventDefault, { capture: false, passive: false });
      // 阻止移动端长按菜单，滚动，缩放，选择等行为
      window.addEventListener('touchstart', preventDefault, { capture: false, passive: false });
      // 阻止web端滚动行为
      window.addEventListener('wheel', preventDefault, { capture: false, passive: false });
      // 阻止web端选择行为
      window.addEventListener('dragstart', preventDefault, {
        capture: false,
        passive: false,
      });
      // 阻止web端选择行为
      if ('onselectstart' in window.document.documentElement) {
        // capture为true使其为捕获阶段就执行
        window.addEventListener('selectstart', preventDefault, {
          capture: false,
          passive: false,
        });
      }
      /* const overflow = [];
      overflow[0] = body.style.overflow;
      body.style.overflow = 'hidden';
      if (html) {
        overflow[1] = html.style.overflow;
        html.style.overflow = 'hidden';
      }
      overflowRef.current = overflow.join('-'); */
    } else {
      window.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('touchstart', preventDefault);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('dragstart', preventDefault);
      if ('onselectstart' in window.document.documentElement) {
        window.removeEventListener('selectstart', preventDefault);
      }
      /* const overflow = overflowRef.current.split('-');
      overflowRef.current = '';
      body.style.overflow = overflow[0];
      if (html) {
        html.style.overflow = overflow[1];
      } */
    }
    return () => {
      window.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('touchstart', preventDefault);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('dragstart', preventDefault);
      if ('onselectstart' in window.document.documentElement) {
        window.removeEventListener('selectstart', preventDefault);
      }
      /* const overflow = overflowRef.current.split('-');
      overflowRef.current = '';
      body.style.overflow = overflow[0];
      if (html) {
        html.style.overflow = overflow[1];
      } */
    };
  }, [innerPrevent]);

  if (destroy || !canUseDOM() || finalEle === null) {
    return null;
  }
  return (
    <React.Fragment>
      {finalEle === false ? children : ReactDOM.createPortal(children, finalEle)}
    </React.Fragment>
  );
};
