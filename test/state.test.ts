import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import StateComponent from './components/State.vue'
import { mapTypedState } from '../src'
import { shallowMount } from '@vue/test-utils'
import { getLocalVue } from './_init'
Vue.use(Vuex)
export interface TestState {
    a: number
    b: string
}

export interface SubTestState {
    value: string
    date: Date
}

describe('test accessing state', () => {
    const DEF_A = 123
    const DEF_B = 'TEST'
    const DEF_VALUE = 'VALUE'
    const DEF_DATE = new Date()
    let $store: Store<TestState>
    beforeEach(() => {
        $store = new Store<TestState>({
            state: () => ({
                a: DEF_A,
                b: DEF_B,
            }),
            modules: {
                sub: {
                    namespaced: true,
                    state: (): SubTestState => ({
                        value: DEF_VALUE,
                        date: DEF_DATE,
                    }),
                },
            },
        })
    })

    it('test state', () => {
        const { a, b } = mapTypedState<TestState>().to('a', 'b')

        expect(a.call({ $store })).toBe(DEF_A)
        expect(b.call({ $store })).toBe(DEF_B)
    })

    it('test namespaced state', () => {
        const { value, date } = mapTypedState<SubTestState>('sub').to(
            'value',
            'date'
        )

        expect(value.call({ $store })).toBe(DEF_VALUE)
        expect(date.call({ $store })).toBe(DEF_DATE)
    })

    it('test instance state function', () => {
        const localVue = getLocalVue()
        const wrapped = shallowMount(StateComponent, {
            localVue,
            store: $store,
        })
        expect((wrapped.find('#a').element as HTMLInputElement).value).toBe(
            DEF_A.toString()
        )
        expect((wrapped.find('#sub').element as HTMLInputElement).value).toBe(
            DEF_VALUE.toString()
        )
    })
})
