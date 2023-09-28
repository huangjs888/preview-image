import React from 'react';
import Core, { type ICSSLikeStyle, type ICSSOptionProperties, type IAnimationExtendOptions } from '../core';
export type ITransitionRef = {
    findDOMElement: () => Element | null | undefined;
    getInstance: () => Core | null | undefined;
};
export type ITransitionProps = {
    cssProperties?: ICSSOptionProperties;
    extendOptions?: IAnimationExtendOptions;
    transitionEnd?: (v: ICSSLikeStyle) => void;
    cancel?: boolean | {
        end?: boolean;
        count?: (v: number) => void;
    };
    children?: React.ReactNode;
};
declare const _default: React.ForwardRefExoticComponent<ITransitionProps & React.RefAttributes<ITransitionRef>>;
export default _default;
