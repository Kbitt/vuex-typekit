import { Ref, computed } from '@vue/composition-api'
import { mapTypedState } from '../module'
import { useStore } from './store'
import { NamespaceRef, resolveNamespace } from './types'

export type StateRefMapper<S> = {
    with: <K extends keyof S>(
        ...keys: K[]
    ) => {
        [P in K]: Readonly<Ref<Readonly<S[P]>>>
    }
}

export function useState<S>(namespace?: NamespaceRef): StateRefMapper<S> {
    return {
        with: <K extends keyof S>(...keys: K[]) => {
            const $store = useStore()
            const mapped = computed(() =>
                mapTypedState<S>(resolveNamespace(namespace)).to(...keys)
            )
            const result = {} as {
                [P in K]: Readonly<Ref<Readonly<S[P]>>>
            }
            keys.forEach(key => {
                result[key] = computed(() => mapped.value[key].call({ $store }))
            })
            return result
        },
    }
}
