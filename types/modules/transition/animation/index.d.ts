declare class Animation {
    duration: number;
    easing: IAnimationEasing;
    delay: number;
    _delay: number;
    _frameId: number;
    _elapsed: number;
    _sleepId: number;
    _delayId: number;
    _tick: IAnimationCallBack | null;
    _delayFn: IAnimationCallBack | null;
    constructor({ duration, easing, delay }?: IAnimationOptions);
    start(frameFn: IAnimationCallBack): void;
    restart(): void;
    sleep(time: number): void;
    stop(): void;
    end(): void;
}
type IAnimationCallBack = (v: number) => void;
export type IAnimationEasing = (v: number) => number;
export type IAnimationOptions = {
    duration?: number;
    easing?: IAnimationEasing;
    delay?: number;
};
export default Animation;
