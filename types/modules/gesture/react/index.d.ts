import React from 'react';
import Core, { type IGestureOptions, type IGestureEvent } from '../core';
export type IGestureRef = {
    findDOMElement: () => Element | null | undefined;
    getInstance: () => Core | null | undefined;
};
export type IHandler = ((e: IGestureEvent) => void) | null;
export type IGestureHandler = {
    onPan?: IHandler;
    onTap?: IHandler;
    onSwipe?: IHandler;
    onSingleTap?: IHandler;
    onLongTap?: IHandler;
    onDoubleTap?: IHandler;
    onMultiPan?: IHandler;
    onScale?: IHandler;
    onRotate?: IHandler;
    onPointerStart?: IHandler;
    onPointerMove?: IHandler;
    onPointerEnd?: IHandler;
    onPointerCancel?: IHandler;
    onGestureStart?: IHandler;
    onGestureMove?: IHandler;
    onGestureEnd?: IHandler;
};
export type IGestureProps = {
    preventAllTap?: boolean;
    options?: IGestureOptions;
    children?: React.ReactNode;
} & IGestureHandler;
declare const _default: React.ForwardRefExoticComponent<{
    preventAllTap?: boolean | undefined;
    options?: IGestureOptions | undefined;
    children?: React.ReactNode;
} & IGestureHandler & React.RefAttributes<IGestureRef>>;
export default _default;
