import { Mutation } from 'vuex';
import { SubType, VueForMappers, UnbindVue } from './types';
export declare type MutationType<S, P = void> = P extends void ? (state: S) => void : (state: S, payload: P) => void;
export declare type MutationPayload<T extends Mutation<any>> = Parameters<T>[1] extends undefined ? never : Parameters<T>[1];
export declare type MappedMutation<T extends Mutation<any>> = MutationPayload<T> extends void ? (this: VueForMappers) => void : (this: VueForMappers, payload: MutationPayload<T>) => void;
export declare type MappedMutations<T> = {
    [P in keyof T]: T[P] extends Mutation<any> ? MappedMutation<T[P]> : never;
};
export declare type VueMapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => Pick<MappedMutations<T>, K>;
};
export declare type MapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(...keys: K[]) => UnbindVue<Pick<MappedMutations<T>, K>>;
};
export declare function mapTypedMutations<T>(namespace?: string): VueMapMutationsSelector<T>;
export declare type VmMutator<T> = {
    commit: <K extends keyof SubType<T, Mutation<any>>>(...params: MutationPayload<T[K]> extends void ? [K] : [K, MutationPayload<T[K]>]) => void;
};
export declare function vmMutations<Mutations>(this: Vue, namespace?: string): VmMutator<Mutations>;
