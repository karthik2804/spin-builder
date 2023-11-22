import { GraphStruct } from "../graph-utils/manifestToGraph";

interface Manifest {
    application: AppDetails;
    trigger: any
    component: Record<string, any>
}

interface AppDetails {
    name: string;
    version: string;
    description: string;
}


export const state = {
    componentDataStores: ["sqlite_databases", "kv_stores"],
    componentCapabilites: ["allowed-outbound-hosts", "files", "ai-models"],
    manifest: { application: { name: "", version: "", description: "" } } as Manifest,
    graph: {} as GraphStruct,
    interactionModeLocked: false,
    wasmComponents: {} as any
}

export type State = typeof state