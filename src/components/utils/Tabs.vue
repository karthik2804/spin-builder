<script lang="ts" setup>

defineProps(["tabs"])
function classObject(tab: any) {
    return tab.active ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
}
</script>

<template>
    <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-4">
        <ul class="flex flex-wrap -mb-px">
            <li v-for="tab in tabs" class="me-2" @click="$emit('tabClick', tab.name)">
                <a href="#" :class="classObject(tab)">{{
                    tab.name }}</a>
            </li>
        </ul>
    </div>
</template>