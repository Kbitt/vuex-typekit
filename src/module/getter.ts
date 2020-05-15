import { Getter, mapGetters } from 'vuex'
import { SubType, VueForMappers } from './types'

export type GetterType<Result, S, R = any, G = any, RG = any> = {
    (state: S, rootState: R, getters: G, rootGetters: RG): Result
}

export type MappedGetter<T extends Getter<any, any>> = (
    this: VueForMappers
) => ReturnType<T>

export type MappedGetters<T> = {
    [P in keyof T]: T[P] extends Getter<any, any> ? MappedGetter<T[P]> : never
}

export type TypedGetters<T> = {
    [P in keyof SubType<T, Getter<any, any>>]: ReturnType<T[P]>
}

export type MapGettersSelector<T> = {
    to: <K extends keyof SubType<T, Getter<any, any>>>(
        ...keys: K[]
    ) => Pick<MappedGetters<T>, K>
    map: <K extends keyof SubType<T, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        to: <U>(mapper: (mapped: Pick<MappedGetters<T>, K>) => U) => U
    }
}
export function mapTypedGetters<T>(namespace?: string): MapGettersSelector<T> {
    return {
        to: <K extends keyof SubType<T, Getter<any, any>>>(
            ...keys: K[]
        ): Pick<MappedGetters<T>, K> =>
            (typeof namespace === 'string'
                ? mapGetters(namespace, keys as string[])
                : mapGetters(keys as string[])) as MappedGetters<T>,
        map(...keys) {
            const mapped = this.to(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}

export type VmGetter<T> = {
    get: <K extends keyof SubType<T, Getter<any, any>>>(name: K) => T[K]
}

export function vmGetters<Getters>(
    this: Vue,
    namespace?: string
): VmGetter<Getters> {
    return {
        get: name => {
            const path = (typeof namespace === 'string'
                ? `${namespace}/${name}`
                : name) as string
            return this.$store.getters[path]
        },
    }
}
