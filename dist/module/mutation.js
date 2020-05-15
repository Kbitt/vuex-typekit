"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
        map: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var mapped = this.to.apply(this, __spread(keys));
            return {
                to: function (mapper) { return mapper(mapped); },
            };
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
