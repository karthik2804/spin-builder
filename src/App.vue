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
