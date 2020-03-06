import { SubType } from '../module/types'
import { Mutation } from 'vuex'
import { MutationPayload, mapTypedMutations } from '../module'
import { useStore } from './store'

export type MutationRefMapper<Mutations> = {
    with: <K extends keyof SubType<Mutations, Mutation<any>>>(
        ...keys: K[]
    ) => {
        [P in K]: MutationPayload<Mutations[P]> extends void
            ? () => void
            : (payload: MutationPayload<Mutations[P]>) => void
    }
}

export function useMutataions<M>(namespace?: string): MutationRefMapper<M> {
    return {
        with: <K extends keyof SubType<M, Mutation<any>>>(...keys: K[]) => {
            const $store = useStore()
            const mapped = mapTypedMutations<M>(namespace).to(...keys)
            const result = {} as {
                [P in K]: MutationPayload<M[P]> extends void
                    ? () => void
                    : (payload?: MutationPayload<M[P]>) => void
            }
            keys.forEach(key => {
                result[key] = mapped[key].bind({ $store }) as any
            })

            return result
        },
    }
}
