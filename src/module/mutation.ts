import { Mutation, mapMutations } from 'vuex'
import { SubType, VueForMappers, UnbindVue } from './types'

export type AnyMutationFn = (payload?: any) => void

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
}

export type MapMutationsSelector<T> = {
    to: <K extends keyof SubType<T, Mutation<any>>>(
        ...keys: K[]
    ) => UnbindVue<Pick<MappedMutations<T>, K>>
}

export function mapTypedMutations<T>(
    namespace?: string
): VueMapMutationsSelector<T> {
    return {
        to: (...keys) =>
            (typeof namespace === 'string'
                ? mapMutations(namespace, keys as string[])
                : mapMutations(keys as string[])) as MappedMutations<T>,
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
