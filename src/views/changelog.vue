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
  }),
  computed: {
    items () {
      return this.$store.getters.getChangelog;
    }
  },
  watch: {
  },
  methods: {
  },
  mounted () {
    this.$store.commit('setReadChangelog', this.items[0].id)
  }
}
</script>
<style lang="scss" scoped>
</style>
