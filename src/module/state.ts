import { mapState } from 'vuex'
import { VueForMappers, UnbindVue, accessNamespace } from './types'

export type MappedState<T> = {
    [P in keyof T]: (this: VueForMappers) => T[P]
}

export type VueMapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => Pick<MappedState<T>, K>
}

export type MapStateSelector<T> = {
    to: <K extends keyof T>(...keys: K[]) => UnbindVue<Pick<MappedState<T>, K>>
}

export function mapTypedState<T>(namespace?: string): VueMapStateSelector<T> {
    return {
        to: <K extends keyof T>(...keys: K[]): Pick<MappedState<T>, K> =>
            (typeof namespace === 'string'
                ? mapState(namespace, keys as string[])
                : mapState(keys as string[])) as MappedState<T>,
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
