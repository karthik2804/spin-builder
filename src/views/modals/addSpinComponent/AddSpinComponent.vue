<script lang="ts" setup>
import { ref } from 'vue';
import Modal from '../../../components/utils/Modal.vue'
import { useStore } from '../../../store';

let store = useStore()
let emit = defineEmits(['close'])
let props = defineProps(['wasmComponent'])

function close() {
    id.value = ""
    emit('close')
}

let id = ref("")

let spinComponentConfigs: any = ref({
    Main: { active: true },
    Files: { active: false },
    Networking: { active: false },
    AI: { active: false },
    Variables: { active: false },
})

function configClassValue(id: string): string {
    console.log(spinComponentConfigs.value[id])
    return spinComponentConfigs.value[id]?.active ? "text-blue-500 font-bold" : "text-gray-400"
}

function addSpinComponent(source: string) {
    if (!id.value) {
        store.commit('addToast', { message: "Spin component ID cannot be empty", type: "error" })
        return
    }
    store.commit('addSpinComponent', { source: source, id: id.value })
    close()
}

console.log(props.wasmComponent)

</script>

<template>
    <Modal :modal="{ id: 'addNode', title: 'Add Spin Component' }" @close="close">
        <template v-slot:body>
            <div class="h-full flex">
                <div class="w-1/5 border-r border-gray-600 px-4 pb-4 pt-8">
                    <div v-for="configItem in Object.keys(spinComponentConfigs)"
                        class="p-2 m-2 rounded-lg  hover:bg-gray-600" :class="configClassValue(configItem)">{{
                            configItem }}
                    </div>
                </div>
                <div class="h-full w-full flex flex-col p-4">
                    <div class="flex-grow">
                        <div v-if="spinComponentConfigs.Main.active">
                            <div class="group relative w-full mb-6">
                                <span class="text-gray-400 text-sm">Wasm Source: {{ wasmComponent.source }}</span>
                            </div>
                            <div class="group relative w-full mb-6">
                                <label for="id"
                                    class="block w-full pb-1 font-medium text-white transition-all duration-200 ease-in-out group-focus-within:text-blue-400">ID</label>
                                <input autocorrect="off" autocapitalize="off" id="route" type="text" v-model="id"
                                    class="peer h-10 w-80 rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex justify-end pt-4">
                        <button @click="addSpinComponent(wasmComponent.source)"
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">Add
                            Spin Component</button>
                        <button @click="$emit('close')"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>