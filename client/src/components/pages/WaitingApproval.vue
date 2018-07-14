<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex md4 lg8 xl6>
              <v-card>
                <v-card-title light primary-title class="headline primary white--text">
                  Hi there! We're thrilled to have you here!
                </v-card-title>
                <v-card-text>
                  <p>
                    Before you can fully join the platform and have access to all sorts of resources, we have to review your profile and your references.
                  </p>
                  <p>
                    Don't worry, it will be done as soon as possible, we're on it!
                  </p>
                  <h2>
                    Status:
                  </h2>
                  <h3 v-if="profile.accountApproved">
                    Approved!
                  </h3>
                  <h3 v-else>
                    Profile being reviewed
                  </h3>
                </v-card-text>
                <v-card-actions>
                  <v-btn block v-if="profile.accountApproved" @click="goToDashboard()" color="primary">Awesome, take me to my dashboard!</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
     <app-footer></app-footer>
</main>
</template>

<script>
import { isLoggedIn, getProfile } from '@/components/authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      profile: {}
    }
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  mounted () {
    this.profile = getProfile()
    if (this.profile.user.roleId === 3) {
      this.fetchAgent(this.profile.user.username)
    } else {
      this.fetchDirector(this.profile.user.username)
    }
  },
  methods: {
    goToDashboard () {
      if (this.profile.user.roleId === 3) {
        this.$router.push('/agent-dashboard')
      } else if (this.profile.user.roleId === 2) {
        this.$router.push('/director-dashboard')
      }
    },
    fetchAgent (username) {
      Axios.get(`${CastingComplexAPI}/agents/?username=${username}`)
        .then((data) => {
          var profile = data.data.data
          if (profile.accountApproved === true) {
            this.profile.accountApproved = profile.accountApproved
            localStorage.setItem('logged_profile', JSON.stringify(profile))
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchDirector (username) {
      Axios.get(`${CastingComplexAPI}/castingdirectors/?username=${username}`)
        .then((data) => {
          var profile = data.data.data
          if (profile.accountApproved === true) {
            this.profile.accountApproved = profile.accountApproved
            localStorage.setItem('logged_profile', JSON.stringify(profile))
          }
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
  @import "./../../assets/styles";

  .content {
      padding-top: $content-padding-top;
      padding-bottom: $content-padding-bottom;
    }

  @media screen and (max-width: 960px){
    .content {
      padding-top: 0px !important;
      padding-bottom: 150px !important;
    }
  }

  .card__text {
    color: black !important;
    text-align: left !important;
  }
  .profile-btn {
    width: 100px !important;
    height: 100px !important;
  }
  .featured-actors {
    padding-bottom: 20px !important;
  }
</style>
