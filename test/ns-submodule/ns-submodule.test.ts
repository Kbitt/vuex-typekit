import { Store } from 'vuex'
import { State, createStore } from './store'

describe('test namespaced submodule', () => {
    let $store: Store<State & { sub?: State }>
    beforeEach(() => {
        $store = createStore()
    })

    it('test operations', async () => {
        // this should call set value and increment both local and sub foo
        await $store.dispatch('setValue', { value: 'abc' })
        // this should call set value and increment both local and parent foo
        await $store.dispatch('sub/setValue', { value: 'xyz' })
        expect($store.state.value).toBe('abc')
        expect($store.state.sub!.value).toBe('xyz')
        expect($store.state.fooCount).toBe(2)
        expect($store.state.sub!.fooCount).toBe(2)
        await $store.dispatch('setValue', { value: 'xyz' })
        await $store.dispatch('sub/setValue', { value: 'abc' })
        expect($store.state.value).toBe('xyz')
        expect($store.state.sub!.value).toBe('abc')
        expect($store.state.fooCount).toBe(4)
        expect($store.state.sub!.fooCount).toBe(4)
    })

    it('test cross module commit', async () => {
        await $store.dispatch('barAction')
        expect($store.state.sub!.barCount).toBe(1)
        await $store.dispatch('barAction')
        expect($store.state.sub!.barCount).toBe(2)
        expect($store.state.barCount).toBe(0)

        await $store.dispatch('sub/barAction')
        expect($store.state.barCount).toBe(1)
        await $store.dispatch('sub/barAction')
        expect($store.state.barCount).toBe(2)
    })

    it('test namespace access from root', async () => {
        expect($store.state.sub!.barCount).toBe(0)
        await $store.dispatch('sub/barRootRootAction')
        expect($store.state.sub!.barCount).toBe(1)
    })
})
