<script lang="ts" setup>
import { ref } from 'vue';
import Toast from "./utils/Toast.vue"

interface Toast {
    id: number
    type: string
    text: string
}

let toastID = 0;

const toasts = ref<Toast[]>([]);

const addToast = ({ type = 'info', duration = 6000, text }: { type?: string; duration?: number; text: string }) => {
    const id = toastID++;

    toasts.value.push({ id, type, text });

    setTimeout(() => {
        removeToast(id);
    }, duration);
};
const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((m) => m.id !== id);
};

defineExpose({ addToast })

</script>

<template>
    <transition-group name="toasts" tag="div" class="fixed right-4 bottom-4 z-50 w-80">
        <Toast class="toasts-item" v-for="toast in toasts" :toast="toast" :key="toast.id"></Toast>
    </transition-group>
</template>

<style>
.toasts-item {
    transition: all 0.5s;
}

.toasts-enter,
.toasts-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.toasts-leave-active {
    position: absolute;
    z-index: -1;
}
</style>