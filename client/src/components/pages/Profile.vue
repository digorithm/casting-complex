<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container>
          <v-layout row justify-center>
            <v-flex xs12 md12 lg8 xl8>
              <v-card class="card-mod">
                <v-card-media
                  :height=getCardMediaHeight()
                  src="/static/img/bg3.jpg"
                >
                <v-layout align-end row wrap>
                  <v-flex xs4 md2 lg2 xl2 sm3 mb-3 mt-1 style="z-index: 100 !important;"
                  :class="{'mr-3': $vuetify.breakpoint.smAndDown,
                           'mr-5': $vuetify.breakpoint.mdOnly,
                           'mr-3': $vuetify.breakpoint.xlOnly,
                           'mr-4': $vuetify.breakpoint.lgOnly,
                           'ml-1': $vuetify.breakpoint.xsOnly,
                           'ml-3': $vuetify.breakpoint.smAndUp}">
                        <v-avatar
                        :size=getProfilePicStyle()
                        tile="true"
                        >
                          <img :src=profilePic />
                        </v-avatar>
                  </v-flex>
                  <v-flex xs6 md3 lg4 xl3 sm3
                  :class="{'mb-0': $vuetify.breakpoint.smAndDown,
                            'mb-5' : $vuetify.breakpoint.mdAndUp,
                            'ml-3': $vuetify.breakpoint.lgAndDown,
                            'ml-5': $vuetify.breakpoint.xlAndUp,
                            'ml-5': $vuetify.breakpoint.xsOnly,
                            'mr-5': $vuetify.breakpoint.xlOnly}">
                       <h2 class="white--text fullname">{{ fullName }}</h2>
                       <p class="from white--text">{{ role }} | <v-icon style="color: white !important;" dark small>location_on</v-icon> {{ from }}</p>
                  </v-flex>
                  <v-flex xs12 sm4 md5 lg5 xl6 class="text-md-right text-xs-center" style="margin-bottom: 35px !important;">
                      <p>
                        <v-btn icon flat color="white"> <v-icon>fa fa-facebook</v-icon>
                        </v-btn>
                        <v-btn icon flat color="white"> <v-icon>fa fa-twitter</v-icon>
                        </v-btn>
                        <v-btn icon small flat color="white"> <v-icon>fa fa-instagram</v-icon>
                        </v-btn>
                        <v-btn small>
                          <v-icon style="color: black !important;" dark left>message</v-icon>
                          message
                        </v-btn>
                      </p>
                  </v-flex>
                </v-layout>
                </v-card-media>
                <v-card-text>
                  <v-toolbar dense flat class="flexbar">
                    <v-toolbar-items class="flexbar-items">
                      <v-btn class="card-btn-left" :style=getCardNavbarMargin() @click.native="showInfo" flat>Information</v-btn>
                      <v-btn class="card-btn-right" @click.native="showAlbum" flat>Photos</v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                      <v-template v-if="toggleInfo">
                      <v-layout row wrap justify-space-around>
                      <v-flex xs11 md6 pt-3>
                        <h2> Summary </h2>
                        <p> {{ biographyMock }} </p>
                        <v-divider></v-divider>
                        <h2> Experience </h2>
                        <v-data-table
                          :headers="headers"
                          :items="experience"
                          hide-actions
                          :no-data-text="noExperience"
                        >
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.project }}</td>
                            <td class="text-xs-left">{{ props.item.role }}</td>
                            <td class="text-xs-left">{{ props.item.type }}</td>
                            <td class="text-xs-left">{{ props.item.year }}</td>
                          </template>
                        </v-data-table>
                      </v-flex>
                      <v-flex xs11 md4 pt-3>
                        <h2> Details </h2>
                        <v-layout row wrap align-center>
                          <v-flex xs3 md3>
                            Name:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ fullName }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Age:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.age }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Height:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.height }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Weight:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.weight }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Eyes:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.eyes }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Hair:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.hair }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Ethnicity:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ details.ethnicity }}
                            </v-btn>
                          </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <h3>Speaks</h3>
                        <v-btn outline small round color="primary" v-for="language in details.speaks" :key="language">{{language}}</v-btn>
                        <v-divider></v-divider>
                        <h3>Credits</h3>
                        <v-btn outline small round color="primary" v-for="credit in details.credits" :key="credit">{{credit}}</v-btn>
                        <v-divider></v-divider>
                        <h3>Unions</h3>
                        <v-btn outline small round color="primary" v-for="union in details.unions" :key="union">{{union}}</v-btn>
                        <v-divider></v-divider>
                        <!-- <v-template v-if="!isRepped">
                          <h4>{{fullName}} does not have an agent.</h4>
                          <v-btn small block color="primary"> Click here to hire this actor </v-btn>
                        </v-template>
                        <v-template v-if="isRepped">
                          <h3>Representation</h3>
                          {{fullName}} is represented by <strong>John Doe</strong> (<a href='/'>@JohnDoe</a>) from <strong>The Casting Agency</strong>.
                        </v-template> -->
                        <v-template v-if="isActorViewing">
                          <v-btn small block color="primary"> Edit your profile </v-btn>
                        </v-template>
                      </v-flex>
                      </v-layout>
                      </v-template>
                      <v-template v-if="!toggleInfo">
                        Here are some photos
                      </v-template>
                </v-card-text>
                <v-divider></v-divider>
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
      isActorViewing: true,
      isRepped: true,
      headers: [{
        text: 'Project',
        align: 'left',
        value: 'project'
      },
      { text: 'Role', value: 'role' },
      { text: 'Type', value: 'type' },
      { text: 'Year', value: 'year' }],
      experience: [
        {
          project: 'Cool project',
          role: 'young woman 1',
          type: 'Commercial film',
          year: '2018'
        },
        {
          project: 'Cool project',
          role: 'young woman 1',
          type: 'Commercial film',
          year: '2018'
        },
        {
          project: 'Cool project',
          role: 'young woman 1',
          type: 'Commercial film',
          year: '2018'
        }
      ],
      noAuditions: 'No added experiences',
      toggleInfo: true,
      active: '1',
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
        speaks: ['English', 'Portuguese', 'Turkish'],
        credits: ['Actor', 'Voice overs', 'Dancer'],
        unions: ['CAEA', 'RQD']
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
    getCardMediaHeight () {
      var breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xs') {
        return '300px'
      } else {
        return '280px'
      }
    },
    getCardNavbarMargin () {
      var breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xs') {
        return ''
      } else if (breakpoint === 'lg') {
        return 'margin-left: 185px !important;'
      } else {
        return 'margin-left: 215px !important;'
      }
    },
    getProfilePicStyle () {
      var breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xs') {
        return '130px'
      } else if (breakpoint === 'lg') {
        return '150px'
      } else {
        return '180px'
      }
    },
    showInfo () {
      this.toggleInfo = true
    },
    showAlbum () {
      this.toggleInfo = false
    },
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
    font-size: 32px !important;
  }

  .tooltip__content{
    background-color: white !important;
    color: black !important;
  }

  .divider {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }

  .card-mod .card__media__background {
    background: rgba(0, 0, 0, 0) url("/static/img/bg3.jpg") no-repeat scroll center center / cover;
    background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 19%, rgba(0, 0, 0, 0.65) 100%), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 0)), color-stop(19%, rgba(0, 0, 0, 0)), color-stop(100%, rgba(0, 0, 0, 0.65))), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 19%, rgba(0, 0, 0, 0.65) 100%), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 19%, rgba(0, 0, 0, 0.65) 100%), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    background: -ms-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 19%, rgba(0, 0, 0, 0.65) 100%), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 19%, rgba(0, 0, 0, 0.65) 100%), url('/static/img/bg3.jpg') no-repeat scroll center center / cover !important;
    height: 280px !important;
  }

  .from {
    padding-left: 5px !important;
  }

  .card__media img {
    border:1px solid white !important;
  }

  .card-mod .card__text {

    padding: 0px !important;

  }

  .flexbar {
    margin-top: -50px !important;
    border-bottom: solid 1px #e4e4e4 !important;
    background-color: white !important;
    max-height:50px !important;
  }

  .flexbar-items {
    margin-top: -30px !important;
    height:50px !important;
  }

  .toolbar-mod {
    height: 50px !important;
  }

  .card-btn-left {
    border-left: solid 1px #e4e4e4 !important;
    border-right: solid 1px #e4e4e4 !important;
  }
  .card-btn-right {
    border-right: solid 1px #e4e4e4 !important;
  }

  .badge__badge {
    border-radius: 10% !important;
    width: 70px !important;
    font-size: 12px !important;
  }

   @media screen and (max-width: 600px){
    .container {
      padding: $content-padding-top 0 0 0 !important;
      padding-top: 0px !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
      margin-bottom: 30px !important;
    }
  }

</style>
