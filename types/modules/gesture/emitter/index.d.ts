type IEventHandler<E, T> = (event: E, type?: T) => boolean | void;
export default class EventEmitter<T extends string, E> {
    events: {
        [key in T]?: {
            pool: Array<IEventHandler<E, T>>;
            single: number;
        };
    };
    constructor();
    one(type: T, handler: IEventHandler<E, T>, single?: boolean): void;
    on(type: T, handler: IEventHandler<E, T>, single?: boolean): void;
    off(type?: T, handler?: IEventHandler<E, T>, single?: boolean): void;
    emit(type: T, event: E): void;
}
export {};
