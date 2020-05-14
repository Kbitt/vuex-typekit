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

    map: <K extends keyof S>(
        ...keys: K[]
    ) => {
        to: <U>(
            mapper: (
                mapped: {
                    [P in K]: Readonly<Ref<Readonly<S[P]>>>
                }
            ) => U
        ) => U
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
        map(...keys) {
            const mapped = this.with(...keys)
            return {
                to: mapper => mapper(mapped),
            }
        },
    }
}
