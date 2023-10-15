<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <item v-for="goal in craft.goals" :key="goal + '_header'" :item="goal" />
      <template v-slot:actions>
        <v-btn v-if="edit" @click.native.stop @click="deleteCraft" icon>
          <v-icon color="primary" class="no-rotate">
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn v-if="edit" @click.native.stop @click="duplicateCraft" icon>
          <v-icon color="blue" class="no-rotate">
            mdi-content-copy
          </v-icon>
        </v-btn>
        <v-simple-checkbox v-if="!edit" v-model="craft.enabled" :ripple="false" color="primary" class="no-rotate" />
        <v-icon>
          $expand
        </v-icon>
      </template>
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
      <v-subheader>Settings</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <item :item="craftingIcon" />
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
    <v-expansion-panel-content v-else>
      <v-subheader>Crafting Goals</v-subheader>
      <v-list-item v-for="goal in craft.goals" :key="goal">
        <v-list-item-content>
          {{ goal }}
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeGoal(goal)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-for="temp_goal, tg in temp_goals" :key="tg">
        <v-list-item-content>
          <v-autocomplete v-model="temp_goal.key" :items="goal_autocomplete"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeTempGoal(temp_goal)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-btn @click="addGoal" icon color="green">
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
            <v-spacer/>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-subheader>Inventory</v-subheader>
      <v-list-item v-for="inventory in craft.inventory" :key="inventory">
        <v-list-item-content>
          {{ inventory }}
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeInventory(inventory)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-for="temp_inventor, ti in temp_inventory" :key="ti">
        <v-list-item-content>
          <v-autocomplete v-model="temp_inventor.key" :items="goal_autocomplete"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="removeTempInventory(temp_inventor)" icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-btn @click="addInventory" icon color="green">
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
            <v-spacer/>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>Settings</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-col cols="auto">
              <v-btn @click="toggleCrafting" tile>
                <item :item="craftingIcon" />
              </v-btn>
            </v-col>
            <v-spacer/>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import item from "./item.vue"
export default {
  name: 'Craft',
  props: ["craft", "edit"],
  components: {
    item
  },
  data: () => ({
    add_goal: '',
    add_inventory: '',
    temp_goals: [],
    temp_inventory: []
  }),
  computed: {
    goal_autocomplete () {
      return this.autocomplete.filter(i => !this.craft.goals.includes(i))
    },
    inventory_autocomplete () {
      return this.autocomplete.filter(i => !this.craft.inventory.includes(i))
    },
    autocomplete () {
      return this.$store.getters.getItems;
    },
    enabled () {
      return this.craft.enabled;
    },
    craftingIcon () {
      if (this.craft.size < 3) {
        return "block.minecraft.no_crafting_table";
      }
      return "block.minecraft.crafting_table";
    }
  },
  watch: {
    enabled: function () {
      this.$emit('enabled');
    }
  },
  methods: {
    addGoal: function () {
      this.temp_goals.push({ key: "" });
      this.$emit('itemsChanged')
      //this.craft.goals.push(this.add_goal)
      //this.add_goal = '';
    },
    removeGoal: function (goal) {
      this.craft.goals.splice(this.craft.goals.indexOf(goal), 1);
      this.$emit('itemsChanged')
    },
    removeTempGoal: function (goal) {
      this.temp_goals.splice(this.temp_goals.indexOf(goal), 1);
    },
    addInventory: function () {
      this.temp_inventory.push({ key: "" })
      this.$emit('itemsChanged')
      // this.craft.inventory.push(this.add_inventory)
      // this.add_inventory = ''
    },
    removeInventory: function (inventory) {
      this.craft.inventory.splice(this.craft.inventory.indexOf(inventory), 1);
      this.$emit('itemsChanged')
    },
    removeTempInventory: function (inventory) {
      this.temp_inventory.splice(this.temp_inventory.indexOf(inventory), 1);
    },
    deleteCraft: function () {
      this.$emit('delete', this.craft)
    },
    duplicateCraft: function () {
      this.$emit('duplicate', this.craft)
    },
    toggleCrafting: function () {
      if(this.craft.size == 3) {
        this.craft.size = 2;
      } else {
        this.craft.size = 3;
      }
      this.$emit('itemsChanged')
    },
    applyChanges: function () {
      var self = this;
      self.temp_goals.forEach(function(goal) {
        if (!self.craft.goals.includes(goal.key))
          self.craft.goals.push(goal.key);
      })
      self.temp_goals = []

      self.temp_inventory.forEach(function(inventory) {
        if (!self.craft.inventory.includes(inventory.key))
          self.craft.inventory.push(inventory.key);
      })
      self.temp_inventory = []
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.no-rotate i {
  transform: none !important
}
i.no-rotate {
  transform: none !important
}
</style>
