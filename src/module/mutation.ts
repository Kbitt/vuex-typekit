import { Mutation, mapMutations } from 'vuex'
import { SubType, VueForMappers, UnbindVue } from './types'

export type AnyMutationFn = (payload?: any) => void

/**
 * Declares a mutation. Requires the module State type (S) and an optional Payload type (P)
 */
export type MutationType<S, P = void> = P extends void
    ? (state: S) => void
    : (state: S, payload: P) => void

export type MutationPayload<T extends Mutation<any>> = Parameters<
    T
>[1] extends undefined
    ? never
    : Parameters<T>[1]

export type MutationFn<T extends Mutation<any>> = MutationPayload<
    T
> extends void
    ? () => void
    : (payload: MutationPayload<T>) => void
export type MappedMutation<T extends Mutation<any>> = MutationPayload<
    T
> extends void
    ? (this: VueForMappers) => void
    : (this: VueForMappers, payload: MutationPayload<T>) => void

export type MappedMutations<T> = {
    [P in keyof T]: T[P] extends Mutation<any> ? MappedMutation<T[P]> : never
}

export type VueMapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(
        ...keys: K[]
    ) => { [P in K]: MappedMutations<T>[P] }

    map: <K extends keyof SubType<T, Mutation<any>>>(
        ...keys: K[]
    ) => {
        to: <U>(mapper: (mapped: { [P in K]: MappedMutations<T>[P] }) => U) => U
    }
}

export type MapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(
        ...keys: K[]
    ) => UnbindVue<Pick<MappedMutations<T>, K>>

    map: <K extends keyof SubType<T, Mutation<any>>>(
        ...keys: K[]
    ) => {
        to: <U>(
            mapper: (mapped: UnbindVue<Pick<MappedMutations<T>, K>>) => U
        ) => U
    }
}

export function mapTypedMutations<T>(
    namespace?: string
): VueMapMutationsSelector<T> {
    return {
        to: (...keys) =>
            (typeof namespace === 'string'
                ? mapMutations(namespace, keys as string[])
                : mapMutations(keys as string[])) as MappedMutations<T>,
        map(...keys) {
            const mapped = this.to(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}

export type MutationVmFn<T> = <K extends keyof SubType<T, Mutation<any>>>(
    ...params: MutationPayload<T[K]> extends void
        ? [K]
        : [K, MutationPayload<T[K]>]
) => void

export type VmMutator<T> = {
    commit: MutationVmFn<T>
}

export function vmMutations<Mutations>(
    this: Vue,
    namespace?: string
): VmMutator<Mutations> {
    return {
        commit: (name, payload?: any) => {
            const path = (typeof namespace === 'string'
                ? `${namespace}/${name}`
                : name) as string
            this.$store.commit(path, payload)
        },
    }
}
