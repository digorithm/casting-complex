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
                  <v-flex xs3 md2 lg2 xl2 sm3 mb-3 mt-1 style="z-index: 100 !important;"
                  :class="{'mr-3': $vuetify.breakpoint.smAndDown,
                           'mr-5': $vuetify.breakpoint.mdOnly,
                           'mr-3': $vuetify.breakpoint.xlOnly,
                           'mr-4': $vuetify.breakpoint.lgOnly,
                           'ml-1': $vuetify.breakpoint.xsOnly,
                           'ml-3': $vuetify.breakpoint.smAndUp}">
                        <v-avatar
                        :size=getProfilePicStyle()
                        :tile=true
                        >
                          <img :src=profilePic />
                        </v-avatar>
                  </v-flex>
                  <v-flex xs7 md3 lg4 xl3 sm4
                  :class="{'mb-0': $vuetify.breakpoint.smAndDown,
                            'mb-5' : $vuetify.breakpoint.mdAndUp,
                            'ml-3': $vuetify.breakpoint.lgAndDown,
                            'ml-5': $vuetify.breakpoint.xlAndUp,
                            'pl-4': $vuetify.breakpoint.smOnly,
                            'ml-5': $vuetify.breakpoint.xsOnly,
                            'mr-5': $vuetify.breakpoint.xlOnly}">
                       <h2 class="white--text fullname">{{ profile.fullname }}</h2>
                       <p :class="{'mb-5': $vuetify.breakpoint.smOnly}" class="from white--text">{{ profile.role }} | <v-icon style="color: white !important;" dark small>location_on</v-icon> {{ profile.from }}</p>
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
                      <template v-if="toggleInfo">
                      <v-layout row wrap justify-space-around>
                      <v-flex xs11 md6 pt-3>
                        <h2> Summary </h2>
                        <p> {{ profile.biography }} </p>
                        <v-divider></v-divider>
                        <h2> Experience </h2>
                        <v-data-table
                          :headers="headers"
                          :items="profile.experience"
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
                              {{ profile.fullname }}
                            </v-btn>
                          </v-flex>
                          <v-flex xs3 md3>
                            Age:
                          </v-flex>
                          <v-flex xs9 md9>
                            <v-btn outline small round color="primary">
                              {{ profile.age }}
                            </v-btn>
                          </v-flex>
                          <template v-if="this.profile.height">
                            <v-flex xs3 md3>
                              Height:
                            </v-flex>
                            <v-flex xs9 md9>
                              <v-btn outline small round color="primary">
                                {{ profile.height }} cms
                              </v-btn>
                            </v-flex>
                          </template>
                          <template v-if="this.profile.weight">
                            <v-flex xs3 md3>
                              Weight:
                            </v-flex>
                            <v-flex xs9 md9>
                              <v-btn outline small round color="primary">
                                {{ profile.weight }} KGs
                              </v-btn>
                            </v-flex>
                          </template>
                          <template v-if="this.profile.eyes">
                            <v-flex xs3 md3>
                              Eyes:
                            </v-flex>
                            <v-flex xs9 md9>
                              <v-btn outline small round color="primary">
                                {{ profile.eyes }}
                              </v-btn>
                            </v-flex>
                          </template>
                          <template v-if="this.profile.hair">
                            <v-flex xs3 md3>
                              Hair:
                            </v-flex>
                            <v-flex xs9 md9>
                              <v-btn outline small round color="primary">
                                {{ profile.hair }}
                              </v-btn>
                            </v-flex>
                          </template>
                          <template v-if="this.profile.ethnicity">
                            <v-flex xs3 md3>
                              Ethnicity:
                            </v-flex>
                            <v-flex xs9 md9>
                              <v-btn outline small round color="primary">
                                {{ profile.ethnicity }}
                              </v-btn>
                            </v-flex>
                          </template>
                        </v-layout>
                        <v-divider></v-divider>
                        <h3>Skills</h3>
                        <v-btn outline small round color="primary" v-for="skill in profile.skills" :key="skill">{{skill}}</v-btn>
                        <v-divider></v-divider>
                        <h3>Speaks</h3>
                        <v-btn outline small round color="primary" v-for="language in profile.languages" :key="language">{{language}}</v-btn>
                        <v-divider></v-divider>
                        <h3>Credits</h3>
                        <v-btn outline small round color="primary" v-for="credit in profile.credits" :key="credit">{{credit}}</v-btn>
                        <v-divider></v-divider>
                        <h3>Unions</h3>
                        <v-btn outline small round color="primary" v-for="union in profile.unions" :key="union">{{union}}</v-btn>
                        <v-divider></v-divider>

                        <template v-if="!isRepped">
                          <h4>{{profile.fullname}} does not have an agent.</h4>

                          <v-btn v-if="isAgentViewing" small block color="primary"> Click here to hire this actor </v-btn>
                        </template>

                        <template v-if="isRepped">
                          <h3>Representation</h3>
                          {{profile.fullname}} is represented by <strong>John Doe</strong> (<a href='/'>@JohnDoe</a>) from <strong>The Casting Agency</strong>.
                        </template>

                        <template v-if="isSelfViewing">
                          <v-btn small to="/edit/actor" block color="primary"> Edit your profile </v-btn>
                        </template>

                        <template v-if="isDirectorViewing">
                          <v-divider></v-divider>
                          <v-btn small block color="primary"> Invite for an audition</v-btn>
                        </template>

                      </v-flex>
                      </v-layout>
                      </template>

                      <template v-if="!toggleInfo">
                        Here are some photos
                      </template>
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
      isSelfViewing: true,
      isActorViewing: false,
      isAgentViewing: false,
      isDirectorViewing: false,
      isRepped: false,
      headers: [{
        text: 'Project',
        align: 'left',
        value: 'project'
      },
      { text: 'Role', value: 'role' },
      { text: 'Type', value: 'type' },
      { text: 'Year', value: 'year' }],
      noExperience: 'No added experiences',
      toggleInfo: true,
      active: '1',
      isAgent: isAgent(),
      isActor: isActor(),
      isDirector: isDirector(),
      profilePic: '',
      profile: {
        fullname: '',
        role: '',
        age: '',
        from: '',
        height: '',
        weight: '',
        eyes: '',
        hair: '',
        ethnicity: '',
        credits: [],
        unions: [],
        skills: [],
        isRepped: '',
        experience: [],
        languages: [],
        biography: ''
      }
    }
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  mounted () {
    this.fetchActor(this.$route.params.username)
  },
  methods: {
    fetchActor (username) {
      Axios.get(`${CastingComplexAPI}/actors/?username=${username}`)
        .then((data) => {
          var profile = data.data.data
          this.profile.fullname = profile.firstName + ' ' + profile.lastName
          this.profile.age = this.calculateAge(profile.birthdate) || '?'
          this.profile.role = (profile.genderId === 1 ? 'Actress' : 'Actor')
          this.profile.height = profile.height
          this.profile.weight = profile.weight
          this.profile.hair = profile.Hair
          this.profile.eyes = profile.Eye
          this.profile.ethnicity = profile.Ethnicity
          this.profile.experience = profile.Experiences
          this.profile.skills = profile.Skills
          this.profile.languages = profile.Languages
          this.profile.credits = profile.Credits
          this.profile.unions = profile.Unions
          this.profile.isRepped = profile.isRepresented
          this.profile.from = profile.City + ', ' + profile.Country
          this.profile.biography = profile.profile

          console.log(profile.Experiences.type)
        }).catch((err) => {
          console.log(err)
        })
    },
    calculateAge (birthdate) {
      var birthday = new Date(birthdate)
      var ageDifMs = Date.now() - birthday.getTime()
      var ageDate = new Date(ageDifMs)
      if (isNaN(Math.abs(ageDate.getUTCFullYear() - 1970))) {
        return null
      }
      return Math.abs(ageDate.getUTCFullYear() - 1970)
    },
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
    }
  },
  created () {
    if (isActor()) {
      this.profilePic = '/static/img/actor3.jpg'
    } else if (isAgent()) {
      this.profilePic = '/static/img/woman2.jpg'
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

  @media screen and (max-width: 600px){
    .content {
      padding-top: 0px !important;
      padding-bottom: 150px !important;
    }
  }

  @media screen and (max-width: 768px){
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

  .card__media img {
    box-shadow: 1px 1px 5px black !important;
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
