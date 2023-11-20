<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['addNewTrigger', 'cancel'])

let route = ref("")
let routeError = ref("")

function addTrigger() {
    console.log(route.value, route.value.length)
    if (route.value === "") {
        routeError.value = "Route is a required field"
        return
    }
    if (!route.value.startsWith("/")) {
        routeError.value = "Route must start with a \"/\""
        return
    }
    let index = route.value.indexOf("...")
    console.log(index, route.value.length, route.value.length != index + 2)
    if (index != -1 && route.value[index - 1] != "/") {
        routeError.value = "... must be prefixed a \"/\""
        return
    }
    if (index != -1 && route.value.length != index + 3) {
        routeError.value = "if using wildcard, path must end in ... (only 3 periods)\""
        return
    }
    // Possibly needs more validation! 

    emit('addNewTrigger', { type: "http", id: `trigger-${(Math.random() + 1).toString(36).substring(7)}`, route: route.value })
}

function clearState() {
    route.value = ""
    routeError.value = ""
}

defineExpose({ clearState })

</script>

<template>
    <div class="flex items-center justify-center w-full flex-grow overflow-hidden flex-col">
        <div class="flex-grow w-full overflow-y-auto mt-6">
            <div class="group relative w-full mb-6">
                <label for="trigger-type"
                    class="block w-full pb-1 font-medium text-white transition-all duration-200 ease-in-out group-focus-within:text-blue-400">Trigger
                    Type <span class="text-sm text-gray-400">(custom trigger support coming soon!)</span></label>
                <input id="trigger-type" type="text" value="http" disabled
                    class="peer h-10 w-80 rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-blue-400" />
            </div>
            <div class="group relative w-full mb-6">
                <label for="route"
                    class="block w-full pb-1 font-medium text-white transition-all duration-200 ease-in-out group-focus-within:text-blue-400">Route<span
                        v-if="routeError" class=" text-sm text-red-400 ml-4">{{ routeError }}</span></label>
                <input id="route" type="text" v-model="route"
                    class="peer h-10 w-80 rounded-md bg-gray-50 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-blue-400" />
            </div>
        </div>
        <div class="w-full flex justify-end pt-4">
            <button @click="addTrigger"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">Add
                Trigger</button>
            <button @click="$emit('cancel')"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
    </div>
</template>