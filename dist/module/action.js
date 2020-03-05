"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
function mapTypedActions(namespace) {
    return {
        to: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return (typeof namespace === 'string'
                ? vuex_1.mapActions(namespace, keys)
                : vuex_1.mapActions(keys));
        },
    };
}
exports.mapTypedActions = mapTypedActions;
function vmActions(namespace) {
    var _this = this;
    return {
        dispatch: function (name, payload) {
            var path = (typeof namespace === 'string'
                ? namespace + "/" + name
                : name);
            return _this.$store.dispatch(path, payload);
        },
    };
}
exports.vmActions = vmActions;
