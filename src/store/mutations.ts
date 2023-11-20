import { MutationTree } from 'vuex'
import { State } from './state'
import { ManifestToGraph } from '../graph-utils'
import { generateTriggerNode } from '../graph-utils/manifestToGraph'

export type Mutations<S = State> = {
    updateManifest(state: S, payload: string): void
    UpdateNodesFromManifest(state: S): void
    addToast(state: S, payload: any): void
    addTrigger(state: S, paylad: any): void
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
    addTrigger(state, payload: any) {
        console.log(state.manifest)
        console.log(payload)
        // state.manifest.trigger
        state.manifest.trigger[payload.type].push({ id: payload.id, route: payload.route })
        state.graph.nodes.push(generateTriggerNode(payload.id, -0.5, payload.type, payload.route))
        console.log(state.graph.nodes)
    }
}