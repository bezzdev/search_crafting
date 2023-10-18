<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <item v-for="goal in craft.goals" :key="goal + '_header'" :item="goal" />
      <template v-slot:actions>
        <div>
          <v-tooltip bottom v-if="edit">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click.native.stop @click="moveUp" icon>
                <v-icon color="white" class="no-rotate">
                  mdi-arrow-up
                </v-icon>
              </v-btn>
            </template>
            <span>Move Up</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip bottom v-if="edit">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click.native.stop @click="moveDown" icon>
                <v-icon color="white" class="no-rotate">
                  mdi-arrow-down
                </v-icon>
              </v-btn>
            </template>
            <span>Move Down</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip bottom v-if="edit">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click.native.stop @click="deleteCraft" icon>
                <v-icon color="primary" class="no-rotate">
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete Group</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip bottom v-if="edit">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click.native.stop @click="duplicateCraft" icon>
                <v-icon color="blue" class="no-rotate">
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </template>
            <span>Duplicate Group</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip bottom v-if="!edit">
            <template v-slot:activator="{ on }">
              <v-simple-checkbox v-on="on" v-model="craft.enabled" :ripple="false" color="primary" class="no-rotate" />
            </template>
            <span>{{ craft.enabled ? 'Temporarily remove from the search' : 'Enable in the search' }}</span>
          </v-tooltip>
        </div>
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
          <v-row align="center">
            <v-col cols="auto">
              <item v-if="craft.size == 3" item="block.minecraft.crafting_table" />
              <item v-else item="block.minecraft.no_crafting_table" />
            </v-col>
            <v-col>
              <div class="ml-2">Language Score Weight: {{craft.weight.toFixed(2)}}</div>
            </v-col>
          </v-row>
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeGoal(goal)" icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-for="temp_goal, tg in temp_goals" :key="tg">
        <v-list-item-content>
          <v-autocomplete v-model="temp_goal.key" :items="goal_autocomplete"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeTempGoal(temp_goal)" icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="addGoal" icon color="green">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Add Crafting Goal</span>
              </v-tooltip>
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeInventory(inventory)" icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-for="temp_inventor, ti in temp_inventory" :key="ti">
        <v-list-item-content>
          <v-autocomplete v-model="temp_inventor.key" :items="inventory_autocomplete"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeTempInventory(temp_inventor)" icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="addInventory" icon color="green">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Add Inventory Item</span>
              </v-tooltip>
            </v-col>
            <v-spacer/>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>Settings</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <v-row align="center">
            <v-col cols="auto">
              <v-tooltip bottom v-if="craft.size == 3">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="toggleCrafting" tile icon>
                    <item item="block.minecraft.crafting_table"  />
                  </v-btn>
                </template>
                <span>Changed to 2x2 only</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="toggleCrafting" tile icon>
                    <item item="block.minecraft.no_crafting_table"  />
                  </v-btn>
                </template>
                <span>Changed to 3x3 available</span>
              </v-tooltip>
            </v-col>
            <v-col cols="4">
              <div class="ml-2 pt-2">Language Score Weight: {{craft.weight.toFixed(2)}}</div>
              <v-slider v-model="craft.weight" @change="weightChanged" min="0" max="2" step="0.01" dense hide-details height="32" />
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
    moveUp: function () {
      this.$emit('moveUp', this.craft)
    },
    moveDown: function () {
      this.$emit('moveDown', this.craft)
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
    weightChanged: function () {
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
