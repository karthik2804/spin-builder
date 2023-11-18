import { MutationTree } from 'vuex'
import { GraphStruct, State } from './state'
import { MarkerType } from '@vue-flow/core'

export type Mutations<S = State> = {
    updateManifest(state: S, payload: string): void
    UpdateNodesFromManifest(state: S): void
    addToast(state: S, payload: any): void
    updateManifestFromGraph(state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
    updateManifest(state, payload: any) {
        console.log(payload)
        state.manifest = payload
    },
    UpdateNodesFromManifest(state) {
        state.graph = ManifestToGraph(state.manifest)
    },
    addToast(_, _payload: any) {
    },
    updateManifestFromGraph(state) {
        state.manifest = graphToManifest(state.manifest, state.graph)
    }
}

function ManifestToGraph(manifest: any): GraphStruct {
    let nodes = new Set()
    let edges = new Set()

    let kv_stores = new Set()
    let sql_stores = new Set()

    // Iterate through the components
    Object.keys(manifest.component).map((k, i) => {
        let component = manifest.component[k]

        k = `component-${k}`
        // add all the kv/sql stores to the set. 
        component.sqlite_databases?.map((store: string) => {
            sql_stores.add(store)
            edges.add({
                id: `esqlstore-${store}-${k}-sql-stores`, source: "sql_stores", target: k, type: 'custom',
                sourceHandle: store, targetHandle: "sqlite-databases", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            })
        })
        component.key_value_stores?.map((store: string) => {
            kv_stores.add(store)
            edges.add({
                id: `ekvstore-${store}-${k}-kv-stores`, source: "kv_stores", target: k, type: 'custom',
                sourceHandle: store, targetHandle: "kv-stores", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            })
        })

        nodes.add(generateComponentNode(k, i, component))

    })

    nodes.add({
        id: 'kv_stores', type: 'store', position: { x: 10, y: 100 }, data: {
            type: "KV Stores",
            stores: Array.from(kv_stores)
        }
    })

    nodes.add({
        id: 'sql_stores', type: 'store', position: { x: 10, y: 300 }, data: {
            type: "Sqlite Stores",
            stores: Array.from(sql_stores)
        }
    })

    let trigger_index = 0;
    Object.keys(manifest.trigger).map((k) => {
        let triggers = manifest.trigger[k]

        triggers.map((trigger: any) => {
            nodes.add(generateTriggerNode(trigger.id, trigger_index, k, trigger.route))
            edges.add({
                id: `e${trigger.component}-trigger-${trigger.id}`, source: `component-${trigger.component}`, target: trigger.id, type: 'custom',
                sourceHandle: "export", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            })
            trigger_index++
        })
    })

    return {
        nodes: Array.from(nodes),
        edges: Array.from(edges)
    }
}

function generateComponentNode(id: string, index: number, component: any) {
    return {
        id: `${id}`, type: 'component', label: 'Node 2', position: { x: 250, y: 400 * index + 100 }, data: {
            id: id,
            description: component.description,
            allowedOutboundHosts: component.allowed_outbound_hosts || "none",
            files: component.files || "none",
            aiModels: component.ai_models || "none"
        }
    }
}

function generateTriggerNode(id: string, index: number, type: string, route: string) {
    return {
        id: id, type: 'trigger', label: 'Node 2', position: { x: 600, y: 400 * index + 100 }, data: {
            id: id,
            type: type,
            route: route
        }
    }
}

function graphToManifest(manifest: any, graph: GraphStruct): any {
    let ret = manifest
    ret.component
}