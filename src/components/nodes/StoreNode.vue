<script lang="ts" setup>
import { Handle, NodeProps, Position } from '@vue-flow/core'
interface StoreNodeProps extends NodeProps {
    data: {
        type: string,
        stores: string[]
    }
}
defineProps<StoreNodeProps>()
</script>

<template>
    <div class="trigger-node bg-green-500 text-white rounded-lg w-32">
        <div class="bg-green-800 rounded-t-lg p-3 text-center">{{ data.type }}</div>
        <div class="text-xs py-4">
            <div v-for="store in data.stores" class="relative">
                <div class="mr-2 text-right">
                    {{ store }}
                </div>
                <Handle type="source" :id="store" :position="Position.Right" />
            </div>
        </div>
    </div>
</template>

<style scoped></style> 