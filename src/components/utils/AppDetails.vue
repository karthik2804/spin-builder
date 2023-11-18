<script lang=ts setup>
import { computed } from 'vue';
import { useStore } from '../../store';

const store = useStore()

const manifest = computed(() => store.state.manifest)

</script>

<template>
    <div class="w-full p-4 mt-6">
        <div class="text-sm">
            <span class="font-bold mr-4">
                {{ manifest.application.name }}
            </span>
            <span class="text-xs text-gray-400">v{{ manifest.application.version }}</span>
        </div>
        <div class="text-xs text-gray-400">{{ manifest.application.description }}</div>
    </div>
</template>