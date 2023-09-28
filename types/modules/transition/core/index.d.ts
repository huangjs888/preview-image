import Animation, { type IAnimationOptions } from '../animation';
import type ICSSOptionValue from './value';
declare class Transition {
    cssProperties: ICSSProperties;
    _cssProperties: ICSSProperties | null;
    _animations: {
        animation: Animation;
        remain: ICSSProperties;
        cancel: boolean;
    }[];
    _apply: (style: ICSSStyle) => void;
    constructor({ cssProperties, apply }?: ITransitionOptions);
    update(): void;
    value(): ICSSLikeStyle;
    apply(cssProperties: ICSSOptionProperties, extendOptions?: IAnimationExtendOptions): Promise<ICSSLikeStyle>;
    cancel(end?: boolean): number;
    running(): boolean;
}
export type ICSSName = string;
export type ICSSValue = {
    [key: string]: number;
};
export type ICSSStyle = {
    [key: ICSSName]: string;
};
export type ICSSLikeStyle = {
    [key: ICSSName]: ICSSValue;
};
export type ICSSProperties = {
    [key: ICSSName]: {
        value: ICSSValue;
        precision: ICSSValue;
        transform: (v: ICSSValue) => string;
    };
};
export type IAnimationExtendOptions = IAnimationOptions & {
    cancel?: boolean;
    before?: (p: number, v?: ICSSLikeStyle) => void | boolean | number;
    after?: (p: number, v?: ICSSLikeStyle) => void;
};
export type ICSSOptionProperties = ICSSOptionValue | {
    [key: ICSSName]: ICSSOptionValue;
};
export type ITransitionOptions = {
    cssProperties?: ICSSOptionProperties;
    apply?: (style: ICSSStyle) => void;
};
export default Transition;
