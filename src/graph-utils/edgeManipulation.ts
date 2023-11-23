import { invoke } from "@tauri-apps/api"
import { Edge } from "@vue-flow/core"

export async function validateConnection(manifest: any, source: string, sourceHandle: string, target: string, targetHandle: string): Promise<boolean> {

    let targetNode = getNodeType(target)

    switch (targetNode) {
        case "component":
            return validateComponentConnect(source, sourceHandle, targetHandle)
        case "trigger":
            return await validateTriggerConnect(manifest, source, sourceHandle)
    }

    return false

}

function validateComponentConnect(source: string, _sourceHandle: string, targetHandle: string): boolean {

    if (targetHandle === source) {
        return true
    }
    return false
}

async function validateTriggerConnect(manifest: any, source: string, sourceHandle: string): Promise<boolean> {
    let id = source.replace("component-", "")
    try {

        if (await invoke('validate_connection', {
            sourceComponentName: manifest.component[id].source,
            sourceExportName: sourceHandle,
            targetComponentName: "http_trigger",
            targetImportName: "wasi:http/incoming-handler@0.2.0-rc-2023-10-18",
        })) {
            return true
        }
    } catch (_) {
        try {

            if (await invoke('validate_connection', {
                sourceComponentName: manifest.component[id].source,
                sourceExportName: sourceHandle,
                targetComponentName: "http_trigger",
                targetImportName: "fermyon:spin/inbound-http",
            })) {
                return true
            }
        } catch (_) {
            throw (`Component export "${sourceHandle}" does not match either "wasi:http/incoming-handler@0.2.0-rc-2023-10-18" or "fermyon:spin/inbound-http"`)
        }
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