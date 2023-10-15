<template>
  <v-app>
    <v-main>
      <toolbar/>
      <router-view v-show="loading"/>
      <v-row v-show="!loading" align="center" class="text-center" style="height: 800px;">
        <v-col>
          <v-progress-circular indeterminate size="80" color="primary" />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script>
import toolbar from './components/toolbar.vue';
export default {
  name: 'App',
  components: {
    toolbar
  },
  data: () => ({
  }),
  computed: {
    loading () {
      return this.$store.getters.getLoading
    }
  },
  watch: {
  }
};
</script>
<style lang="scss">
.site-loader {
  margin: 0 auto;
}
</style>