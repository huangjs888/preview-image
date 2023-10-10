export declare function fixDecimal(value: number, places?: number): number;
export declare function ratioOffset(v: number, k: number, t: number): number;
export declare function effectuate(fn: any, ...args: any): any;
export declare function isBetween(v: number, [min, max]: number[]): boolean;
export declare function between(v: number, [min, max]: number[], _?: boolean): number;
export declare function getSPBox(element?: Element | null): {
    x: number;
    y: number;
    w: number;
    h: number;
};
