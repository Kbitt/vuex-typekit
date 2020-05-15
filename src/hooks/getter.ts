import { Ref, computed } from '@vue/composition-api'
import { SubType } from '../module/types'
import { Getter } from 'vuex'
import { useStore } from './store'
import { mapTypedGetters } from '../module'
import { NamespaceRef, resolveNamespace } from './types'
export type GetterRefMapper<G> = {
    with: <K extends keyof SubType<G, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>
    }
    map: <K extends keyof SubType<G, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        to: <U>(
            mapper: (
                mapped: { [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>> }
            ) => U
        ) => U
    }
}

export function useGetters<G>(namespace?: NamespaceRef): GetterRefMapper<G> {
    return {
        with: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = computed(() =>
                mapTypedGetters<G>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as {
                [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>
            }
            keys.forEach(key => {
                result[key] = computed(() => mapped.value[key].call({ $store }))
            })
            return result
        },
        map(...keys) {
            const mapped = this.with(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}
