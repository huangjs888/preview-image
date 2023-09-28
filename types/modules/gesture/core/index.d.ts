import EventEmitter from '../emitter';
declare class Gesture extends EventEmitter<IGestureEventType, IGestureEvent> {
    wheelDelay: number;
    longTapInterval: number;
    doubleTapInterval: number;
    doubleTapDistance: number;
    touchMoveDistance: number;
    swipeVelocity: number;
    swipeDuration: number;
    raiseDuration: number;
    _rotateAngle: number;
    _singleTapTimer: number;
    _longTapTimer: number;
    _wheelTimerEnd: {
        scale: number;
        timer: number;
        wheelEnd: () => void;
    } | null;
    _preventTap: boolean;
    _swipePoints: any[] | null;
    _preventSingleTap: boolean;
    _preventDoubleTap: boolean;
    _firstPointer: IGesturePointer | null;
    _pointer0: IGesturePointer | null;
    _pointer1: IGesturePointer | null;
    constructor(options?: IGestureOptions);
    resetOptions(options?: IGestureOptions): void;
    preventAllTap(fp?: boolean): void;
}
export type IGestureOptions = {
    wheelDelay?: number;
    longTapInterval?: number;
    doubleTapInterval?: number;
    doubleTapDistance?: number;
    touchMoveDistance?: number;
    swipeVelocity?: number;
    swipeDuration?: number;
    raiseDuration?: number;
};
export type IGestureDirection = 'Left' | 'Right' | 'Up' | 'Down' | 'None';
export type IGestureEventType = 'pan' | 'tap' | 'swipe' | 'singleTap' | 'longTap' | 'doubleTap' | 'multiPan' | 'scale' | 'rotate' | 'pointerStart' | 'pointerMove' | 'pointerEnd' | 'pointerCancel' | 'gestureStart' | 'gestureMove' | 'gestureEnd';
export type IGesturePointer = {
    start: number[];
    previous: number[];
    current: number[];
    identifier: number;
    changed: boolean;
};
export type IGestureEvent = {
    pointers: IGesturePointer[];
    leavePointers: IGesturePointer[];
    getPoint: (whichOne?: 'start' | 'previous' | 'current') => number[];
    scale?: number;
    angle?: number;
    deltaX?: number;
    deltaY?: number;
    direction?: IGestureDirection;
    moveScale?: number;
    moveAngle?: number;
    moveX?: number;
    moveY?: number;
    moveDirection?: IGestureDirection;
    velocity?: number;
    waitTime?: number;
    delayTime?: number;
    intervalTime?: number;
    swipeComputed?: (factor: number, _velocity?: number) => {
        duration: number;
        stretchX: number;
        stretchY: number;
        deceleration: number;
    };
    timestamp: number;
    sourceEvent: any;
};
export default Gesture;
