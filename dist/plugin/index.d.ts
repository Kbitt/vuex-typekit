import { PluginObject } from 'vue/types/umd';
import { stateGetter } from '../module/state';
import { MapMutationsSelector } from '../module/mutation';
declare module 'vue/types/vue' {
    interface Vue {
        $state: typeof stateGetter;
        $commit: <T>(namespace?: string) => MapMutationsSelector<T>;
    }
}
declare const plugin: PluginObject<void>;
export default plugin;
