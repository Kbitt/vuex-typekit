import { PluginObject } from 'vue/types/umd'
import { stateGetter } from '../module/state'
import { vmMutations } from '../module/mutation'
import { vmActions, vmGetters } from '../module'
import { setUseStoreHook } from '../hooks/store'
import { Store } from 'vuex'

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
export type VuexTypekitPluginOptions = {
    useStore: () => Store<any>
}
const plugin: PluginObject<VuexTypekitPluginOptions> = {
    install: (Vue, options) => {
        if (options && options.useStore) {
            setUseStoreHook(options.useStore)
        }
        Vue.prototype.$state = stateGetter
        Vue.prototype.$mutations = vmMutations
        Vue.prototype.$actions = vmActions
        Vue.prototype.$getters = vmGetters
    },
}

export default plugin
