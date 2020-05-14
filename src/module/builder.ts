import {
    ActionContext,
    Mutation,
    Action,
    Getter,
    ActionHandler,
    Commit,
    Dispatch,
    GetterTree,
    ActionTree,
    MutationTree,
} from 'vuex'
import { SubType } from './types'
import { ActionPayload } from './action'
import { TypedGetters } from './getter'
import { MutationType } from './mutation'

export interface TypedCommit<Mutations> extends Commit {
    typed: {
        <K extends keyof SubType<Mutations, Mutation<any>>>(
            ...params: Parameters<Mutations[K]>[1] extends void
                ? [K]
                : [K, Parameters<Mutations[K]>[1]]
        ): void
    }
    root<M>(
        namespace?: string
    ): {
        typed: {
            <K extends keyof SubType<M, Mutation<any>>>(
                ...params: Parameters<M[K]>[1] extends void
                    ? [K]
                    : [K, Parameters<M[K]>[1]]
            ): void
        }
    }
    sub<M>(
        namespace: string
    ): {
        typed: {
            <K extends keyof SubType<M, Mutation<any>>>(
                ...params: Parameters<M[K]>[1] extends void
                    ? [K]
                    : [K, Parameters<M[K]>[1]]
            ): void
        }
    }
}

export interface TypedDispatch<Actions> extends Dispatch {
    typed: {
        <K extends keyof SubType<Actions, Action<any, any>>>(
            ...params: Parameters<Actions[K]>[1] extends void
                ? [K]
                : [K, Parameters<Actions[K]>[1]]
        ): Promise<any> | void
    }
    root<A>(
        namespace?: string
    ): {
        typed: {
            <K extends keyof SubType<A, Action<any, any>>>(
                ...params: Parameters<A[K]>[1] extends void
                    ? [K]
                    : [K, Parameters<A[K]>[1]]
            ): Promise<any> | void
        }
    }
    /**
     * Provide a dispatcher object to call actions on a sub module. Use like:
     * @example
     * dispatch.sub<ActionInterface>('subNamespace').dispatch('someSubAction')
     * @param namespace Namespace of the submodule to call
     */
    sub<A>(
        namespace: string
    ): {
        typed: {
            <K extends keyof SubType<A, Action<any, any>>>(
                ...params: Parameters<A[K]>[1] extends void
                    ? [K]
                    : [K, Parameters<A[K]>[1]]
            ): Promise<any> | void
        }
    }
}
export interface TypedActionContext<
    State,
    Mutations,
    Actions,
    Getters = any,
    RootState = any,
    RootGetters = any
> extends ActionContext<State, RootState> {
    state: State
    commit: TypedCommit<Mutations>
    dispatch: TypedDispatch<Actions>
    getters: TypedGetters<Getters>
    rootState: RootState
    rootGetters: TypedGetters<RootGetters>
}

export type TypedActionHandler<
    P extends keyof SubType<Actions, Action<any, any>>,
    State,
    Mutations,
    Actions,
    Getters = any,
    RootState = any,
    RootGetters = any
> = ActionPayload<Actions[P]> extends void
    ? (
          context: TypedActionContext<
              State,
              Mutations,
              Actions,
              Getters,
              RootState,
              RootGetters
          >
      ) => Promise<any> | void
    : (
          context: TypedActionContext<
              State,
              Mutations,
              Actions,
              Getters,
              RootState,
              RootGetters
          >,
          payload: ActionPayload<Actions[P]>
      ) => Promise<any> | void

export type CreateModuleOptions<
    State,
    Mutations = void,
    Actions = void,
    Getters = void,
    RootState = void,
    RootGetters = void
> = {
    namespaced?: boolean
    state: State | (() => State)
    modules?: Record<string, any>
} & (Mutations extends void
    ? { mutations?: MutationTree<State> }
    : {
          mutations: CreateMutationsOptions<State, Mutations>
      }) &
    (Actions extends void
        ? { actions?: ActionTree<State, RootState> }
        : {
              actions: CreateActionsOptions<
                  State,
                  Mutations,
                  Actions,
                  Getters,
                  RootState,
                  RootGetters
              >
          }) &
    (Getters extends void
        ? { getters?: GetterTree<State, RootState> }
        : {
              getters: CreateGettersOptions<
                  State,
                  Getters,
                  RootState,
                  RootGetters
              >
          })

export function createModule<
    State,
    Mutations = void,
    Actions = void,
    Getters = void,
    RootState = void,
    RootGetters = void
