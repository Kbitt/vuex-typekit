import { Action } from 'vuex';
import { SubType } from '../module/types';
import { ActionFn } from '../module';
import { NamespaceRef } from './types';
export declare type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
        [P in K]: ActionFn<A[P]>;
    };
    map: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: ActionFn<A[P]>;
        }) => U) => U;
    };
};
export declare function useActions<A>(namespace?: NamespaceRef): ActionRefMapper<A>;
