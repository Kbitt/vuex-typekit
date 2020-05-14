import Vue from 'vue'
import {
    TodoState,
    TodoMutations,
    TodoActions,
    TodoGetters,
    SubGetters,
} from './todo'
import {
    mapTypedState,
    mapTypedMutations,
    mapTypedActions,
    mapTypedGetters,
} from '../../src'
export const template = `
<div>
    <button type="button" id="add" @click="ADD_TODO">Add</button>
    <button type="button" id="mappedAdd" @click="addTodo">Add</button>
    <button type="button" id="clear" @click="clearDone">Clear Done</button>
    <div><span>Done: {{ doneCount }} </span><span>Not done: {{ notDoneCount }}</span></div>
    <div><span>Done: {{ subDoneCount }} </span><span>Not done: {{ subNotDoneCount }}</span></div>
    <div><input readonly id="count" :value="mappedTodos.length" ></div>
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
                ...mapTypedState<TodoState>(namespace)
                    .map('todos')
                    .to(state => ({ mappedTodos: state.todos })),
                ...mapTypedGetters<TodoGetters>(namespace).to(
                    'doneCount',
                    'notDoneCount',
                    'filtered'
                ),
                ...mapTypedGetters<SubGetters>(
                    namespace ? namespace + '/sub' : 'sub'
                ).to('subDoneCount', 'subNotDoneCount'),
            },
            methods: {
                ...mapTypedMutations<TodoMutations>(namespace).to(
                    'ADD_TODO',
                    'REMOVE_TODO'
                ),
                ...mapTypedMutations<TodoMutations>(namespace)
                    .map('ADD_TODO', 'REMOVE_TODO')
                    .to(({ ADD_TODO, REMOVE_TODO }) => ({
                        addTodo: ADD_TODO,
                        removeTodo: REMOVE_TODO,
                    })),
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
            mappedTodos(this: Vue) {
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
            subDoneCount(this: Vue) {
                return this.$getters<SubGetters>('sub').get('subDoneCount')
            },
            notDoneCount(this: Vue) {
                return this.$getters<TodoGetters>().get('notDoneCount')
            },
            subNotDoneCount(this: Vue) {
                return this.$getters<SubGetters>('sub').get('subNotDoneCount')
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
            addTodo(this: Vue) {
                this.$mutations<TodoMutations>(namespace).commit('ADD_TODO')
            },
            removeTodo(this: Vue, payload: { index: number }) {
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
