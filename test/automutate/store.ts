import { ActionType, createAutomodule } from '../../src'
import { Store } from 'vuex'

export interface State {
    a: number
    b: number
    c: number
    value: string
}

export interface Actions {
    calcValue: ActionType<State>
    setValues: ActionType<State, Partial<State>>
}

export default (raw = false) => {
    const options = createAutomodule<State, Actions>({
        state: () => ({
            a: 0,
            b: 0,
            c: 0,
            value: '',
        }),
        mutations: {
            clearABC: state => {
                state.a = 0
                state.b = 0
                state.c = 0
            },
        },
        actions: {
            setValues: ({ state }, payload) => {
                if (typeof payload.a === 'number') {
                    state.a = payload.a
                }
                if (typeof payload.b === 'number') {
                    state.b = payload.b
                }
                if (typeof payload.c === 'number') {
                    state.c = payload.c
                }
                if (typeof payload.value === 'number') {
                    state.value = payload.value
                }
            },
            calcValue: ({ state }) => {
                state.value = `${state.a} - ${state.b} - ${state.c}`
            },
        },
        automutate: raw || { rawPayloads: true },
    })
    ;(options as any).strict = true
    return new Store<State>(options)
}
