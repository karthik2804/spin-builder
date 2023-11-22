<script setup lang="ts">
import Graph from "./components/Graph.vue"
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import NotificationComponent from "./components/NotificationComponent.vue";

import { useStore } from './store';
import { Ref, ref } from "vue";

const store = useStore()

const notification: Ref<InstanceType<typeof NotificationComponent> | null> = ref(null)
defineExpose({
  addToast: notification.value?.addToast,
});

store.dispatch("getManifest")
store.subscribe((mutation, _) => {
  if (mutation.type === "addToast") {
    notification.value?.addToast({ type: mutation.payload.type, text: mutation.payload.message })
  }
})

let globalDragging = ref(false);

// Global event listener to prevent default behavior for dragenter and dragover events
function preventDefaultForGlobalDrag(e: DragEvent) {
  e.preventDefault();
}

// Global event listener to prevent default behavior for drop events
function preventDefaultAndHandleDrop(e: DragEvent) {
  e.preventDefault();
  globalDragging.value = false;

}

// Set up global event listeners
document.addEventListener('dragenter', preventDefaultForGlobalDrag);
document.addEventListener('dragover', preventDefaultForGlobalDrag);
document.addEventListener('drop', preventDefaultAndHandleDrop);

</script>

<template>
  <Header></Header>
  <div class="relative min-h-screen flex flex-wrap" data-dev-hint="container">
    <Sidebar></Sidebar>
    <Graph></Graph>
    <NotificationComponent ref="notification"></NotificationComponent>
  </div>
</template>

<style></style>
