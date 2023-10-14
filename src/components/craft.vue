<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <item v-for="goal in craft.goals" :key="goal + '_header'" :item="goal" />
    </v-expansion-panel-header>
    <v-expansion-panel-content v-if="!edit">
      <v-subheader>Crafting Goals</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <item v-for="goal in craft.goals" :key="goal" :item="goal" />
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-subheader>Inventory</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <item v-for="inventory in craft.inventory" :key="inventory" :item="inventory" />
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
    <v-expansion-panel-content v-else>
      <v-subheader inset>Crafting Goals</v-subheader>
      <v-list-item v-for="goal in craft.goals" :key="goal">
        <v-list-item-content>
          {{ goal }}
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeItem(goal)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-subheader inset>Inventory</v-subheader>
      <v-list-item v-for="inventory in craft.inventory" :key="inventory">
        <v-list-item-content>
          {{ inventory }}
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeItem(inventory)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import item from "./item.vue"
export default {
  name: 'Craft',
  props: ["craft"],
  components: {
    item
  },
  data: () => ({
    edit: false
  }),
  computed: {
    title () {
      var label = "Search Bucket"

      if (this.craft.goals.length > 0) {
        label = ""
        for(var i = 0; i < this.craft.goals.length; i++) {
          var item = this.craft.goals[i];
          var parts = item.split(".");

          if (parts.length > 2)
            label += parts[2]
          else 
            label += item
          
          if (i < this.craft.goals.length - 1)
            label += " + "

          label += "\n"
        }
      }
      return label;
    }
  },
  watch: {
  },
  methods: {
    
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
