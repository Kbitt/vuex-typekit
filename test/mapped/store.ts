import Vue from 'vue'
import { MutationType, ActionType, createModule, GetterType } from '../../src'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)
export interface State {
    count: number
    previous: number
}

export interface Mutations {
    INCREMENT: MutationType<State>
    SET_PREVIOUS: MutationType<State, { previous: number }>
}

export interface Actions {
    increment: ActionType<State>
}

export interface Getters {
    next: GetterType<number, State>
}

export default () =>
    new Store(
        createModule<State, Mutations, Actions, Getters>({
            state: () => ({ count: 0, previous: 0 }),
            mutations: {
                INCREMENT: state => state.count++,
                SET_PREVIOUS: (state, { previous }) =>
                    (state.previous = previous),
            },
            actions: {
                increment: ({ state, commit }) => {
                    commit.typed('SET_PREVIOUS', { previous: state.count })
                    commit.typed('INCREMENT')
                },
            },
            getters: {
                next: state => state.count + 1,
            },
        })
    )
