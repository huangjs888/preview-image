export type RectSize = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export type TElement = {
    el: HTMLElement | null;
    x?: number;
    y?: number;
    k?: number;
    o?: number;
    w?: number;
    h?: number;
};
export declare function popupTransform(backdrop: TElement, wrapper: TElement, element: TElement, duration?: number): Promise<void>;
export declare function popupComputedSize(originRect: RectSize | null, continerRect: RectSize | null, elementSize: RectSize | null): {
    x: number;
    y: number;
    k: number;
    w: number;
    h: number;
};
