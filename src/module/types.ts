import { Store } from 'vuex'

export type VueForMappers = {
    $store: Store<any>
}

export type ExtendsOrNeverMap<T, C> = {
    [P in keyof T]: T[P] extends C ? P : never
}
export type AllowedKeys<T, C> = ExtendsOrNeverMap<T, C>[keyof T]
export type SubType<T, C> = Pick<T, AllowedKeys<T, C>>
export type OmitType<T, C> = Omit<T, AllowedKeys<T, C>>
export type Func<R = any> = (...args: any[]) => R
export type WithFirstArgOrNone<T extends Func<R>, R> = Parameters<
    T
>[0] extends void
    ? () => R
    : (payload: Parameters<T>[0]) => R

export type WithVueFirstArgOrNone<T extends Func<R>, R> = Parameters<
    T
>[0] extends void
    ? (this: VueForMappers) => R
    : (this: VueForMappers, payload: Parameters<T>[0]) => R

export type UnbindVue<T> = {
    [P in keyof T]: T[P] extends (this: VueForMappers, ...args: any[]) => any
        ? (...params: Parameters<T[P]>) => ReturnType<T[P]>
        : T[P] extends (this: VueForMappers) => any
        ? () => ReturnType<T[P]>
        : T[P]
}

export function accessNamespace(state: any, namespace?: string): any {
    if (typeof namespace !== 'string') return state
    let result = state
    namespace.split('/').forEach(part => {
        result = result[part]
    })
    return result
}
