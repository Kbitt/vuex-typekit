import Vue from 'vue'
import Vuex, { Store, Module } from 'vuex'
import { createModule, MutationType, ActionType } from '../../src'

Vue.use(Vuex)
export interface State {
    value: string
    fooCount: number
    barCount: number
}

export interface Mutations {
    SET_VALUE: MutationType<State, { value: string }>
    INC_FOO: MutationType<State>
    INC_BAR: MutationType<State>
}

export interface Actions {
    setValue: ActionType<State, { value: string }>
    fooAction: ActionType<State>
    barAction: ActionType<State>
    barRootAction: ActionType<State>
    barRootRootAction: ActionType<State>
}

const createExampleModule = (sub = false): Module<State, State> =>
    createModule<State, Mutations, Actions>({
        namespaced: sub ? undefined : true,
        state: () => ({ value: '', fooCount: 0, barCount: 0 }),
        mutations: {
            INC_FOO: state => state.fooCount++,
            INC_BAR: state => state.barCount++,
            SET_VALUE: (state, { value }) => (state.value = value),
        },
        actions: {
            fooAction: ({ commit }) => commit.typed('INC_FOO'),
            barAction: ({ commit }) => {
                if (sub) {
                    commit.sub<Mutations>('sub').commit('INC_BAR')
                } else {
                    commit.root<Mutations>().commit('INC_BAR')
                }
            },
            barRootAction: ({ commit }) => {
                if (!sub) {
                    commit.root<Mutations>('sub').commit('INC_BAR')
                }
            },
            barRootRootAction: ({ dispatch }) => {
                if (sub) return Promise.resolve()
                return dispatch.root<Actions>('sub').dispatch('barRootAction')
            },
            setValue: async ({ commit, dispatch }, payload) => {
                await dispatch.typed('fooAction')
                if (sub) {
                    await dispatch.sub<Actions>('sub').dispatch('fooAction')
                } else {
                    await dispatch.root<Actions>().dispatch('fooAction')
                }
                commit.typed('SET_VALUE', payload)
            },
        },
        modules: sub
            ? {
                  sub: createExampleModule(),
              }
            : undefined,
    })

export const createStore = () =>
    new Store<State & { sub?: State }>(createExampleModule(true))
