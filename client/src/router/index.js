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
import AgentDashboard from '@/components/pages/AgentDashboard'
import DirectorDashboard from '@/components/pages/DirectorDashboard'
import AdminDashboard from '@/components/pages/AdminDashboard'
import ActorProfile from '@/components/pages/ActorProfile'
import AgentProfile from '@/components/pages/AgentProfile'
import EditActorProfile from '@/components/pages/EditActorProfile'
import EditAgentProfile from '@/components/pages/EditAgentProfile'
import DirectorProfile from '@/components/pages/DirectorProfile'
import EditDirectorProfile from '@/components/pages/EditDirectorProfile'
import DirectorBreakdowns from '@/components/pages/DirectorBreakdowns'
import ManageBreakdown from '@/components/pages/ManageBreakdown'
import JobBoard from '@/components/pages/JobBoard'
import Breakdown from '@/components/pages/Breakdown'
import SearchActor from '@/components/pages/SearchActor'
import ManageActors from '@/components/pages/ManageActors'
import Auditions from '@/components/pages/Auditions'
import Messaging from '@/components/pages/Messaging'
import WaitingApproval from '@/components/pages/WaitingApproval'

import NotFound from '@/components/pages/NotFound'

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
import ActorsWidget from '@/components/ActorsWidget'
import SendMessageDialog from '@/components/SendMessageDialog'

import Lightbox from 'vue-simple-lightbox'

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
Vue.component('actors-widget', ActorsWidget)
Vue.component('lightbox', Lightbox)
Vue.component('send-message-dialog', SendMessageDialog)
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
      path: '/director-dashboard',
      name: 'Director Dashboard',
      components: {
        default: DirectorDashboard,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/agent-dashboard',
      name: 'Agent Dashboard',
      components: {
        default: AgentDashboard,
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
      path: '/admin-dashboard',
      name: 'Admin Dashboard',
      components: {
        default: AdminDashboard,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/actor/:username',
      name: 'Actor profile',
      components: {
        default: ActorProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/edit/actor',
      name: 'Edit actor profile',
      components: {
        default: EditActorProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/agent/:username',
      name: 'Agent profile',
      components: {
        default: AgentProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/edit/agent',
      name: 'Edit agent profile',
      components: {
        default: EditAgentProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/director/:username',
      name: 'Casting director profile',
      components: {
        default: DirectorProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/edit/director',
      name: 'Edit casting director profile',
      components: {
        default: EditDirectorProfile,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/breakdowns',
      name: 'Director breakdowns',
      components: {
        default: DirectorBreakdowns,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/breakdowns/:breakdown_id/manage',
      name: 'Manage breakdown',
      components: {
        default: ManageBreakdown,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/job-board',
      name: 'Job board',
      components: {
        default: JobBoard,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/breakdowns/:breakdown_id',
      name: 'Breakdown page',
      components: {
        default: Breakdown,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/search-actor',
      name: 'Search actor',
      components: {
        default: SearchActor,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/manage-actors',
      name: 'Manage actors',
      components: {
        default: ManageActors,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/auditions',
      name: 'Auditions',
      components: {
        default: Auditions,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/message',
      name: 'Message',
      components: {
        default: Messaging,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/waiting-approval',
      name: 'Waiting approval',
      components: {
        default: WaitingApproval,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '/notFound',
      name: 'Not found',
      components: {
        default: NotFound,
        header: Header,
        footer: Footer
      }
    },
    {
      path: '*',
      name: 'Not found',
      components: {
        default: NotFound,
        header: Header,
        footer: Footer
      }
    }
  ]
})
