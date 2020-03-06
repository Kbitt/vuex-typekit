import { Action } from 'vuex'
import { SubType } from '../module/types'
import { ActionPayload, mapTypedActions } from '../module'
import { useStore } from './store'

export type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(
        ...keys: K[]
    ) => {
        [P in K]: ActionPayload<A[P]> extends void
            ? () => void
            : (payload: ActionPayload<A[P]>) => void
    }
}

export function useActions<A>(namespace?: string): ActionRefMapper<A> {
    return {
        with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = mapTypedActions<A>(namespace).to(...keys)
            const result = {} as {
                [P in K]: ActionPayload<A[P]> extends void
                    ? () => void
                    : (payload?: ActionPayload<A[P]>) => void
            }
            keys.forEach(key => {
                result[key] = mapped[key].bind({ $store }) as any
            })

            return result
        },
    }
}
