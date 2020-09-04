import { Ref, computed } from '@vue/composition-api'
import { SubType } from '../module/types'
import { Getter } from 'vuex'
import { useStore } from './store'
import { mapTypedGetters, GetterType } from '../module'
import { NamespaceRef, resolveNamespace } from './types'
export type GetterResult<T extends Getter<any, any>> = ReturnType<T> extends (
    ...args: any
) => any
    ? Readonly<Ref<ReturnType<T>>>
    : Readonly<Ref<Readonly<ReturnType<T>>>>
export type GetterRefMapper<G> = {
    with: <K extends keyof SubType<G, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: GetterResult<G[P]>
    }
    map: <K extends keyof SubType<G, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        to: <U>(mapper: (mapped: { [P in K]: GetterResult<G[P]> }) => U) => U
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
                [P in K]: GetterResult<G[P]>
            }
            keys.forEach(key => {
                result[key] = computed(() =>
                    mapped.value[key].call({ $store })
                ) as any
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
