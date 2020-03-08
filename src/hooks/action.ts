import { Action } from 'vuex'
import { SubType } from '../module/types'
import {
    ActionPayload,
    mapTypedActions,
    ActionFn,
    AnyActionFn,
} from '../module'
import { useStore } from './store'
import { NamespaceRef, resolveNamespace } from './types'
import { computed } from '@vue/composition-api'

export type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: ActionFn<A[P]>
    }
}

export function useActions<A>(namespace?: NamespaceRef): ActionRefMapper<A> {
    return {
        with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
            const mapped = computed<Record<K, AnyActionFn>>(() =>
                mapTypedActions<A>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as Record<K, AnyActionFn>
            keys.forEach(key => {
                result[key] = (payload?: any) =>
                    mapped.value[key].call({ $store: useStore() }, payload)
            })

            return result as Record<K, ActionFn<A[K]>>
        },
    }
}
