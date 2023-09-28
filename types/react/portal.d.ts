import React from 'react';
type IElement = Element | DocumentFragment | null;
export type IContainer = false | string | IElement | (() => IElement);
export type IPortalProps = {
    container?: IContainer;
    lockOverflow?: boolean;
    destroy?: boolean;
    children?: React.ReactNode;
};
declare const _default: ({ container, destroy, lockOverflow, children }: IPortalProps) => React.JSX.Element | null;
export default _default;
