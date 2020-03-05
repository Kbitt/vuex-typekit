import { PluginObject } from 'vue/types/umd';
import { stateGetter } from '../module/state';
import { vmMutations } from '../module/mutation';
import { vmActions, vmGetters } from '../module';
declare module 'vue/types/vue' {
    interface Vue {
        $state: typeof stateGetter;
        $mutations: typeof vmMutations;
        $actions: typeof vmActions;
        $getters: typeof vmGetters;
    }
}
declare const plugin: PluginObject<void>;
export default plugin;
