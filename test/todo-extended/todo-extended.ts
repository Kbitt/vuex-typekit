import {
    createTodoModule,
    TodoState,
    TodoMutations,
    TodoActions,
    TodoGetters,
} from '../todo/todo'
import {
    MutationType,
    ActionType,
    createMutations,
    createActions,
} from '../../src'

export interface ExtendedTodoState extends TodoState {
    isDirty: boolean
}

export interface ExtendedTodoMutations extends TodoMutations {
    SET_IS_DIRTY: MutationType<ExtendedTodoState, { isDirty: boolean }>
}

export interface ExtendedTodoActions extends TodoActions {
    save: ActionType<ExtendedTodoState, { isDirty: boolean }>
}

export const createExtendedTodoModule = () => {
    const { state, mutations, actions, getters } = createTodoModule()
    actions
    return {
        state: (): ExtendedTodoState => ({
            ...state(),
            isDirty: false,
        }),
        mutations: createMutations<ExtendedTodoState, ExtendedTodoMutations>({
            ...mutations,
            SET_IS_DIRTY: (state, { isDirty }) => {
                state.isDirty = isDirty
            },
        }),
        actions: createActions<
            ExtendedTodoState,
            ExtendedTodoMutations,
            ExtendedTodoActions,
            TodoGetters
        >({
            ...actions,
            save: ({ commit, dispatch, getters }, { isDirty }) => {
                commit.typed('REMOVE_TODO', { index: 0 })
                dispatch.typed('clearDone')
            },
            clearDone: () => Promise.resolve(),
        }),
    }
}
