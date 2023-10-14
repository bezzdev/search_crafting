import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Crafting from '../views/crafting.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Crafting',
    meta: {
      toolbar: true,
      absoluteToolbar: true
    },
    component: Crafting
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.key) {
    next();
  } else {
    let key = to.meta.key;
    store.dispatch('hasKey', key).then(function (authorized) {
      if (authorized) {
        next();
      } else {
        next('/');
      }
    })
  }
})

export default router
