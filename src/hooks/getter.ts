import { Ref, computed } from '@vue/composition-api'
import { SubType } from '../module/types'
import { Getter } from 'vuex'
import { useStore } from './store'
import { mapTypedGetters } from '../module'
export type GetterRefMapper<G> = {
    with: <K extends keyof SubType<G, Getter<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>
    }
}

export function useGetters<G>(namespace?: string): GetterRefMapper<G> {
    return {
        with: <K extends keyof SubType<G, Getter<any, any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = mapTypedGetters<G>(namespace).to(...keys)
            const result = {} as {
                [P in K]: Readonly<Ref<Readonly<ReturnType<G[P]>>>>
            }
            keys.forEach(key => {
                result[key] = computed(() => mapped[key].call({ $store }))
            })
            return result
        },
    }
}
