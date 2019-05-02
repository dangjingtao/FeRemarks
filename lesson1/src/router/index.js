import Vue from 'vue'
import Router from 'vue-router'
import Shop from '@/pages/Shop'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'shop',
      component: Shop
    }
  ]
})
