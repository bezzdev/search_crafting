<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      {{ title }}
      <template v-slot:actions>
        <v-tooltip v-if="result.warning" top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="no-rotate pr-2" color="yellow">
              mdi-alert
            </v-icon>
          </template>
          <span> {{ result.warning }} </span>
        </v-tooltip>
        <v-icon>
          $expand
        </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="10" v-if="result.completed">
          <div class="language-description">
            Unique characters needed: {{ result.unique_character_count }} ({{ result.unique_characters.join('').replaceAll(' ', '_').split().join(' ') }})
          </div>
          <div class="language-description">
            Searches: {{ bestCharacters }}
          </div>
          <div class="language-description mb-2">
            Calculated efficiency score: ( {{ formatScore(result.score) }} )
          </div>
        </v-col>
        <v-col cols="10" v-else>
          <div class="language-description">
            There are no results calculated for this language
          </div>
        </v-col>
        <v-col>
          <v-checkbox v-if="edit" class="ml-2 pt-4" label="Visible" :value="true" :input-value="true" dense @change="disableLanguage"/>
        </v-col>
      </v-row>
      <v-lazy>
        <v-expansion-panels class="px-2" v-if="result">
          <v-expansion-panel v-for="craft, c in result.crafts" :key="c" :readonly="craft.best_searches.length == 0">
            <template v-if="craft.best_search">
              <v-expansion-panel-header class="search-header">
                <v-row dense style="width: 100%;">
                  <v-col cols="2" style="width: 100px;">
                    <div class="pt-2 d-inline-flex search-character">{{formatSearchTerm(craft.best_search.search_term)}}</div>
                    <div class="pt-2 d-inline-flex">({{ formatScore(craft.best_search.score) }})</div>
                    <div class="overlap-icon-container">
                      <div class="overlap-icon" style="top: -26px;" v-if="craft.best_search.overlap">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" small>
                              mdi-information
                            </v-icon>
                          </template>
                          <span>This search requires overlapping (the &#60; symbol means backspace)</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="10">
                    <item v-for="goal in craft.goals" :key="'c'+c+'-g-'+goal" :item="goal" :language="result.translations" />
                    <div class="mx-4 d-inline-flex" v-if="!(craft.best_search.results.length - craft.goals.length == 0)">
                      <v-icon>mdi-plus</v-icon>
                    </div>
                    <item v-for="junk in nonGoalItems(craft.goals, craft.best_search.results)" :key="'c'+c+'-j-'+junk" :item="junk" :language="result.translations" />
                  </v-col>
                </v-row>
                <template v-slot:actions>
                  <v-icon v-show="craft.best_searches.length != 0">
                    $expand
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="px-4">
                <v-divider class="pb-4" />
                <v-row v-for="search, s in craft.best_searches" :key="search.search_term" dense style="width: 100%;">
                  <v-col cols="2" style="width: 100px;">
                    <div class="pt-2 d-inline-flex search-character">{{ formatSearchTerm(search.search_term) }}</div>
                    <div class="pt-2 d-inline-flex">({{ formatScore(search.score) }})</div>
                    <div class="overlap-icon-container">
                      <div class="overlap-icon" v-if="search.overlap">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" small>
                              mdi-information
                            </v-icon>
                          </template>
                          <span>This search requires overlapping (the &#60; symbol means backspace)</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="10">
                    <item v-for="goal in craft.goals" :key="'c'+c+'-g-'+s+'-'+goal" :item="goal" :language="result.translations" />
                    <div class="mx-4 d-inline-flex" v-if="!(search.results.length == craft.goals.length)">
                      <v-icon>mdi-plus</v-icon>
                    </div>
                    <item v-for="junk in nonGoalItems(craft.goals, search.results)" :key="'c'+c+'-j-s'+s+'-'+junk" :item="junk" :language="result.translations" />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </template>
            <template v-else>
              <v-list-item class="pl-6">
                <v-list-item-content>
                  <v-row dense style="width: 100%;">
                    <v-col cols="auto">
                      <div class="pt-2" v-if="craft.valid" >
                        Not Found
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" class="pb-1">mdi-information</v-icon>
                          </template>
                          <span>These items do not share characters</span>
                        </v-tooltip>
                      </div>
                      <div class="pt-2" v-else>Not Craftable</div>                      
                    </v-col>
                    <v-col cols="10">
                      <item v-for="goal in craft.goals" :key="'g-'+c+'-'+goal" :item="goal" :language="result.translations" />
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-lazy>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import item from "./item.vue"
export default {
  name: 'LanguageResult',
  props: ['result', 'edit'],
  components: {
    item
  },
  data: () => ({
  }),
  computed: {
    title() {
      if (this.result.completed && !this.result.disabled) {
        return `( ${this.formatScore(this.result.score)} ) ( ${this.result.unique_character_count} ) ${this.result.localized} = ${this.result.language_name} (${this.result.language_region})`;
      } else {
          return `${this.result.localized} = ${this.result.language_name} (${this.result.language_region})`;
      }
    },
    bestCharacters() {
      return this.result.crafts.filter(c => c.best_search != null).map(c => "" + c.best_search.search_term.replaceAll(' ', '_').split('').join(' ') + "").join(', ')
    }
  },
  watch: {
  },
  methods: {
    bestSearch: function(craft) {
      return craft.best_searches[0]
    },
    nonGoalItems: function(goals, results) {
      return results.filter(i => !goals.includes(i));
    },
    formatSearchTerm: function (term) {
      // if (term == " ")
      //   return "\xa0 \xa0";
      return "" + term.replaceAll(' ', '_').split('').join('') + "";
    },
    formatScore: function(score) {
      if (score.toFixed)
        return score.toFixed(2);
      return score;
    },
    disableLanguage: function () {
      this.$emit("disableLanguage", this.result.language_key)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.search-character {
  cursor: default;
  user-select: text;
  padding-left: 8px;
  padding-right: 4px;
  padding-bottom: 10px;
  letter-spacing: 0.25em;
}
.language-description {
  padding: 0 16px;
  color: #bfbfbf;
}
.search-header {
  min-height: 32px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.overlap-icon-container {
  position: relative;
}
.overlap-icon {
  position: absolute;
  left: -16px;
  top: -34px;
}
</style>
