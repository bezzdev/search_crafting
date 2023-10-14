import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: []
  },
  getters: {
    getItems: state => {
      return state.items;
    },
  },
  mutations: {
    setItems (state, val) {
      state.items = val;
    },
  },
  actions: {
  },
  modules: {
  }
})
