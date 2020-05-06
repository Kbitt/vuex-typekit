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
        return Promise.resolve(wrappedEl.setValue(value))
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
        await setInputValue(VALUE, A_VAL)

        expect(store.state.a?.value).toBe(A_VAL)

        await setInputValue(NS, 'b')
        expect(getInputValue(VALUE)).toBe('default')
        expect(getInputValue(NS)).toBe('b')

        const B_VAL = 'set in B'
        await setInputValue(VALUE, B_VAL)

        expect(store.state.b?.value).toBe(B_VAL)

        await setInputValue(NS, 'c')
        expect(getInputValue(VALUE)).toBe('default')
        expect(getInputValue(NS)).toBe('c')

        const C_VAL = 'set in C'
        await setInputValue(VALUE, C_VAL)

        expect(store.state.c?.value).toBe(C_VAL)

        await setInputValue(NS, 'a')
        expect(getInputValue(VALUE)).toBe(A_VAL)

        await setInputValue(NS, 'b')
        expect(getInputValue(VALUE)).toBe(B_VAL)

        await setInputValue(NS, 'c')
        expect(getInputValue(VALUE)).toBe(C_VAL)
    })
})
