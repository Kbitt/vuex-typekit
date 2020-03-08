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
}

export function useGetters<G>(namespace?: NamespaceRef): GetterRefMapper<G> {
    return {
        with: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
            const mapped = computed(() =>
                mapTypedGetters<G>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as {
                [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>
            }
            keys.forEach(key => {
                result[key] = computed(() =>
                    mapped.value[key].call({ $store: useStore() })
                )
            })
            return result
        },
    }
}
