# vuex-typekit

### A set of handy types and utility functions for creating more strongly typed Vuex modules.

## The Problem

Vuex, along with many JavaScript implementations of the flux pattern, throws away a lot of useful type information. A `Store` only keeps the type of its state and you don't get any parameter type information when calling `commit` or `dispatch`. However, by adding some extra types and utility functions, we can write Vuex modules with useful type information that extends from the module's definition to its consumption.

## How To

To take advantage of the utility functions, it is first necessary to declare interfaces for your module's Mutations, Actions and Getters (whichever are necessary for your module). It's important to note: DO NOT extends Vuex's `MutationTree`, `ActionTree` and `GetterTree` interfaces, the index signature of those interfaces will weaken the typing. Instead, using the utility types in the example below will create module component trees that implicitly satisfies these interfaces.

```typescript
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
```

The `MutationType` and `ActionType` types let you declare your mutations and actions based on state as well as the type of the payload. `GetterType` types a getter to its return type and state, and optionally the types of getters, root state and root getters.

Declaring all of these interfaces might seem like a lot of extra work, but they'll make it a bit easier to implement the actual module functions, and much easier to access them in your Vue components.

Now we can implement the module:

```typescript
const store = new Store<TodoState>({
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
            setText: ({ state, mutate, getters }, { index, text }) => {
                const todo = getters.filtered[index]
                const realIndex = state.todos.indexOf(todo)
                mutate('SET_TEXT', { index: realIndex, text })
            },
        }),
    },
})
```

The `createMutations` and `createGetters` functions simply take the state and mutation types we defined and requires correct implementations be passed into them (which are returned by the result). And since the parameters are defined in our interfaces, they're already implicitly typed in the implentations (no `payload?: any`). In `createActions` a little bit more magic happens. For one, all of the getters can be fully typed. But the context passed to each action has a couple extra functions: `mutate` and `send`, which are strongly typed versions of `commit` and `dispatch` (and which are simply wrappers for the latter, respectively). All local mutation/action names and payload types are available when using these functions, but the original `commit` and `dispatch` are still there for calling outside the current module. The results of these utility functions are simply a map of mutations, actions, and getters, for a completely normal vuex module at runtime. No classes or decorators, just objects.

Now we can use these interfaces when we consume the module as well. Instead of using the `mapXXX` functions provided by Vuex, we can use `mapTypedXXX` provided by this module.

```typescript
export default Vue.extend({
    template,
    computed: {
        ...mapTypedState<TodoState>(/* namespace?: string */).to(
            'todos',
            'filter'
        ),
        ...mapTypedGetters<TodoGetters>(/* namespace?: string */).to(
            'doneCount',
            'notDoneCount',
            'filtered'
        ),
    },
    methods: {
        ...mapTypedMutations<TodoMutations>(/* namespace?: string */).to(
            'ADD_TODO',
            'REMOVE_TODO'
        ),
        ...mapTypedActions<TodoActions>(/* namespace?: string */).to(
            'setDone',
            'setText',
            'clearDone'
        ),
    },
})
```

The `mapTypedXXX` functions, as shown above, have a slightly different syntax from vuex's helpers. We pass in a type argument (and optionally pass a namespace). Then chain a call to a `to` method, which accepts a list of typed keys. The result is fully typed as well, which means the all the keys we choose to map are known at design time, so they can even be inferred by developer tools like Vetur inside your component templates.

Typed access to the store through the view model instance is available as well, just like how you can access `this.$store`.

```typescript
import Vue from 'vue'
import VuexTypekit from 'vuex-typekit'

Vue.use(VuexTypekit) // <-- required for vue instance methods below

export default Vue.extend({
    computed: {
        todos() {
            return this.$state<TodoState>(/* namespace?: string */).get('todos')
        },
        filter() {
            return this.$state<TodoState>(/* namespace?: string */).get(
                'filter'
            )
        },
        filtered() {
            return this.$getters<TodoGetters>(/* namespace?: string */).get(
                'filtered'
            )
        },
        doneCount() {
            return this.$getters<TodoGetters>(/* namespace?: string */).get(
                'doneCount'
            )
        },
        notDoneCount() {
            return this.$getters<TodoGetters>(/* namespace?: string */).get(
                'notDoneCount'
            )
        },
    },
    methods: {
        ADD_TODO() {
            this.$mutations<TodoMutations>(/* namespace?: string */).commit(
                'ADD_TODO'
            )
        },
        REMOVE_TODO(payload: { index: number }) {
            this.$mutations<TodoMutations>(/* namespace?: string */).commit(
                'REMOVE_TODO',
                payload
            )
        },
        clearDone() {
            this.$actions<TodoActions>(/* namespace?: string */).dispatch(
                'clearDone'
            )
        },
        setText(payload: { text: string; index: number }) {
            this.$actions<TodoActions>(/* namespace?: string */).dispatch(
                'setText',
                payload
            )
        },
        setDone(payload: { done: boolean; index: number }) {
            this.$actions<TodoActions>(/* namespace?: string */).dispatch(
                'setDone',
                payload
            )
        },
    },
})
```

This trivial example simply replaces the mapping functions with the same result using the instance methods. Just like in all the other examples, keys, payloads and results are fully typed based on the interfaces passed into them. In the simplest use, this would allow you to map some module properties to different names (in case of name collision). But you could also use state/mutations/actions/etc in any method or computed property, again with strong typing.
