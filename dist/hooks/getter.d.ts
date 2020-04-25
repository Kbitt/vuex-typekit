import { Ref } from '@vue/composition-api';
import { SubType } from '../module/types';
import { Getter } from 'vuex';
import { NamespaceRef } from './types';
export declare type GetterRefMapper<G> = {
    with: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
        [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>;
    };
};
export declare function useGetters<G>(namespace?: NamespaceRef): GetterRefMapper<G>;