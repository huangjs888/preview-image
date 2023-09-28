type DampingOption = {
    max?: number;
    mode?: number;
    expo?: number;
};
export declare function performDamping(value: number, option?: DampingOption): number;
export declare function revokeDamping(value: number, option?: DampingOption): number;
export {};
