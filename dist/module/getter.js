"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
function mapTypedGetters(namespace) {
    return {
        to: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return (typeof namespace === 'string'
                ? vuex_1.mapGetters(namespace, keys)
                : vuex_1.mapGetters(keys));
        },
    };
}
exports.mapTypedGetters = mapTypedGetters;
function vmGetters(namespace) {
    var _this = this;
    return {
        getters: function (name) {
            var path = (typeof namespace === 'string'
                ? namespace + "/" + name
                : name);
            return _this.$store.getters[path];
        },
    };
}
exports.vmGetters = vmGetters;
