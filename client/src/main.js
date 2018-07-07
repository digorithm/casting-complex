// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
//
// import VueSocketIO from 'vue-socket.io'

// export const SocketInstance = io(`http://${window.location.hostname}:5050`)

import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.use(VueCookie)
// Vue.use(VueSocketIO, SocketInstance)
Vue.use(Vuetify, {
  theme: {
    primary: '#085f89',
    secondary: '#989898',
    accent: colors.indigo.base
  }
})

Vue.config.productionTip = false

// Bus is a component to send data across different components.
export const bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
