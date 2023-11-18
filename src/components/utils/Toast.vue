<script lang=ts setup>
defineProps(['toast']);

function getColor(type: string) {
    switch (type) {
        case "success":
            return "bg-green-600 text-white"
            break
        case "info":
            return "bg-blue-500 text-white"
            break
        case "warn":
            return "bg-orange-500  text-white"
            break
        case "error":
            return "bg-red-500  text-white"
            break
        default:
            return "bg-blue-500 text-white"
    }
}

</script>

<template>
    <div class="p-4 mb-2 rounded-lg w-full" :class="getColor(toast.type)">
        <span class="c-toasts__item-text">{{ toast.text }}</span>
    </div>
</template>

<style></style>