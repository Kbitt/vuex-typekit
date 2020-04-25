import { MutationType, createMutations } from '../../src'

export interface DynamicModuleState {
    value: string
}

export interface DynamicModuleMutations {
    SET_VALUE: MutationType<DynamicModuleState, { value: string }>
}

export const createDynamicModule = () => {
    return {
        namespaced: true,
        state: (): DynamicModuleState => ({
            value: 'default',
        }),
        mutations: {
            ...createMutations<DynamicModuleState, DynamicModuleMutations>({
                SET_VALUE: (state, payload) => {
                    state.value = payload.value
                },
            }),
        },
    }
}
