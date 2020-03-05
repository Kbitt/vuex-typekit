import { Store } from 'vuex';
export declare type VueForMappers = {
    $store: Store<any>;
};
export declare type ExtendsOrNeverMap<T, C> = {
    [P in keyof T]: T[P] extends C ? P : never;
};
export declare type AllowedKeys<T, C> = ExtendsOrNeverMap<T, C>[keyof T];
export declare type SubType<T, C> = Pick<T, AllowedKeys<T, C>>;
export declare type OmitType<T, C> = Omit<T, AllowedKeys<T, C>>;
export declare type Func<R = any> = (...args: any[]) => R;
export declare type WithFirstArgOrNone<T extends Func<R>, R> = Parameters<T>[0] extends void ? () => R : (payload: Parameters<T>[0]) => R;
export declare type WithVueFirstArgOrNone<T extends Func<R>, R> = Parameters<T>[0] extends void ? (this: VueForMappers) => R : (this: VueForMappers, payload: Parameters<T>[0]) => R;
export declare type UnbindVue<T> = {
    [P in keyof T]: T[P] extends (this: VueForMappers, ...args: any[]) => any ? (...params: Parameters<T[P]>) => ReturnType<T[P]> : T[P] extends (this: VueForMappers) => any ? () => ReturnType<T[P]> : T[P];
};
export declare function accessNamespace(state: any, namespace?: string): any;
