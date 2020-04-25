/// <reference types="./shims-vue" />
import Vuex, { Store } from 'vuex'
import VueTypekit from '../src'
import CompositionApi from '@vue/composition-api'
import { createLocalVue } from '@vue/test-utils'

export const getLocalVue = (options?: { useStore: () => Store<any> }) => {
    const localVue = createLocalVue()

    localVue.use(Vuex)
    localVue.use(CompositionApi)
    localVue.use(VueTypekit, options)
    return localVue
}

export const wait = (time: number) =>
    new Promise(resolve => {
        setTimeout(() => resolve(), time)
    })
