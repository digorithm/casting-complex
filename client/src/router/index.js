import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/pages/Home'
import Join from '@/components/pages/Join'
import JoinActor from '@/components/pages/JoinActor'
import JoinCastingDirector from '@/components/pages/JoinCastingDirector'
import JoinAgent from '@/components/pages/JoinAgent'
import Payment from '@/components/pages/Payment'
import References from '@/components/pages/References'
import ActorDashboard from '@/components/pages/ActorDashboard'
import ActorProfile from '@/components/pages/ActorProfile'

// Global components
import Header from '@/components/Header'
import Login from '@/components/Login'
import Footer from '@/components/Footer'
import MobileHeader from '@/components/MobileHeader'
import ProfileWidget from '@/components/ProfileWidget'
import AuditionWidget from '@/components/AuditionWidget'
import AuditionRequestWidget from '@/components/AuditionRequestWidget'
import BreakdownWidget from '@/components/BreakdownWidget'
import NewsWidget from '@/components/NewsWidget'

// Register components
Vue.component('app-header', Header)
Vue.component('app-mobile-header', MobileHeader)
Vue.component('app-footer', Footer)
Vue.component('login-modal', Login)
Vue.component('profile-widget', ProfileWidget)
Vue.component('audition-widget', AuditionWidget)
Vue.component('audition-request-widget', AuditionRequestWidget)
Vue.component('breakdown-widget', BreakdownWidget)
Vue.component('news-widget', NewsWidget)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/join',
      name: 'Join',
      components: {
        default: Join,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/join-actor',
      name: 'JoinActor',
      components: {
        default: JoinActor,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/join-director',
      name: 'JoinCastingDirector',
      components: {
        default: JoinCastingDirector,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/join-agent',
      name: 'JoinAgent',
      components: {
        default: JoinAgent,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/payment',
      name: 'Payment',
      components: {
        default: Payment,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/references',
      name: 'References',
      components: {
        default: References,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/actor-dashboard',
      name: 'Actor Dashboard',
      components: {
        default: ActorDashboard,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/actor-profile',
      name: 'Actor Profile',
      components: {
        default: ActorProfile,
        header: Header,
        footer: Footer
      }
    }
  ]
})
