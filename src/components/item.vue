<template>
  <v-tooltip bottom color="deep-purple darken-4">
    <template v-slot:activator="{ on }">
      <v-img v-on="on" class="d-inline-flex" aspect-ratio="1" max-height="32" max-width="32" contain :src="image" lazy-src="icons/command_block.png"></v-img>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'Blank',
  props: ['item', 'language'],
  components: {
  },
  data: () => ({
  }),
  computed: {
    image () {
      return this.getImage(this.getItemName(this.item))
    },
    tooltip () {
      if (this.language) {
        return this.language[this.item];
      }
      return this.item;
    }
  },
  watch: {
  },
  methods: {
    getItemName: function(item) {
      return item.split('.')[2];
    },
    getImage: function (name) {
      return "/icons/" + name + ".png";
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
