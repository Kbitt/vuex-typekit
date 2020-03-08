import { Store } from 'vuex'
import { provide, inject } from '@vue/composition-api'

const STORE = Symbol('STORE')
export function provideStore(store: Store<any>) {
    provide(STORE, store)
}

export function useStore<S = any>() {
    const store = inject(STORE) as Store<S>
    if (!store) {
        throw new Error('No store has been provided')
    }
    return store
}
