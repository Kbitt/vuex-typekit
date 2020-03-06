"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = require("../module");
var store_1 = require("./store");
function useActions(namespace) {
    return {
        with: function () {
            var _a;
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var $store = store_1.useStore();
            var mapped = (_a = module_1.mapTypedActions(namespace)).to.apply(_a, keys);
            var result = {};
            keys.forEach(function (key) {
                result[key] = mapped[key].bind({ $store: $store });
            });
            return result;
        },
    };
}
exports.useActions = useActions;
