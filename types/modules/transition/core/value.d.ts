import { type ICSSValue } from './index';
export default class Value {
    value: ICSSValue;
    precision?: ICSSValue;
    transform?: (v: ICSSValue) => string;
    constructor(value: number | ICSSValue, precision?: number | ICSSValue, transform?: (v: ICSSValue) => string);
    toRaw(): {
        value: ICSSValue;
        precision?: ICSSValue | undefined;
        transform?: ((v: ICSSValue) => string) | undefined;
    };
}
