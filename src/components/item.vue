<template>
  <v-img class="d-inline-flex" aspect-ratio="1" max-height="32" max-width="32" contain :src="image" lazy-src="icons/command_block.png"></v-img>
</template>
<script>
export default {
  name: 'Blank',
  props: ['item'],
  components: {
  },
  data: () => ({
  }),
  computed: {
    image () {
      return this.getImage(this.getItemName(this.item))
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
