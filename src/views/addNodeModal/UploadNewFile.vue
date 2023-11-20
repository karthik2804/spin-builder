<script lang="ts" setup>
import { invoke } from '@tauri-apps/api';
import { useStore } from '../../store';
import { computed, ref } from 'vue';
import Toggle from '../../components/utils/Toggle.vue'
let store = useStore()

let fileUploaded = ref(false)
let uploadError = ref(null)
let parsedContents: any = ref({})
let filename = ref("")
let dragging = ref(false)
let showWit = ref(false)

let toggleProps = computed({
    get: (): any => {
        return {
            unchecked: 'imports/exports',
            checked: 'wit',
            state: showWit.value,
        };
    },
    set: (value: boolean) => {
        // Handle the setter logic here if needed
        showWit.value = value;
    },
}
)

async function parseWasm(file: any) {
    let reader = new FileReader()
    reader.onload = async () => {
        try {
            parsedContents.value = await invoke('parse_wasm_binary', { name: file.name, bytes: Array.from(new Uint8Array(reader.result as ArrayBuffer)) })
            filename = file.name
            store.commit('addToast', { message: "parsed wasm file succefully", type: "success" })
        } catch (err) {
            // store.commit('addToast', { message: "parsed wasm file failed", type: "error" })
        }
    }
    reader.readAsArrayBuffer(file)
}

async function wasmFileUpload(e: any) {
    e.preventDefault()
    let files = e.target.files || e.dataTransfer.files
    if (files.length) {
        fileUploaded.value = true
        await parseWasm(files[0])
    }
    store.commit("addToast", { message: "Not implemented yet!", type: "info" })
}

async function drop(e: any) {
    e.preventDefault()
    let droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
        fileUploaded.value = true;
        await parseWasm(droppedFiles[0]); // Process the first dropped file
    }
    console.log(droppedFiles)
    console.log("dropped")
}

function clearState() {

}

defineExpose({ clearState })

</script>

<template>
    <div class="flex items-center justify-center w-full flex-grow overflow-hidden">
        <div class="text-red-400 text-sm" v-if="uploadError">{{ uploadError }}</div>
        <label @drop="drop" @dragover.prevent="" @dragenter.prevent.stop="dragging = true"
            @dragleave.prevent.stop="dragging = false" v-if="!fileUploaded && !uploadError" for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to
                        upload</span> or drag and drop</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">.wasm</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" accept=".wasm" @change="wasmFileUpload" />
        </label>
        <div v-if="fileUploaded && !uploadError" class="p-4 w-full flex flex-auto h-full flex-col">
            <div class="pt-4 pb-2 flex justify-between items-center">
                <div class="text-gray-400 text-sm ml-2">{{ filename }}</div>
                <Toggle :toggle="toggleProps" v-model="showWit">
                </Toggle>
            </div>
            <pre class="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-lg">
<code v-if="showWit" class="text-gray-400 font-mono text-xs">// WIT 
{{ parsedContents.wit }}</code>
<code v-else class="text-gray-400 font-mono text-xs">// Exports<span v-for="export_val in parsedContents.exports">
{{ export_val }}</span>

// Imports <span v-for="import_val in parsedContents.imports">
{{ import_val }}</span>
</code>
            </pre>
            <div class="flex justify-end pt-4">
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">Add
                    component</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style></style>