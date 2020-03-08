"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
var module_1 = require("../module");
var store_1 = require("./store");
var types_1 = require("./types");
function useState(namespace) {
    return {
        with: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var $store = store_1.useStore();
            var mapped = composition_api_1.computed(function () {
                var _a;
                return (_a = module_1.mapTypedState(types_1.resolveNamespace(namespace))).to.apply(_a, keys);
            });
            var result = {};
            keys.forEach(function (key) {
                result[key] = composition_api_1.computed(function () { return mapped.value[key].call({ $store: $store }); });
            });
            return result;
        },
    };
}
exports.useState = useState;
