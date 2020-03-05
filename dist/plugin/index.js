"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../module/state");
var mutation_1 = require("../module/mutation");
var module_1 = require("../module");
// declare const v: Vue
// v.$state<{ a: number }>().get('a')
// v.$mutations<{ foo: (state: any, data: { value: string }) => void; bar: (state: any) => void }>()
//     .commit('bar')
var plugin = {
    install: function (Vue) {
        Vue.prototype.$state = state_1.stateGetter;
        Vue.prototype.$mutations = mutation_1.vmMutations;
        Vue.prototype.$actions = module_1.vmActions;
        Vue.prototype.$getters = module_1.vmGetters;
    },
};
exports.default = plugin;
