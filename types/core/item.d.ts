import { Transition, type ITransitionOptions, type IAnimationExtendOptions } from '@huangjs888/transition';
import { Transform } from '@huangjs888/transform';
import { type IElement } from '@huangjs888/lightdom';
declare class ItemModel extends Transition {
    _dblAdjust: boolean;
    _dblScale: IDouble;
    _damping: IDamping[];
    _rotation: IRange;
    _scalation: IRange;
    _translation: IRange[];
    _sizePosition: ISizePosition & {
        elementWidth: number;
        elementHeight: number;
    };
    constructor({ sizePosition, dblAdjust, dblScale, damping, rotation, scalation, translation, transitionEl, ...transitionOption }?: IItemModelOption);
    reset(duration?: number): void;
    sizePosition(sizePosition?: ISizePosition): ISizePosition & {
        elementWidth: number;
        elementHeight: number;
    };
    setRotation(a?: IRange): void;
    getRotation(...args: any): any;
    setScalation(k?: IRange): void;
    getScalation(...args: any): any;
    setTranslation(xy?: IRange[]): void;
    getTranslation(k?: number, ...args: any): any[];
    setXTranslation(x?: IRange): void;
    getXTranslation(k?: number, ...args: any): any;
    setYTranslation(y?: IRange): void;
    getYTranslation(k?: number, ...args: any): any;
    setDblScale(k?: IDouble): void;
    getDblScale(...args: any): number;
    setDblAdjust(aj?: boolean): void;
    getDblAdjust(): boolean;
    isDamping(key: IDamping): boolean;
    setDamping(damping?: IDamping[]): void;
    rotate(a: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    rotateTo(a: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    scale(k: number, point?: number[]): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    scaleTo(k: number, point?: number[]): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translate(x: number, y: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translateTo(x: number, y: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translateX(x: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translateXTo(x: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translateY(y: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    translateYTo(y: number): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    transform(transform: Transform, point?: number[] | IAnimationExtendOptions, options?: IAnimationExtendOptions & {
        touching?: boolean;
    }): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    transformTo(transform: Transform, point?: number[] | (IAnimationExtendOptions & {
        touching?: boolean;
    }), options?: IAnimationExtendOptions & {
        touching?: boolean;
    }): Promise<import("@huangjs888/transition").ICSSLikeStyle>;
    computeOffset(point: number[], k: number, adjust?: boolean): number[];
    moveBounce(touching: boolean, angle: number, scale: number, deltaX: number, deltaY: number, point?: number[]): void;
    resetBounce(touching: boolean, point?: number[], cancel?: boolean): void;
    dblScale(touching: boolean, point?: number[]): void;
    swipeBounce(touching: boolean, duration: number, stretch: number, key: 'x' | 'y', transition?: (key: 'x' | 'y', xySwipe: number, xyBounce: number, option: (v: number) => IAnimationExtendOptions) => void): void;
}
export type IDamping = 'rotate' | 'scale' | 'translate';
export type ISizePosition = {
    containerCenter: number[];
    containerWidth: number;
    containerHeight: number;
    naturalWidth: number;
    naturalHeight: number;
};
export type IRange = number[] | void | ((...args: any) => number[] | void);
export type IDouble = number | void | ((...args: any) => number | void);
export type IItemModelOption = {
    sizePosition?: ISizePosition;
    dblAdjust?: boolean;
    dblScale?: IDouble;
    damping?: IDamping[];
    scalation?: IRange;
    translation?: IRange[];
    rotation?: IRange;
} & ITransitionOptions & {
    transitionEl?: IElement;
};
export default ItemModel;
