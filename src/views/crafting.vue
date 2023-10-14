<template>
  <v-container fluid>
    <v-row>
      <v-spacer/>
      <v-col cols="6">
        <v-expansion-panels>
          <craft v-for="craft, c in crafting" :key="c" :craft="craft" />
        </v-expansion-panels>
      </v-col>
      <v-col cols="6">
        <v-expansion-panels>
          <languageResult v-for="result, r in results" :key="r" :result="result" />
        </v-expansion-panels>
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
import { LanguageKeys } from '../js/languageKeys.js';

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
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ],
        goals: [
          "item.minecraft.iron_pickaxe",
          "item.minecraft.iron_axe",
          "item.minecraft.iron_shovel",
        ]
      },
      {
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ],
        goals: [
          "item.minecraft.bucket",
        ]
      },
      {
        inventory: [
          "block.minecraft.oak_planks",
          "item.minecraft.stick",
          "item.minecraft.iron_ingot",
          "item.minecraft.gold_ingot",
          "item.minecraft.flint"
        ],
        goals: [
          "item.minecraft.flint_and_steel"
        ]
      },
      {
        inventory: [
          "block.minecraft.oak_planks",
          "block.minecraft.white_wool",
          "block.minecraft.obsidian",
          "block.minecraft.crying_obsidian",
          "block.minecraft.glowstone",
          "item.minecraft.ender_pearl",
          "item.minecraft.blaze_rod"
        ],
        goals: [
          "block.minecraft.white_bed",
          "block.minecraft.respawn_anchor"
        ]
      }
    ],
    badCharacters: [" "],
    results: []
  }),
  computed: {
  },
  watch: {
  },
  methods: {
    getRelevantGroupsForInventory: function (groups, inventory) {
      var relevant = []
      groups.forEach(function(group) {
        var group_relevant = false;
        group.forEach(function(recipe) {
          var craftable = true;
          recipe.ingredients.forEach(function(ingredient) {
            if (!ingredient.some(ing => inventory.includes(ing))) {
              // does not have ingredient
              craftable = false;
            }
          })
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
      return valid_characters;
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
    }
  },
  mounted () {
    var self = this;
    self.results = []

    var keys = ['en_gb', 'bs_ba', 'ko_kr', 'uk_ua', 'vi_vn']
    // var keys = ['ko_kr']
    var test_languages = keys.map(k => Languages.find(l => l.file == k))

    test_languages.forEach(function(language) {
      var translation_result = { 
        language_name: language.name, 
        language_key: language.file,
        crafting: [],
        score: 0
      }
      var translations = LanguageKeys[language.file];

      self.crafting.forEach(function(craft) {
        var groups = self.getRelevantGroupsForInventory(RecipeGroups, craft.inventory)
        var searches = self.getSearchesForItems(craft.goals, translations);

        var best_search_term = null;
        var best_search_results = null;
        var best_search_score = Number.MAX_SAFE_INTEGER;
        searches.forEach(function(search) {
          var results = self.searchGroups(groups, translations, search);

          if (results.length < best_search_score) {
            best_search_results = results;
            best_search_score = results.length;
            best_search_term = search;
          }
        })

        if (best_search_term != null) {
          var best_search_recipes = self.getRecipesForGroups(best_search_results, craft.inventory)
          translation_result.crafting.push({
            goals: craft.goals,
            best_search_term: best_search_term,
            best_search_recipes: best_search_recipes
          })
          translation_result.score += best_search_recipes.length - craft.goals.length
        } else {
          translation_result.crafting.push({
            goals: craft.goals,
            best_search_term: null,
            best_search_recipes: []
          })
          translation_result.score += 100
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
  }
}
</script>
<style lang="scss" scoped>
</style>
