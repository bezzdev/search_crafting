<template>
  <v-expansion-panel readonly class="disabled-language-result">
    <v-expansion-panel-header>
      {{ result.localized }} = {{ result.language_name }} ({{ result.language_region }})
      <template v-slot:actions>
        <v-tooltip v-if="result.warning" top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="no-rotate pr-2" color="yellow">
              mdi-alert
            </v-icon>
          </template>
          <span> {{ result.warning }} </span>
        </v-tooltip>
        <v-checkbox class="ml-2 pt-4" :value="false" dense @change="change"/>
      </template>
    </v-expansion-panel-header>
  </v-expansion-panel>
</template>
<script>
export default {
  name: 'DisabledLanguageResult',
  props: ['result'],
  components: {
  },
  data: () => ({
  }),
  computed: {
  },
  watch: {
  },
  methods: {
    change: function () {
      this.$emit("enableLanguage", this.result.language_key)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.v-input--checkbox {
  padding: 0 !important;
  height: 20px;
  margin-left: -1px !important;
  margin-top: 0 !important;
}

</style>
<style lang="scss">
.disabled-language-result .v-input--selection-controls__input {
  margin-right: 1px !important
}
</style>
