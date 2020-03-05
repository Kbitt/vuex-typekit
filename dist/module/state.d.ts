import { VueForMappers, UnbindVue } from './types';
export declare type MappedState<T> = {
    [P in keyof T]: (this: VueForMappers) => T[P];
};
export declare type VueMapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => Pick<MappedState<T>, K>;
};
export declare type MapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => UnbindVue<Pick<MappedState<T>, K>>;
};
export declare function mapTypedState<T>(namespace?: string): VueMapStateSelector<T>;
export declare function stateGetter<T>(this: VueForMappers, namespace?: string): {
    get: <K extends keyof T>(name: K) => T[K];
};