>({
    state,
    mutations,
    actions,
    getters,
    namespaced,
    modules,
}: CreateModuleOptions<
    State,
    Mutations,
    Actions,
    Getters,
    RootState,
    RootGetters
>): {
    state: typeof state
} & (Mutations extends void
    ? { mutations?: MutationTree<State> }
    : { mutations: { [P in keyof typeof mutations]: Mutation<State> } }) &
    (Actions extends void
        ? { actions?: ActionTree<State, RootState> }
        : {
              actions: {
                  [P in keyof typeof actions]: ActionHandler<State, RootState>
              }
          }) &
    (Getters extends void
        ? {
              getters: GetterTree<State, RootState>
          }
        : {
              getters: { [P in keyof typeof getters]: Getter<State, RootState> }
          }) {
    return {
        state,
        namespaced,
        modules,
        mutations: mutations
            ? createMutations<State, Mutations>(mutations as any)
            : {},
        actions: actions
            ? createActions<
                  State,
                  Mutations,
                  Actions,
                  Getters,
                  RootState,
                  RootGetters
              >(actions as any)
            : {},
        getters: getters
            ? createGetters<State, Getters, RootState, RootGetters>(
                  getters as any
              )
            : {},
    } as any
}

export type CreateActionsOptions<
    State,
    Mutations,
    Actions,
    Getters = any,
    RootState = any,
    RootGetters = any
> = {
    [P in keyof SubType<Actions, Action<any, any>>]: TypedActionHandler<
        P,
        State,
        Mutations,
        Actions,
        Getters,
        RootState,
        RootGetters
    >
}

export function createActions<
    State,
    Mutations,
    Actions,
    Getters = any,
    RootState = any,
    RootGetters = any
>(
    options: CreateActionsOptions<
        State,
        Mutations,
        Actions,
        Getters,
        RootState,
        RootGetters
    >
): { [P in keyof typeof options]: ActionHandler<State, RootState> } {
    const result = {} as {
        [P in keyof typeof options]: ActionHandler<State, RootState>
    }
    Object.keys(options).forEach(key => {
        const k = key as keyof typeof options
        result[k] = function (
            { commit, dispatch, ...context }: ActionContext<State, any>,
            payload?: any
        ) {
            const wrappedCommit = function (this: any, ...args: any) {
                return commit.apply(this, args)
            } as TypedCommit<Mutations>
            wrappedCommit.typed = wrappedCommit
            wrappedCommit.root = function (namespace) {
                return {
                    typed: function () {
                        const [type, payload] = arguments
                        const path = namespace ? namespace + '/' + type : type
                        wrappedCommit(path, payload, {
                            root: true,
                        })
                    },
                }
            }

            wrappedCommit.sub = function (namespace) {
                return {
                    typed: function () {
                        const [type, payload] = arguments
                        const path = namespace + '/' + type
                        wrappedCommit(path, payload)
                    },
                }
            }

            const wrappedDispatch = function (this: any, ...args: any) {
                return dispatch.apply(this, args)
            } as TypedDispatch<Actions>
            wrappedDispatch.typed = wrappedDispatch
            wrappedDispatch.root = function (namespace) {
                return {
                    typed: function () {
                        const [type, payload] = arguments
                        const path = namespace ? namespace + '/' + type : type
                        return wrappedDispatch(path, payload, { root: true })
                    },
                }
            }
            wrappedDispatch.sub = function (namespace) {
                return {
                    typed: function () {
                        const [type, payload] = arguments
                        const path = namespace + '/' + type
                        return wrappedDispatch(path, payload)
                    },
                }
            }
            return Promise.resolve(
                (options[k] as any).call(
                    this,
                    {
                        ...context,
                        commit: wrappedCommit,
                        dispatch: wrappedDispatch,
                    },
                    payload
                )
            )
        }
    })
    return result
}

export type CreateGettersOptions<
    State,
    Getters,
    RootState = any,
    RootGetters = any
> = {
    [P in keyof SubType<Getters, Getter<any, any>>]: (
        state: State,
        getters: TypedGetters<Getters>,
        rootState: RootState,
        rootGetters: TypedGetters<RootGetters>
    ) => ReturnType<Getters[P]>
}

export function createGetters<
    State,
    Getters,
    RootState = any,
    RootGetters = any
>(
    options: CreateGettersOptions<State, Getters, RootState, RootGetters>
): { [P in keyof typeof options]: Getter<State, RootState> } {
    return { ...options }
}

export type CreateMutationsOptions<State, Mutations> = {
    [P in keyof SubType<Mutations, Mutation<State>>]: Parameters<
        Mutations[P]
    >[1] extends void
        ? MutationType<State>
        : MutationType<State, Parameters<Mutations[P]>[1]>
}

export function createMutations<State, Mutations>(
    options: CreateMutationsOptions<State, Mutations>
): { [P in keyof typeof options]: Mutation<State> } {
    return {
        ...options,
    }
}
