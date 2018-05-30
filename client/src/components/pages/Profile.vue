<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container>
          <v-layout row justify-center>
            <v-flex md8 lg8 xl8>
              <v-card>
                <v-card-media
                  height="350px"
                  src="/static/img/bg8.jpg"
                >
                <v-layout align-center column>
                  <v-flex xs12 sm6 md2 pt-4 >
                        <v-avatar
                        size="180px"
                        >
                          <img :src=profilePic />
                        </v-avatar>
                  </v-flex>
                  <v-flex>
                      <h2 class="text-xs-center white--text fullname">{{ fullName }}</h2>
                      <p class="white--text text-xs-center">{{ role }} | <v-icon dark small>location_on</v-icon> {{ from }}</p>
                  </v-flex>
                  <v-flex>
                      <p class="text-xs-center">
                        <v-btn class="social text-xs-center" flat icon color="white"> <v-icon>fa fa-facebook</v-icon>
                        </v-btn>
                        <v-btn class="social text-xs-center" flat icon color="white"> <v-icon>fa fa-twitter</v-icon>
                        </v-btn>
                        <v-btn class="social text-xs-center" flat icon color="white"> <v-icon>fa fa-instagram</v-icon>
                        </v-btn>
                      </p>
                  </v-flex>
                </v-layout>
                </v-card-media>
                <v-card-text>
                  <v-tabs
                    v-model="active"
                    centered=true
                    slider-color="primary"
                  >
                    <v-tab
                    >
                      Information
                    </v-tab>
                    <v-tab>
                      Photos
                    </v-tab>
                    <v-tab-item>
                      <v-layout row wrap justify-space-around>
                      <v-flex md6>
                        <h2> Summary </h2>
                        <p> {{ biographyMock }} </p>
                      </v-flex>
                      <v-flex md4>
                        <h2> Details </h2>
                        <p> Age: {{ details.age }} </p>
                        <p> Height: {{ details.height }} </p>
                        <p> Weight: {{ details.weight }} </p>
                        <p> Eyes: {{ details.eyes }} </p>
                        <p> Hair: {{ details.hair }} </p>
                        <p> Ethnicity: {{ details.ethnicity }} </p>
                        <p> Speaks: {{ details.speaks }} </p>
                        <p> Credits: {{ details.credits }} </p>
                        <p> Unions: {{ details.unions }} </p>
                      </v-flex>
                      </v-layout>
                    </v-tab-item>
                    <v-tab-item>
                      Photo album here
                    </v-tab-item>
                  </v-tabs>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
     <app-footer></app-footer>
</main>
</template>

<script>
import { isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'
import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      active: null,
      card: {
        title: 'Rodrigo Araujo'
      },
      profile: '',
      fullName: '',
      from: 'Vancouver, Canada',
      role: 'Actress',
      biography: '',
      biographyMock: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla, Phasellus commodo neque nulla Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla',
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
      specializations: 'Music video, Film',
      isAgent: isAgent(),
      isActor: isActor(),
      isDirector: isDirector(),
      profilePic: '',
      details: {
        age: 24,
        height: '168 cm',
        weight: '130 lb',
        eyes: 'Green',
        hair: 'Blonde',
        ethnicity: 'Caucasian',
        speaks: 'English, Portuguese, Turkish',
        credits: 'Actor, Voice overs, Dancer',
        unions: 'CAEA. RQD'
      }
    }
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  mounted () {
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
          } else if (isDirector()) {
            // this.getCastingSpecialization()
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
    getCastingSpecialization () {
      this.specializations = this.extras['CastingSpecialization'].filter(s => this.profile.specializationId.includes(s.id)).map(s => s.name).join(', ')
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
      this.profilePic = '/static/img/actor3.jpg'
      this.getCityAndCountry()
    } else if (isAgent()) {
      this.profilePic = '/static/img/woman2.jpg'
      this.agencyName = this.profile.agencyName
      this.position = this.profile.position
    } else if (isDirector()) {
      this.profilePic = '/static/img/man1.jpg'
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

  .fullname {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  .card__media__background{
    filter: blur(1px) !important;
  }

</style>
