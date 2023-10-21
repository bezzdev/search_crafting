<template>
  <v-app>
    <v-main>
      <toolbar/>
      <sidebar/>
      <router-view v-show="loaded"/>
      <v-row v-show="!loaded" align="center" class="text-center" style="height: 800px;">
        <v-col>
          <v-progress-circular indeterminate size="80" color="primary" />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script>
import toolbar from './components/toolbar.vue';
import sidebar from './components/sidebar.vue';
export default {
  name: 'App',
  components: {
    toolbar,
    sidebar
  },
  data: () => ({
  }),
  computed: {
    loaded () {
      return this.$store.getters.getLoaded
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