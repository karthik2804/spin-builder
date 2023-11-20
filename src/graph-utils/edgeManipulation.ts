import { Edge } from "@vue-flow/core"

export function validateConnection(manifest: any, source: string, sourceHandle: string, target: string, targetHandle: string): boolean {

    let targetNode = getNodeType(target)

    switch (targetNode) {
        case "component":
            return validateComponentConnect(source, sourceHandle, targetHandle)
        case "trigger":
            return validateTriggerConnect(manifest, sourceHandle)
    }

    return false

}

function validateComponentConnect(source: string, _sourceHandle: string, targetHandle: string): boolean {

    if (targetHandle === source) {
        return true
    }
    return false
}

function validateTriggerConnect(_manifest: any, sourceHandle: string): boolean {
    console.log(sourceHandle)
    if ((sourceHandle === "export")) {
        return true
    }
    return false
}

function getNodeType(nodeID: string): string {
    return nodeID.split("-")[0]
}

export function addEdgeToManifest(manifest: any, source: string, sourceHandle: string, target: string, _targetHandle: string) {

    let sourceNode = getNodeType(source)
    let targetNode = getNodeType(target)

    switch (targetNode) {
        case "component":
            let id = target.replace("component-", "")
            if (sourceNode === "sqlite_databases") {
                manifest.component[id].sqlite_databases ? manifest.component[id].sqlite_databases.push(sourceHandle) : manifest.component[id].sqlite_databases = [sourceHandle]
            } else if (sourceNode === "kv_stores") {
                manifest.component[id].key_value_stores ? manifest.component[id].key_value_stores.push(sourceHandle) : manifest.component[id].key_value_stores = [sourceHandle]
            }
            break
        case "trigger":
            let component = source.replace("component-", "")
            manifest.trigger.http.map((k: any) => {
                console.log(k, source)
                if (k.id === target) {
                    k.component = component
                }
            })
            break
    }

}

export function removeEdgeFromManifest(manifest: any, edge: Edge) {
    let sourceNode = getNodeType(edge.source)
    let targetNode = getNodeType(edge.target)
    console.log(targetNode)
    switch (targetNode) {
        case "component":
            let id = edge.target.replace("component-", "")
            if (sourceNode === "sqlite_databases") {
                manifest.component[id].sqlite_databases = manifest.component[id].sqlite_databases.filter((item: string) => item != (edge.sourceHandle || ""))
            } else if (sourceNode === "kv_stores") {
                manifest.component[id].key_value_stores = manifest.component[id].key_value_stores.filter((item: string) => item != (edge.sourceHandle || ""))
            }
            break
        case "trigger":
            manifest.trigger.http.map((k: any) => {
                if (k.id === edge.target) {
                    k.component = null
                }
            })
            break
    }
}