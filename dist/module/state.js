"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
var types_1 = require("./types");
function mapTypedState(namespace) {
    return {
        to: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return (typeof namespace === 'string'
                ? vuex_1.mapState(namespace, keys)
                : vuex_1.mapState(keys));
        },
    };
}
exports.mapTypedState = mapTypedState;
function stateGetter(namespace) {
    var _this = this;
    return {
        get: function (name) {
            var state = types_1.accessNamespace(_this.$store.state, namespace);
            return state[name];
        },
    };
}
exports.stateGetter = stateGetter;
