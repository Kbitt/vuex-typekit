import { PluginObject } from 'vue/types/umd'
import { MapStateSelector, stateGetter } from '../module/state'
import { MapMutationsSelector, vmMutations } from '../module/mutation'
import { vmActions, vmGetters } from '../module'

declare module 'vue/types/vue' {
    interface Vue {
        $state: typeof stateGetter
        $mutations: typeof vmMutations
        $actions: typeof vmActions
        $getters: typeof vmGetters
    }
}

// declare const v: Vue
// v.$state<{ a: number }>().get('a')
// v.$mutations<{ foo: (state: any, data: { value: string }) => void; bar: (state: any) => void }>()
//     .commit('bar')

const plugin: PluginObject<void> = {
    install: Vue => {
        Vue.prototype.$state = stateGetter
        Vue.prototype.$mutations = vmMutations
        Vue.prototype.$actions = vmActions
        Vue.prototype.$getters = vmGetters
    },
}

export default plugin
