import { type IElement } from '../../lightdom';
import Core, { type IGestureOptions } from '../core';
declare class Gesture extends Core {
    element: Element | null;
    _unbind: (() => void) | null;
    constructor(element: IElement, options?: IGestureOptions);
    destory(): void;
}
export default Gesture;
