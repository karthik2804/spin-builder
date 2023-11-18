<script lang="ts" setup>
import { Handle, Position, NodeProps } from '@vue-flow/core'

interface TriggerNodeProps extends NodeProps {
    data: {
        id: string,
        type: string,
        route: string
    }
}
defineProps<TriggerNodeProps>()
</script>

<template>
    <div class="trigger-node bg-pink-500 text-white rounded-lg">
        <div class="bg-pink-800 p-3 rounded-t-lg">{{ data.type }} Trigger</div>
        <div class="relative p-4 text-xs">
            <div>ID: {{ data.id }}</div>
            <div>Route: {{ data.route }}</div>
            <Handle type="target" :position="Position.Left" />
        </div>
    </div>
</template>

<style scoped></style>