import { Ref } from '@vue/composition-api';
import { NamespaceRef } from './types';
export declare type StateRefMapper<S> = {
    with: <K extends keyof S>(...keys: K[]) => {
        [P in K]: Readonly<Ref<Readonly<S[P]>>>;
    };
};
export declare function useState<S>(namespace?: NamespaceRef): StateRefMapper<S>;
