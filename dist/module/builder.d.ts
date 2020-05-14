import { ActionContext, Mutation, Action, Getter, ActionHandler, Commit, Dispatch, GetterTree, ActionTree, MutationTree } from 'vuex';
import { SubType } from './types';
import { ActionPayload } from './action';
import { TypedGetters } from './getter';
import { MutationType } from './mutation';
export interface TypedCommit<Mutations> extends Commit {
    typed: {
        <K extends keyof SubType<Mutations, Mutation<any>>>(...params: Parameters<Mutations[K]>[1] extends void ? [K] : [K, Parameters<Mutations[K]>[1]]): void;
    };
    root<M>(namespace?: string): {
<<<<<<< HEAD
        commit: {
=======
        typed: {
>>>>>>> master
            <K extends keyof SubType<M, Mutation<any>>>(...params: Parameters<M[K]>[1] extends void ? [K] : [K, Parameters<M[K]>[1]]): void;
        };
    };
    sub<M>(namespace: string): {
<<<<<<< HEAD
        commit: {
=======
        typed: {
>>>>>>> master
            <K extends keyof SubType<M, Mutation<any>>>(...params: Parameters<M[K]>[1] extends void ? [K] : [K, Parameters<M[K]>[1]]): void;
        };
    };
}
export interface TypedDispatch<Actions> extends Dispatch {
    typed: {
        <K extends keyof SubType<Actions, Action<any, any>>>(...params: Parameters<Actions[K]>[1] extends void ? [K] : [K, Parameters<Actions[K]>[1]]): Promise<any> | void;
    };
    root<A>(namespace?: string): {
<<<<<<< HEAD
        dispatch: {
=======
        typed: {
>>>>>>> master
            <K extends keyof SubType<A, Action<any, any>>>(...params: Parameters<A[K]>[1] extends void ? [K] : [K, Parameters<A[K]>[1]]): Promise<any> | void;
        };
    };
    /**
     * Provide a dispatcher object to call actions on a sub module. Use like:
     * @example
     * dispatch.sub<ActionInterface>('subNamespace').dispatch('someSubAction')
     * @param namespace Namespace of the submodule to call
     */
    sub<A>(namespace: string): {
<<<<<<< HEAD
        dispatch: {
=======
        typed: {
>>>>>>> master
            <K extends keyof SubType<A, Action<any, any>>>(...params: Parameters<A[K]>[1] extends void ? [K] : [K, Parameters<A[K]>[1]]): Promise<any> | void;
        };
    };
}
export interface TypedActionContext<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> extends ActionContext<State, RootState> {
    state: State;
    commit: TypedCommit<Mutations>;
    dispatch: TypedDispatch<Actions>;
    getters: TypedGetters<Getters>;
    rootState: RootState;
    rootGetters: TypedGetters<RootGetters>;
}
export declare type TypedActionHandler<P extends keyof SubType<Actions, Action<any, any>>, State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> = ActionPayload<Actions[P]> extends void ? (context: TypedActionContext<State, Mutations, Actions, Getters, RootState, RootGetters>) => Promise<any> | void : (context: TypedActionContext<State, Mutations, Actions, Getters, RootState, RootGetters>, payload: ActionPayload<Actions[P]>) => Promise<any> | void;
export declare type CreateModuleOptions<State, Mutations = void, Actions = void, Getters = void, RootState = void, RootGetters = void> = {
    namespaced?: boolean;
    state: State | (() => State);
    modules?: Record<string, any>;
} & (Mutations extends void ? {
    mutations?: MutationTree<State>;
} : {
    mutations: CreateMutationsOptions<State, Mutations>;
}) & (Actions extends void ? {
    actions?: ActionTree<State, RootState>;
} : {
    actions: CreateActionsOptions<State, Mutations, Actions, Getters, RootState, RootGetters>;
}) & (Getters extends void ? {
    getters?: GetterTree<State, RootState>;
} : {
    getters: CreateGettersOptions<State, Getters, RootState, RootGetters>;
});
export declare function createModule<State, Mutations = void, Actions = void, Getters = void, RootState = void, RootGetters = void>({ state, mutations, actions, getters, namespaced, modules, }: CreateModuleOptions<State, Mutations, Actions, Getters, RootState, RootGetters>): {
    state: typeof state;
} & (Mutations extends void ? {
    mutations?: MutationTree<State>;
} : {
    mutations: {
        [P in keyof typeof mutations]: Mutation<State>;
    };
}) & (Actions extends void ? {
    actions?: ActionTree<State, RootState>;
} : {
    actions: {
        [P in keyof typeof actions]: ActionHandler<State, RootState>;
    };
}) & (Getters extends void ? {
    getters: GetterTree<State, RootState>;
} : {
    getters: {
        [P in keyof typeof getters]: Getter<State, RootState>;
    };
});
export declare type CreateActionsOptions<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> = {
    [P in keyof SubType<Actions, Action<any, any>>]: TypedActionHandler<P, State, Mutations, Actions, Getters, RootState, RootGetters>;
};
export declare function createActions<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any>(options: CreateActionsOptions<State, Mutations, Actions, Getters, RootState, RootGetters>): {
    [P in keyof typeof options]: ActionHandler<State, RootState>;
};
export declare type CreateGettersOptions<State, Getters, RootState = any, RootGetters = any> = {
    [P in keyof SubType<Getters, Getter<any, any>>]: (state: State, getters: TypedGetters<Getters>, rootState: RootState, rootGetters: TypedGetters<RootGetters>) => ReturnType<Getters[P]>;
};
export declare function createGetters<State, Getters, RootState = any, RootGetters = any>(options: CreateGettersOptions<State, Getters, RootState, RootGetters>): {
    [P in keyof typeof options]: Getter<State, RootState>;
};
export declare type CreateMutationsOptions<State, Mutations> = {
    [P in keyof SubType<Mutations, Mutation<State>>]: Parameters<Mutations[P]>[1] extends void ? MutationType<State> : MutationType<State, Parameters<Mutations[P]>[1]>;
};
export declare function createMutations<State, Mutations>(options: CreateMutationsOptions<State, Mutations>): {
    [P in keyof typeof options]: Mutation<State>;
};
