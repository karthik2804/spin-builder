import { ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import { Mutations } from './mutations'
import { invoke } from '@tauri-apps/api'

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload?: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
    getManifest(
        { commit }: AugmentedActionContext,
    ): void
    saveManifest(
        { commit, state }: AugmentedActionContext,
    ): void
    notImplemented(
        { commit }: AugmentedActionContext,
    ): void
}

export const actions: ActionTree<State, State> & Actions = {
    async getManifest({ commit }) {
        let manifest: string = await invoke("get_manifest")
        if (manifest) {
            commit("updateManifest", JSON.parse(manifest))
            commit("UpdateNodesFromManifest")
            commit("addToast", { message: "Loaded app", type: "success" })
        }
    },
    async saveManifest({ commit, state }) {
        console.log(await invoke("save_manifest", { jsonManifest: JSON.stringify(state.manifest) }))
    },
    notImplemented({ commit }) {
        commit("addToast", { message: "Not implemented yet!", type: "info" })
    }
}