interface GraphStruct {
    nodes: any[]
    edges: any[]
}

interface Manifest {
    application: AppDetails;
}

interface AppDetails {
    name: string;
    version: string;
    description: string;
}


export const state = {
    componentDataStores: ["sqlite-databases", "kv-stores"],
    componentCapabilites: ["allowed-outbound-hosts", "files", "ai-models"],
    manifest: { application: { name: "", version: "", description: "" } } as Manifest,
    graph: {} as GraphStruct,
}

export type State = typeof state
export type { GraphStruct }