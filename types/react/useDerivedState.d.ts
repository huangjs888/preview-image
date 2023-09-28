export declare function useForceUpdate(): () => void;
type Updater<T> = (updater: T | ((origin: T) => T)) => void;
export declare function useDerivedState<T>(value: T | (() => T), useCompare?: (prev: T, next: T) => T): [T, Updater<T>];
export {};
