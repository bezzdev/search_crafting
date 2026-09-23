<template>
  <v-container fluid v-if="loaded && options != null">
    <v-row>
      <v-spacer/>
      <v-col cols="12" sm="5" lg="6">
        <v-toolbar class="mb-2">
          <v-btn v-if="!edit" @click="setEditMode(true)" tile color="blue">
            Edit
          </v-btn>
          <v-btn v-else @click="setEditMode(false)" tile color="green">
            Save
          </v-btn>
          <v-spacer />
          <v-tooltip v-if="!edit" bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="share" text>
                Share
                <v-icon class="ml-2">
                  mdi-share
                </v-icon>
              </v-btn>
            </template>
            <span>Copy a link to this setup</span>
          </v-tooltip>
        </v-toolbar>
        <v-expansion-panels class="mb-2">
          <permitted v-if="options && options.allow_permitted_items" ref="permitted" :permitted="options.permitted_items" :edit="edit" 
            @itemsChanged="itemsChanged"
          />
        </v-expansion-panels>
        <v-expansion-panels>
          <craft ref="craft" v-for="craft, c in crafts" :key="c" :craft="craft" :edit="edit" 
            @moveUp="moveUp"
            @moveDown="moveDown"
            @delete="deleteCraft"
            @duplicate="duplicateCraft" 
            @itemsChanged="itemsChanged" 
            @enabled="enabledChanged" 
          />
          <v-tooltip v-if="edit" bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon large @click="addCraft">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add Group</span>
          </v-tooltip>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" sm="7" lg="6">
        <v-toolbar class="mb-2">
          <v-btn @click="toggleSettings" icon color="white" class="mr-2">
            <v-icon>
              mdi-cog
            </v-icon>
          </v-btn>
          <v-text-field label="search" v-model="options.search" hide-details single-line @change="searchChanged" />
          <v-checkbox class="ml-2 pt-4" label="auto" v-model="options.auto_search" dense />
        </v-toolbar>
        <v-card class="mb-2" v-show="settingsOpen">
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-switch v-model="options.score_search_lengths" label="label" @change="setDirty">
                  <template v-slot:label>
                    Search Length Matters
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Apply a penalty based on the search length</span>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-subheader class="pl-0 input-slider">
                  Maximum Search Length: {{ options.max_characters }}
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="ml-2">
                        mdi-information
                      </v-icon>
                    </template>
                    <span>The maximum length of a search.</span>
                  </v-tooltip>
                </v-subheader>
                <v-slider v-model="options.max_characters" step="1" min="1" max="8" ticks="always" @change="setDirty">
                  <template v-slot:prepend>
                    <span>1</span>
                  </template>
                  <template v-slot:append>
                    <span>8</span>
                  </template> 
                </v-slider>
                <v-text-field v-model="options.letter_penalty" class="mt-3" label="Search Length Penalty" @change="setDirty" type="number" dense>
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for each additional character in the search</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="options.has_junk_penalty" label="Has Junk Penalty" @change="setDirty" type="number">
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for having any junk in the search results</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-text-field v-model="options.junk_penalty" label="Junk Item Penalty" @change="setDirty" type="number">
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for each junk item in the search results</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-text-field v-model="options.fail_penalty" label="Search Fail Penalty" @change="setDirty" type="number">
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for failing to find a valid search</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-switch v-model="options.allow_permitted_items" class="ml-2" label="label" @change="setDirty">
                  <template v-slot:label>
                    Allow Permitted Items
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <div class="text-center">
                        Configure permitted items that will not negatively affect the efficiency score
                      </div>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-switch v-model="options.permit_goal_items" class="ml-2" label="label" @change="setDirty">
                  <template v-slot:label>
                    Include Goal Items
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <div class="text-center">
                        Goal items from other crafts will be included in the permitted list
                      </div>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-text-field class="pl-4 pr-2" v-model="options.permitted_items_benefit" label="Permitted Item Benefit" @change="setDirty" type="number">
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Score benefit for finding these additional items</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-switch v-model="options.resource_id" label="label" @change="setDirty" dense>
                  <template v-slot:label>
                    Resource ID
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Allow the use of the prepended ':' to search for items using their Resource ID</span>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-switch v-model="options.optimize_unique_characters" label="label" @change="setDirty" dense>
                  <template v-slot:label>
                    Optimize Character Set
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <div class="text-center">
                        Minimize the required unique characters by using equal cost alternatives<br>
                        May slow down search speed significantly
                      </div>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-text-field v-model="options.double_input" class="mt-4" label="Double Input Penalty" @change="setDirty" type="number" dense>
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for the same character input twice in a row</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-text-field v-model="options.character_blacklist" class="mt-3" persistent-placeholder :label="characterBlacklistLabel" @change="setDirty">
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>These characters will not show in search results</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-switch v-model="options.overlap_crafting" label="label" @change="setDirty">
                  <template v-slot:label>
                    Craft Overlap
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Allow crafts goals to be split into multiple searches sharing the first search character, currently supports up to 2 goals and 2 length searches</span>
                    </v-tooltip>
                  </template>
                </v-switch>
                <v-text-field v-model="options.overlap_penalty" class="mt-4" label="Overlap Penalty" @change="setDirty" type="number" dense>
                  <template v-slot:append>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Penalty for overlapped crafts</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-expansion-panels class="mb-2" v-if="enabled_languages.length != all_languages.length">
          <disabled-languages :languages="all_languages" :enabledLanguages="enabled_languages" @disableAll="disableAllLanguages" @enableAll="enableAllLanguages"></disabled-languages>
        </v-expansion-panels>
        <div class="text-center" v-if="resultsOutdated && options.auto_search">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-row v-if="resultsOutdated && !options.auto_search" align="center" class="text-center" style="height: 200px;">
          <v-col>
            <v-btn @click="manuallySearch" tile class="mb-2" color="primary">
              Search
            </v-btn>
            <div>Auto Search is turned off</div>
          </v-col>
        </v-row>
        <v-expansion-panels v-show="!loading && !resultsOutdated">
          <template v-for="result in filteredResults">
            <language-result v-if="!result.disabled" :result="result" :key="result.language_key" @disableLanguage="disableLanguage" :edit="edit" @copyText="copyText" />
            <disabled-language-result v-if="result.disabled" :result="result" :key="result.language_key" @enableLanguage="enableLanguage" />
          </template>
        </v-expansion-panels>
      </v-col>
      <v-spacer/>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import craft from "../components/craft.vue"
