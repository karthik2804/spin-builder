<script lang="ts" setup>
defineProps(["tooltip"])
</script>

<template>
    <span
        class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute m-2 p-2 bottom-full opacity-0 mx-auto z-50">{{
            tooltip.message }}</span>
    <div
        class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 absolute w-1 h-1 p-2 bottom-full opacity-0 mx-auto transform rotate-45 left-6 -top-4">
    </div>
</template>