import { mapState } from 'vuex'
import { VueForMappers, UnbindVue, accessNamespace } from './types'

export type MappedState<T> = {
    [P in keyof T]: (this: VueForMappers) => T[P]
}

export type VueMapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => { [P in K]: MappedState<T>[P] }

    map: <K extends keyof T>(
        ...keys: K[]
    ) => {
        to: <U>(mapper: (mapped: { [P in K]: MappedState<T>[P] }) => U) => U
    }
}

export type MapStateSelector<T> = {
    to: <K extends keyof T>(
        ...keys: K[]
    ) => UnbindVue<{ [P in K]: MappedState<T>[P] }>
}

export function mapTypedState<T>(namespace?: string): VueMapStateSelector<T> {
    return {
        to: (...keys) =>
            (typeof namespace === 'string'
                ? mapState(namespace, keys as string[])
                : mapState(keys as string[])) as MappedState<T>,

        map(...keys) {
            const mapped = this.to(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}

export function stateGetter<T>(this: VueForMappers, namespace?: string) {
    return {
        get: <K extends keyof T>(name: K) => {
            const state = accessNamespace(this.$store.state, namespace) as T
            return state[name]
        },
    }
}
