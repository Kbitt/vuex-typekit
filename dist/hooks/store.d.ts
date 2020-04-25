import { Store } from 'vuex';
export declare function setUseStoreHook(hook: () => Store<any>): void;
export declare function useStore<S = any>(): Store<S>;
