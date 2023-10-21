<template>
  <v-container fluid>
    <v-row align="center" style="height: 600px;">
      <v-spacer/>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>
            About
          </v-card-title>
          <v-card-text>
            <h3>
            Inception
            </h3>
            <p>
            The creation of this site was spawned from a discussion with <a href="https://twitch.tv/silverrruns">Silverrruns</a> on improving search crafting.
            <br>The languages currently in use were good, but could there be a better one?
            </p>

            <h3>
            What was Known
            </h3>
            <p>
            Bosnian, Ukrainian, Korean, Vietnamese were known good languages for search crafting.
            Some of these were found by searching for certain requirements e.g. a 1 character search to find wool, glowstone, beds and anchors together.
            <br>What decides if a language is "good" or "better" could be subjective to the player based on the requirements they have.
            <br>Scripts have been used in the past to find specific language searches but they weren't easy to use, flexible, or accessible to everyone.
            </p>

            <h3>
            Development
            </h3>
            <p>
            I wanted to make a tool that would allow for full control of the search criteria.
            For the best results this would have to take into account the player's inventory at the time of searching, as it has a major affect on shown recipes.
            <br>The main factors that control search results are: can the player craft the item, is the recipe unlocked, and finally does the item match the search query.
            Search query matching consists of Recipe Groups and Item Tooltips.
            </p>

            <h3>
            Tooltips
            </h3>
            <p>
            It was known that tooltip information was included in the search alongside the translated name.
            Weirdly enough, searching for the numbers found in an item's tooltip would have inconsistent results.
            In order for this tool to have the most accurate results I needed to have the most accurate data.
            <br>The first step was to extract all data the search function uses via a custom mod.
            Once this data was extracted, it was clear as to why searching these numerical values resulted in strange results.
            <br>Each part of a item tooltip represents some data. This data is translated and formatted when the player mouses over an item.
            During the in-game search, the tooltip data gets combined and avoids the formatting process.
            This results in the tool attackspeed values remaining in their true form such as -1, -2, -3.

            </p>
            <h3>
            Recipe Groups 
            </h3>
            <p>
            Recipe groups are collections of recipes. If your search query matches any item in a group, all craftable items in the group will show in the results.
            An example of this would be beds, boats or wooden doors. This is why searching "acacia" will show any boat you can craft.
            </p>

            <!-- <h3>
            Findings
            </h3>
            <p>
            Ukrainian, Bosnian, Vietnamese
            </p> -->
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'About',
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
