import Vue from 'vue'
import Router from 'vue-router'

import Authentication from '@/components/pages/Authentication/Authentication'
import Home from '@/components/pages/Home'

// Global components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Register components
Vue.component('app-header', Header)
Vue.component('app-footer', Footer)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Authentication',
      component: Authentication
    },
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
        footer: Footer
      }
    }
  ]
})
