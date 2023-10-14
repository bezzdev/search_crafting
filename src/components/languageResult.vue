<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      {{ result.language_name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div v-for="craft, c in result.crafting" :key="c">
        <v-subheader>Best search letter: "{{ craft.best_search_term }}" Clashing search results: {{ craft.best_search_recipes.length - craft.goals.length }} </v-subheader>
        <v-list-item>
          <v-list-item-content>
            <item v-for="goal in craft.goals" :key="goal" :item="goal" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <item v-for="result in nonGoalItems(craft)" :key="result" :item="result" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
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
  },
  watch: {
  },
  methods: {
    nonGoalItems: function(craft) {
      return craft.best_search_recipes.filter(i => !craft.goals.includes(i));
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
