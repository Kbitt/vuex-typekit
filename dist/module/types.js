"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function accessNamespace(state, namespace) {
    if (typeof namespace !== 'string')
        return state;
    var result = state;
    namespace.split('/').forEach(function (part) {
        result = result[part];
    });
    return result;
}
exports.accessNamespace = accessNamespace;
