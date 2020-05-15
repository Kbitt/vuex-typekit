import { VueForMappers, UnbindVue } from './types';
export declare type MappedState<T> = {
    [P in keyof T]: (this: VueForMappers) => T[P];
};
export declare type VueMapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => {
        [P in K]: MappedState<T>[P];
    };
    map: <K extends keyof T>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: MappedState<T>[P];
        }) => U) => U;
    };
};
export declare type MapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => UnbindVue<{
        [P in K]: MappedState<T>[P];
    }>;
};
export declare function mapTypedState<T>(namespace?: string): VueMapStateSelector<T>;
export declare function stateGetter<T>(this: VueForMappers, namespace?: string): {
    get: <K extends keyof T>(name: K) => T[K];
};
