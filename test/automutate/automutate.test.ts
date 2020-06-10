import getStore from './store'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('automutate', () => {
    let store: ReturnType<typeof getStore>

    const runTest = async (raw: boolean) => {
        store = getStore(raw)
        await store.dispatch('setValues', {
            a: 1,
            b: 2,
            c: 3,
        })

        expect(store.state.a).toBe(1)
        expect(store.state.b).toBe(2)
        expect(store.state.c).toBe(3)

        await store.dispatch('calcValue')

        expect(store.state.value).toBe('1 - 2 - 3')
    }

    it('test it', async () => {
        await runTest(false)
    })

    it('test raw payload', async () => {
        await runTest(true)
    })

    it('test mutatiosn are still intact', async () => {
        store = getStore(false)

        await store.dispatch('setValues', {
            a: 1,
            b: 2,
            c: 3,
        })

        expect(store.state.a).toBe(1)
        expect(store.state.b).toBe(2)
        expect(store.state.c).toBe(3)

        store.commit('clearABC')

        expect(store.state.a).toBe(0)
        expect(store.state.b).toBe(0)
        expect(store.state.c).toBe(0)
    })
})
