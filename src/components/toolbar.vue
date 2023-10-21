<template>
  <v-app-bar app>
    <v-btn icon class="px-2 mr-2" @click="toggleMenu">
      <v-icon>
        mdi-menu
      </v-icon>
    </v-btn>
    Minecraft Search Crafting
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-icon class="mx-2" v-on="on">
          mdi-information
        </v-icon>
      </template>
      <span>Use this site to find the most optimal search terms for your desired items.</span>
    </v-tooltip>
    <v-spacer/>

    <a class="bezz" href="https://twitter.com/bezzdev" target="_blank" >
      <span class="pr-2">@bezzdev</span>
      <v-avatar
        tile
        size="32">
        <v-img src="bezz.jpg" aspect-ratio="1"/>
      </v-avatar>
    </a>
    <v-divider class="mx-2" vertical/>
    <a class="" href="https://github.com/bezzdev/search_crafting" target="_blank" >
      <v-icon large>
        mdi-github
      </v-icon>
    </a>
    <v-divider class="ml-2 mr-3" vertical/>
    <v-avatar
      tile class="">
      <v-img src="scotland.svg" contain height="40" max-width="64px"/>
    </v-avatar>
    <!-- <a href="https://twitter.com/bezzdev">@bezzdev</a> -->
  </v-app-bar>
</template>
<script>
export default {
  name: 'Toolbar',
  props: [],
  components: {
  },
  data: () => ({
  }),
  computed: {
    menu () {
      return this.$store.getters.getMenu
    }
  },
  watch: {
  },
  methods: {
    toggleMenu: function() {
      this.$store.commit('setMenu', !this.menu)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.bezz {
  text-decoration: none !important;
}
</style>
