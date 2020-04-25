import Vue from 'vue'
import { TodoState, TodoMutations, TodoActions, TodoGetters } from './todo'
import {
    mapTypedState,
    mapTypedMutations,
    mapTypedActions,
    mapTypedGetters,
} from '../../src'
export const template = `
<div>
    <button type="button" id="add" @click="ADD_TODO">Add</button>
    <button type="button" id="clear" @click="clearDone">Clear Done</button>
    <ul id="list">
        <li v-for="(todo, index) in todos" :key="filter + index">
            <input
                type="checkbox"
                :value="todo.done"
                @input="setDone({ done: $event.target.checked, index })"
            />
            <input
                type="text"
                :value="todo.text"
                @input="setText({ text: $event.target.value, index })"
            />
            <button type="button" @click="REMOVE_TODO(index)">X</button>
        </li>
    </ul>
</div>
`

const createTodoComponent = (
    useInstanceMethods = false,
    namespace: string | undefined = undefined
) => {
    if (!useInstanceMethods) {
        return Vue.extend({
            template,
            computed: {
                ...mapTypedState<TodoState>(namespace).to('todos', 'filter'),
                ...mapTypedGetters<TodoGetters>(namespace).to(
                    'doneCount',
                    'notDoneCount',
                    'filtered'
                ),
            },
            methods: {
                ...mapTypedMutations<TodoMutations>(namespace).to(
                    'ADD_TODO',
                    'REMOVE_TODO'
                ),
                ...mapTypedActions<TodoActions>(namespace).to(
                    'setDone',
                    'setText',
                    'clearDone'
                ),
            },
        })
    }

    return Vue.extend({
        template,
        computed: {
            todos(this: Vue) {
                return this.$state<TodoState>(namespace).get('todos')
            },
            filter(this: Vue) {
                return this.$state<TodoState>(namespace).get('filter')
            },
            filtered(this: Vue) {
                return this.$getters<TodoGetters>().get('filtered')
            },
            doneCount(this: Vue) {
                return this.$getters<TodoGetters>().get('doneCount')
            },
            notDoneCount(this: Vue) {
                return this.$getters<TodoGetters>().get('notDoneCount')
            },
        },
        methods: {
            ADD_TODO(this: Vue) {
                this.$mutations<TodoMutations>(namespace).commit('ADD_TODO')
            },
            REMOVE_TODO(this: Vue, payload: { index: number }) {
                this.$mutations<TodoMutations>(namespace).commit(
                    'REMOVE_TODO',
                    payload
                )
            },
            clearDone(this: Vue) {
                this.$actions<TodoActions>(namespace).dispatch('clearDone')
            },
            setText(this: Vue, payload: { text: string; index: number }) {
                this.$actions<TodoActions>(namespace).dispatch(
                    'setText',
                    payload
                )
            },
            setDone(this: Vue, payload: { done: boolean; index: number }) {
                this.$actions<TodoActions>(namespace).dispatch(
                    'setDone',
                    payload
                )
            },
        },
    })
}

export default createTodoComponent
