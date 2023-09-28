import { type IElement } from '../../lightdom';
import Core, { type ITransitionOptions } from '../core';
declare class Transition extends Core {
    constructor(element: IElement, options?: ITransitionOptions);
}
export default Transition;
