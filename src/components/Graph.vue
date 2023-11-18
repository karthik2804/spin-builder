<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, type Edge, MarkerType, Connection } from '@vue-flow/core'
import ComponentNode from './nodes/ComponentNode.vue'
import StoreNode from './nodes/StoreNode.vue'
import CustomEdge from './edges/CustomEdge.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import { computed } from 'vue';
import { useStore } from '../store';

const store = useStore()

const { removeEdges } = useVueFlow()
const { onConnect, addEdges } = useVueFlow()

const nodes = computed({ get: () => store.state.graph.nodes, set: (value) => store.state.graph.nodes = value })
const edges = computed({ get: () => store.state.graph.edges, set: (value) => store.state.graph.edges = value })

onConnect((params: Connection) => {
    console.log(params.source, params.targetHandle)
    if (params.source == "sql_stores" && params.targetHandle != "sqlite-databases") {
        store.commit('addToast', { message: "invalid Connection", type: "error" })
        return
    }
    let edge: Edge = {
        id: `e${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`, source: params.source, target: params.target, type: 'custom',
        sourceHandle: params.sourceHandle, targetHandle: params.targetHandle, markerEnd: {
            type: MarkerType.ArrowClosed,
        }, data: {
            type: "temptry"
        }
    }
    addEdges([edge])
})

function removeEdge(id: string) {
    console.log(store.state.graph.edges.filter(k => { return k.id === id }))
    removeEdges(id)
}

</script>
<template>
    <div class="flex-grow">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init class="vue-flow-basic-example"
            :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
            <Background pattern-color="#aaa" :gap="8" />

            <MiniMap />

            <Controls />

            <template #node-component="nodeProps">
                <ComponentNode v-bind="nodeProps" />
            </template>

            <template #node-trigger="nodeProps">
                <TriggerNode v-bind="nodeProps" />
            </template>

            <template #node-store="nodeProps">
                <StoreNode v-bind="nodeProps" />
            </template>

            <template #edge-custom="edgeProps">
                <CustomEdge v-bind="edgeProps" @removeEdge="removeEdge" />
            </template>
        </VueFlow>
    </div>
</template>
<style>
.vue-flow__handle {
    height: 10px;
    width: 10px;
}

.vue-flow__node.selected {
    border: 3px solid red;
    border-radius: 0.675rem;
}

.vue-flow__edge.selected path {
    stroke: red !important;
    stroke-width: 3px;
    background-color: red;
}
</style>