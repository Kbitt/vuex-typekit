<template>
    <div>
        <input
            :value="value"
            @input="SET_VALUE({ value: $event.target.value })"
        />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { TestState, TestMutations } from '../mutation.test'
import { mapTypedMutations, mapTypedState } from '../../src'
export default Vue.extend({
    methods: {
        ...mapTypedMutations<TestMutations>().to('SET_VALUE'),
    },
    computed: {
        ...mapTypedState<TestState>().to('value'),
    },
})
</script>
