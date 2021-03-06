import { getLocalVue } from '../_init'
import { Store } from 'vuex'
import { TodoState, createTodoModule } from './todo'
import { createTodoModule as createTodoB } from './todo-create'
import createTodoComponent from './component'
import { createHookTodoComponent } from '../hooks/component'
import { VueClass, shallowMount } from '@vue/test-utils'

interface RunTestParams {
    component: VueClass<any>
    namespace?: string
    useCreateModule?: boolean
}

describe('test todos', () => {
    let localVue: ReturnType<typeof getLocalVue>
    let store: Store<TodoState>

    const getState = (namespace?: string) =>
        namespace ? ((store.state as any)[namespace] as TodoState) : store.state

    const getGetter = (name: string, namespace?: string) =>
        store.getters[namespace ? `${namespace}/${name}` : name]

    const commit = (name: string, payload?: any, namespace?: string) => {
        store.commit(namespace ? `${namespace}/${name}` : name, payload)
    }

    const dispatch = (name: string, payload?: any, namespace?: string) => {
        store.dispatch(namespace ? `${namespace}/${name}` : name, payload)
    }

    const createStore = (useCreateModule: boolean) => {
        store = new Store(useCreateModule ? createTodoB() : createTodoModule())
    }

    beforeEach(() => {
        localVue = getLocalVue({ useStore: () => store })
    })

    const runTest = async ({ component, namespace }: RunTestParams) => {
        const wrapped = shallowMount(component, { localVue, store })
        await wrapped.find('#add').trigger('click')
        expect(getState(namespace).todos.length).toBe(1)
        expect(getGetter('doneCount', namespace)).toBe(0)
        expect(
            (wrapped.find('#mappedDoneCount').element as HTMLInputElement).value
        ).toBe('0')
        expect(getGetter('notDoneCount', namespace)).toBe(1)

        const li = wrapped.find('li').element
        const [doneEl, textEl] = Array.from(li.children) as [
            HTMLInputElement,
            HTMLInputElement
        ]
        const TASK = 'DO THAT THING'

        const getInputValue = (selector: string) =>
            (wrapped.find(selector).element as HTMLInputElement).value
        textEl.value = TASK
        textEl.dispatchEvent(new Event('input'))

        expect(getInputValue('#contains')).toBe('0')
        expect(getInputValue('#containsFoo')).toBe('0')

        await localVue.nextTick()

        expect(getState(namespace).todos[0].text).toBe(TASK)

        doneEl.checked = true
        doneEl.dispatchEvent(new Event('input'))
        await localVue.nextTick()

        expect(getGetter('doneCount', namespace)).toBe(1)
        expect(getInputValue('#mappedDoneCount')).toBe('1')
        expect(getGetter('notDoneCount', namespace)).toBe(0)
        expect(getState(namespace).todos[0].done).toBe(true)

        await wrapped.find('#clear').trigger('click')

        expect(getState(namespace).todos.length).toBe(0)
        expect(getGetter('doneCount', namespace)).toBe(0)
        expect(getGetter('notDoneCount', namespace)).toBe(0)

        commit('ADD_TODO', null, namespace)
        await localVue.nextTick()
        expect(wrapped.findAll('li').length).toBe(1)
        commit('ADD_TODO', null, namespace)
        commit('ADD_TODO', null, namespace)
        commit('SET_TEXT', { index: 0, text: 'foo' }, namespace)
        await localVue.nextTick()
        await localVue.nextTick()
        expect(wrapped.findAll('li').length).toBe(3)
        expect(getInputValue('#contains')).toBe('1')
        expect(getInputValue('#containsFoo')).toBe('1')

        await wrapped.find('#mappedAdd').trigger('click')
        expect(wrapped.findAll('li').length).toBe(4)

        const root = wrapped.find('#root').element
        // mark everything as done
        Array.from(root.querySelectorAll('input[type=checkbox]')).forEach(e => {
            const el = e as HTMLInputElement
            el.checked = true
            el.dispatchEvent(new Event('input'))
        })
        await localVue.nextTick()
        await wrapped.find('#mappedClearDone').trigger('click')
        expect(getState(namespace).todos.length).toBe(0)
        expect(getInputValue('#contains')).toBe('0')
        expect(getInputValue('#containsFoo')).toBe('0')
    }

    ;[true, false].forEach(useCreateModule => {
        const getTestName = (name: string) =>
            `${name} (useCreateModule = ${useCreateModule})`
        it(getTestName('test mapped todos component'), async () => {
            createStore(useCreateModule)
            await runTest({
                component: createTodoComponent(),
                useCreateModule,
            })
        })

        it(getTestName('test vm todos component'), async () => {
            createStore(useCreateModule)
            await runTest({
                component: createTodoComponent(true),
                useCreateModule,
            })
        })

        it(getTestName('test mapped todos w/ namespace'), async () => {
            createStore(useCreateModule)
            const namespace = 'subTodos'
            store.registerModule(namespace, {
                ...createTodoModule(),
                namespaced: true,
            })
            await runTest({
                component: createTodoComponent(false, namespace),
                namespace,
                useCreateModule,
            })
        })

        it(getTestName('test vm todos w/ namespace'), async () => {
            createStore(useCreateModule)
            const namespace = 'subTodos'
            store.registerModule(namespace, {
                ...createTodoModule(),
                namespaced: true,
            })
            await runTest({
                component: createTodoComponent(true, namespace),
                namespace,
                useCreateModule,
            })
        })

        it(getTestName('test hooks as root'), async () => {
            createStore(useCreateModule)
            await runTest({
                component: createHookTodoComponent(),
                useCreateModule,
            })
        })

        it(getTestName('test hooks w/ namespace'), async () => {
            createStore(useCreateModule)
            const namespace = 'subTodos'
            store.registerModule(namespace, {
                ...createTodoModule(),
                namespaced: true,
            })
            await runTest({
                component: createHookTodoComponent(namespace),
                namespace,
                useCreateModule,
            })
        })
    })
})
