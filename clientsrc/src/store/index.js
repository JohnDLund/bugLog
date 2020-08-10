import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import { api } from "./AxiosService"

Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    profile: {},
    bugs: [],
    activeBug: {},
    notes: [],
    activeNote: {}
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },

    setBugs(state, bugs) {
      state.bugs = bugs
    },
    setActiveBug(state, bug) {
      state.activeBug = bug
    },

  },
  actions: {

    getBugs({ commit, dispatch }) {
      api.get('bugs')
        .then(res => {
          console.log("got all bugs", res.data)
          commit('setBugs', res.data)
        })
    },

    addBug({ commit, dispatch }, bugData) {
      console.log(bugData)
      api.post('bugs', bugData)
        .then(serverBug => {
          dispatch('getBugs')
        })
    },

    async getBug({ commit }, bugId) {
      try {
        let res = await api.get("bugs/" + bugId)
        console.log("got the bug", res.data);
        commit("setActiveBug", res.data)
      } catch (err) {
        console.error(err)
      }
    },
    async deleteBug({ dispatch }, bugId) {
      try {
        let res = await api.delete("bugs/" + bugId)
        console.log("deleted a bug", res.data);
        dispatch("getBugs", bugId)
      } catch (err) {
        console.error(err)
      }
    },

    async editBug({ dispatch }, bugData) {
      try {
        console.log("bugData", bugData)
        let res = await api.put("bugs/" + bugData.id, bugData)
        console.log("edited the bug", res.data);
        dispatch("getBugs", bugData.bugId)
      } catch (err) {
        console.error(err)
      }
    },















    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getProfile({ commit }) {
      try {
        let res = await api.get("profile");
        commit("setProfile", res.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
});
