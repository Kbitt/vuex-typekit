import { SubType } from '../module/types'
import { Mutation } from 'vuex'
import {
    MutationPayload,
    mapTypedMutations,
    AnyMutationFn,
    MutationFn,
} from '../module'
import { useStore } from './store'
import { NamespaceRef, resolveNamespace } from './types'
import { computed } from '@vue/composition-api'

export type MutationRefMapper<Mutations> = {
    with: <K extends keyof SubType<Mutations, Mutation<any>>>(
        ...keys: K[]
    ) => {
        [P in K]: MutationFn<Mutations[P]>
    }
}

export function useMutataions<M>(
    namespace?: NamespaceRef
): MutationRefMapper<M> {
    return {
        with: <K extends keyof SubType<M, Mutation<any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = computed<Record<K, AnyMutationFn>>(() =>
                mapTypedMutations<M>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as Record<K, AnyMutationFn>
            keys.forEach(key => {
                result[key] = (payload?: any) =>
                    mapped.value[key].call({ $store }, payload)
            })

            return result as Record<K, MutationFn<M[K]>>
        },
    }
}
