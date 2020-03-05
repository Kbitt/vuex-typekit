import {
    MutationType,
    GetterType,
    createMutations,
    createGetters,
    ActionType,
    createActions,
} from '../../src'
import { Module } from 'vuex'

export type Todo = {
    done: boolean
    text: string
}

export interface TodoState {
    todos: Todo[]
    filter: {
        done: boolean | undefined
        text: string | undefined
    }
}

export interface TodoMutations {
    ADD_TODO: MutationType<TodoState>
    SET_DONE: MutationType<TodoState, { index: number; done: boolean }>
    SET_TEXT: MutationType<TodoState, { index: number; text: string }>
    REMOVE_TODO: MutationType<TodoState, { index: number }>
}

export interface TodoGetters {
    filtered: GetterType<Todo[], TodoState>
    doneCount: GetterType<number, TodoState>
    notDoneCount: GetterType<number, TodoState>
}

export interface TodoActions {
    clearDone: ActionType<TodoState>
    removeTodo: ActionType<TodoState, { index: number }>
    setDone: ActionType<TodoState, { index: number; done: boolean }>
    setText: ActionType<TodoState, { index: number; text: string }>
}

export const createTodoModule = (): Module<TodoState, any> => ({
    state: () => ({
        todos: [],
        filter: {
            done: undefined,
            text: undefined,
        },
    }),
    mutations: {
        ...createMutations<TodoState, TodoMutations>({
            ADD_TODO: state => state.todos.push({ done: false, text: '' }),
            REMOVE_TODO: (state, { index }) => state.todos.splice(index, 1),
            SET_DONE: (state, { index, done }) => {
                state.todos[index].done = done
            },
            SET_TEXT: (state, { index, text }) => {
                state.todos[index].text = text
            },
        }),
    },
    getters: {
        ...createGetters<TodoState, TodoGetters>({
            filtered: state =>
                state.todos.filter(
                    todo =>
                        (state.filter.done === undefined ||
                            state.filter.done === todo.done) &&
                        (state.filter.text === undefined ||
                            todo.text.includes(state.filter.text))
                ),
            doneCount: state => state.todos.filter(todo => todo.done).length,
            notDoneCount: state =>
                state.todos.filter(todo => !todo.done).length,
        }),
    },
    actions: {
        ...createActions<TodoState, TodoMutations, TodoActions, TodoGetters>({
            clearDone: ({ state, mutate }) => {
                state.todos
                    .map(({ done }, index) => ({ index, done }))
                    .filter(({ done }) => done)
                    .map(({ index }) => index)
                    .sort()
                    .reverse()
                    .forEach(index => mutate('REMOVE_TODO', { index }))
            },
            removeTodo: ({ state, getters, mutate }, { index }) => {
                const todo = getters.filtered[index]
                const idx = state.todos.indexOf(todo)
                mutate('REMOVE_TODO', { index: idx })
            },
            setDone: ({ state, mutate, getters }, { index, done }) => {
                const todo = getters.filtered[index]
                const realIndex = state.todos.indexOf(todo)
                mutate('SET_DONE', { index: realIndex, done })
            },
            setText: ({ state, mutate, getters, act }, { index, text }) => {
                const todo = getters.filtered[index]
                const realIndex = state.todos.indexOf(todo)
                mutate('SET_TEXT', { index: realIndex, text })
            },
        }),
    },
})
