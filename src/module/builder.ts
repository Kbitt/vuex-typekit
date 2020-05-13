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
import { ActionPayload, ActionType } from './action'
import { GetterResult } from './getter'
import { MutationType } from './mutation'
export interface TypedActionContext<
    State,
    Mutations,
    Actions,
    Getters = any,
    RootState = any,
    RootGetters = any
> {
    state: State
    commit: {
        <K extends keyof SubType<Mutations, Mutation<any>>>(
            ...params: Parameters<Mutations[K]>[1] extends void
                ? [K]
                : [K, Parameters<Mutations[K]>[1]]
        ): void
        any: Commit
    }
    dispatch: {
        <K extends keyof SubType<Actions, Action<any, any>>>(
            ...params: Parameters<Actions[K]>[1] extends void
                ? [K]
                : [K, Parameters<Actions[K]>[1]]
        ): Promise<any> | void
        any: Dispatch
    }
    getters: GetterResult<Getters>
    rootState: RootState
    rootGetters: GetterResult<RootGetters>
}

export type TypedActionFn<
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
    [P in keyof SubType<Actions, Action<any, any>>]: TypedActionFn<
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
            const forTypedCommit: any = commit
            forTypedCommit.any = commit

            const forTypedDispatch: any = dispatch
            forTypedDispatch.any = dispatch
            return Promise.resolve(
                (options[k] as any).call(
                    this,
                    {
                        ...context,
                        commit: forTypedCommit,
                        dispatch: forTypedDispatch,
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
        getters: GetterResult<Getters>,
        rootState: RootState,
        rootGetters: GetterResult<RootGetters>
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
