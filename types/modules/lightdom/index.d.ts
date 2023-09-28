export declare function getScrollBarSize(target: Element | boolean): {
    width: number;
    height: number;
};
export declare function isBodyOverflowing(): boolean;
export declare function cssInject(id: string, cssText: string): void;
export type ICSSStyle = {
    [key: string]: string | number | undefined;
};
export declare function setStyle(el?: Element | null, style?: ICSSStyle): Element | null | undefined;
export declare function hasClass(el?: Element | null, className?: string): boolean;
export declare function addClass(el?: Element | null, className?: string | string[]): Element | null | undefined;
export declare function removeClass(el?: Element | null, className?: string | string[]): Element | null | undefined;
export type IElement = string | Element | (() => Element | null | undefined) | null | undefined;
export declare function getElement(container?: IElement): Element | null;
type IChildren = string | number | boolean | null | undefined | Element;
type IProps = {
    className?: string | string[];
    style?: ICSSStyle;
    attrs?: {
        [key: string]: string;
    };
};
export declare function createElement(type?: string | IProps, props?: IProps | IChildren | IChildren[], children?: IChildren | IChildren[] | IElement, parent?: Element): Element;
export declare function getBBox(element?: Element | null): {
    left: number;
    top: number;
    width: number;
    height: number;
};
export {};
