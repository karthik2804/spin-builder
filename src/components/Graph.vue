<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, type Edge, MarkerType, Connection, GraphNode } from '@vue-flow/core'
import ComponentNode from './nodes/ComponentNode.vue'
import StoreNode from './nodes/StoreNode.vue'
import CustomEdge from './edges/CustomEdge.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import { computed, ref, watch } from 'vue';
import { useStore } from '../store';
import { addEdgeToManifest, removeEdgeFromManifest, validateConnection } from '../graph-utils/edgeManipulation'

const store = useStore()

const { removeEdges } = useVueFlow()
const { onConnect, addEdges, getSelectedNodes } = useVueFlow()

const nodes = computed({ get: () => store.state.graph.nodes, set: (value) => store.state.graph.nodes = value })
const edges = computed({ get: () => store.state.graph.edges, set: (value) => store.state.graph.edges = value })

onConnect(async (params: Connection) => {
    try {
        if (!await validateConnection(store.state.manifest, params.source, params.sourceHandle || "", params.target, params.targetHandle || "")) {
            return
        }
    } catch (err) {
        store.commit('addToast', { message: err, type: "error" })
        return
    }
    let edge: Edge = {
        id: `e${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`, source: params.source, target: params.target, type: 'custom',
        sourceHandle: params.sourceHandle, targetHandle: params.targetHandle, markerEnd: {
            type: MarkerType.ArrowClosed,
        },
    }
    addEdges([edge])
    addEdgeToManifest(store.state.manifest, params.source, params.sourceHandle || "", params.target, params.targetHandle || "")
    if (edge.target.includes("trigger")) {
        handleTriggerValidation(edge.target, true)
    }
})

function removeEdge(id: string) {
    let edges: any[] = store.state.graph.edges.filter(k => { return k.id === id })
    let edge = edges.shift()
    removeEdgeFromManifest(store.state.manifest, edge as Edge)
    if (edge.target.includes("trigger")) {
        handleTriggerValidation(edge.target, false)
    }
    removeEdges(id)
}

const selectedNodes = ref([] as GraphNode<any, any, string>[])

watch(getSelectedNodes, (newValue) => {
    selectedNodes.value = newValue
    let id = ""
    if (selectedNodes.value.length) {
        id = selectedNodes.value[0].id
    }
    store.state.graph.edges.map((edge: any) => {
        if (edge.source === id || edge.target === id) {
            edge.data.active = true;
            edge.animated = true
        } else {
            edge.data.active = false;
            edge.animated = false
        }
    })
})

function handleTriggerValidation(id: string, value: boolean) {
    const nodeIndex = store.state.graph.nodes.findIndex(node => node.id === id);
    if (nodeIndex !== -1) {
        store.state.graph.nodes[nodeIndex].data.connected = value;
    }
}

function interactionModeLocked(state: boolean) {
    store.state.interactionModeLocked = state
}

</script>
<template>
    <div class="flex-grow">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init :default-zoom="1.5" :min-zoom="0.2"
            :max-zoom="4">
            <Background pattern-color="#aaa" :gap="8" />

            <MiniMap />

            <Controls @interaction-change="interactionModeLocked" />

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
    height: 10px !important;
    width: 10px !important;
}

.vue-flow__handle-left {
    left: -5px !important;
}

.vue-flow__handle-right {
    right: -5px !important;
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