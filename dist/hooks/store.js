"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useStoreHook = null;
function setUseStoreHook(hook) {
    useStoreHook = hook;
}
exports.setUseStoreHook = setUseStoreHook;
function useStore() {
    if (!useStoreHook)
        throw new Error('useStore hook has not been provided to vuex-typekit, make sure to set it when calling Vue.use(VuexTypekit)');
    return useStoreHook();
}
exports.useStore = useStore;
