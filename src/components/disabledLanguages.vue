<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-subheader class="pl-0" style="height: 32px">{{disabledMessage}}</v-subheader>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" class="mx-2">
          <v-btn @click="disableAll" tile color="red" class="mr-2">
            Disable All
          </v-btn>
          <v-btn @click="enableAll" tile color="green">
            Enable All
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
export default {
  name: 'DisabledLanguages',
  props: ["languages", "enabledLanguages"],
  components: {
  },
  data: () => ({
  }),
  computed: {
    disabledCount () {
      return this.languages.length - this.enabledLanguages.length;
    },
    disabledMessage () {
      return `You have (${this.disabledCount}) languages disabled`;
    }
  },
  watch: {
  },
  methods: {
    disableAll: function () {
      this.$emit("disableAll");
    },
    enableAll: function () {
      this.$emit("enableAll");
    },
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>