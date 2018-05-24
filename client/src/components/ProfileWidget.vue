<template>
  <v-card>
    <v-card-media src="/static/img/actor3.jpg" height="300px">
    </v-card-media>
    <v-card-title primary class="title">
      <v-layout row warp align-center>
      <v-flex d-flex md9>
      {{ fullName }}
      </v-flex>
      <v-flex d-flex md5>
        <v-btn color="primary" style="min-width: 0 !important; padding: 0 !important;" small><v-icon>edit</v-icon></v-btn>
      </v-flex>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <template v-if="isActor">
        <p><strong>From:</strong> <em>{{ country.name }}, {{ city.name }}</em></p>
        <p><strong>Credits:</strong> <em>{{ credits }}</em></p>
        <p><strong>Unions:</strong> <em>{{ unions }}</em></p>
      </template>
      <template v-else-if="isAgent">
        <p><strong>Agency divisions:</strong> <em>{{ divisions }}</em></p>
        <p><strong>Roster types:</strong> <em>{{ rosterTypes }}</em></p>
      </template>
      <p><strong>Biography:</strong> <em>{{ biography }}</em></p>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="isActor" color="primary" to="/actor-profile" block small>View public profile</v-btn>
      <v-btn v-if="isAgent" color="primary" to="/agent-profile" block small>View public profile</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Axios from 'axios'
import { isLoggedIn, isActor, isAgent } from '@/components/authentication'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      // TODO: Compute size of profile pic based on pic's dimensions
      profile: '',
      fullName: '',
      biography: '',
      country: '',
      city: '',
      ethnicity: '',
      extras: [],
      credits: '',
      unions: '',
      agencyName: '',
      position: '',
      website: '',
      divisions: [],
      rosterTypes: [],
      isAgent: isAgent(),
      isActor: isActor()
    }
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  created () {
    this.profile = JSON.parse(localStorage.getItem('logged_profile'))
    this.fullName = this.profile.firstName + ' ' + this.profile.lastName
    this.getExtras()
    this.biography = (function () {
      var profile = JSON.parse(localStorage.getItem('logged_profile')).profile
      if (profile === null) {
        return 'Welcome to Casting Complex! This page is your main dashboard, wbere you can access information such as recently published breakdowns, your auditions, statuses for your audition requests, news, and more! You can edit your profile by clicking on the edit, the pencil icon, right about your profile!'
      } else {
        return profile.profile
      }
    })()
    if (isActor()) {
      this.getCityAndCountry()
    } else if (isAgent()) {
      this.agencyName = this.profile.agencyName
      this.position = this.profile.position
    }
  },
  methods: {
    getExtras (context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.extras = data.data.data
          if (isActor()) {
            this.getCreditsandUnions()
          } else if (isAgent()) {
            this.getDivisionAndType()
            console.log(this.divisions, this.rosterTypes)
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    getCreditsandUnions () {
      this.credits = this.extras['Credit'].filter(c => this.profile.creditId.includes(c.id)).map(c => c.name).join(', ')

      this.unions = this.extras['Union'].filter(u => this.profile.unionId.includes(u.id)).map(u => u.name).join(', ')
    },
    getDivisionAndType () {
      this.divisions = this.extras['AgencyDivision'].filter(a => this.profile.agencyDivisionId.includes(a.id)).map(a => a.name).join(', ')

      this.rosterTypes = this.extras['RosterType'].filter(r => this.profile.rosterTypeId.includes(r.id)).map(r => r.name).join(', ')
    },
    getCityAndCountry (context) {
      Axios.get(`${CastingComplexAPI}/extras/countries`)
        .then((data) => {
          this.country = data.data.data.filter(c => this.profile.countryId === c.id)[0]
          Axios.get(`${CastingComplexAPI}/extras/cities/${this.country.id}`)
            .then((data) => {
              this.city = data.data.data.filter(c => this.profile.cityId === c.id)[0]
            }).catch((err) => {
              console.log(err)
            })
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
</style>
