# vuex-typekit

<p aling="center">
    <img src="https://circleci.com/gh/Kbitt/vuex-typekit.svg?style=shield">
    <img src="https://img.shields.io/badge/coverage-100%25-brightgreen">
</p>

### A set of handy types and utility functions for creating more strongly typed Vuex modules.

## The Problem

Vuex, along with many JavaScript implementations of the flux pattern, throws away a lot of useful type information. A `Store` only keeps the type of its state and you don't get any parameter type information when calling `commit` or `dispatch`. However, by adding some extra types and utility functions, we can write types for our modules that help with both writing the modules and using them.

## TLDR: Why?

Wouldn't it be great if we could use vuex and get the benefits of static typing?

Let's say we have a mutation defined like

```typescript
SET_VALUE: (state: { value: string }, payload: { value: string }) =>
    (state.value = payload.value)
```

When using our vuex modules it would really be beneficial to be able to catch some errors early:

If we forget to pass a payload:

```typescript
valueAction: ({ commit }, payload: { value: string }) => {
    commit('SET_VALUE') // no payload!
}
```

If we pass the incorrect type of payload:

```typescript
valueAction: ({ commit }, payload: { value: string }) => {
    commit('SET_VALUE', payload.value) // incorrect payload!
}
```

Or even if we try to call a mutation (or action) that doesn't exist:

```typescript
valueAction: ({ commit }, payload: { value: string }) => {
    commit('SETVALUE', payload.value) // wrong mutation type!
}
```

We can't normally catch these kinds of errors at build time, but `vuex-typekit` makes this possible!

## How To

To take advantage of the utility functions, it is first necessary to declare interfaces for your module's Mutations, Actions and Getters (whichever are necessary for your module). This might seem laborious at first, but it makes implementing them a bit easier and we'll use them later to get type safe access to the store. It also makes it easier to extend module interfaces.

**Important to note**: _DO NOT extend Vuex's `MutationTree`, `ActionTree` and `GetterTree` interfaces, the index signature of those interfaces will weaken the typing. Instead, using the utility types in the example below will create module component trees that implicitly satisfies these interfaces._

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
    ADD_TODO: MutationType<TodoState> // provide state type and optionally payload type
    SET_DONE: MutationType<TodoState, { index: number; done: boolean }>
    SET_TEXT: MutationType<TodoState, { index: number; text: string }>
    REMOVE_TODO: MutationType<TodoState, { index: number }>
    SET_FILTER_DONE: MutationType<TodoState, { done: boolean | undefined }>
    SET_FILTER_TEXT: MutationType<TodoState, { text: string | undefined }>
}

export interface TodoGetters {
    filtered: GetterType<Todo[], TodoState> // provide return type and state, optionally the root state and root getters
    doneCount: GetterType<number, TodoState>
    notDoneCount: GetterType<number, TodoState>
}

export interface TodoActions {
    clearDone: ActionType<TodoState> // provide state type and optionally payload type
    removeTodo: ActionType<TodoState, { index: number }>
    setDone: ActionType<TodoState, { index: number; done: boolean }>
    setText: ActionType<TodoState, { index: number; text: string }>
}
```

The `MutationType` and `ActionType` types let you declare your mutations and actions based on state as well as the type of the payload. `GetterType` types a getter to its return type and state, and optionally the types of getters, root state and root getters.

Now we can implement the module with `createModule` helper function:

```typescript
export default new Store<TodoState>(
    createModule<TodoState, TodoMutations, TodoActions, TodoGetters>({
        state: () => ({
            todos: [],
            filter: {
                done: undefined,
                text: undefined,
            },
        }),
        mutations: {
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
        },
        getters: {
            filtered: state =>
                state.todos.filter(
                    todo =>
                        (state.filter.done === undefined ||
                            state.filter.done === todo.done) &&
                        (state.filter.text === undefined ||
                            todo.text.includes(state.filter.text))
                ),
            doneCount: state => state.todos.filter(todo => todo.done).length,
            notDoneCount: (state, getters) =>
                state.todos.length - getters.doneCount,
        },
        actions: {
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
        },
    })
)
```

`createModule` takes all of our interfaces and requires implementations for each mutation/action/getter. The payloads of mutations and actions are all inferred from the interfaces, so they do not need to be explicitly declared again. In the actions, we have typed versions of `commit` and `dispatch` accessible via `commit.typed` and `dispatch.typed`, and `getters`/`rootGetters` are fully typed (if interfaces for those are provided), so they only accept valid mutation/action type names for the local module, and only accept the correct type of payload (or no payload). Typed access to the store root or to submodules are accessible via `(commit|dispatch).root<T>(namespace?: string).typed` and `(commit|dispatch).sub<T>(namespace: string).typed` Calling `commit` and `dispatch` still works like normal untyped calls. You can also create separate mutation trees, action trees, etc., with the matching `createMutations`, `createActions`, etc., functions, allowing you to create them separately from your module.

## Hooks for composition-api

Use hooks inside composition-api components. Hook functions are optional and require `@vue/composition-api` to be installed. These hooks accept a namespace as either a string or a ref to a string. By passing a ref, a single component can switch between more than one namespaced module that implements the same module interface.

```typescript
// options must be passed in to use the hooks. useStore can be either a regular function that
// returns the store instance, or a hook function using the provide/inject pattern
Vue.use(VuexTypekit, {
    useStore: () => store, // return store
})
export default defineComponent({
    setup: () => {
        return {
            ...useState<TodoState>(/* namespace?: string | Ref<string> */).with(
                'filter',
                'todos'
            ),
            ...useGetters<
                TodoGetters
            >(/* namespace?: string | Ref<string> */).with(
                'doneCount',
                'filtered',
                'notDoneCount'
            ),
            ...useMutataions<
                TodoMutations
            >(/* namespace?: string | Ref<string> */).with(
                'ADD_TODO',
                'REMOVE_TODO'
            ),
            ...useActions<
                TodoActions
            >(/* namespace?: string | Ref<string> */).with(
                'setDone',
                'setText',
                'clearDone'
            ),
        }
    },
})
```

For classic options api components, we can use map functions to map a module just like the vuex helpers. Instead of using the `mapXXX` functions provided by Vuex, we can use `mapTypedXXX` provided by this module.

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
