<template>
    <div>
        <input id="a" :value="geta" />
        <input id="sub" :value="getSubValue" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { TestState, SubTestState } from '../state.test'
export default Vue.extend({
    computed: {
        geta() {
            return this.$state<TestState>().get('a')
        },
        getSubValue() {
            return this.$state<SubTestState>('sub').get('value')
        },
    },
})
</script>
