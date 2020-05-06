import { MutationType, mapTypedMutations } from '../src'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import MutationComponent from './components/Mutation.vue'
import { getLocalVue } from './_init'
Vue.use(Vuex)

export interface TestState {
    value: string
}

export interface TestMutations {
    SET_VALUE: MutationType<TestState, { value: string }>
}

const getMutations = (): TestMutations => ({
    SET_VALUE: (state, { value }) => {
        state.value = value
    },
})

describe('mutations', () => {
    let $store: Store<TestState>

    beforeEach(() => {
        $store = new Store<TestState>({
            state: () => ({
                value: '',
            }),
            mutations: {
                ...getMutations(),
            },
        })
    })

    it('test a mutation', () => {
        expect($store.state.value).toBe('')

        const TEST_VAL = 'ASDFYASDFH123132'

        mapTypedMutations<TestMutations>()
            .to('SET_VALUE')
            .SET_VALUE.call({ $store }, { value: TEST_VAL })
        expect($store.state.value).toBe(TEST_VAL)
    })

    it('test in component', async () => {
        const TEST_VAL = 'ASDFYASDFH123132'
        const localVue = getLocalVue()
        const wrapped = shallowMount(MutationComponent, {
            localVue,
            store: $store,
        })
        const wrappedInput = wrapped.find('input')
        const el = wrappedInput.element as HTMLInputElement
        expect(el.value).toBe('')
        await wrappedInput.setValue(TEST_VAL)
        expect(el.value).toBe(TEST_VAL)
    })
})
