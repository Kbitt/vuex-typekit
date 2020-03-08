import { Action } from 'vuex';
import { SubType } from '../module/types';
import { ActionFn } from '../module';
import { NamespaceRef } from './types';
export declare type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
        [P in K]: ActionFn<A[P]>;
    };
};
export declare function useActions<A>(namespace?: NamespaceRef): ActionRefMapper<A>;
