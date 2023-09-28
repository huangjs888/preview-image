type Raw = {
    a?: number;
    k?: number;
    x?: number;
    y?: number;
};
export default class Transform {
    a?: number;
    k?: number;
    x?: number;
    y?: number;
    constructor(t?: Raw);
    static identity(): Transform;
    toRaw(): Raw;
    toString(): string;
}
export {};
