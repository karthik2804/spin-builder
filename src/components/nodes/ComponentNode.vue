<script lang="ts" setup>
import { Handle, NodeProps, Position } from '@vue-flow/core'
import { computed } from 'vue';
import { useStore } from '../../store';

const store = useStore()

const dataStores = computed(() => store.state.componentDataStores)
const capabilities = computed(() => store.state.componentCapabilites)

interface ComponentNodeProps extends NodeProps {
    data: {
        id: string,
        source: string | any,
        description: string | null,
        allowedOutboundHosts: string[],
        files: string[],
        aiModels: string[]
        [key: string]: string | string[] | null;
    }
}
defineProps<ComponentNodeProps>()

function hyphenToCamel(input: string): string {
    return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

</script>

<template>
    <div class="trigger-node bg-violet-500 text-white rounded-lg w-64">
        <div class="bg-violet-800 rounded-t-lg p-3">
            <div>
                {{ data.id }}
            </div>
            <div class="text-xs text-gray-400">source: {{ data.source }}</div>
            <span class="text-gray-400 text-xs">{{ data.description || "no description" }}</span>
        </div>
        <div class="text-xs py-">
            <div v-for="dataStore in dataStores" class="relative">
                <span class="ml-2">
                    {{ dataStore }}
                </span>
                <Handle :id="dataStore" type="target" :position="Position.Left" />
            </div>
            <div v-for="capability in capabilities" class="relative mt-2">
                <div class="ml-2">
                    {{ capability }}: {{ data[hyphenToCamel(capability)] }}
                </div>
            </div>
        </div>
        <div class="flex w-full py-4 border-t border-purple-1000">
            <div class="w-1/2">
            </div>
            <div class="w-1/2">
                <div class="relative">
                    <div class="text-xs text-right mr-2">incoming_wasi_http</div>
                    <Handle type="source" id="export" :position="Position.Right" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style> 