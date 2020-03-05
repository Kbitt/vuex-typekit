"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
function mapTypedMutations(namespace) {
    return {
        to: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return (typeof namespace === 'string'
                ? vuex_1.mapMutations(namespace, keys)
                : vuex_1.mapMutations(keys));
        },
    };
}
exports.mapTypedMutations = mapTypedMutations;
function vmMutations(namespace) {
    var _this = this;
    return {
        commit: function (name, payload) {
            var path = (typeof namespace === 'string'
                ? namespace + "/" + name
                : name);
            _this.$store.commit(path, payload);
        },
    };
}
exports.vmMutations = vmMutations;
