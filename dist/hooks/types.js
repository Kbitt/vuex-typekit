"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNamespace = function (namespace) {
    return typeof namespace === 'string'
        ? namespace
        : typeof namespace === 'object'
            ? namespace.value
            : undefined;
};
