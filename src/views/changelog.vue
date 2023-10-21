<template>
  <v-container fluid>
    <v-row>
      <v-spacer/>
      <v-col cols="12" sm="6">
        <v-timeline dense>
          <v-timeline-item
            v-for="item in items"
            :key="item.id"
            small
            fill-dot>
            <v-subheader>{{ item.date }}</v-subheader>
            <v-card>
              <v-card-title>
              {{ item.title }}
              </v-card-title>
              <v-card-text>
                <span v-html="item.text"/>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Changelog',
  props: [],
  components: {
  },
  data: () => ({
    items: [
      {
        id: 6,
        date: "Wed, Oct 21 - 2023",
        title: "Version 6",
        text: "Features <br>" +
              "- added about page <br>" +
              "- added changelog page <br>" +
              "- added reset option <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- Fixed loading race condition <br>"
      },
      {
        id: 5,
        date: "Wed, Oct 18 - 2023",
        title: "Version 5",
        text: "Features <br>" +
              "- added 'optimize character-set' setting <br>" +
              " - this will try to minimize the total unique search characters used for a language by finding optimal same cost substitutes <br>" +
              "- added translated tooltips <br>" +
              "- more alternative searches <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- fixed Austrian language name <br>" +
              "- added missing en_us <br>" +
              "- fixed bug with wool/wood alternatives <br>" +
              "- fixed craft calculation weight not being duplicated <br>"
      },
      {
        id: 4,
        date: "Wed, Oct 16 - 2023",
        title: "Version 4",
        text: "Features <br>" +
              "- move groups up / down <br>" +
              "- can now disable auto search <br>" +
              "- better character selectability <br>" +
              "- added configurable penalty values <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- searches that include a space now display properly <br>"
      },
      {
        id: 3,
        date: "Wed, Oct 15 - 2023",
        title: "Version 3",
        text: "Features <br>" +
              "- added share button <br>" +
              "<br>" +
              "Bug fixes <br>" +
              "- can't add items to inventory that are in your crafting goal <br>" +
              "- can't change crafting size from 2x2 / 3x3 <br>"
      },
      {
        id: 2,
        date: "Wed, Oct 14 - 2023",
        title: "Version 2",
        text: "Features <br>" +
              "- integrated tooltip data <br>" +
              "- configuration caching"
      },
      {
        id: 1,
        date: "Wed, Oct 12 - 2023",
        title: "Version 0",
        text: "A basic version of the project was built and hosted live. <br>" +
              "This only searched against item names and was very limited."
      },
      {
        id: 0,
        date: "Wed, Oct 11 - 2023",
        title: "Init",
        text: "The inital idea for the project was formed"
      }
    ]
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
