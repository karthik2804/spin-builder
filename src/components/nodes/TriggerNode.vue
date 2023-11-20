<script lang="ts" setup>
import { Handle, Position, NodeProps, useVueFlow } from '@vue-flow/core'
import { onMounted } from 'vue';
import Tooltip from '../utils/Tooltip.vue';

interface TriggerNodeProps extends NodeProps {
    data: {
        id: string,
        type: string,
        route: string,
        connected: boolean
    }
}
let props = defineProps<TriggerNodeProps>()

let { getConnectedEdges } = useVueFlow()

onMounted(() => {
    if (getConnectedEdges(props.data.id).length) {
        props.data.connected = true
    }
})


</script>

<template>
    <div class="trigger-node bg-pink-500 text-white rounded-lg flex flex-col relative group">
        <div class="bg-pink-800 p-3 rounded-t-lg flex items-center">
            <div v-if="!data.connected">
                <Tooltip :tooltip="{ message: 'Trigger nodes need to be connected to a component' }"></Tooltip>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="yellow"
                    class="w-6 h-6 inline mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>{{ data.type }} Trigger
        </div>
        <div class="relative p-4 text-xs">
            <div>Route: {{ data.route }}</div>
            <Handle connectable="single" type="target" :position="Position.Left" />
        </div>
    </div>
</template>

<style scoped></style>