import { Ref } from '@vue/composition-api';
import { SubType } from '../module/types';
import { Getter } from 'vuex';
import { NamespaceRef } from './types';
export declare type GetterResult<T extends Getter<any, any>> = ReturnType<T> extends (...args: any) => any ? Readonly<Ref<ReturnType<T>>> : Readonly<Ref<Readonly<ReturnType<T>>>>;
export declare type GetterRefMapper<G> = {
    with: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
        [P in K]: GetterResult<G[P]>;
    };
    map: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: GetterResult<G[P]>;
        }) => U) => U;
    };
};
export declare function useGetters<G>(namespace?: NamespaceRef): GetterRefMapper<G>;
