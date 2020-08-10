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
    setNotes(state, notes) {
      state.notes = notes
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

    async getActiveBug({ commit }, bugId) {
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

    async editBug({ dispatch, commit }, bugData) {
      try {
        console.log("bugData", bugData)
        let res = await api.put("bugs/" + bugData.id, bugData)
        console.log("edited the bug", res.data);
        dispatch("getBugs")
        dispatch("getActiveBug", bugData.id)


      } catch (err) {
        console.error(err)
      }
    },



    async getNotes({ commit }, bugId) {
      try {
        let res = await api.get("notes/" + bugId + "/notes")
        console.log("got the notes", res.data);
        commit("setNotes", res.data)
      } catch (err) {
        console.error(err)
      }
    },

    async postNote({ commit, dispatch }, noteData) {
      try {
        let res = await api.post("notes/", noteData)
        console.log(res.data)
        this.dispatch("getNotes", noteData.bugId)
      } catch (error) {
        console.error(error);
      }
    },

    async deleteNote({ dispatch, commit }, note) {
      try {
        let res = await api.delete("notes/" + note.id)
        console.log(res.data)
        this.dispatch("getNotes", note.bugId)
      } catch (error) {
        console.error(error)
      }
    },

    async changeNote({ dispatch }, editedNoteObject) {
      try {
        let res = await api.put("notes/" + editedNoteObject._id, editedNoteObject.data)
        console.log("got the data", res.data)
        console.log("got the object", editedNoteObject)
        this.dispatch("getActiveBug", res.data.bugId)
      } catch (error) {
        console.error(error)
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
