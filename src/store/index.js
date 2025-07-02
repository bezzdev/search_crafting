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
    options: state.options,
    readChangelog: state.readChangelog
  }),
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    items: [],
    loaded: true,
    crafting: [],
    options: null,
    menu: false,
    readChangelog: -1,
    changelog: [
      {
        id: 11,
        date: "Wed, July 2 - 2025",
        title: "Version 11",
        text: "Features <br>" +
              "- More thorough searching for longer search lengths<br>" +
              "-- we no longer stop increasing search lengths once a valid search is found, this allows us to find alternative valid searches of longer lengths<br><br>" +
              "- Better text rendering of non-latin language scripts in search results<br>" +
              "-- we try to separate characters in scripts that usually combine multiple keystrokes into one character"
      },
      {
        id: 10,
        date: "Wed, May 14 - 2025",
        title: "Version 10",
        text: "Features <br>" +
              "- added support for craft overlapping (backspace)<br>"
      },
      {
        id: 9,
        date: "Thur, April 25 - 2024",
        title: "Version 9",
        text: "Features <br>" +
              "- updated default crafts<br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- fixed changlog day of week to match date <br>"
      },
      {
        id: 8,
        date: "Sat, Nov 04 - 2023",
        title: "Version 8",
        text: "Features <br>" +
              "- added support for up to 8 length searches <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- fixed sometimes displaying wrong language summary unique characters <br>" +
              "- sharing now includes the crafting weight influence <br>"
      },
      {
        id: 7,
        date: "Thur, Nov 02 - 2023",
        title: "Version 7",
        text: "Features <br>" +
              "- added language warnings for broken and misleading languages"
      },
      {
        id: 6,
        date: "Sat, Oct 21 - 2023",
        title: "Version 6",
        text: "Features <br>" +
              "- added about page <br>" +
              "- added changelog page <br>" +
              "- added reset option <br>" +
              "- added support for permitted items <br>" +
              " -- permitted items will not be classed as junk <br>" +
              " -- permitted items can be scored positively <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- fixed loading race condition <br>"
      },
      {
        id: 5,
        date: "Wed, Oct 18 - 2023",
        title: "Version 5",
        text: "Features <br>" +
              "- added 'optimize character-set' setting <br>" +
              " -- this will try to minimize the total unique search characters used for a language by finding optimal same cost substitutes <br>" +
              "- added translated tooltips <br>" +
              "- more alternative searches <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- fixed Austrian language name <br>" +
              "- added missing en_us <br>" +
              "- fixed bug with wool/wood alternatives <br>" +
              "- fixed craft calculation weight not being duplicated <br>"
      },
      {
        id: 4,
        date: "Mon, Oct 16 - 2023",
        title: "Version 4",
        text: "Features <br>" +
              "- move groups up / down <br>" +
              "- can now disable auto search <br>" +
              "- better character selectability <br>" +
              "- added configurable penalty values <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- searches that include a space now display correctly <br>"
      },
      {
        id: 3,
        date: "Sun, Oct 15 - 2023",
        title: "Version 3",
        text: "Features <br>" +
              "- added share button <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- can't add items to inventory that are in your crafting goal <br>" +
              "- can't change crafting size from 2x2 / 3x3 <br>"
      },
      {
        id: 2,
        date: "Sat, Oct 14 - 2023",
        title: "Version 2",
        text: "Features <br>" +
              "- integrated tooltip data <br>" +
              "- configuration caching"
      },
      {
        id: 1,
        date: "Thur, Oct 12 - 2023",
        title: "Version 0",
        text: "A basic version of the project was built and hosted live. <br>" +
              "This only searched against item names and was very limited."
      },
      {
        id: 0,
        date: "Wed, Oct 11 - 2023",
        title: "Init",
        text: "The inital idea for the project was formed"
      }
    ]
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
    },
    getReadChangelog: state => {
      return state.readChangelog
    },
    getIsNewChangelog: state => {
      return state.readChangelog < state.changelog[0].id
    },
    getChangelog: state => {
      return state.changelog;
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
    },
    setReadChangelog (state, val) {
      state.readChangelog = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
