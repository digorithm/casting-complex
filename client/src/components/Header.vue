<template>
  <v-toolbar app class="primary hidden-sm-and-down" absolute dense prominent>
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
    <v-toolbar-title class="centered toolbar__title-mod"> Casting Complex </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="main-toolbar" slot="extension">
      <v-menu v-if="isLoggedIn()" :nudge-width="100">
        <v-btn slot="activator" flat>
          <v-icon class="hidden-sm-and-down" to='/' left dark>    more_vert</v-icon>
        Home
        </v-btn>
        <v-list>
          <v-list-tile v-for="item in loggedInMenuItems" :key="item.title" :to="item.path">
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn v-if="!isLoggedIn()" to='/' flat>
        <v-icon class="hidden-sm-and-down" to='/' left dark>home</v-icon>
      Home
      </v-btn>
      <v-btn
        flat
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path">
        <v-icon class="hidden-sm-and-down" left dark>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
      <v-btn v-if="!isLoggedIn()" v-on:click.native="openDialog()" flat>
        <v-icon class="hidden-sm-and-down" left dark>lock_open</v-icon>
        Sign in
      </v-btn>
      <v-btn v-if="isLoggedIn()" v-on:click.native="logout()" flat>
        <v-icon class="hidden-sm-and-down" left dark>exit_to_app</v-icon>
        Sign out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import {bus} from '../main'
import { logout, isLoggedIn, isActor } from '@/components/authentication'

export default {
  data () {
    return {
      styleObject: {
        fontSize: '105px'
      },
      menuItems: [],
      isLoggedIn: isLoggedIn,
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
        vm.$router.push('/actor-dashboard')
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
      if (!isLoggedIn()) {
        this.menuItems = [
          { title: 'About us', path: '/about', icon: 'info' },
          { title: 'Pricing', path: '/pricing', icon: 'attach_money' },
          { title: 'Contact', path: '/contact', icon: 'contacts' },
          { title: 'Join', path: '/join', icon: 'face' }
        ]
      }
      if (isLoggedIn() && isActor()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/actor-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/actor-profile', icon: 'person' },
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

  .btn.btn-signin {
    height: $sign-in-btn-height !important;
    margin-top: ($navbar-height - $sign-in-btn-height)/2 !important;
    width: $sign-in-btn-width important;
    background-color: #989898 !important;
    color: black;
  }

  .main-toolbar {
    width: 100% !important;
    display: flex;
    justify-content: space-around;
  }

  .btn.btn-nav {
    height: $sign-in-btn-height !important;
    width: $sign-in-btn-width important;
    background-color: white !important;
    color: black !important;
    padding-top: 5px;
  }

  .btn__content {
    font-weight: 700 !important;
  }

  .toolbar__extension {
    background-color: white !important;
  }
  .toolbar__content {
    height: $navbar-height !important;
  }
  .toolbar__title-mod {
    font-size: 68px !important;
    display: flex;
    justify-content: space-around;
    width: 100% !important;
    color: white;
    font-family: $logo;
  }

  .l-header-container {
    background-color: $background-color;
    margin: 0 auto;
    padding: 0 15px;
    min-width: 272px;
    label, input, .icon, .input-group__selections__comma {
      color: #29b6f6!important;
    }
    .input-group__details {
      &:before {
        background-color: $border-color-input !important;
      }
    }
    .btn {
      margin-top: 15px;
    }
  }
</style>
