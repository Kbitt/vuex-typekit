import { Ref } from '@vue/composition-api'

export type NamespaceRef = string | Ref<string>

export const resolveNamespace = (namespace?: string | NamespaceRef) => {
    return typeof namespace === 'string'
        ? namespace
        : typeof namespace === 'object'
        ? namespace.value
        : undefined
}
