<script lang="ts" setup>
import { Ref, ref } from 'vue';
import Modal from '../../components/utils/Modal.vue'
import Tabs from '../../components/utils/Tabs.vue'
import UploadNewFile from './UploadNewFile.vue'
import AddTrigger from './AddTrigger.vue';
import { useStore } from '../../store';

let store = useStore()
const tabs: any = ref([
    { name: "wasm component" }, { name: "trigger", active: true }
])

let activeTab = ref("trigger")

function switchTab(name: string) {
    tabs.value.map((k: any) => {
        k.active = k.name === name
    })
    activeTab.value = name === "trigger" ? "trigger" : "wasm"
}

const newTrigger: Ref<InstanceType<typeof AddTrigger> | null> = ref(null)
const newWasmComponent: Ref<InstanceType<typeof UploadNewFile> | null> = ref(null)

let emit = defineEmits(["close"])

function test(trigger: any) {
    store.commit('addTrigger', trigger)
    newTrigger.value?.clearState()
    newWasmComponent.value?.clearState()
    emit('close')
}

function close() {
    newTrigger.value?.clearState()
    newWasmComponent.value?.clearState()
    emit('close')
}

function addWasmComponent(payload: any) {
    store.commit('addWasmComponent', payload)
    newTrigger.value?.clearState()
    newWasmComponent.value?.clearState()
    emit('close')
}

</script>

<template>
    <Modal :modal="{ id: 'addNode', title: 'Add Node' }" @close="close">
        <template v-slot:body>
            <div class="h-full flex flex-col">
                <Tabs :tabs="tabs" @tabClick="switchTab"></Tabs>
                <UploadNewFile ref="newWasmComponent" v-show="activeTab === 'wasm'" @addWasmComponent="addWasmComponent"
                    @cancel="close" />
                <AddTrigger ref="newTrigger" v-show="activeTab === 'trigger'" @addNewTrigger="test" @cancel="close" />
            </div>
        </template>
    </Modal>
</template>