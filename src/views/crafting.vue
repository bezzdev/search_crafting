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
          <permitted v-if="options" ref="permitted" :permitted="options.permitted_items" :edit="edit" 
            @itemsChanged="itemsChanged"
          />
        </v-expansion-panels>
        <v-expansion-panels>
          <craft ref="craft" v-for="craft, c in crafting" :key="c" :craft="craft" :edit="edit" 
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
                <v-switch v-model="options.score_search_lengths" class="ml-2" label="label" @change="setResultsOutdated">
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
              </v-col>
              <v-col cols="4">
                <v-subheader class="pl-0">
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
                <v-slider v-model="options.max_characters" step="1" min="1" max="8" ticks="always" @change="setResultsOutdated">
                  <template v-slot:prepend>
                    <span>1</span>
                  </template>
                  <template v-slot:append>
                    <span>8</span>
                  </template> 
                </v-slider>
              </v-col>
              <v-col cols="4">
                <v-switch v-model="options.optimize_unique_characters" class="ml-2" label="label" @change="setResultsOutdated">
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
              </v-col>
            </v-row>
            <v-row class="px-2 pt-2">
              <v-col cols="3">
                <v-text-field v-model="options.letter_penalty" label="Search Length Penalty" @change="setResultsOutdated" type="number" dense>
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
              <v-col cols="3">
                <v-text-field v-model="options.junk_penalty" label="Junk Item Penalty" @change="setResultsOutdated" type="number" dense>
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
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="options.has_junk_penalty" label="Has Junk Penalty" @change="setResultsOutdated" type="number" dense>
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
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="options.fail_penalty" label="Search Fail Penalty" @change="setResultsOutdated" type="number" dense>
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
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-switch v-model="options.allow_permitted_items" class="ml-2" label="label" @change="setResultsOutdated">
                  <template v-slot:label>
                    Allow Permitted Items
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <div class="text-center">
                        Permitted items will not negatively affect the efficiency score
                      </div>
                    </v-tooltip>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="4">
                <v-switch v-model="options.permit_goal_items" class="ml-2" label="label" @change="setResultsOutdated">
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
              </v-col>
              <v-col cols="4">
                <v-text-field class="pl-4 pr-2" v-model="options.permitted_items_benefit" label="Permitted Item Benefit" @change="setResultsOutdated" type="number">
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
            </v-row>
            <v-row class="px-2 mt-0">
              <v-col cols="12">
                <v-subheader class="pl-0" style="height: 32px">Permitted Items</v-subheader>
                <item v-for="item in permittedItems" :key="item + '_excluded'" :item="item" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-switch v-model="options.overlap_crafting" class="ml-2" label="label" @change="setResultsOutdated">
                  <template v-slot:label>
                    Craft Overlap
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="ml-2">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>Allow crafting goals to be split into multiple searches sharing the first search character, currently supports up to 2 goals and 2 length searches</span>
                    </v-tooltip>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="4">
                <v-text-field class="pl-4 pr-2"  v-model="options.overlap_penalty" label="Overlap Penalty" @change="setResultsOutdated" type="number">
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
          <languageResult v-for="result in filteredResults" :key="result.language_key" :result="result" />
        </v-expansion-panels>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>
<script>
import craft from "../components/craft.vue"
import permitted from "../components/permitted.vue"

import languageResult from '../components/languageResult.vue'
import item from "../components/item.vue"

import { RecipeGroups } from '../js/recipeGroups.js';
import { Languages } from '../js/languages.js';
import { LanguageTooltips } from '../js/languageTooltips.js';
import { en_gb } from '../js/names/en_gb.js';
import { ShareSerialize, ShareDeserialize } from '../js/shareSerializer'
import { CraftingLoader } from '../js/craftingLoader'
import { OptionsLoader } from '../js/optionsLoader'
import { DefaultSetup } from '../js/defaultSetup'

