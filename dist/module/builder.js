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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function createModule(_a) {
    var state = _a.state, mutations = _a.mutations, actions = _a.actions, getters = _a.getters;
    return {
        state: state,
        mutations: mutations
            ? createMutations(mutations)
            : undefined,
        actions: actions
            ? createActions(actions)
            : undefined,
        getters: getters
            ? createGetters(getters)
            : undefined,
    };
}
exports.createModule = createModule;
function createActions(options) {
    var result = {};
    Object.keys(options).forEach(function (key) {
        var k = key;
        result[k] = function (_a, payload) {
            var commit = _a.commit, dispatch = _a.dispatch, context = __rest(_a, ["commit", "dispatch"]);
            var forTypedCommit = commit;
            forTypedCommit.any = commit;
            var forTypedDispatch = dispatch;
            forTypedDispatch.any = dispatch;
            return Promise.resolve(options[k].call(this, __assign(__assign({}, context), { commit: forTypedCommit, dispatch: forTypedDispatch }), payload));
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
