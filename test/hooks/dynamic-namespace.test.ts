import { getLocalVue } from '../_init'
import { Store } from 'vuex'
import { DynamicModuleState, createDynamicModule } from './dynamic-module'
import App from './App.vue'
import { useStore } from './useStore'
import { mount } from '@vue/test-utils'

describe('dynamic namespace switching', () => {
    let localVue: ReturnType<typeof getLocalVue>
    let store: Store<{
        a?: DynamicModuleState
        b?: DynamicModuleState
        c?: DynamicModuleState
    }>
    let wrapped: ReturnType<typeof mount>

    const getInputValue = (id: string) => {
        return (wrapped.find(id).element as HTMLInputElement).value
    }
    const setInputValue = (id: string, value: string) => {
        const wrappedEl = wrapped.find(id)
        const input = wrappedEl.element as HTMLInputElement
        input.value = value
        wrappedEl.trigger('input')
    }
    const NS = '#namespace',
        VALUE = '#value'
    beforeEach(() => {
        localVue = getLocalVue({ useStore })
        store = new Store({
            modules: {
                a: createDynamicModule(),
                b: createDynamicModule(),
                c: createDynamicModule(),
            },
        })
        wrapped = mount(App, { localVue, store, propsData: { store } })
    })

    it('switching', async () => {
        // baseline
        expect(getInputValue(VALUE)).toBe('default')
        expect(getInputValue(NS)).toBe('a')

        const A_VAL = 'set in A'
        setInputValue(VALUE, A_VAL)
        await localVue.nextTick()

        expect(store.state.a?.value).toBe(A_VAL)

        setInputValue(NS, 'b')
        await localVue.nextTick()
        expect(getInputValue(VALUE)).toBe('default')
        expect(getInputValue(NS)).toBe('b')

        const B_VAL = 'set in B'
        setInputValue(VALUE, B_VAL)
        await localVue.nextTick()

        expect(store.state.b?.value).toBe(B_VAL)

        setInputValue(NS, 'c')
        await localVue.nextTick()
        expect(getInputValue(VALUE)).toBe('default')
        expect(getInputValue(NS)).toBe('c')

        const C_VAL = 'set in C'
        setInputValue(VALUE, C_VAL)
        await localVue.nextTick()

        expect(store.state.c?.value).toBe(C_VAL)

        setInputValue(NS, 'a')
        await localVue.nextTick()
        expect(getInputValue(VALUE)).toBe(A_VAL)

        setInputValue(NS, 'b')
        await localVue.nextTick()
        expect(getInputValue(VALUE)).toBe(B_VAL)

        setInputValue(NS, 'c')
        await localVue.nextTick()
        expect(getInputValue(VALUE)).toBe(C_VAL)
    })
})