import permitted from "../components/permitted.vue"
import disabledLanguages from "../components/disabledLanguages.vue"

import languageResult from '../components/languageResult.vue'
import disabledLanguageResult from '../components/disabledLanguageResult.vue'
import { en_gb } from '../js/names/en_gb.js';
import { ShareSerialize, ShareDeserialize } from '../js/shareSerializer'
import { CraftingLoader } from '../js/craftingLoader'
import { OptionsLoader } from '../js/optionsLoader'
import { LanguageLoader } from '../js/languageLoader'
import { DefaultSetup } from '../js/defaultSetup'
import { Crafting } from '../js/crafting.js';
import { Languages } from '../js//languages.js';

export default {
  name: 'Crafting',
  props: [],
  components: {
    craft,
    permitted,
    disabledLanguages,
    languageResult,
    disabledLanguageResult,
  },
  data: () => ({
    crafts: [],
    all_languages: [],
    enabled_languages: [],
    options: null,
    option_values: null,
    results: [],
    edit: false,
    settingsOpen: false,
    settingsOutdated:false,
    resultsOutdated: false,
    craftsChanged: false,
    loading: false,
    snackbar: false,
    snackbarText: ""
  }),
  computed: {
    loaded () {
      return this.$store.getters.getLoaded
    },
    filteredResults () {
      return this.results.filter(r => (!r.disabled || this.edit) && this.filterLanguage(r))
    },
    permittedItems () {
      if (this.crafts != null && this.options != null && this.options.permitted_items != null) {
        if (!this.options.permit_goal_items) {
          return this.options.permitted_items;
        } else {
          return this.crafts.filter(craft => craft.enabled).flatMap(craft => craft.goals).concat(this.options.permitted_items).filter(function(value, index, array) {
            return array.indexOf(value) === index;
          })
        }
      }
      return [];
    },
    characterBlacklistLabel() {
      return 'Banned Characters (' + (this.options.character_blacklist ?? "").length + ')';
    }
  },
  watch: {
  },
  methods: {
    setEditMode: function (val) {
      this.edit = val;
      if (this.edit == false && this.craftsChanged) {

        this.$refs["permitted"].applyChanges();
        for(var c = 0; c < this.crafts.length; c++)
          this.$refs["craft"][c].applyChanges();

        this.setDirty();
      }
    },
    toggleSettings: function () {
      this.settingsOpen = !this.settingsOpen;
    },
    share: function () {
      var items = this.$store.getters.getItems;

      var encoded = ShareSerialize({
        crafting: this.crafts,
        options: this.options,
        languages: this.enabled_languages.length == this.all_languages.length ? null : this.enabled_languages
      }, items);

      var link = process.env.VUE_APP_CLIENT_PROTOCOL + process.env.VUE_APP_CLIENT_URL + "?data=" + encoded;
      navigator.clipboard.writeText(link);
    },
    setDirty: function () {
      this.setSettingsOutdated();
      this.setResultsOutdated();
    },
    setSettingsOutdated: function () {
      this.settingsOutdated = true;
    },
    setResultsOutdated: function () {
      this.resultsOutdated = true;
    },
    addCraft: function () {
      this.crafts.push({
        enabled: true,
        size: 3,
        weight: 1.0,
        goals: [
        ],
        inventory: [
        ]        
      })
    },
    moveUp: function (craft) {
      var index = this.crafts.indexOf(craft)
      if (index > 0) {
        this.crafts.splice(index, 1);
        this.crafts.splice(index - 1, 0, craft);
      }
    },
    moveDown: function (craft) {
      var index = this.crafts.indexOf(craft)
      if (index < this.crafts.length - 1) {
        this.crafts.splice(index, 1);
        this.crafts.splice(index + 1, 0, craft);
      }
    },
    deleteCraft: function(craft) {
      this.crafts.splice(this.crafts.indexOf(craft), 1);
      this.craftsChanged = true;
    },
    itemsChanged: function () {
      this.craftsChanged = true;
    },
    duplicateCraft: function(craft) {
      var dupe = {
        enabled: craft.enabled,
        size: craft.size,
        weight: craft.weight,
        goals: [
        ],
        inventory: [
        ]        
      }

      dupe.goals = [].concat(craft.goals)
      dupe.inventory = [].concat(craft.inventory)
      
      var index = this.crafts.indexOf(craft)
      this.crafts.splice(index + 1, 0, dupe);

      this.craftsChanged = true;
    },
    enabledChanged: function () {
      this.setDirty();
    },
    searchChanged: function () {
      this.$store.commit('setOptions', this.options)
    },
    filterLanguage: function (languageResult) {
      var search = ''
      if (this.options && this.options.search) {
        if (this.options.search == '')
          return true;

        search = this.options.search;
        if(languageResult.language_name.toLowerCase().includes(search.toLowerCase()))
          return true;
        if(languageResult.language_region.toLowerCase().includes(search.toLowerCase()))
          return true;
        if(languageResult.localized.toLowerCase().includes(search.toLowerCase()))
          return true;

        return false;
      }
      return true;
    },
    disableLanguage: function(language_key) {
      let self = this;
      if (self.enabled_languages.includes(language_key)) {
        self.enabled_languages.splice(self.enabled_languages.indexOf(language_key), 1);
        if (self.results) {
          self.results.find(r => r.language_key == language_key).disabled = true;
        }
      }
      self.$store.commit('setEnabledLanguages', self.enabled_languages)
    },
    enableLanguage: function(language_key) {
      let self = this;
      if (!self.enabled_languages.includes(language_key)) {
        self.enabled_languages.push(language_key);
        if (self.results) {
          self.results.find(r => r.language_key == language_key).disabled = false;
        }
      }
      self.$store.commit('setEnabledLanguages', self.enabled_languages)
    },
    disableAllLanguages: function () {
      let self = this;
      if (self.results) {
        self.all_languages.forEach(key => {
          let lang = self.results.find(r => r.language_key == key)
          if (lang) {
            lang.disabled = true;
          }
        })
      }

      self.enabled_languages = []
      self.$store.commit('setEnabledLanguages', self.enabled_languages)
    },
    enableAllLanguages: function () {
      let self = this;
      if (self.results) {
        self.all_languages.forEach(key => {
          let lang = self.results.find(r => r.language_key == key)
          if (lang) 
          {
            lang.disabled = false;
          }
        })
      }

      self.enabled_languages = self.all_languages.map(l => l)
      self.$store.commit('setEnabledLanguages', self.enabled_languages)
    },
    manuallySearch: function () {
      this.resultsOutdated = false;
      this.getResults();
    },
    getResults: function () {
      let self = this;
      self.loading = false;
      self.results = Crafting.getResults(self.options, self.crafts, self.enabled_languages, self.permittedItems);
      self.loading = false;
    },
    copyText: function (text) {
      navigator.clipboard.writeText(text);
      this.snackbarText = "Copied text: "+ text;
      this.snackbar = true;
    }
  },
  mounted () {
    var self = this;
    const item_keys = Object.keys(en_gb);
    self.$store.commit('setItems', item_keys);
    Crafting.setItems(item_keys);
    
    // default setup
    var defaults = DefaultSetup();
    self.crafts = defaults.crafting;
    self.options = defaults.options;
    self.all_languages = Languages.map(l => l.key);
    self.enabled_languages = Languages.map(l => l.key);

    if (defaults.disabled_languages?.length) {
      self.enabled_languages = Languages.map(l => l.key).filter(key => !defaults.disabled_languages.includes(key));
    } else if (defaults.enabled_languages?.length) {
      self.enabled_languages = Languages.map(l => l.key).filter(key => defaults.enabled_languages.includes(key));
    }

    // load data from cache
    var loadedCrafting = self.$store.getters.getCrafting;
    if (loadedCrafting != null && loadedCrafting.length > 0) {
      self.crafts = CraftingLoader(loadedCrafting);
    }
    var loadedOptions = self.$store.getters.getOptions;
    if (loadedOptions != null) {
      self.options = OptionsLoader(loadedOptions, defaults.options);
    }

    var loadedLanguages = self.$store.getters.getEnabledLanguages;
    if (loadedLanguages != null) {
      self.enabled_languages = loadedLanguages;
    }
    
    // load share data
    if(self.$route.query.data) {
      var encoded = self.$route.query.data;
      
      var items = this.$store.getters.getItems;
      var json = ShareDeserialize(encoded, items)

      if (json) {
        if (json.crafting) {
          self.crafts = CraftingLoader(json.crafting);
        }
        if (json.options) {
          self.options = OptionsLoader(json.options, defaults.options);
        }
        if (json.enabled_languages) {
          self.enabled_languages = LanguageLoader(json.enabled_languages, self.all_languages);
        }
      }
      self.$router.replace({'query': null});
      
      self.getResults();
    }
   
    // finish loading
    self.$store.commit('setLoaded', true)

    // get new results
    setInterval(function() {
      if (self.settingsOutdated) {
        self.$store.commit('setCrafting', self.crafts)
        self.$store.commit('setOptions', self.options)
        self.$store.commit('setEnabledLanguages', self.enabled_languages)

        self.settingsOutdated = false;
      }
      if (self.resultsOutdated && self.options.auto_search) {
        self.getResults();
        self.resultsOutdated = false;
      }
    }, 500)

    self.setDirty();
  }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.v-expansion-panel-content__wrap {
  padding-left: 8px;
  padding-right: 8px;
}

.v-input--switch {
  margin-top: 2px;
}

.input-slider {
  margin-top: -6px;
}

.v-input--switch .v-messages,
.v-input__slider .v-messages,
.v-text-field__details {
  display: none;
}

</style>
