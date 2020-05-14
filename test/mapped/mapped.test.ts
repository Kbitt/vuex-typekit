import createStore, { State, Mutations, Actions } from './store'
import { mapTypedState, mapTypedMutations } from '../../src'

describe('test mapped values', () => {
    let $store: ReturnType<typeof createStore>

    beforeEach(() => {
        $store = createStore()
    })

    it('test mapped state', () => {
        const { mappedCount, mappedPrevious } = mapTypedState<State>()
            .map('count', 'previous')
            .to(({ count, previous }) => ({
                mappedCount: count,
                mappedPrevious: previous,
            }))
        const { count, previous } = mapTypedState<State>().to(
            'count',
            'previous'
        )

        const isAllExpected = (value: number) =>
            value === mappedCount.call({ $store }) &&
            value === count.call({ $store })

        const isAllPreviousExpected = (value: number) =>
            value === mappedPrevious.call({ $store }) &&
            value === previous.call({ $store })

        expect(isAllExpected(0)).toBe(true)
        expect(isAllPreviousExpected(0)).toBe(true)
        $store.dispatch('increment')
        expect(isAllExpected(1)).toBe(true)
        expect(isAllPreviousExpected(0)).toBe(true)
        $store.dispatch('increment')
        expect(isAllExpected(2)).toBe(true)
        expect(isAllPreviousExpected(1)).toBe(true)
    })

    it('test mapped mutations', () => {
        const { increment } = mapTypedMutations<Mutations>()
            .map('INCREMENT')
            .to(({ INCREMENT }) => ({
                increment: INCREMENT,
            }))

        const { INCREMENT } = mapTypedMutations<Mutations>().to('INCREMENT')

        increment.call({ $store })
        expect($store.state.count).toBe(1)
        INCREMENT.call({ $store })
        expect($store.state.count).toBe(2)
        increment.call({ $store })
        expect($store.state.count).toBe(3)
        INCREMENT.call({ $store })
        expect($store.state.count).toBe(4)
    })
})
