import { Ref } from '@vue/composition-api';
import { NamespaceRef } from './types';
export declare type StateRefMapper<S> = {
    with: <K extends keyof S>(...keys: K[]) => {
        [P in K]: Readonly<Ref<Readonly<S[P]>>>;
    };
    map: <K extends keyof S>(...keys: K[]) => {
        to: <U>(mapper: (mapped: {
            [P in K]: Readonly<Ref<Readonly<S[P]>>>;
        }) => U) => U;
    };
};
export declare function useState<S>(namespace?: NamespaceRef): StateRefMapper<S>;
