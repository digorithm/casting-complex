<template>
  <v-toolbar app class="main-header primary hidden-sm-and-down" absolute dense prominent>
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
    <v-toolbar-title class="toolbar__title-mod"> Casting Complex </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="main-toolbar" slot="">
      <v-menu offset-y v-if="isLoggedIn() && !isRegistrationInProgress()" :nudge-width="100">
        <v-btn color="white" slot="activator" flat>
          <v-icon class="hidden-sm-and-down" to='/' left dark>    more_vert</v-icon>
        Home
        </v-btn>
        <v-list>
          <v-list-tile v-for="item in loggedInMenuItems" :key="item.title" :to="item.path">
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn color="white" v-if="!isLoggedIn() || isRegistrationInProgress()" to='/' flat>
        <v-icon class="hidden-sm-and-down" to='/' left dark>home</v-icon>
      Home
      </v-btn>
      <v-btn
        flat
        v-for="item in menuItems"
        :key="item.title"
        color="white"
        :to="item.path">
        <template v-if="item.title !== 'Messages'">
          <v-icon class="hidden-sm-and-down" left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </template>
        <template v-else>
          <template v-if="unreadMessages > 0">
            <v-badge color="red" left>
              <span slot="badge">{{unreadMessages}}</span>
                <v-icon class="hidden-sm-and-down" dark>{{ item.icon }}</v-icon>
            </v-badge>
          </template>
          <template v-else>
            <v-icon class="hidden-sm-and-down" dark>{{ item.icon }}</v-icon>
          </template>
        </template>
      </v-btn>
      <v-btn color="white" v-if="!isLoggedIn() || isRegistrationInProgress()" v-on:click.native="openDialog()" flat>
        <v-icon class="hidden-sm-and-down" left dark>lock_open</v-icon>
        Sign in
      </v-btn>
      <v-menu class="hidden-sm-and-down" offset-y v-if="isLoggedIn() && !isRegistrationInProgress()" :nudge-width="100">
        <v-btn color="white" slot="activator" v-if="isLoggedIn() && !isRegistrationInProgress()" flat>
          <v-avatar
          size="50px"
          >
            <img :src=profilePic />
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile v-for="item in avatarMenuItems" :key="item.title" v-on:click.native="logout()" :to=item.path>
            <v-list-tile-title v-text="item.title">
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import {bus} from '../main'
import io from 'socket.io-client'
import { logout, isLoggedIn, isAdmin, isActor, isAgent, isDirector, isRegistrationInProgress } from '@/components/authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      styleObject: {
        fontSize: '105px'
      },
      menuItems: [],
      isLoggedIn: isLoggedIn,
      isRegistrationInProgress: isRegistrationInProgress,
      loggedInMenuItems: [
        { title: 'Home', path: '/', icon: 'home' },
        { title: 'About us', path: '/about', icon: 'info' },
        { title: 'Pricing', path: '/pricing', icon: 'attach_money' },
        { title: 'Contact', path: '/contact', icon: 'contacts' }
      ],
      avatarMenuItems: [
        { title: 'Sign off', path: '/', icon: 'exit_to_app' }
      ],
      color: 'success',
      mode: '',
      y: 'top',
      snackbar: false,
      timeout: 5000,
      username: '',
      loginMessage: 'Hello, I\'m a snackbar',
      profilePic: '',
      profile: {
        userId: '',
        avatar: ''
      },
      unreadMessages: ''
    }
  },
  mounted () {
    // TODO: don't load logged navbar if registration is in progress
    this.getCorrectToolbar()
    if (isLoggedIn()) {
      this.socket = io.connect(CastingComplexAPI)
      this.socket.emit('logged_on', {username: this.username + '-header', userId: this.profile.userId})

      this.socket.on('new_message', () => {
        this.unreadMessages = this.unreadMessages + 1
      })

      this.socket.on('unread_messages', data => {
        this.unreadMessages = data
      })
    }
  },
  created: function () {
    this.profile.userId = JSON.parse(localStorage.getItem('logged_profile')).userId
    this.profile.avatar = localStorage.getItem('logged_profile').avatar
    this.username = JSON.parse(localStorage.getItem('logged_profile')).user.username
    if (isActor()) {
      this.fetchAvatar()
    } else if (isAgent()) {
      this.fetchAvatar()
    } else if (isDirector()) {
      this.fetchAvatar()
    } else if (isAdmin()) {
      this.profile.userId = JSON.parse(localStorage.getItem('logged_profile')).user.id
      this.fetchAvatar()
    }
    // Whenever we get a signal from the bus telling us that the user has logged in, we update the toolbar
    var vm = this
    bus.$on('logged', function (value) {
      if (value) {
        vm.loginMessage = 'Hi, ' + JSON.parse(localStorage.getItem('logged_profile')).firstName + ', welcome back! :-)'
        vm.snackbar = true
        vm.getCorrectToolbar()
        if (isActor()) { vm.$router.push('/actor-dashboard') }
        if (isAgent()) { vm.$router.push('/agent-dashboard') }
        if (isDirector()) { vm.$router.push('/director-dashboard') }
        if (isAdmin()) { vm.$router.push('/admin-dashboard') }
      }
    })
  },
  methods: {
    fetchAvatar () {
      console.log(this.profile.userId)
      Axios.get(`${CastingComplexAPI}/users/${this.profile.userId}/photos/profile`)
        .then((data) => {
          this.profilePic = data.data.avatar
        }).catch((err) => {
          console.log(err)
        })
    },
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
          { title: 'Profile', path: '/actor/' + this.username, icon: 'person' },
          { title: 'Job board', path: '/job-board', icon: 'work' },
          { title: 'Messages', path: '/message', icon: 'message' }
        ]
      }
      if (isLoggedIn() && isAgent() && !isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/agent-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/agent/' + this.username, icon: 'person' },
          { title: 'Actors', path: '/manage-actors', icon: 'person' },
          { title: 'Job board', path: '/job-board', icon: 'work' },
          { title: 'Messages', path: '/message', icon: 'message' }
        ]
      }
      if (isLoggedIn() && isDirector() && !isRegistrationInProgress()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/director-dashboard', icon: 'dashboard' },
          { title: 'Profile', path: '/director/' + this.username, icon: 'person' },
          { title: 'Breakdowns', path: '/breakdowns', icon: 'work' },
          { title: 'Job board', path: '/job-board', icon: 'work' },
          { title: 'Messages', path: '/message', icon: 'message' }
        ]
      }
      if (isLoggedIn() && isAdmin()) {
        this.menuItems = [
          { title: 'Dashboard', path: '/admin-dashboard', icon: 'dashboard' },
          { title: 'Messages', path: '/message', icon: 'message' }
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
  }

  .btn.btn-nav {
    height: $sign-in-btn-height !important;
    width: $sign-in-btn-width important;
    background-color: white !important;
    color: black !important;
    padding-top: 5px;
  }

  // .btn__content {
  //   font-weight: 700 !important;
  //   color: white !important;
  // }

  .main-header .toolbar__extension {
    background-color: white !important;
  }
  .main-header .toolbar__content {
    height: $navbar-height !important;
  }
  .main-header .toolbar__title-mod {
    font-size: 45px !important;
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
