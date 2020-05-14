import { createModule, GetterType } from '../../src'
import { TodoState, TodoMutations, TodoActions, TodoGetters } from './todo'

interface SubState {}

interface SubMutations {}

interface SubActions {}

interface SubGetters {
    subDoneCount: GetterType<number, SubState>
    subNotDoneCount: GetterType<number, SubState>
}

export const createTodoModule = () =>
    createModule<TodoState, TodoMutations, TodoActions, TodoGetters>({
        state: () => ({
            todos: [],
            filter: {
                done: undefined,
                text: undefined,
            },
        }),
        mutations: {
            ADD_TODO: state => state.todos.push({ done: false, text: '' }),
            REMOVE_TODO: (state, { index }) => state.todos.splice(index, 1),
            SET_DONE: (state, { index, done }) => {
                state.todos[index].done = done
            },
            SET_TEXT: (state, { index, text }) => {
                state.todos[index].text = text
            },
            SET_FILTER_DONE: (state, { done }) => (state.filter.done = done),
            SET_FILTER_TEXT: (state, { text }) => (state.filter.text = text),
        },
        getters: {
            filtered: state =>
                state.todos.filter(
                    todo =>
                        (state.filter.done === undefined ||
                            state.filter.done === todo.done) &&
                        (state.filter.text === undefined ||
                            todo.text.includes(state.filter.text))
                ),
            doneCount: state => state.todos.filter(todo => todo.done).length,
            notDoneCount: (state, getters) =>
                state.todos.length - getters.doneCount,
        },
        actions: {
            clearDone: ({ state, commit }) => {
                state.todos
                    .map(({ done }, index) => ({ index, done }))
                    .filter(({ done }) => done)
                    .map(({ index }) => index)
                    .sort()
                    .reverse()
                    .forEach(index => commit.typed('REMOVE_TODO', { index }))
            },
            removeTodo: ({ state, getters, commit }, { index }) => {
                const todo = getters.filtered[index]
                const idx = state.todos.indexOf(todo)
                commit.typed('REMOVE_TODO', { index: idx })
            },
            setDone: ({ state, commit, getters }, { index, done }) => {
                const todo = getters.filtered[index]
                const realIndex = state.todos.indexOf(todo)
                commit.typed('SET_DONE', { index: realIndex, done })
            },
            setText: ({ state, commit, getters }, { index, text }) => {
                const todo = getters.filtered[index]
                const realIndex = state.todos.indexOf(todo)
                commit.typed('SET_TEXT', { index: realIndex, text })
            },
        },
        modules: {
            sub: createModule<
                SubState,
                SubMutations,
                SubActions,
                SubGetters,
                TodoState,
                TodoGetters
            >({
                namespaced: true,
                state: () => ({}),
                mutations: {},
                actions: {},
                getters: {
                    subDoneCount: (_s, _g, _r, rootGetters) =>
                        rootGetters.doneCount,
                    subNotDoneCount: (_s, _g, _r, rootGetters) =>
                        rootGetters.notDoneCount,
                },
            }),
        },
    })
