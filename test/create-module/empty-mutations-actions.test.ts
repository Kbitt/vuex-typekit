import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createModule } from '../../src'

Vue.use(Vuex)

describe('test mutations/actions not defined', () => {
    it('test it', () => {
        const module = createModule<{}>({
            state: {},
        })

        expect(Object.keys(module.mutations!).length).toBe(0)
        expect(Object.keys(module.actions!).length).toBe(0)
    })
})
