<template>
  <v-app-bar app>
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

    <a href="https://twitter.com/bezzdev">
      <span class="pr-2">@bezzdev</span>
      <v-avatar
        tile
        size="32"
        color="grey">
        <v-img src="bezz.jpg" aspect-ratio="1"/>
      </v-avatar>
    </a>

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
