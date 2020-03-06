import { ActionContext, Mutation, Action, Getter } from 'vuex';
import { SubType } from './types';
import { ActionPayload } from './action';
import { GetterResult } from './getter';
import { MutationType } from './mutation';
export interface TypedActionContext<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> extends ActionContext<State, any> {
    mutate: <K extends keyof SubType<Mutations, Mutation<any>>>(...params: Parameters<Mutations[K]>[1] extends void ? [K] : [K, Parameters<Mutations[K]>[1]]) => void;
    send: <K extends keyof SubType<Actions, Action<any, any>>>(...params: Parameters<Actions[K]>[1] extends void ? [K] : [K, Parameters<Actions[K]>[1]]) => Promise<any> | void;
    getters: GetterResult<Getters>;
    rootState: RootState;
    rootGetters: GetterResult<RootGetters>;
}
export declare type CreateActionsOptions<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> = {
    [P in keyof SubType<Actions, Action<any, any>>]: ActionPayload<Actions[P]> extends void ? (context: TypedActionContext<State, Mutations, Actions, Getters, RootState, RootGetters>) => Promise<any> | void : (context: TypedActionContext<State, Mutations, Actions, Getters, RootState, RootGetters>, payload: ActionPayload<Actions[P]>) => Promise<any> | void;
};
export declare function createActions<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any>(options: CreateActionsOptions<State, Mutations, Actions, Getters, RootState, RootGetters>): {
    [P in keyof typeof options]: Action<State, any>;
};
export declare function createGetters<State, Getters, RootState = any, RootGetters = any>(options: {
    [P in keyof SubType<Getters, Getter<any, any>>]: (state: State, getters: GetterResult<Getters>, rootState: RootState, rootGetters: GetterResult<RootGetters>) => ReturnType<Getters[P]>;
}): {
    [P in keyof typeof options]: Getter<State, RootState>;
};
export declare function createMutations<State, Mutations>(options: {
    [P in keyof SubType<Mutations, Mutation<State>>]: Parameters<Mutations[P]>[1] extends void ? MutationType<State> : MutationType<State, Parameters<Mutations[P]>[1]>;
}): {
    [P in keyof typeof options]: Mutation<State>;
};