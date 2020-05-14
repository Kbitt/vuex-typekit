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
Object.defineProperty(exports, "__esModule", { value: true });
function createModule(_a) {
    var state = _a.state, mutations = _a.mutations, actions = _a.actions, getters = _a.getters, namespaced = _a.namespaced, modules = _a.modules;
    return {
        state: state,
        namespaced: namespaced,
        modules: modules,
        mutations: mutations
            ? createMutations(mutations)
            : {},
        actions: actions
            ? createActions(actions)
            : {},
        getters: getters
            ? createGetters(getters)
            : {},
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
            forTypedCommit.typed = commit;
            forTypedCommit.root = function (namespace) {
                return {
                    commit: function () {
                        var _a = __read(arguments, 2), type = _a[0], payload = _a[1];
                        var path = namespace ? namespace + '/' + type : type;
                        commit(path, payload, {
                            root: true,
                        });
                    },
                };
            };
            forTypedCommit.sub = function (namespace) {
                return {
                    commit: function () {
                        var _a = __read(arguments, 2), type = _a[0], payload = _a[1];
                        var path = namespace + '/' + type;
                        commit(path, payload, {
                            root: true,
                        });
                    },
                };
            };
            var forTypedDispatch = dispatch;
            forTypedDispatch.typed = dispatch;
            forTypedDispatch.root = function (namespace) {
                return {
                    dispatch: function () {
                        var _a = __read(arguments, 2), type = _a[0], payload = _a[1];
                        var path = namespace ? namespace + '/' + type : type;
                        return dispatch(path, payload, { root: true });
                    },
                };
            };
            forTypedDispatch.sub = function (namespace) {
                return {
                    dispatch: function () {
                        var _a = __read(arguments, 2), type = _a[0], payload = _a[1];
                        var path = namespace + '/' + type;
                        return dispatch(path, payload);
                    },
                };
            };
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
