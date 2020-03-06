import { Action } from 'vuex';
import { SubType } from '../module/types';
import { ActionPayload } from '../module';
export declare type ActionRefMapper<A> = {
    with: <K extends keyof SubType<A, Action<any, any>>>(...keys: K[]) => {
        [P in K]: ActionPayload<A[P]> extends void ? () => void : (payload: ActionPayload<A[P]>) => void;
    };
};
export declare function useActions<A>(namespace?: string): ActionRefMapper<A>;
