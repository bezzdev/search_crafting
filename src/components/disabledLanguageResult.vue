<template>
  <v-expansion-panel readonly>
    <v-expansion-panel-header>
      {{ result.localized }} = {{ result.language_name }} ({{ result.language_region }})
      <template v-slot:actions>
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
  margin-top: 0 !important;
}
</style>
