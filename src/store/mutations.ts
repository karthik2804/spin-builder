import { MutationTree } from 'vuex'
import { State } from './state'
import { ManifestToGraph } from '../graph-utils'
import { generateComponentNode, generateTriggerNode } from '../graph-utils/manifestToGraph'

export type Mutations<S = State> = {
    updateManifest(state: S, payload: string): void
    UpdateNodesFromManifest(state: S): void
    addToast(state: S, payload: any): void
    addTrigger(state: S, payload: any): void
    addSpinComponent(state: S, payload: any): void
    addWasmComponent(state: S, payload: any): void
}

export const mutations: MutationTree<State> & Mutations = {
    updateManifest(state, payload: any) {
        state.manifest = payload
    },
    UpdateNodesFromManifest(state) {
        state.graph = ManifestToGraph(state.manifest)
    },
    addToast(_, _payload: any) {
    },
    addTrigger(state, payload: any) {
        // state.manifest.trigger
        state.manifest.trigger[payload.type].push({ id: payload.id, route: payload.route })
        state.graph.nodes.push(generateTriggerNode(payload.id, -0.5, payload.type, payload.route))
    },
    addWasmComponent(state, payload: any): void {
        state.wasmComponents[payload.name] = {
            name: payload.name.split("/").slice(-1)[0],
            imports: payload.imports,
            exports: payload.exports,
            wit: payload.wit
        }
        console.log(state.manifest)
    },
    addSpinComponent(state, payload: any): void {
        console.log("here")
        console.log(payload)
        let id = "c" + (Math.random() + 1).toString(36).substring(5)
        state.graph.nodes.push(generateComponentNode("component-" + id, -1, { source: payload }))
        state.manifest.component[id] = {
            source: "test.wasm"
        }
    }

}