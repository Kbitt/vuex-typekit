import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createModule } from '../../src'

Vue.use(Vuex)

interface State {
    value: string
}

const getStore = () =>
    new Store<State>(
        createModule<State>({
            state: () => ({ value: '' }),
            mutations: {
                SET_VALUE: (state, payload: { value: string }) => {
                    state.value = payload.value
                },
            },
            actions: {
                setValue: ({ commit }, payload: { value: string }) => {
                    commit('SET_VALUE', payload)
                },
            },
        })
    )

describe('test undefined mutations', () => {
    let store: Store<State>
    const VAL = 'ABC123'

    beforeEach(() => {
        store = getStore()
    })

    it('test w/ mutation', () => {
        expect(store.state.value).toBe('')
        store.commit('SET_VALUE', { value: VAL })
        expect(store.state.value).toBe(VAL)
    })

    it('test w/ action', async () => {
        expect(store.state.value).toBe('')
        await store.dispatch('setValue', { value: VAL })
        expect(store.state.value).toBe(VAL)
    })
})
