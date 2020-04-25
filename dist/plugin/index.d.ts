import { PluginObject } from 'vue/types/umd';
import { stateGetter } from '../module/state';
import { vmMutations } from '../module/mutation';
import { vmActions, vmGetters } from '../module';
import { Store } from 'vuex';
declare module 'vue/types/vue' {
    interface Vue {
        $state: typeof stateGetter;
        $mutations: typeof vmMutations;
        $actions: typeof vmActions;
        $getters: typeof vmGetters;
    }
}
export declare type VuexTypekitPluginOptions = {
    useStore: () => Store<any>;
};
declare const plugin: PluginObject<VuexTypekitPluginOptions>;
export default plugin;
