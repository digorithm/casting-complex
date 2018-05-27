<template>
  <div class="hidden-md-and-up">
      <v-expansion-panel>
         <v-snackbar
            :timeout="timeout"
            :color="color"
            :top="y === 'top'"
            :multi-line="mode === 'multi-line'"
            :vertical="mode === 'vertical'"
            v-model="snackbar"
          >
            {{ loginMessage }}
            <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>
        <v-expansion-panel-content>
          <div slot="header">
            <p class="header-title"> Casting Complex</p>
          </div>
          <v-btn class="modified-btn-content" v-if="!isLoggedIn() || isRegistrationInProgress()" to='/' flat>
          Home
          </v-btn>
          <v-btn
            flat
            class="modified-btn-content"
            v-for="item in menuItems"
            :key="item.title"
            :to="item.path">
            {{ item.title }}
          </v-btn>
          <v-btn class="modified-btn-content" v-if="!isLoggedIn() || isRegistrationInProgress()" v-on:click.native="openDialog()" flat>
            Sign in
          </v-btn>
          <v-btn class="modified-btn-content" v-if="isLoggedIn() && !isRegistrationInProgress()" v-on:click.native="logout()" flat>
            Sign out
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
</template>

<script>
import {bus} from '../main'
import { logout, isLoggedIn, isRegistrationInProgress, isActor, isAgent, isDirector } from '@/components/authentication'

export default {
  data () {
    return {
      menuItems: [],
      isLoggedIn: isLoggedIn,
      isRegistrationInProgress: isRegistrationInProgress,
      loggedInMenuItems: [
        { title: 'Home', path: '/', icon: 'home' },
        { title: 'About us', path: '/about', icon: 'info' },
        { title: 'Pricing', path: '/pricing', icon: 'attach_money' },
        { title: 'Contact', path: '/contact', icon: 'contacts' }
      ],
      color: 'success',
      mode: '',
      y: 'top',
      snackbar: false,
      timeout: 5000,
      loginMessage: 'Hello, I\'m a snackbar'
    }
  },
  mounted () {
    this.getCorrectToolbar()
  },
  created: function () {
    // Whenever we get a signal from the bus telling us that the user has logged in, we update the toolbar
    var vm = this
    bus.$on('logged', function (value) {
      if (value) {
        vm.getCorrectToolbar()
        if (isActor()) { vm.$router.push('/actor-dashboard') }
        if (isAgent()) { vm.$router.push('/agent-dashboard') }
        if (isDirector()) { vm.$router.push('/director-dashboard') }
        vm.loginMessage = 'Hi, ' + JSON.parse(localStorage.getItem('logged_profile')).firstName + ', welcome back! :-)'
        vm.snackbar = true
      }
    })
  },
  methods: {
    openDialog () {
      // Send signal to open modal
      bus.$emit('dialog', true)
    },
    getCorrectToolbar () {
      // Whenever this is called, it changes the menuItems prop, causing the re-rendering of the toolbar
      if (!isLoggedIn() || isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'About us', path: '/about', icon: 'info' },
          { title: 'Pricing', path: '/pricing', icon: 'attach_money' },
          { title: 'Contact', path: '/contact', icon: 'contacts' },
          { title: 'Join', path: '/join', icon: 'face' }
        ]
      }
      if (isLoggedIn() && isActor() && !isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/actor-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/actor-profile', icon: 'person' },
          { title: 'Messages', path: '/message', icon: 'message' },
          { title: 'Job board', path: '/job-board', icon: 'work' }
        ]
      }
      if (isLoggedIn() && isAgent() && !isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/agent-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/agent-profile', icon: 'person' },
          { title: 'Actors', path: '/manage-actors', icon: 'person' },
          { title: 'Messages', path: '/message', icon: 'message' },
          { title: 'Job board', path: '/job-board', icon: 'work' }
        ]
      }
      if (isLoggedIn() && isDirector() && !isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/director-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/director-profile', icon: 'person' },
          { title: 'Breakdowns', path: '/breakdowns', icon: 'work' },
          { title: 'Messages', path: '/message', icon: 'message' },
          { title: 'Job board', path: '/job-board', icon: 'work' }
        ]
      }
    },
    logout () {
      logout()
      this.getCorrectToolbar()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import "./../assets/styles";

.header-title {
  font-size: 50px !important;
  display: flex;
  justify-content: space-around;
  width: 100% !important;
  color: white;
  font-family: $logo !important;
}

@media screen and (max-width: 600px){
  .header-title {
    font-size: 35px !important;
  }
  .icon.material-icons{
    color: white !important;
  }
}

.expansion-panel__container {
  background-color: $background-color !important;
}

.modified-btn-content {
  color: white !important;
}
</style>
