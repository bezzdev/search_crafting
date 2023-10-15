import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
  reducer: (state) => ({
    crafting: state.crafting,
    options: state.options
  }),
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    items: [],
    crafting: [],
    settings: {}
  },
  getters: {
    getItems: state => {
      return state.items;
    },
    getCrafting: state => {
      return state.crafting;
    },
    getSettings: state => {
      return state.settings;
    }
  },
  mutations: {
    setItems (state, val) {
      state.items = val;
    },
    setCrafting (state, val) {
      state.crafting = val;
    },
    setSettings (state, val) {
      state.settings = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
