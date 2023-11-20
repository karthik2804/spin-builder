import { MarkerType } from "@vue-flow/core"
import { GRAPH_CONSTANTS as constants } from "./constants"

export interface GraphStruct {
    nodes: any[]
    edges: any[]
}


function ManifestToGraph(manifest: any): GraphStruct {
    let nodes = new Set()
    let edges = new Set()

    let kv_stores = new Set()
    let sql_stores = new Set()

    // Iterate through the components
    Object.keys(manifest.component).map((componentID, i) => {
        let component = manifest.component[componentID]

        componentID = `component-${componentID}`
        // add all the kv/sql stores to the set. 
        component.sqlite_databases?.map((store: string) => {
            sql_stores.add(store)
            edges.add({
                id: `${constants.edgeType.sqliteConnect}-${store}-${componentID}`, source: "sqlite_databases", target: componentID, type: 'custom',
                sourceHandle: store, targetHandle: "sqlite_databases", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }, data: {
                    connect: constants.edgeType.sqliteConnect
                }
            })
        })
        component.key_value_stores?.map((store: string) => {
            kv_stores.add(store)
            edges.add({
                id: `${constants.edgeType.kvConnect}-${store}-${componentID}-kv-stores`, source: "kv_stores", target: componentID, type: 'custom',
                sourceHandle: store, targetHandle: "kv_stores", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }, data: {
                    connect: constants.edgeType.kvConnect
                }
            })
        })

        nodes.add(generateComponentNode(componentID, i, component))

    })

    nodes.add({
        id: 'kv_stores', type: 'store', position: { x: 10, y: 100 }, data: {
            type: "KV Stores",
            stores: Array.from(kv_stores)
        }
    })

    nodes.add({
        id: 'sqlite_databases', type: 'store', position: { x: 10, y: 300 }, data: {
            type: "Sqlite Stores",
            stores: Array.from(sql_stores)
        }
    })

    let trigger_index = 0;
    Object.keys(manifest.trigger).map((k) => {
        let triggers = manifest.trigger[k]

        triggers.map((trigger: any) => {
            trigger.id = trigger.id === undefined ? `trigger-${(Math.random() + 1).toString(36).substring(7)}` : trigger.id
            console.log(trigger.id ? (Math.random() + 1).toString(36).substring(7) : trigger.id)
            nodes.add(generateTriggerNode(trigger.id, trigger_index, k, trigger.route))
            edges.add({
                id: `${constants.edgeType.triggerConnect}-${trigger.component}-trigger-${trigger.id}`, source: `component-${trigger.component}`, target: trigger.id, type: 'custom',
                sourceHandle: "export", markerEnd: {
                    type: MarkerType.ArrowClosed,
                }, data: {
                    connect: constants.edgeType.triggerConnect
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
        id: `${id}`, type: 'component', position: { x: 250, y: 400 * index + 100 }, data: {
            id: id,
            description: component.description,
            allowedOutboundHosts: component.allowed_outbound_hosts || "none",
            files: component.files || "none",
            aiModels: component.ai_models || "none"
        }
    }
}

export function generateTriggerNode(id: string, index: number, type: string, route: string) {
    return {
        id: id, type: 'trigger', position: { x: 600, y: 400 * index + 100 }, data: {
            id: id,
            type: type,
            route: route,
        }
    }
}

export { ManifestToGraph }