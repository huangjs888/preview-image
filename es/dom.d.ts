export declare function setStyle(ele: HTMLElement, css: {
    [key: string]: string | number | undefined;
}): HTMLElement;
export declare function createContainer(element?: HTMLElement | string): HTMLElement;
export declare function createSubstance(isVertical: boolean, element: HTMLElement): HTMLElement;
export declare function createBackdrop(background: string, element: HTMLElement): HTMLElement;
export declare function createIndicator(isVertical: boolean, hasIndicator: boolean, element: HTMLElement): HTMLElement | null;
export declare function createItemIndicator(isVertical: boolean, element: HTMLElement | null): HTMLElement | null;
export declare function createItemWrapper(isFirst: boolean, isVertical: boolean, hasLoading: boolean, itemGap: number, element: HTMLElement): HTMLElement;
export declare function createLoading(element: HTMLElement): void;
export declare function createError(element: HTMLElement): void;
