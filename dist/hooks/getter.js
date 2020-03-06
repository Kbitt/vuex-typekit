"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
var store_1 = require("./store");
var module_1 = require("../module");
function useGetters(namespace) {
    return {
        with: function () {
            var _a;
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var $store = store_1.useStore();
            var mapped = (_a = module_1.mapTypedGetters(namespace)).to.apply(_a, keys);
            var result = {};
            keys.forEach(function (key) {
                result[key] = composition_api_1.computed(function () { return mapped[key].call({ $store: $store }); });
            });
            return result;
        },
    };
}
exports.useGetters = useGetters;
