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
<div id="root">
    <button type="button" id="add" @click="ADD_TODO">Add</button>
    <button type="button" id="mappedAdd" @click="addTodo">Add</button>
    <button type="button" id="clear" @click="clearDone">Clear Done</button>
    <button type="button" id="mappedClearDone" @click="mappedClearDone">Clear Done</button>
    <div><span>Done: {{ doneCount }} </span><span>Not done: {{ notDoneCount }}</span></div>
    <div><span>Done: {{ subDoneCount }} </span><span>Not done: {{ subNotDoneCount }}</span></div>
    <div><input id="mappedDoneCount" :value="mappedDoneCount"></div>
    <div><input id="count" :value="mappedTodos.length" ></div>
    <div><input id="contains" :value="contains('foo').length" ></div>
    <div><input id="containsFoo" :value="containsFoo.length" ></div>
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
                containsFoo() {
                    return this.$getters<TodoGetters>(namespace).get(
                        'contains'
                    )('foo')
                },
                ...mapTypedState<TodoState>(namespace).to('todos', 'filter'),
                ...mapTypedState<TodoState>(namespace)
                    .map('todos')
                    .to(state => ({ mappedTodos: state.todos })),
                ...mapTypedGetters<TodoGetters>(namespace).to(
                    'doneCount',
                    'notDoneCount',
                    'filtered',
                    'contains'
                ),
                ...mapTypedGetters<TodoGetters>(namespace)
                    .map('doneCount')
                    .to(({ doneCount }) => ({ mappedDoneCount: doneCount })),
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
                ...mapTypedActions<TodoActions>(namespace)
                    .map('clearDone')
                    .to(({ clearDone }) => ({ mappedClearDone: clearDone })),
            },
        })
    }

    return Vue.extend({
        template,
        computed: {
            containsFoo() {
                return this.$getters<TodoGetters>(namespace).get('contains')(
                    'foo'
                )
            },
            todos() {
                return this.$state<TodoState>(namespace).get('todos')
            },
            mappedTodos() {
                return this.$state<TodoState>(namespace).get('todos')
            },
            filter() {
                return this.$state<TodoState>(namespace).get('filter')
            },
            filtered() {
                return this.$getters<TodoGetters>(namespace).get('filtered')
            },
            doneCount() {
                return this.$getters<TodoGetters>(namespace).get('doneCount')
            },
            contains() {
                return this.$getters<TodoGetters>(namespace).get('contains')
            },
            mappedDoneCount() {
                return this.$getters<TodoGetters>(namespace).get('doneCount')
            },
            subDoneCount() {
                return this.$getters<SubGetters>('sub').get('subDoneCount')
            },
            notDoneCount() {
                return this.$getters<TodoGetters>(namespace).get('notDoneCount')
            },
            subNotDoneCount() {
                return this.$getters<SubGetters>('sub').get('subNotDoneCount')
            },
        },
        methods: {
            ADD_TODO() {
                this.$mutations<TodoMutations>(namespace).commit('ADD_TODO')
            },
            REMOVE_TODO(payload: { index: number }) {
                this.$mutations<TodoMutations>(namespace).commit(
                    'REMOVE_TODO',
                    payload
                )
            },
            addTodo() {
                this.$mutations<TodoMutations>(namespace).commit('ADD_TODO')
            },
            removeTodo(payload: { index: number }) {
                this.$mutations<TodoMutations>(namespace).commit(
                    'REMOVE_TODO',
                    payload
                )
            },
            clearDone() {
                this.$actions<TodoActions>(namespace).dispatch('clearDone')
            },
            mappedClearDone() {
                this.$actions<TodoActions>(namespace).dispatch('clearDone')
            },
            setText(payload: { text: string; index: number }) {
                this.$actions<TodoActions>(namespace).dispatch(
                    'setText',
                    payload
                )
            },
            setDone(payload: { done: boolean; index: number }) {
                this.$actions<TodoActions>(namespace).dispatch(
                    'setDone',
                    payload
                )
            },
        },
    })
}

export default createTodoComponent
