import { Getter } from 'vuex';
import { SubType, VueForMappers } from './types';
export declare type GetterType<Result, S, R = any, G = any, RG = any> = {
    (state: S, getters: G, rootState: R, rootGetters: RG): Result;
};
export declare type MappedGetter<T extends Getter<any, any>> = (this: VueForMappers) => ReturnType<T>;
export declare type MappedGetters<T> = {
    [P in keyof T]: T[P] extends Getter<any, any> ? MappedGetter<T[P]> : never;
};
export declare type TypedGetters<T> = {
    [P in keyof SubType<T, Getter<any, any>>]: ReturnType<T[P]>;
};
export declare type MapGettersSelector<T> = {
    to: <K extends keyof SubType<T, Getter<any, any>>>(...keys: K[]) => Pick<MappedGetters<T>, K>;
    map: <K extends keyof SubType<T, Getter<any, any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: Pick<MappedGetters<T>, K>) => U) => U;
    };
};
export declare function mapTypedGetters<T>(namespace?: string): MapGettersSelector<T>;
export declare type VmGetter<T> = {
    get: <K extends keyof SubType<T, Getter<any, any>>>(name: K) => T[K];
};
export declare function vmGetters<Getters>(this: Vue, namespace?: string): VmGetter<Getters>;
