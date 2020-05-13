import {
    MutationType,
    ActionType,
    createMutations,
    createActions,
    createModule,
    GetterType,
} from '../src'

export default {
    actions: createActions<State, Mutations, Actions>({
        newValue: ({ commit }, { value }) => {
            commit('SET_VALUE', { value })
        },
    }),
}

interface State {
    value: string
}

interface Mutations {
    SET_VALUE: MutationType<State, { value: string }>
    UPDATE_VALUE: MutationType<State, { value: string }>
    CLEAR_VALUE: MutationType<State>
}

interface Actions {
    newValue: ActionType<State, { value: string }>
}

interface Getters {
    getSomething: GetterType<string, State>
}

const m = createModule<State, Mutations, Actions>({
    state: () => ({ value: '' }),
    mutations: {
        CLEAR_VALUE: (state) => {},
        SET_VALUE: (state) => {},
        UPDATE_VALUE: (state) => {},
    },
    actions: {
        newValue: ({ commit }) => {
            commit('CLEAR_VALUE')
            commit('SET_VALUE', { value: 'abc' })
            commit('UPDATE_VALUE', { value: 'xyz' })
        },
    },
    getters: {
        getSomething: (state) => ' ' + state.value,
    },
})
