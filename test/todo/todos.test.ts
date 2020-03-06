import { getLocalVue } from '../_init'
import { Store } from 'vuex'
import { TodoState, createTodoModule } from './todo'
import createTodoComponent from './component'
import { createHookTodoComponent } from '../hooks/component'
import { mount, VueClass, shallowMount } from '@vue/test-utils'

describe('', () => {
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

    beforeEach(() => {
        localVue = getLocalVue({ useStore: () => store })
        store = new Store(createTodoModule())
    })

    const runTest = async (Component: VueClass<any>, namespace?: string) => {
        const wrapped = shallowMount(Component, { localVue, store })
        wrapped.find('#add').trigger('click')
        await localVue.nextTick()
        expect(getState(namespace).todos.length).toBe(1)
        expect(getGetter('doneCount', namespace)).toBe(0)
        expect(getGetter('notDoneCount', namespace)).toBe(1)

        const li = wrapped.find('li').element
        const [doneEl, textEl, delBtn] = Array.from(li.children) as [
            HTMLInputElement,
            HTMLInputElement,
            HTMLButtonElement
        ]
        const TASK = 'DO THAT THING'
        textEl.value = TASK
        textEl.dispatchEvent(new Event('input'))

        await localVue.nextTick()

        expect(getState(namespace).todos[0].text).toBe(TASK)

        doneEl.checked = true
        doneEl.dispatchEvent(new Event('input'))
        await localVue.nextTick()

        expect(getGetter('doneCount', namespace)).toBe(1)
        expect(getGetter('notDoneCount', namespace)).toBe(0)
        expect(getState(namespace).todos[0].done).toBe(true)

        wrapped.find('#clear').trigger('click')
        await localVue.nextTick()

        expect(getState(namespace).todos.length).toBe(0)
        expect(getGetter('doneCount', namespace)).toBe(0)
        expect(getGetter('notDoneCount', namespace)).toBe(0)

        commit('ADD_TODO', null, namespace)
        await localVue.nextTick()
        expect(wrapped.findAll('li').length).toBe(1)
        commit('ADD_TODO', null, namespace)
        commit('ADD_TODO', null, namespace)
        await localVue.nextTick()
        expect(wrapped.findAll('li').length).toBe(3)
    }

    it('test mapped todos component', async () => {
        await runTest(createTodoComponent())
    })

    it('test vm todos component', async () => {
        await runTest(createTodoComponent(true))
    })

    it('test mapped todos w/ namespace', async () => {
        const namespace = 'subTodos'
        store.registerModule(namespace, {
            ...createTodoModule(),
            namespaced: true,
        })
        await runTest(createTodoComponent(false, namespace), namespace)
    })

    it('test vm todos w/ namespace', async () => {
        const namespace = 'subTodos'
        store.registerModule(namespace, {
            ...createTodoModule(),
            namespaced: true,
        })
        await runTest(createTodoComponent(true, namespace), namespace)
    })

    it('test hooks as root', async () => {
        await runTest(createHookTodoComponent())
    })

    it('test hooks w/ namespace', async () => {
        const namespace = 'subTodos'
        store.registerModule(namespace, {
            ...createTodoModule(),
            namespaced: true,
        })
        await runTest(createHookTodoComponent(namespace), namespace)
    })
})
