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
    loaded: true,
    crafting: [],
    options: null,
    menu: false
  },
  getters: {
    getItems: state => {
      return state.items;
    },
    getLoaded: state => {
      return state.loaded
    },
    getCrafting: state => {
      return state.crafting;
    },
    getOptions: state => {
      return state.options;
    },
    getMenu: state => {
      return state.menu
    }
  },
  mutations: {
    setItems (state, val) {
      state.items = val;
    },
    setLoaded (state, val) {
      state.loaded = val;
    },
    setCrafting (state, val) {
      state.crafting = val;
    },
    setOptions (state, val) {
      state.options = val;
    },
    setMenu (state, val) {
      state.menu = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
