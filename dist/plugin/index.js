"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../module/state");
var mutation_1 = require("../module/mutation");
var module_1 = require("../module");
var store_1 = require("../hooks/store");
var plugin = {
    install: function (Vue, options) {
        if (options && options.useStore) {
            store_1.setUseStoreHook(options.useStore);
        }
        Vue.prototype.$state = state_1.stateGetter;
        Vue.prototype.$mutations = mutation_1.vmMutations;
        Vue.prototype.$actions = module_1.vmActions;
        Vue.prototype.$getters = module_1.vmGetters;
    },
};
exports.default = plugin;
