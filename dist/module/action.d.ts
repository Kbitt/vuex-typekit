import { Store, ActionContext, Action, ActionObject, ActionHandler } from 'vuex';
import { SubType, VueForMappers } from './types';
export declare type ActionType<S, P = void> = P extends void ? (this: Store<any>, injectee: ActionContext<S, any>) => any : (this: Store<any>, injectee: ActionContext<S, any>, payload: P) => any;
export declare type ActionPayload<T extends Action<any, any>> = T extends ActionObject<any, any> ? Parameters<T['handler']>[1] : T extends ActionHandler<any, any> ? Parameters<T>[1] : void;
export declare type MappedAction<T extends Action<any, any>> = ActionPayload<T> extends void ? (this: VueForMappers) => Promise<any> : (this: VueForMappers, payload: ActionPayload<T>) => Promise<any>;
export declare type MappedActions<T> = {
    [P in keyof T]: T[P] extends Action<any, any> ? MappedAction<T[P]> : never;
};
export declare type MapActionsSelector<T> = {
    to: <K extends keyof SubType<T, Action<any, any>>>(...keys: K[]) => Pick<MappedActions<T>, K>;
};
export declare function mapTypedActions<T>(namespace?: string): MapActionsSelector<T>;
