<script setup lang="ts">
import { ref } from 'vue';
import AppDetails from './utils/AppDetails.vue'
import AddNodeModal from '../views/addNodeModal/AddNodeModal.vue'
import { useStore } from '../store';

let store = useStore()

let modalVisible = ref(false)
function openModal() {
    modalVisible.value = true
}
function closeModal() {
    modalVisible.value = false
}

function save() {
    store.dispatch('saveManifest')
}
</script>
<template>
    <aside id="sidebar"
        class="z-50 bg-gray-800 min-h-screen h-full flex flex-column text-gray-100 md:w-80 w-3/4 px-0 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col md:justify-between overflow-y-auto"
        data-dev-hint="sidebar; px-0 for frameless; px-2 for visually inset the navigation">
        <div class="bg-gray-700 font-bold text-xl text-white-600 p-2">Spin Builder</div>
        <AppDetails></AppDetails>
        <div class="flex-grow">
            <div class="relative flex py-5 items-center px-4">
                <div class="w-5 border-t border-gray-500"></div>
                <span class="flex-shrink mx-1 text-gray-600 text-xs font-bold">wasm components</span>
                <div class="flex-grow border-t border-gray-500"></div>
            </div>
        </div>
        <div class="p-4 flex justify-center">
            <button @click="openModal()"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Add
                Node</button>
            <button @click="save" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save
                Manifest</button>
        </div>
    </aside>
    <AddNodeModal v-show="modalVisible" @close="closeModal"></AddNodeModal>
</template>
<style>
#sidebar {
    --tw-translate-x: -100%;
}

@media (min-width: 768px) {
    #sidebar {
        --tw-translate-x: 0;
        display: flex;
    }
}
</style>