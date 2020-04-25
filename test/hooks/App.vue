<template>
    <dynamic />
</template>
<script lang="ts">
import Dynamic from './Dynamic.vue'
import { defineComponent } from '@vue/composition-api'
import { provideStore } from './useStore'
import { Store } from 'vuex'
export default defineComponent({
    components: {
        Dynamic,
    },
    props: {
        store: {
            type: Object,
            required: true,
        },
    },
    setup: props => {
        provideStore(props.store as Store<any>)
    },
})
</script>
