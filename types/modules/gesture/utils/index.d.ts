export declare function fixOption(value: number | undefined, defaultValue: number, minVal: number): number;
export declare function isTouchable(): number | boolean;
export declare function getEventPoints(event: any, started?: boolean): {
    points: {
        pageX: number;
        pageY: number;
        identifier: number;
    }[];
    isFirst?: boolean;
};
export declare function getDistance([x0, y0]: number[], [x1, y1]: number[]): number;
export declare function getAngle([x0, y0]: number[], [x1, y1]: number[]): number;
export declare function getCenter([x0, y0]: number[], [x1, y1]: number[]): number[];
export declare function getDirection([x0, y0]: number[], [x1, y1]: number[]): "Left" | "Right" | "Up" | "Down" | "None";
export declare function getVelocity(deltaTime: number, distance: number): number;
export declare function getVector(value: number, angle: number): number[];
