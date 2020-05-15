import { Action } from 'vuex'
import { SubType } from '../module/types'
import { mapTypedActions, ActionFn, AnyActionFn } from '../module'
import { useStore } from './store'
import { NamespaceRef, resolveNamespace } from './types'
import { computed } from '@vue/composition-api'

export type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: ActionFn<A[P]>
    }

    map: <K extends keyof SubType<A, Action<any, any>>>(
        ...keys: K[]
    ) => {
        to: <U>(
            mapper: (
                mapped: {
                    [P in K]: ActionFn<A[P]>
                }
            ) => U
        ) => U
    }
}

export function useActions<A>(namespace?: NamespaceRef): ActionRefMapper<A> {
    return {
        with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = computed<Record<K, AnyActionFn>>(() =>
                mapTypedActions<A>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as Record<K, AnyActionFn>
            keys.forEach(key => {
                result[key] = (payload?: any) =>
                    mapped.value[key].call({ $store }, payload)
            })

            return result as Record<K, ActionFn<A[K]>>
        },
        map(...keys) {
            const mapped = this.with(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}
