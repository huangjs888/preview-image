export type EaseFn = (t: number) => number;
export declare function createEase(a?: number, b?: number, easeFn?: EaseFn): EaseFn;
export declare function createEaseInOut(k?: number, easeIn?: EaseFn, easeOut?: EaseFn): EaseFn;
declare const easeInOutQuad: EaseFn;
declare const easeOutInQuad: EaseFn;
declare const easeOutQuad: EaseFn;
declare const easeOutQuart: EaseFn;
export { easeInOutQuad, easeOutInQuad, easeOutQuad, easeOutQuart };
