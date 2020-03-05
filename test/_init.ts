/// <reference types="./shims-vue" />
import Vuex from 'vuex'
import VueTypekit from '../src'
import { createLocalVue } from '@vue/test-utils'

export const getLocalVue = () => {
    const localVue = createLocalVue()

    localVue.use(Vuex)
    localVue.use(VueTypekit)
    return localVue
}

export const wait = (time: number) =>
    new Promise(resolve => {
        setTimeout(() => resolve(), time)
    })
