import Transition, { type EaseFn, type TAIOptions } from '@huangjs888/transition';
import Transform, { type TransformRaw } from '@huangjs888/transform';
declare class Entity {
    _element: HTMLElement;
    _transform: Transform;
    _transition: Transition;
    _dblAdjust: boolean;
    _dblScale: number | (() => number);
    _damping: Damping[];
    _rotation: number[] | (() => number[]);
    _scalation: number[] | (() => number[]);
    _translation: (number[] | ((v: number) => number[]))[];
    _sizeInfo: SizeInfo & {
        elementWidth: number;
        elementHeight: number;
    };
    constructor({ element, sizeInfo, dblAdjust, dblScale, damping, rotation, scalation, translation, }: IOption);
    getElement(): HTMLElement;
    getTransform(): Transform;
    getSizeInfo(): SizeInfo & {
        elementWidth: number;
        elementHeight: number;
    };
    setSizeInfo(sizeInfo?: SizeInfo): void;
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
    isDamping(key: Damping): boolean;
    setDamping(damping?: Damping[]): void;
    rotate(a: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    rotateTo(a: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    scale(k: number, point?: number[]): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    scaleTo(k: number, point?: number[]): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translate(x: number, y: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translateTo(x: number, y: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translateX(x: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translateXTo(x: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translateY(y: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    translateYTo(y: number): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    transform(transformRaw: TransformRaw, point?: number[] | TAIOptions, options?: TAIOptions): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    transformTo(transformRaw: TransformRaw, point?: number[] | TAIOptions, options?: TAIOptions): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    transitionRun(transformRaw: TransformRaw, options?: TAIOptions): Promise<TransformRaw> | Promise<{
        [key: string]: number;
    }>;
    transitionCancel(): number;
    isTransitioning(): boolean;
    reset(duration?: number): void;
    computeOffset(point: number[], k: number, adjust?: boolean): number[];
    moveBounce(angle: number, scale: number, deltaX: number, deltaY: number, point?: number[]): void;
    resetBounce(point?: number[], cancel?: boolean): void;
    dblScale(point?: number[]): void;
    swipeBounce(duration: number, stretch: number, key: 'x' | 'y', transition?: (key: 'x' | 'y', xySwipe: number, xyBounce: number, option: (v: number) => {
        duration: number;
        easing: EaseFn;
    }) => void): void;
}
export type Damping = 'rotate' | 'scale' | 'translate';
export type SizeInfo = {
    containerCenter: number[];
    containerWidth: number;
    containerHeight: number;
    naturalWidth: number;
    naturalHeight: number;
};
export type IOption = {
    element?: HTMLElement | string;
    sizeInfo?: SizeInfo;
    dblAdjust?: boolean;
    dblScale?: number;
    damping?: Damping[];
    scalation?: number[];
    translation?: number[][];
    rotation?: number[];
};
export default Entity;
