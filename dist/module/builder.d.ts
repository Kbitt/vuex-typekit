import { ActionContext, Mutation, Action, Getter } from 'vuex';
import { SubType } from './types';
import { ActionPayload } from './action';
import { GetterResult } from './getter';
export interface TypedActionContext<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any> extends ActionContext<State, any> {
    mutate: <K extends keyof SubType<Mutations, Mutation<any>>>(name: K, payload: Parameters<Mutations[K]>[1]) => void;
    act: <K extends keyof SubType<Actions, Action<any, any>>>(name: K, payload: Parameters<Actions[K]>[1]) => Promise<any> | void;
    getters: GetterResult<Getters>;
    rootState: RootState;
    rootGetters: GetterResult<RootGetters>;
}
export declare function createActions<State, Mutations, Actions, Getters = any, RootState = any, RootGetters = any>(options: {
    [P in keyof SubType<Actions, Action<any, any>>]: (context: TypedActionContext<State, Mutations, Actions, Getters, RootState, RootGetters>, payload: ActionPayload<Actions[P]>) => Promise<any> | void;
}): {
    [P in keyof typeof options]: Action<State, any>;
};
export declare function createGetters<State, Getters, RootState = any, RootGetters = any>(options: {
    [P in keyof SubType<Getters, Getter<any, any>>]: (state: State, getters: GetterResult<Getters>, rootState: RootState, rootGetters: GetterResult<RootGetters>) => ReturnType<Getters[P]>;
}): {
    [P in keyof typeof options]: Getter<State, RootState>;
};
