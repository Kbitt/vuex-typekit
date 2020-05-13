import {
    createTodoModule,
    TodoState,
    TodoMutations,
    TodoActions,
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
            ExtendedTodoActions
        >({
            ...actions,
            save: ({}, { isDirty }) => Promise.resolve(),
            clearDone: () => Promise.resolve(),
        }),
    }
}
