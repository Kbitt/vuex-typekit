import {
    MutationType,
    GetterType,
    createMutations,
    createGetters,
    ActionType,
    createActions,
} from '../../src'

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
    SET_FILTER_DONE: MutationType<TodoState, { done: boolean | undefined }>
    SET_FILTER_TEXT: MutationType<TodoState, { text: string | undefined }>
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

export interface SubState {}

export interface SubMutations {}

export interface SubActions {}

export interface SubGetters {
    subDoneCount: GetterType<number, SubState>
    subNotDoneCount: GetterType<number, SubState>
}

export const createTodoModule = () => ({
    state: (): TodoState => ({
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
            SET_FILTER_DONE: (state, { done }) => (state.filter.done = done),
            SET_FILTER_TEXT: (state, { text }) => (state.filter.text = text),
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
        }),
    },
    modules: {
        sub: {
            namespaced: true,
            state: () => ({}),
            getters: createGetters<
                SubState,
                SubGetters,
                TodoState,
                TodoGetters
            >({
                subDoneCount: (_, __, ___, rootGetters) =>
                    rootGetters.doneCount,
                subNotDoneCount: (_, __, ___, rootGetters) =>
                    rootGetters.notDoneCount,
            }),
        },
    },
})
