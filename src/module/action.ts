import {
    Store,
    ActionContext,
    Action,
    ActionObject,
    ActionHandler,
    mapActions,
} from 'vuex'
import { SubType, VueForMappers } from './types'

export type ActionType<S, P = void> = P extends void
    ? (this: Store<any>, injectee: ActionContext<S, any>) => any
    : (this: Store<any>, injectee: ActionContext<S, any>, payload: P) => any

export type ActionPayload<T extends Action<any, any>> = T extends ActionObject<
    any,
    any
>
    ? Parameters<T['handler']>[1]
    : T extends ActionHandler<any, any>
    ? Parameters<T>[1]
    : void

export type MappedAction<T extends Action<any, any>> = ActionPayload<
    T
> extends void
    ? (this: VueForMappers) => Promise<any>
    : (this: VueForMappers, payload: ActionPayload<T>) => Promise<any>

export type MappedActions<T> = {
    [P in keyof T]: T[P] extends Action<any, any> ? MappedAction<T[P]> : never
}

export type MapActionsSelector<T> = {
    to: <K extends keyof SubType<T, Action<any, any>>>(
        ...keys: K[]
    ) => Pick<MappedActions<T>, K>
}

export function mapTypedActions<T>(namespace?: string): MapActionsSelector<T> {
    return {
        to: <K extends keyof SubType<T, Action<any, any>>>(
            ...keys: K[]
        ): Pick<MappedActions<T>, K> =>
            (typeof namespace === 'string'
                ? mapActions(namespace, keys as string[])
                : mapActions(keys as string[])) as MappedActions<T>,
    }
}

export type VmActor<T> = {
    dispatch: <K extends keyof SubType<T, Action<any, any>>>(
        ...params: ActionPayload<T[K]> extends void
            ? [K]
            : [K, ActionPayload<T[K]>]
    ) => Promise<any>
}

export function vmActions<Actions>(
    this: Vue,
    namespace?: string
): VmActor<Actions> {
    return {
        dispatch: (name, payload?: any) => {
            const path = (typeof namespace === 'string'
                ? `${namespace}/${name}`
                : name) as string
            return this.$store.dispatch(path, payload)
        },
    }
}
