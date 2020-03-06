import { SubType } from '../module/types';
import { Mutation } from 'vuex';
import { MutationPayload } from '../module';
export declare type MutationRefMapper<Mutations> = {
    with: <K extends keyof SubType<Mutations, Mutation<any>>>(...keys: K[]) => {
        [P in K]: MutationPayload<Mutations[P]> extends void ? () => void : (payload: MutationPayload<Mutations[P]>) => void;
    };
};
export declare function useMutataions<M>(namespace?: string): MutationRefMapper<M>;
