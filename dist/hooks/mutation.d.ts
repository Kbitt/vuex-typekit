import { SubType } from '../module/types';
import { Mutation } from 'vuex';
import { MutationFn } from '../module';
import { NamespaceRef } from './types';
export declare type MutationRefMapper<Mutations> = {
    with: <K extends keyof SubType<Mutations, Mutation<any>>>(...keys: K[]) => {
        [P in K]: MutationFn<Mutations[P]>;
    };
    map: <K extends keyof SubType<Mutations, Mutation<any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: MutationFn<Mutations[P]>;
        }) => U) => U;
    };
};
export declare function useMutations<M>(namespace?: NamespaceRef): MutationRefMapper<M>;
