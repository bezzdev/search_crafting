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
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-refresh</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Reset</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'Sidebar',
  props: [],
  components: {
  },
  data: () => ({
  }),
  computed: {
    menu: {
      get: function() {
        return this.$store.getters.getMenu;
      },
      set: function(val) {
        this.$store.commit('setMenu', val);
      }
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
