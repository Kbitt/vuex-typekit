"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../module/state");
var plugin = {
    install: function (Vue) {
        Vue.prototype.$state = state_1.stateGetter;
    },
};
exports.default = plugin;
