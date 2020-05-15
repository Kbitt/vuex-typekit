import { Mutation } from 'vuex';
import { SubType, VueForMappers, UnbindVue } from './types';
export declare type AnyMutationFn = (payload?: any) => void;
/**
 * Declares a mutation. Requires the module State type (S) and an optional Payload type (P)
 */
export declare type MutationType<S, P = void> = P extends void ? (state: S) => void : (state: S, payload: P) => void;
export declare type MutationPayload<T extends Mutation<any>> = Parameters<T>[1] extends undefined ? never : Parameters<T>[1];
export declare type MutationFn<T extends Mutation<any>> = MutationPayload<T> extends void ? () => void : (payload: MutationPayload<T>) => void;
export declare type MappedMutation<T extends Mutation<any>> = MutationPayload<T> extends void ? (this: VueForMappers) => void : (this: VueForMappers, payload: MutationPayload<T>) => void;
export declare type MappedMutations<T> = {
    [P in keyof T]: T[P] extends Mutation<any> ? MappedMutation<T[P]> : never;
};
export declare type VueMapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => {
        [P in K]: MappedMutations<T>[P];
    };
    map: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: MappedMutations<T>[P];
        }) => U) => U;
    };
};
export declare type MapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => UnbindVue<Pick<MappedMutations<T>, K>>;
    map: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: UnbindVue<Pick<MappedMutations<T>, K>>) => U) => U;
    };
};
export declare function mapTypedMutations<T>(namespace?: string): VueMapMutationsSelector<T>;
export declare type MutationVmFn<T> = <K extends keyof SubType<T, Mutation<any>>>(...params: MutationPayload<T[K]> extends void ? [K] : [K, MutationPayload<T[K]>]) => void;
export declare type VmMutator<T> = {
    commit: MutationVmFn<T>;
};
export declare function vmMutations<Mutations>(this: Vue, namespace?: string): VmMutator<Mutations>;
