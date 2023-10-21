import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    meta: {
      toolbar: true,
      absoluteToolbar: true
    },
    component: () => import('../views/about.vue')
  },
  {
    path: '/changelog',
    name: 'Changelog',
    meta: {
      toolbar: true,
      absoluteToolbar: true
    },
    component: () => import('../views/changelog.vue')
  },
  {
    path: '/',
    name: 'Crafting',
    meta: {
      toolbar: true,
      absoluteToolbar: true
    },
    component: () => import('../views/crafting.vue')
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
