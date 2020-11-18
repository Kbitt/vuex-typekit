import { GetterType, mapTypedGetters, createGetters } from '../src'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
Vue.use(Vuex)
interface MyRootState {
    mode: 'dark' | 'light'
    sub?: MyState
}

interface MyState {
    value: string
}

interface MyRootGetters {
    next: GetterType<'dark' | 'light', MyRootState, MyRootGetters>
    isNext: GetterType<
        (input: 'dark' | 'light') => boolean,
        MyRootState,
        MyRootGetters
    >
}

interface MyGetters {
    upper: GetterType<string, MyState, MyGetters, MyRootGetters>
    upperAndNext: GetterType<string, MyState, MyGetters, MyRootGetters>
}

const DEF_VALUE = 'default'

const createStore = () =>
    new Store<MyRootState>({
        state: () => ({ mode: 'light' }),
        getters: {
            ...createGetters<MyRootState, MyRootGetters>({
                next: state => (state.mode === 'dark' ? 'light' : 'dark'),
                isNext: (_, getters) => input => getters.next === input,
            }),
        },
        modules: {
            sub: {
                namespaced: true,
                state: (): MyState => ({
                    value: DEF_VALUE,
                }),
                getters: {
                    ...createGetters<
                        MyState,
                        MyGetters,
                        MyRootState,
                        MyRootGetters
                    >({
                        upper: state => state.value.toUpperCase(),
                        upperAndNext: (_, getters, __, rootGetters) =>
                            getters.upper + rootGetters.next,
                    }),
                },
            },
        },
    })

describe('getter', () => {
    let $store: Store<MyRootState>
    beforeEach(() => {
        $store = createStore()
    })

    it('root', () => {
        expect($store.getters['next']).toBe('dark')
    })

    it('sub', () => {
        expect($store.getters['sub/upper']).toBe(DEF_VALUE.toUpperCase())
    })

    it('combo', () => {
        expect($store.getters['sub/upperAndNext']).toBe(
            DEF_VALUE.toUpperCase() + 'dark'
        )
    })

    it('callback is function', () => {
        expect(typeof $store.getters['isNext']).toBe('function')
    })

    it('map', () => {
        const mapped = mapTypedGetters<MyRootGetters>().to('next')
        expect(mapped.next.call({ $store })).toBe('dark')
    })

    it('map callback', () => {
        const { isNext } = mapTypedGetters<MyRootGetters>().to('isNext')
        expect(isNext.call({ $store })('dark')).toBe(true)
        expect(isNext.call({ $store })('light')).toBe(false)
    })
})
