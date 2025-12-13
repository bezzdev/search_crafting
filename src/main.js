import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router'
import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
