import { defineComponent } from '@vue/composition-api'
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
            return {
                ...useState<TodoState>(namespace).with('filter', 'todos'),
                ...useGetters<TodoGetters>(namespace).with(
                    'doneCount',
                    'filtered',
                    'notDoneCount'
                ),
                ...useGetters<SubGetters>(
                    namespace ? namespace + '/sub' : 'sub'
                ).with('subDoneCount', 'subNotDoneCount'),
                ...useMutations<TodoMutations>(namespace).with(
                    'ADD_TODO',
                    'REMOVE_TODO'
                ),
                ...useActions<TodoActions>(namespace).with(
                    'setDone',
                    'setText',
                    'clearDone'
                ),
            }
        },
    })
}
