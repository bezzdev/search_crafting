<template>
  <v-navigation-drawer v-model="menu" app>
    <v-list dense>
      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item link to="about">
        <v-list-item-icon>
          <v-icon>mdi-information-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>About</v-list-item-title>
      </v-list-item>
      <v-list-item link to="changelog">
        <v-list-item-icon>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Change Log</v-list-item-title>
        <v-icon v-if="isNewChangelog" color="red lighten-1">
          mdi-alert-circle
        </v-icon>
      </v-list-item>
      <v-list-item link @click="reset">
        <v-list-item-icon>
          <v-icon>mdi-refresh</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Reset</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-dialog v-model="resetDialog" width="600">
      <v-card>
        <v-card-title>
          Reset all Data
        </v-card-title>
        <v-card-text>
          This will reset all user data that you have created.<br>
          Are you sure?
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="confirmReset" tile color="red">
            Reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'Sidebar',
  props: [],
  components: {
  },
  data: () => ({
    resetDialog: false
  }),
  computed: {
    menu: {
      get: function() {
        return this.$store.getters.getMenu;
      },
      set: function(val) {
        this.$store.commit('setMenu', val);
      }
    },
    isNewChangelog () {
      return this.$store.getters.getIsNewChangelog;
    }
  },
  watch: {
  },
  methods: {
    reset: function () {
      this.resetDialog = true;
    },
    confirmReset: function () {
      this.$store.commit('setCrafting', [])
      this.$store.commit('setOptions', null)
      
      this.resetDialog = false;
      window.location.reload();
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
