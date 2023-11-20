const nodeTypes = {
    wasmComponent: "component",
    kvStore: "kvStore",
    sqlStore: "sqlStore",
    appVariables: "appVariables",
    trigger: "trigger"
}

enum edgeType {
    triggerConnect = "triggerConnect",
    sqliteConnect = "sqliteConnect",
    kvConnect = "kvConnect",
}


const GRAPH_CONSTANTS = {
    nodeTypes,
    edgeType
}

export { GRAPH_CONSTANTS }