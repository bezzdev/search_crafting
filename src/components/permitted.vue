<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div>
        <div>
          <!-- Permitted Items -->
          <v-subheader class="pl-0" style="height: 32px">Permitted Items</v-subheader>
        </div>
        <div>
          <item v-for="item in permitted" :key="item + '_header'" :item="item" />
        </div>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content v-if="!edit">
      <v-subheader>Permitted Items</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <item v-for="item in permitted" :key="item + '_item'" :item="item" />
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
    <v-expansion-panel-content v-else>
      <v-subheader>Permitted Items</v-subheader>
      <v-list-item v-for="item in permitted" :key="item + '_item'">
        <v-list-item-content>
          {{ item }}
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeItem(item)" icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-for="temp_item, tp in temp_items" :key="tp">
        <v-list-item-content>
          <v-autocomplete v-model="temp_item.key" :items="goal_autocomplete"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="removeTempItem(temp_item)" icon color="red">
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
                  <v-btn v-on="on" @click="addItem" icon color="green">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Add Item</span>
              </v-tooltip>
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
  name: 'Permitted',
  props: ["permitted", "edit"],
  components: {
    item
  },
  data: () => ({
    temp_items: [],
  }),
  computed: {
    goal_autocomplete () {
      return this.autocomplete.filter(i => !this.permitted.includes(i))
    },
    autocomplete () {
      return this.$store.getters.getItems;
    },
  },
  watch: {
  },
  methods: {
    addItem: function () {
      this.temp_items.push({ key: "" });
      this.$emit('itemsChanged')
    },
    removeItem: function (item) {
      this.permitted.splice(this.permitted.indexOf(item), 1);
      this.$emit('itemsChanged')
    },
    removeTempItem: function (item) {
      this.temp_items.splice(this.temp_items.indexOf(item), 1);
    },
    applyChanges: function () {
      var self = this;
      self.temp_items.forEach(function(item) {
        if (!self.permitted.includes(item.key))
          self.permitted.push(item.key);
      })
      self.temp_items = []
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
