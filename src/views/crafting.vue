<template>
  <v-container fluid>
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
          <v-switch v-model="options.one_character_only" class="ml-4" hide-details label="Find Single Character Only" @change="setResultsOutdated"/>
          <v-switch v-model="options.score_search_lengths" class="ml-2" hide-details label="Search Length Matters" @change="setResultsOutdated"/>
          <v-spacer />
          
          <v-tooltip v-if="!edit" bottom>
            <template v-slot:activator="{ on }">
              <v-btn  v-on="on" @click="share" text>
                Share
                <v-icon class="ml-2">
                  mdi-share
                </v-icon>
              </v-btn>
            </template>
            <span>Copy a link to this setup</span>
          </v-tooltip>
        </v-toolbar>
        <v-expansion-panels>
          <craft :ref="'craft-' + c" v-for="craft, c in crafting" :key="c" :craft="craft" :edit="edit" @delete="deleteCraft" @duplicate="duplicateCraft" @itemsChanged="itemsChanged" @enabled="enabledChanged" />
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
          <v-text-field label="search" v-model="options.search" hide-details single-line @change="searchChanged" />
        </v-toolbar>  
        <v-expansion-panels v-if="!loading">
          <languageResult v-show="filterLanguage(result)" v-for="result, r in results" :key="r" :result="result" />
        </v-expansion-panels>
        <div class="text-center" v-else>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>
<script>
import craft from "../components/craft.vue"
import languageResult from '../components/languageResult.vue'

import { RecipeGroups } from '../js/recipeGroups.js';
import { Languages } from '../js/languages.js';
// import { LanguageNames } from '../js/languageNames.js';
import { LanguageTooltips } from '../js/languageTooltips.js';
import { en_gb } from '../js/names/en_gb.js';
import { ShareSerialize, ShareDeserialize } from '../js/shareSerializer'

