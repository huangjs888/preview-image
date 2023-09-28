import Transition, { type ITransitionOptions, type IAnimationExtendOptions } from '../modules/transition';
import Transform from '../modules/transform';
import { type IElement } from '../modules/lightdom';
declare class ItemModel extends Transition {
    _dblAdjust: boolean;
    _dblScale: number | (() => number);
    _damping: IDamping[];
    _rotation: number[] | (() => number[]);
    _scalation: number[] | (() => number[]);
    _translation: (number[] | ((v: number) => number[]))[];
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
    setRotation(a?: number[]): void;
    getRotation(): any;
    setScalation(k?: number[]): void;
    getScalation(): any;
    setTranslation(xy?: number[][]): void;
    getTranslation(k?: number): any[];
    setXTranslation(x?: number[]): void;
    getXTranslation(k?: number): any;
    setYTranslation(y?: number[]): void;
    getYTranslation(k?: number): any;
    setDblScale(k?: number): void;
    getDblScale(): any;
    setDblAdjust(aj?: boolean): void;
    getDblAdjust(): boolean;
    isDamping(key: IDamping): boolean;
    setDamping(damping?: IDamping[]): void;
    rotate(a: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    rotateTo(a: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    scale(k: number, point?: number[]): Promise<import("../modules/transition").ICSSLikeStyle>;
    scaleTo(k: number, point?: number[]): Promise<import("../modules/transition").ICSSLikeStyle>;
    translate(x: number, y: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    translateTo(x: number, y: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    translateX(x: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    translateXTo(x: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    translateY(y: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    translateYTo(y: number): Promise<import("../modules/transition").ICSSLikeStyle>;
    transform(transform: Transform, point?: number[] | IAnimationExtendOptions, options?: IAnimationExtendOptions): Promise<import("../modules/transition").ICSSLikeStyle>;
    transformTo(transform: Transform, point?: number[] | IAnimationExtendOptions, options?: IAnimationExtendOptions): Promise<import("../modules/transition").ICSSLikeStyle>;
    computeOffset(point: number[], k: number, adjust?: boolean): number[];
    moveBounce(angle: number, scale: number, deltaX: number, deltaY: number, point?: number[]): void;
    resetBounce(point?: number[], cancel?: boolean): void;
    dblScale(point?: number[]): void;
    swipeBounce(duration: number, stretch: number, key: 'x' | 'y', transition?: (key: 'x' | 'y', xySwipe: number, xyBounce: number, option: (v: number) => IAnimationExtendOptions) => void): void;
}
export type IDamping = 'rotate' | 'scale' | 'translate';
export type ISizePosition = {
    containerCenter: number[];
    containerWidth: number;
    containerHeight: number;
    naturalWidth: number;
    naturalHeight: number;
};
export type IItemModelOption = {
    sizePosition?: ISizePosition;
    dblAdjust?: boolean;
    dblScale?: number;
    damping?: IDamping[];
    scalation?: number[];
    translation?: number[][];
    rotation?: number[];
} & ITransitionOptions & {
    transitionEl?: IElement;
};
export default ItemModel;
