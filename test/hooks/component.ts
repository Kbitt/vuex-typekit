import { defineComponent, computed } from '@vue/composition-api'
import { template } from '../todo/component'
import {
    TodoState,
    TodoActions,
    TodoMutations,
    TodoGetters,
    SubGetters,
} from '../todo/todo'
import { useActions, useGetters, useState, useMutations } from '../../src'

export function createHookTodoComponent(namespace?: string) {
    return defineComponent({
        template,
        setup: () => {
            const getters = useGetters<TodoGetters>(namespace).with(
                'doneCount',
                'filtered',
                'notDoneCount',
                'contains'
            )
            return {
                containsFoo: computed(() => getters.contains.value('foo')),
                ...useState<TodoState>(namespace).with('filter', 'todos'),
                ...useState<TodoState>(namespace)
                    .map('todos')
                    .to(state => ({ mappedTodos: state.todos })),
                ...getters,
                ...useGetters<TodoGetters>(namespace)
                    .map('doneCount')
                    .to(({ doneCount }) => ({ mappedDoneCount: doneCount })),
                ...useGetters<SubGetters>(
                    namespace ? namespace + '/sub' : 'sub'
                ).with('subDoneCount', 'subNotDoneCount'),
                ...useMutations<TodoMutations>(namespace).with(
                    'ADD_TODO',
                    'REMOVE_TODO'
                ),
                ...useMutations<TodoMutations>(namespace)
                    .map('ADD_TODO', 'REMOVE_TODO')
                    .to(({ ADD_TODO, REMOVE_TODO }) => ({
                        addTodo: ADD_TODO,
                        removeTodo: REMOVE_TODO,
                    })),
                ...useActions<TodoActions>(namespace).with(
                    'setDone',
                    'setText',
                    'clearDone'
                ),
                ...useActions<TodoActions>(namespace)
                    .map('clearDone')
                    .to(({ clearDone }) => ({ mappedClearDone: clearDone })),
            }
        },
    })
}
