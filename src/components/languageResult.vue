<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      ( {{ result.score.toFixed(2) }} ) {{ result.localized }} = {{ result.language_name }} ( {{ result.language_region }} )
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-subheader>
        Best search letters {{ bestCharacters }} <br>
        Calculated efficiency score ( {{ result.score.toFixed(2) }} )
      </v-subheader>
      <v-lazy>
        <v-expansion-panels class="px-2">
          <v-expansion-panel v-for="craft, c in result.crafting" :key="c" :readonly="craft.best_searches.length == 0">
            <template v-if="craft.best_search">
              <v-expansion-panel-header>
                <v-row dense style="width: 100%;">
                  <v-col cols="auto" style="width: 100px;">
                    <div class="pt-2 d-inline-flex search-character">({{formatSearchTerm(craft.best_search.search_term)}})</div>
                    <div class="pt-2 d-inline-flex">({{ craft.best_search.score.toFixed(2) }})</div>
                  </v-col>
                  <v-col cols="10">
                    <item v-for="goal in craft.goals" :key="'g-'+c+'-'+goal" :item="goal" />
                    <div class="mx-4 d-inline-flex" v-if="!(craft.best_search.results.length - craft.goals.length == 0)">
                      <v-icon>mdi-plus</v-icon>
                    </div>
                    <item v-for="result in nonGoalItems(craft.goals, craft.best_search.results)" :key="'c-'+c+'-'+result" :item="result" />
                  </v-col>
                </v-row>
                <template v-slot:actions>
                  <v-icon v-show="craft.best_searches.length != 0">
                    $expand
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="px-3">
                <v-divider class="pb-4" />
                <v-row v-for="search, s in craft.best_searches" :key="search.search_term" dense style="width: 100%;">
                  <v-col cols="auto" style="width: 100px;">
                    <div class="pt-2 d-inline-flex search-character">({{ formatSearchTerm(search.search_term) }})</div>
                    <div class="pt-2 d-inline-flex">({{ search.score.toFixed(2) }})</div>
                  </v-col>
                  <v-col cols="10">
                    <!-- <item v-for="result in search.results" :key="'c-'+c+'s-'+s+'-'+result" :item="result" /> -->

                    <item v-for="goal in craft.goals" :key="'c-'+c+'s-'+s+'-'+goal" :item="goal" />
                    <div class="mx-4 d-inline-flex" v-if="!(search.results.length == craft.goals.length)">
                      <v-icon>mdi-plus</v-icon>
                    </div>
                    <item v-for="result in nonGoalItems(craft.goals, search.results)" :key="'c-'+c+'s-'+s+'-'+result" :item="result" />
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
                      <item v-for="goal in craft.goals" :key="'g-'+c+'-'+goal" :item="goal" />
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-lazy>
      <!-- <v-list v-for="craft, c in result.crafting" :key="c">
        <v-list-item>
          <v-list-item-content>
            <item v-for="goal in craft.goals" :key="goal" :item="goal" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-row v-for="search in craft.best_searches" :key="search.search_term" dense style="width: 100%;">
              <v-col cols="auto">
                <div class="pt-2">( {{ search.search_term }} )</div>
              </v-col>
              <v-col cols="auto">
                <div class="pt-2">({{ search.score.toFixed(2) }})</div>
              </v-col>
              <v-col cols="10">
                <item v-for="result in search.results" :key="result" :item="result" />
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list> -->
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import item from "./item.vue"
export default {
  name: 'LanguageResult',
  props: ['result'],
  components: {
    item
  },
  data: () => ({
  }),
  computed: {
    bestCharacters() {
      return "(" + this.result.crafting.filter(c => c.best_search != null).map(c => c.best_search.search_term).join(',') + ")"
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
      if (term == " ")
        return "\xa0 \xa0";
      return term;
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
}
</style>
