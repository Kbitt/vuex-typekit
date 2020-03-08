<template>
    <div>
        <input
            id="value"
            :value="value"
            @input="SET_VALUE({ value: $event.target.value })"
        />
        <input
            id="namespace"
            :value="namespace"
            @input="namespace = $event.target.value"
        />
    </div>
</template>

<script lang="ts">
import { useState, useMutataions } from '../../src'
import { DynamicModuleState, DynamicModuleMutations } from './dynamic-module'
import { defineComponent, computed, ref } from '@vue/composition-api'
export default defineComponent({
    setup: () => {
        const namespace = ref('a')
        return {
            namespace,
            ...useState<DynamicModuleState>(namespace).with('value'),
            ...useMutataions<DynamicModuleMutations>(namespace).with(
                'SET_VALUE'
            ),
        }
    },
})
</script>