export default {
  name: 'Crafting',
  props: [],
  components: {
    craft,
    languageResult
  },
  data: () => ({
    crafting: [
      {
        enabled: true,
        size: 3,
        goals: [
          "item.minecraft.iron_pickaxe",
          "item.minecraft.iron_axe",
          "item.minecraft.iron_shovel",
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ]
      },
      {
        enabled: true,
        size: 3,
        goals: [
          "item.minecraft.bucket",
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ]        
      },
      {
        enabled: true,
        size: 2,
        goals: [
          "item.minecraft.flint_and_steel"
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ]       
      },
      {
        enabled: true,
        size: 3,
        goals: [
          "item.minecraft.golden_carrot",
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "block.minecraft.white_wool",
          "block.minecraft.obsidian",
          "block.minecraft.crying_obsidian",
          "item.minecraft.ender_pearl",
          "item.minecraft.blaze_rod",
          "item.minecraft.carrot",
          "item.minecraft.gold_nugget",
          "item.minecraft.gold_ingot"
        ]
      },
      {
        enabled: true,
        size: 3,
        goals: [
          "block.minecraft.white_wool",
          "block.minecraft.glowstone"
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "block.minecraft.obsidian",
          "block.minecraft.crying_obsidian",
          "item.minecraft.ender_pearl",
          "item.minecraft.blaze_rod",
          "block.minecraft.white_bed",
          "item.minecraft.glowstone_dust",
          "item.minecraft.string",
        ]
      },
      {
        enabled: true,
        size: 3,
        goals: [
          "block.minecraft.white_bed",
          "block.minecraft.respawn_anchor"
        ],
        inventory: [
          "block.minecraft.oak_planks",
          "block.minecraft.obsidian",
          "block.minecraft.crying_obsidian",
          "item.minecraft.ender_pearl",
          "item.minecraft.blaze_rod",
          "block.minecraft.white_wool",
          "block.minecraft.glowstone"
        ]
      }
    ],
    options: {
      one_character_only: false,
      score_search_lengths: true,
      search: ''
    },
    badCharacters: ["□"],
    results: [],
    edit: false,
    resultsOutdated: false,
    craftingChanged: false,
    loading: false,
  }),
  computed: {
  },
  watch: {
    resultsOutdated: function(val) {
      if (val) {
        this.loading = true;
      }
    }
  },
  methods: {
    setEditMode: function (val) {
      this.edit = val;
      if (this.edit == false && this.craftingChanged) {

        for(var c = 0; c < this.crafting.length; c++)
          this.$refs["craft-"+c][0].applyChanges();

        this.setResultsOutdated();
      }
    },
    share: function () {
      var items = this.$store.getters.getItems;

      var encoded = ShareSerialize({
        crafting: this.crafting,
        options: this.options
      }, items);

      var link = process.env.VUE_APP_CLIENT_PROTOCOL + process.env.VUE_APP_CLIENT_URL + "?data=" + encoded;
      navigator.clipboard.writeText(link);
    },
    setResultsOutdated: function () {
      this.resultsOutdated = true;
    },
    addCraft: function () {
      this.crafting.push({
        enabled: true,
        size: 3,
        goals: [
        ],
        inventory: [
        ]        
      })
    },
    deleteCraft: function(craft) {
      this.crafting.splice(this.crafting.indexOf(craft), 1);
      this.craftingChanged = true;
    },
    itemsChanged: function () {
      this.craftingChanged = true;
    },
    duplicateCraft: function(craft) {
      var dupe = {
        enabled: true,
        size: 3,
        goals: [
        ],
        inventory: [
        ]        
      }

      dupe.goals = [].concat(craft.goals)
      dupe.inventory = [].concat(craft.inventory)

      this.crafting.push(dupe)
      this.craftingChanged = true;
    },
    enabledChanged: function () {
      this.setResultsOutdated();
    },
    searchChanged: function () {
      this.$store.commit('setOptions', this.options)
    },
    filterLanguage: function (languageResult) {
      var search = ''
      if (this.options && this.options.search) {
        if (this.options.search == '')
          return true

        search = this.options.search;
        if(languageResult.language_name.toLowerCase().includes(search.toLowerCase()))
          return true
        if(languageResult.language_region.toLowerCase().includes(search.toLowerCase()))
          return true
        if(languageResult.localized.toLowerCase().includes(search.toLowerCase()))
          return true
      }
      return true;
    },
    getRelevantGroupsForInventory: function (groups, size, inventory) {
      var relevant = []
      groups.forEach(function(group) {
        var group_relevant = false;
        group.forEach(function(recipe) {
          var craftable = true;
          if (recipe.size > size) {
            craftable = false;
          } else {
            recipe.ingredients.forEach(function(ingredient) {
              if (!ingredient.some(ing => inventory.includes(ing))) {
                // does not have ingredient
                craftable = false;
              }
            })
          }
          if (craftable) {
            group_relevant = true;
          }
        })

        if (group_relevant) {
          relevant.push(group);
        }
      })
      return relevant;
    },
    getSearchesForItems: function (items, translations) {
      var self = this;
      
      var item_translations = []
      var characters = []
      var valid_characters = []

      items.forEach(function(item) {
        var translation = translations[item].toLowerCase();
        item_translations.push(translation);

        for(var c = 0; c < translation.length; c++) {
          var ch = translation[c]
          if (!characters.includes(ch) && !self.badCharacters.includes(ch)) {
            // get all matching characters for these keys
            characters.push(ch);
          }
        }
      })

      characters.forEach(function(char) {
        if(item_translations.every(function (translation) { return translation.includes(char); })) {
          valid_characters.push(char); 
        }
      })


      if (!this.options.one_character_only) {
        // handling for search lengths > 1
        var characters2 = []
        var valid_characters2 = []

        valid_characters.forEach(function(char) {
          items.forEach(function(item) {
            var translation = translations[item].toLowerCase();
            for(var i = 0; i < translation.length - 1; i++) {
              if (translation[i] == char) {
                var newChar2 = translation[i+1];
                if(!self.badCharacters.includes(newChar2)) {
                  var newSearch = char + newChar2;
                  if (!characters2.includes(newSearch)) {
                    characters2.push(newSearch)
                  }
                }
              }
            }
          })
        })
        characters2.forEach(function(char2) {
          if(item_translations.every(function (translation) { return translation.includes(char2); })) {
            valid_characters2.push(char2); 
          }
        })
        valid_characters = valid_characters.concat(valid_characters2); 
      }

      return valid_characters
    },
    searchGroups: function (groups, translations, search) {
      var found = []
      groups.forEach(function(group) {
        var matched = false;
        group.forEach(function(recipe) {
          var output = translations[recipe.output];
          if (output.toLowerCase().includes(search)) {
            matched = true;
          }
        })
        if (matched) {
          found.push(group);
        }
      })
      return found;
    },
    getRecipesForGroups: function (groups, inventory) {
      var recipes = []
      groups.forEach(function(group) {
        group.forEach(function(recipe) {
          var craftable = true;
          recipe.ingredients.forEach(function(ingredient) {
            if (!ingredient.some(ing => inventory.includes(ing))) {
              // does not have ingredient
              craftable = false;
            }
          })
          if (craftable) {
            recipes.push(recipe.output)
          }
        })
      })
      return recipes;
    },
    scoreSearch: function(search, goals, results) {
      var remainder = results.length - goals.length;
      var letters = search.length;
      if (!this.options.score_search_lengths)
        letters = 1;
      return Math.pow(0.6 * letters, 2) + (remainder); 
    },
    getResults: function () {
      var self = this;
      self.loading = true;
      self.results = []

      var keys = Languages.map(l => l.key)
      var test_languages = keys.map(k => Languages.find(l => l.key == k))

      var valid_crafts = self.crafting.filter(c => c.goals.length > 0 && c.inventory.length > 0);
      valid_crafts.forEach(function (craft) {
        var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.size, craft.inventory)
        
        var valid = true;
        craft.goals.forEach(function (goal) {
          var found_craftable = groups.find(g => g.find(r => r.output == goal))
          if (found_craftable == null) {
            valid = false;
          }
        })
        craft.valid = valid;
      })
      var enabled_crafts = valid_crafts.filter(c => c.enabled);
      
      test_languages.forEach(function(language) {
        var translation_result = {
          language_name: language.name,
          language_region: language.region,
          localized: language.localized,
          language_key: language.key,
          crafting: [],
          score: 0
        }
        var translations = LanguageTooltips[language.key];

        enabled_crafts.forEach(function(craft) {
          if (craft.valid) {
            var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.size, craft.inventory)
            var searches = self.getSearchesForItems(craft.goals, translations);

            var scored_search_results = []

            searches.forEach(function(search) {
              var results = self.searchGroups(groups, translations, search);
              var score = self.scoreSearch(search, craft.goals, results);
              if (score == -0.64) {
                console.log()
              }
              scored_search_results.push({
                search_term: search,
                results: self.getRecipesForGroups(results, craft.inventory),
                score: score
              })
            })

            var best_searches = []
            var best_search = null

            if (scored_search_results.length > 0) {
              scored_search_results.sort(function compare(a, b) {
                if (a.score < b.score) {
                  return -1;
                } else if (a.score > b.score) {
                  return 1;
                }
                return 0;
              })
              
              best_search = scored_search_results[0]
            }

            if (scored_search_results.length > 1) {
              best_searches = scored_search_results.slice(1, 3);
              best_searches = best_searches.filter(s => s.score < best_search.score * 5)
            }

            translation_result.crafting.push({
              goals: craft.goals,
              valid: true,
              best_search: best_search,
              best_searches: best_searches
            })
          } else {
             translation_result.crafting.push({
              goals: craft.goals,
              valid: false,
              best_search: null,
              best_searches: []
            })
          }

          if (best_search != null) {
            translation_result.score += best_search.score
          } else {
            translation_result.score += 100.0
          }
        })

        self.results.push(translation_result)
      })

      self.results.sort(function compare(a, b) {
        if (a.score < b.score) {
          return -1;
        } else if (a.score > b.score) {
          return 1;
        }
        return 0;
      })

      self.loading = false;
    }
  },
  mounted () {
    var self = this;
    self.$store.commit('setItems', Object.keys(en_gb));
    
    // load data from cache
    var loadedCrafting = self.$store.getters.getCrafting;
    if (loadedCrafting != null && loadedCrafting.length > 0) {
      self.crafting = loadedCrafting;
    }
    var loadedOptions = self.$store.getters.getOptions;
    if (loadedOptions != null) {
      self.options = loadedOptions;
    }
    
    // load share data
    if(self.$route.query.data) {
      var encoded = self.$route.query.data;
      
      var items = this.$store.getters.getItems;
      var json = ShareDeserialize(encoded, items)

      if (json) {
        if (json.crafting) {
          self.crafting = json.crafting
        }
        if (json.options) {
          self.options = json.options
        }
        self.getResults();
      }
      self.$router.replace({'query': null});
    } else {
      self.setResultsOutdated();
    }

    // finish loading
    self.$store.commit('setLoading', false)

    // get new results
    setInterval(function() {
      if (self.resultsOutdated) {
        self.$store.commit('setCrafting', self.crafting)
        self.$store.commit('setOptions', self.options)
        self.resultsOutdated = false;
        self.getResults();
      }
    }, 500)
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
</style>