export default {
  name: 'Crafting',
  props: [],
  components: {
    craft,
    permitted,
    languageResult,
    item
  },
  data: () => ({
    crafting: [],
    options: null,
    option_values: null,
    badCharacters: ["□"],
    results: [],
    edit: false,
    settingsOpen: false,
    resultsOutdated: false,
    craftingChanged: false,
    loading: false,
  }),
  computed: {
    loaded () {
      return this.$store.getters.getLoaded
    },
    filteredResults () {
      return this.results.filter(r => this.filterLanguage(r))
    },
    permittedItems () {
      if (this.crafting != null && this.options != null && this.options.permitted_items != null) {
        if (!this.options.permit_goal_items) {
          return this.options.permitted_items;
        } else {
          return this.crafting.filter(craft => craft.enabled).flatMap(craft => craft.goals).concat(this.options.permitted_items).filter(function(value, index, array) {
            return array.indexOf(value) === index;
          })
        }
      }
      return [];
    }
  },
  watch: {
  },
  methods: {
    setEditMode: function (val) {
      this.edit = val;
      if (this.edit == false && this.craftingChanged) {

        this.$refs["permitted"].applyChanges();
        for(var c = 0; c < this.crafting.length; c++)
          this.$refs["craft"][c].applyChanges();

        this.setResultsOutdated();
      }
    },
    toggleSettings: function () {
      this.settingsOpen = !this.settingsOpen;
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
        weight: 1.0,
        goals: [
        ],
        inventory: [
        ]        
      })
    },
    moveUp: function (craft) {
      var index = this.crafting.indexOf(craft)
      if (index > 0) {
        this.crafting.splice(index, 1);
        this.crafting.splice(index - 1, 0, craft);
      }
    },
    moveDown: function (craft) {
      var index = this.crafting.indexOf(craft)
      if (index < this.crafting.length - 1) {
        this.crafting.splice(index, 1);
        this.crafting.splice(index + 1, 0, craft);
      }
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
      
      var index = this.crafting.indexOf(craft)
      this.crafting.splice(index + 1, 0, dupe);

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
    manuallySearch: function () {
      this.resultsOutdated = false;
      this.getResults();
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
    getLongerSearches: function (goals, groups, translations, searches) { // translations, searches) {
      let self = this;

      var new_searches = []
      goals.forEach(function(item) {
        groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
          group.forEach(function(recipe) {
            var translation = translations[recipe.output].toLowerCase();

            searches.forEach(function(search) {
              for(var i = 0; i < translation.length; i++) {
                if (translation.substring(i, i + search.length) == search) {
                  var new_char = translation[i + search.length];
                  if(!self.badCharacters.includes(new_char)) {
                    var new_search = search + new_char;
                    if (!new_searches.includes(new_search)) {
                      new_searches.push(new_search)
                    }
                  }
                }
              }
            })
          })
        })
      })

      var valid_searches = self.validateSearches(goals, groups, translations, new_searches)
      return valid_searches;
    },
    validateSearches: function (goals, groups, translations, searches) {
      var valid_searches = []
      searches.forEach(function(search) {
        if(goals.every(function(goal) {
          var found = groups.find(function(group) { 
            return group.some(function(recipe) {
              return recipe.output == goal
            }) && group.some(function(recipe) { 
              return translations[recipe.output].includes(search)
            })
          })
          return found != null;
        })) {
          valid_searches.push(search); 
        }
      })
      return valid_searches;
    },
    getSearchesForItems: function (goals, groups, translations) {
      var self = this;
      
      // var item_translations = []
      var searches = []

      goals.forEach(function(item) {
        groups.filter(group => group.some(recipe => recipe.output == item)).forEach(function(group) {
          group.forEach(function(recipe) {
            var translation = translations[recipe.output].toLowerCase();
            // item_translations.push(translation);

            for(var c = 0; c < translation.length; c++) {
              var ch = translation[c]
              if (!searches.includes(ch) && !self.badCharacters.includes(ch)) {
                // get all matching characters for these keys
                searches.push(ch);
              }
            }
          })
        })
      })

      var valid_searches = self.validateSearches(goals, groups, translations, searches)

      if (this.option_values.max_characters >= 2) {
        var two_length_searches = self.getLongerSearches(goals, groups, translations, valid_searches);

        valid_searches = valid_searches.concat(two_length_searches);
      }

      return valid_searches
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
    scoreSearch: function(search, junk, boost) {
      var remainder = junk;
      var letters = search;
      
      if (!this.options.score_search_lengths)
        letters = 1;

      var letter_penalty = this.option_values.letter_penalty * Math.pow(letters - 1, 3);

      var junk_penalty = remainder * this.option_values.junk_penalty;
      if (remainder > 0) {
        junk_penalty += this.option_values.has_junk_penalty
      }
      return letter_penalty + junk_penalty + boost
    },
    getUniqueCharacters: function (items) {
      // get all characters
      var characters = []
      items.forEach(function (item) {
        characters = characters.concat(item.split(''))
      })

      // get unique characters
      var unique_characters = characters.filter(function(value, index, array) {
        return array.indexOf(value) === index;
      })
      return unique_characters;
    },
    getBestCharacterPermutation: function (fixed_characters, choices, search_variations) {
      let self = this;

      var current = search_variations[0];

      var best_cost = -1;
      var best_choices = null;
      current.forEach(function (option) {
        var additional_characters = option.split('').filter(c => !fixed_characters.includes(c));
        var new_characters = fixed_characters.concat(additional_characters)
        
        var new_choices = [].concat(choices)
        new_choices.push(option)

        if (search_variations.length > 1) {
          var next_options = [].concat(search_variations)
          next_options.splice(0, 1);
          
          var result = self.getBestCharacterPermutation(new_characters, new_choices, next_options)
          var cost = result.cost;

          if (best_choices == null || cost < best_cost) {
            best_cost = cost;
            best_choices = result.choices;
          }
        } else {
          var bottom_cost = new_characters.length;

          if (best_choices == null || bottom_cost < best_cost) {
            best_cost = bottom_cost;
            best_choices = new_choices;
          }
        }
      })

      return { choices: best_choices, cost: best_cost };
    },
    minimizeLanguageCharacters: function (translation_result) {
      var self = this;
      var interchangeable = []
      
      // find interchangeable results
      translation_result.crafting.forEach(function(craft) {
        if (craft.best_search != null && craft.best_searches.length > 0) {
          if (craft.best_search.score == craft.best_searches[0].score) {
            interchangeable.push(craft)
          }
        }
      });
      
      // get all characters
      var searches = translation_result.crafting.filter(craft => !interchangeable.includes(craft) && craft.best_search != null).map(c => c.best_search.search_term)
      var unique_characters = this.getUniqueCharacters(searches) 
      
      var not_solved = []

      translation_result.crafting.forEach(function(craft) {
        if (craft.best_search != null && craft.best_searches.length > 0) {
          if (craft.best_search.score == craft.best_searches[0].score) {
            // current solution is already good
            if(craft.best_search.search_term.split('').every(c => unique_characters.includes(c))) {
              return;
            } else {
              // otherwise

              // find a valid replacement
              var valid_replacement = craft.best_searches.find(s => s.score == craft.best_search.score && s.search_term.split('').every(c => unique_characters.includes(c)))
              if (valid_replacement != null) {
                // override the best_search
                craft.best_searches.splice(0, 0, craft.best_search);
                craft.best_search = valid_replacement;
                craft.best_searches.splice(craft.best_searches.indexOf(valid_replacement), 1);
                return;
              }
            }
            // try to find a best permutation later
            not_solved.push(craft)
          }
        }
      })

      interchangeable = not_solved

      if (interchangeable.length > 0) {
        var permutations = 1
        interchangeable.forEach(function (inter) {
          var options = inter.best_searches.filter(s => s.score == inter.best_searches[0].score).length + 1;
          permutations = permutations * options;
        })
        
        if (permutations < 25000) {
          interchangeable.forEach(function (inter) {
            inter.best_searches.splice(0, 0, inter.best_search)
            inter.best_search = null;
          })

          // calculate unique characters
          searches = translation_result.crafting.filter(craft => craft.best_search != null).map(c => c.best_search.search_term)
          unique_characters = self.getUniqueCharacters(searches) 

          // work out best permutation of the interchangeable search options
          var search_options = interchangeable.map(function(interchange) {
            var score_to_match = interchange.best_searches[0].score;
            return interchange.best_searches.filter(function(search) {
              return search.score == score_to_match
            }).map(function(s) {
              return s.search_term;
            })
          })
          var best_permutation = self.getBestCharacterPermutation(unique_characters, [], search_options);

          for(var i = 0; i < interchangeable.length; i++) {
            var interchange = interchangeable[i] 
            var found_best = interchange.best_searches.find(s => s.search_term == best_permutation.choices[i])
            interchange.best_search = found_best;
            interchange.best_searches = interchange.best_searches.filter(s => s.search_term != best_permutation.choices[i])
          }
        }
      }

      unique_characters = self.getUniqueCharacters(translation_result.crafting.filter(craft => craft.best_search != null).map(c => c.best_search.search_term))
      translation_result.unique_characters = unique_characters;
      translation_result.unique_character_count = unique_characters.length;
    },
    scoreSearches: function (goals, craft, groups, translations, searches) {
      var self = this;
      var scored_search_results = []
      searches.forEach(function(search) {
        var results = self.searchGroups(groups, translations, search);

        var junk = results.filter(g => !g.some(r => goals.includes(r.output)) )
        var boost = 0
        if(self.options.allow_permitted_items) {
          var without_additional = junk.filter(g => !g.some(r => self.permittedItems.includes(r.output)))
          var additional = junk.length - without_additional.length;
          boost = -self.option_values.permitted_items_benefit * additional;
          junk = without_additional;
        }

        var score = self.scoreSearch(search.length, junk.length, boost);

        scored_search_results.push({
          search_term: search,
          results: self.getRecipesForGroups(results, craft.inventory),
          overlap: false,
          score: score
        })
      })
      return scored_search_results;
    },
    getResults: function () {
      var self = this;
      self.loading = true;
      self.results = []

      self.option_values = {
        letter_penalty: parseFloat(self.options.letter_penalty),
        junk_penalty: parseFloat(self.options.junk_penalty),
        has_junk_penalty: parseFloat(self.options.has_junk_penalty),
        fail_penalty: parseFloat(self.options.fail_penalty),
        permitted_items_benefit:  parseFloat(self.options.permitted_items_benefit),
        max_characters: parseInt(self.options.max_characters),
        overlap_penalty: parseFloat(self.options.overlap_penalty)
      }

      var keys = Languages.map(l => l.key)

      var test_languages = keys.map(k => Languages.find(l => l.key == k))

      var valid_crafts = self.crafting.filter(c => c.goals.length > 0 && c.inventory.length > 0);
      valid_crafts.forEach(function (craft) {
        var groups = self.getRelevantGroupsForInventory(RecipeGroups, parseInt(craft.size), craft.inventory)
        
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
        var translations = LanguageTooltips[language.key];

        var translation_result = {
          language_name: language.name,
          language_region: language.region,
          warning: language.warning,
          localized: language.localized,
          language_key: language.key,
          translations: translations,
          crafting: [],
          unique_character_count: 0,
          unique_characters: [],
          score: 0
        }

        enabled_crafts.forEach(function(craft) {
          if (craft.valid) {
            var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.size, craft.inventory)
            var searches = self.getSearchesForItems(craft.goals, groups, translations);
            var last_searches = searches;

            var scored_search_results = []
            var latest_results = self.scoreSearches(craft.goals, craft, groups, translations, searches);

            scored_search_results = scored_search_results.concat(latest_results);

            var acceptable = craft.goals.length;
            if (self.option_values.max_characters >= 2) {
              for(var i = 3; i <= self.option_values.max_characters; i++) {
                var found = latest_results.filter(r => r.results.length == acceptable) > 5;
                if (!found) {
                  var next_searches = self.getLongerSearches(craft.goals, groups, translations, last_searches);
                  next_searches = next_searches.filter(s => !searches.includes(s));
                  
                  latest_results = self.scoreSearches(craft.goals, craft, groups, translations, next_searches);
                  scored_search_results = scored_search_results.concat(latest_results);
                  last_searches = next_searches;
                } else {
                  break;
                }
              }
            }

            if (self.options.overlap_crafting) {
              if (craft.goals.length == 2) { // only try overlapping for searches of 2 goals
                if (!(latest_results.find(r => r.results.length == acceptable) != null)) { // only try if we dont have a better search
                  var goal_a = [craft.goals[0]];
                  var goal_b = [craft.goals[1]];

                  var searches_a = self.getSearchesForItems(goal_a, groups, translations).filter(s => s.length == 2);
                  var searches_b = self.getSearchesForItems(goal_b, groups, translations).filter(s => s.length == 2);

                  for(var sa = 0; sa < searches_a.length; sa++) {
                    var search_a = searches_a[sa];
                    for (var sb = 0; sb < searches_b.length; sb++) {
                      var search_b = searches_b[sb];
                      if (search_a[0] == search_b[0]) {
                        // we have an overlap
                        var score_a = self.scoreSearches(goal_a, craft, groups, translations, [search_a])[0];
                        var score_b = self.scoreSearches(goal_b, craft, groups, translations, [search_b])[0];

                        var results_a = self.searchGroups(groups, translations, search_a);
                        var results_b = self.searchGroups(groups, translations, search_b);

                        var combinedScore = score_a.score + score_b.score + self.option_values.overlap_penalty;

                        let combined_score = {
                          search_term: search_a + "<" + search_b[1],
                          results: self.getRecipesForGroups(results_a, craft.inventory).concat(self.getRecipesForGroups(results_b, craft.inventory)),
                          overlap: true,
                          score: combinedScore
                        }

                        scored_search_results.push(combined_score);
                      }
                    }
                  }
                }
              }
            }

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
              scored_search_results.splice(0, 1);
              var same_scores = scored_search_results.filter(s => s.score == best_search.score).length

              var take = Math.max(same_scores, 5);
              best_searches = scored_search_results.slice(0, take);
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
            translation_result.score += best_search.score * craft.weight
          } else {
            translation_result.score += self.option_values.fail_penalty * craft.weight
          }
        })

        // calculate unique characters
        var unique_characters = self.getUniqueCharacters(translation_result.crafting.filter(craft => craft.best_search != null).map(c => c.best_search.search_term))
        translation_result.unique_characters = unique_characters;
        translation_result.unique_character_count = unique_characters.length;

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

      if (self.options.optimize_unique_characters) {
        self.results.forEach(function(result) {
          self.minimizeLanguageCharacters(result)
        })
      }

      self.loading = false;
    }
  },
  mounted () {
    var self = this;
    self.$store.commit('setItems', Object.keys(en_gb));
    
    // default setup
    var defaults = DefaultSetup();
    self.crafting = defaults.crafting;
    self.options = defaults.options;

    // load data from cache
    var loadedCrafting = self.$store.getters.getCrafting;
    if (loadedCrafting != null && loadedCrafting.length > 0) {
      self.crafting = CraftingLoader(loadedCrafting);
    }
    var loadedOptions = self.$store.getters.getOptions;
    if (loadedOptions != null) {
      self.options = OptionsLoader(loadedOptions, defaults.options);
    }
    
    // load share data
    if(self.$route.query.data) {
      var encoded = self.$route.query.data;
      
      var items = this.$store.getters.getItems;
      var json = ShareDeserialize(encoded, items)

      if (json) {
        if (json.crafting) {
          self.crafting = CraftingLoader(json.crafting);
        }
        if (json.options) {
          self.options =  OptionsLoader(json.options, defaults.options);
        }
        self.getResults();
      }
      self.$router.replace({'query': null});
    } else {
      self.setResultsOutdated();
    }

    // finish loading
    self.$store.commit('setLoaded', true)

    // get new results
    setInterval(function() {
      if (self.resultsOutdated) {
        self.$store.commit('setCrafting', self.crafting)
        self.$store.commit('setOptions', self.options)

        if (self.options.auto_search) {
          self.resultsOutdated = false;
          self.getResults();
        }
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
