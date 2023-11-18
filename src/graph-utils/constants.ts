const nodeTypes = {
    wasmComponent: "component",
    kvStore: "kvStore",
    sqlStore: "sqlStore",
    appVariables: "appVariables",
    trigger: "trigger"
}

enum edgeType {
    triggerComponent,
    sqliteConnect,
    kvConnect,
}


const GRAPH_CONSTANTS = {
    nodeTypes,
    edgeType
}

export { GRAPH_CONSTANTS }