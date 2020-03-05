import {
    ActionType,
    MutationType,
    GetterType,
    mapTypedActions,
    createActions,
} from '../src'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
Vue.use(Vuex)
interface TestState {
    value: string
}

interface TestMutations {
    SET_VALUE: MutationType<TestState, { value: string }>
}

interface TestAction {
    setValue: ActionType<TestState, { value: string }>
    prependValue: ActionType<TestState>
}

interface TestGetters {
    valueUpper: GetterType<string, TestState>
}

const createStore = () =>
    new Store<TestState>({
        state: () => ({
            value: 'default',
        }),
        mutations: {
            SET_VALUE: (state, data: { value: string }) => {
                state.value = data.value
            },
        },
        actions: {
            ...createActions<TestState, TestMutations, TestAction, TestGetters>(
                {
                    setValue: ({ mutate }, payload) => {
                        mutate('SET_VALUE', payload)
                    },
                    prependValue: ({ state, act }) => {
                        return act('setValue', { value: 'Mr. ' + state.value })
                    },
                }
            ),
        },
    })

describe('actions', () => {
    let store: Store<TestState>
    beforeEach(() => {
        store = createStore()
    })
    it('builder call action w/ payload', () => {
        store.dispatch('setValue', { value: '123' })
        expect(store.state.value).toBe('123')
    })

    it('builder call action that calls another action', () => {
        const name = 'GRAVES'
        store.dispatch('setValue', { value: name })
        store.dispatch('prependValue')
        expect(store.state.value).toBe(`Mr. ${name}`)
    })

    it('map', () => {
        const mapped = mapTypedActions<TestAction>().to('prependValue')
        mapped.prependValue.call({ $store: store })
    })

    it('use getters', () => {})
})
