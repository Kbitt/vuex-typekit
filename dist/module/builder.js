"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function createActions(options) {
    var result = {};
    Object.keys(options).forEach(function (key) {
        var k = key;
        result[k] = function (context, payload) {
            return Promise.resolve(options[k].call(this, __assign(__assign({}, context), { mutate: function (name, mutationPayload) {
                    context.commit(name, mutationPayload);
                }, send: function (name, actionPayload) {
                    return context.dispatch(name, actionPayload);
                } }), payload));
        };
    });
    return result;
}
exports.createActions = createActions;
function createGetters(options) {
    return __assign({}, options);
}
exports.createGetters = createGetters;
function createMutations(options) {
    return __assign({}, options);
}
exports.createMutations = createMutations;
