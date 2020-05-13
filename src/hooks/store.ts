import { Store } from 'vuex'

let useStoreHook: null | (() => Store<any>) = null

export function setUseStoreHook(hook: () => Store<any>) {
    useStoreHook = hook
}

export function useStore<S = any>() {
    if (!useStoreHook)
        throw new Error(
            'useStore hook has not been provided to vuex-typekit, make sure to set it when calling Vue.use(VuexTypekit)'
        )
    return useStoreHook() as Store<S>
}
