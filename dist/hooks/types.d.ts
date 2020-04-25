import { Ref } from '@vue/composition-api';
export declare type NamespaceRef = string | Ref<string>;
export declare const resolveNamespace: (namespace?: string | Ref<string> | undefined) => string | undefined;
