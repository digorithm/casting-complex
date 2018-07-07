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
                          <img v-if="!isSelfViewing" :src=profile.avatar />
                          <v-tooltip top v-if="isSelfViewing">
                            <input type="file"
                              v-if="isSelfViewing"
                              :id="uploadFieldName"
                              :name="uploadFieldName"
                              :disabled="isSaving"
                              @change="fileChange($event.target.name, $event.target.files)"
                              accept="image/*"
                              class="input-file">
                            <span>Update profile photo</span>
                            <label slot="activator" :for=uploadFieldName >
                              <img :src=profile.avatar />
                            </label>
                          </v-tooltip>
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
                        <v-layout row wrap mt-1>
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

                        <template v-if="!profile.isRepped">
                          <h4>{{profile.fullname}} does not have an agent.</h4>

                          <!-- <v-btn @click="requestRepToActor()" v-if="isAgentViewing" small block color="primary"> Click here to hire this actor </v-btn> -->

                          <!-- <v-alert transition="scale-transition" :value="requestSentAlert" type="success">
                              Your request was sent!
                              <v-btn flat color="white" @click.native="requestSentAlert = false">Close</v-btn>
                            </v-alert>
                          <v-alert transition="scale-transition" :value="doubleRequestAlert" type="error">
                            You already requested this actor. This actor should reply soon :-).
                            <v-btn flat color="white" @click.native="doubleRequestAlert = false">Close</v-btn>
                          </v-alert> -->
                        </template>

                        <template v-if="profile.isRepped">
                          <h3>Representation</h3>
                          {{profile.fullname}} is represented by <strong><router-link :to="{ name: 'Agent profile', params: { username: profile.agent.username }}">{{profile.agent.name}}</router-link></strong> from <strong>{{profile.agent.agencyName}}</strong>.
                        </template>

                        <template v-if="isAgentViewing && viewerRepsThisActor">
                          <v-divider></v-divider>
                            <p><em>You represent this actor</em></p>
                            <v-btn @click="cancelRep()" small block color="error">Cancel representation </v-btn>
                            <v-alert transition="scale-transition" :value="cancelRepSuccessAlert" type="success">
                              Your representation has been canceled.
                              <v-btn flat color="white" @click.native="cancelRepSuccessAlert = false">Close</v-btn>
                            </v-alert>
                            <v-alert transition="scale-transition" :value="cancelRepFailAlert" type="error">
                              Something went wrong. We're on it!
                              <v-btn flat color="white" @click.native="cancelRepFailAlert = false">Close</v-btn>
                            </v-alert>
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
                      <v-flex>
                        <template v-if="!toggleInfo">
                            <v-layout row wrap align-center>
                              <v-flex ml-3 mt-2 class="text-xs-left">
                                <h3>{{profile.fullname}}'s photos</h3>
                              </v-flex>
                              <v-spacer></v-spacer>
                              <v-flex md2 mt-2 pr-1
                                :class="{'pl-5': $vuetify.breakpoint.xlOnly}">
                                <form enctype="multipart/form-data" novalidate v-if="(isInitial || isSaving) && isSelfViewing">
                                    <input type="file" multiple :name="uploadAlbumFieldName" :id="uploadAlbumFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="upload-photos">
                                    <label :for=uploadAlbumFieldName>
                                      <template v-if="isSaving">
                                      Uploading...
                                      </template>
                                      <template v-if="isInitial">
                                      Add photos
                                      </template>
                                    </label>
                                </form>
                              </v-flex>
                            </v-layout>
                          <v-divider></v-divider>
                          <v-container grid-list-md fluid>
                          <v-layout row wrap>
                            <v-flex
                              v-for="(photo, key) in album"
                              :key="key"
                              xl2
                              lg3
                              xs4
                            >
                              <v-card flat tile>
                                <v-card-media
                                  height="200px"
                                >
                                  <img @click="viewPhoto(key, photo.name)" class="photo text-xs-center" :src=photo.photo>
                                </v-card-media>
                              </v-card>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </template>
                      </v-flex>
                </v-card-text>
                <v-divider></v-divider>
                <template v-if="album.length > 0">
                  <v-dialog v-model="displayPhoto" max-width="1000px">
                      <v-card dark>
                        <v-toolbar condensed card dark color="primary">
                          <v-btn icon dark @click.native="displayPhoto=false">
                            <v-icon>close</v-icon>
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn v-if="isSelfViewing" color="error" @click="deletePhoto"><v-icon left>delete</v-icon> delete</v-btn>
                        </v-toolbar>
                        <v-layout row wrap justify-center align-center>
                          <v-flex xs2 md2 justify-left>
                            <v-btn color="primary" icon small @click="previousPhoto" ><v-icon>navigate_before</v-icon></v-btn>
                          </v-flex>
                          <v-flex xs8 md8>
                            <v-card-text>
                              <img class="view-photo" :src=album[viewPhotoIndex].photo>
                            </v-card-text>
                          </v-flex>
                          <v-flex xs2 md2>
                            <v-btn color="primary" icon small @click="nextPhoto"><v-icon>navigate_next</v-icon></v-btn>
                          </v-flex>
                        </v-layout>
                      </v-card>
                  </v-dialog>
                </template>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
     <app-footer></app-footer>
</main>
</template>

<script>
import { getProfile, isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'
import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
  data () {
    return {
      displayPhoto: false,
      rowsPerPageItems: [12],
      pagination: {
        rowsPerPage: 12
      },
      isSelfViewing: false,
      isActorViewing: false,
      isAgentViewing: false,
      isDirectorViewing: false,
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
      album: [],
      profile: {
        userId: '',
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
        biography: '',
        agent: ''
      },
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos',
      uploadAlbumFieldName: 'album',
      viewPhotoIndex: 0,
      viewerProfile: '',
      requestSentAlert: false,
      doubleRequestAlert: false,
      viewerRepsThisActor: false,
      cancelRepSuccessAlert: false,
      cancelRepFailAlert: false
    }
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  mounted () {
    this.fetchActor(this.$route.params.username)
    this.reset()
    this.viewerProfile = getProfile()
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  methods: {
    fetchAgentActors () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      return Axios.get(`${CastingComplexAPI}/agents/${this.viewerProfile.id}/actors`, config).then(res => {
        return res.data.data
      }).catch(e => {
        console.log(e)
      })
    },
    defineViewer () {
      if (this.viewerProfile.user.id !== this.profile.userId) {
        this.isSelfViewing = false

        if (isActor()) {
          this.isActorViewing = true
        }
        if (isAgent()) {
          this.isAgentViewing = true
          // get agents actors and see if this is one of them
          this.fetchAgentActors().then(actors => {
            for (let actor of actors) {
              if (actor.id === this.profile.id) this.viewerRepsThisActor = true
            }
          })
        }
        if (isDirector()) this.isDirectorViewing = true
      } else {
        this.isSelfViewing = true
      }
      console.log('Is self viewing: ' + this.isSelfViewing)
      console.log('Is actor viewing: ' + this.isActorViewing)
      console.log('Is director viewing: ' + this.isDirectorViewing)
      console.log('Is agent viewing: ' + this.isAgentViewing)
    },
    cancelRep () {
      if (!confirm('Are you sure you want to cancel representation with this actor?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      const url = `${CastingComplexAPI}/agents/${this.viewerProfile.id}/actors/${this.profile.id}`
      return Axios.delete(url, config)
        .then(res => {
          console.log(res)
          this.cancelRepSuccessAlert = true
          this.profile.isRepped = false
          this.viewerRepsThisActor = false
        })
        .catch(err => {
          console.log(err.response)
          this.cancelRepFailAlert = true
        })
    },
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
          this.profile.userId = profile.userId
          this.profile.avatar = profile.user.avatar
          this.profile.id = profile.id

          if (this.profile.isRepped) {
            this.profile.agent = profile.agent
          }
          console.log(JSON.stringify(this.profile.agent))

          this.getProfilePic()
          this.defineViewer()
          this.fetchAlbum()
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
    getProfilePic () {
      this.fetchAvatar().then(src => {
        this.profilePic = src
      })
    },
    fetchAvatar () {
      return Axios.get(`${CastingComplexAPI}/users/${this.profile.userId}/photos/profile`)
        .then((data) => {
          var src = 'data:image/jpeg;base64,' + data.data.avatar
          return src
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchAlbum () {
      Axios.get(`${CastingComplexAPI}/users/${this.profile.userId}/photos`)
        .then((data) => {
          this.album = data.data.album.map(function (p) {
            return { photo: 'data:image/jpeg;base64,' + p.photo, name: p.name }
          })
        }).catch((err) => {
          console.log(err)
        })
    },
    showInfo () {
      this.toggleInfo = true
    },
    showAlbum () {
      this.toggleInfo = false
    },
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    wait (ms) {
      return (x) => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms))
      }
    },
    save (formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING

      this.upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
          this.getProfilePic()
        })
        .catch(err => {
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
          console.log(err)
        })
    },
    saveAlbum (formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING

      this.uploadAlbum(formData)
        .then(this.wait(2500))
        .then(x => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
          this.reset()
          this.fetchAlbum()
        })
        .catch(err => {
          this.albumUploadError = err.response
          this.currentStatus = STATUS_FAILED
          console.log(err)
          this.reset()
        })
    },
    uploadAlbum (formData) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      const url = `${CastingComplexAPI}/users/photos`
      return Axios.post(url, formData, config)
        .then(x => console.log(x))
    },
    upload (formData) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      const url = `${CastingComplexAPI}/users/photos/profile`
      return Axios.post(url, formData, config)
        .then(x => console.log(x))
    },
    filesChange (fieldName, fileList) {
      console.log(fieldName)
      // handle file changes when uploading album photos
      const formData = new FormData()

      if (!fileList.length) return

      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })

      // save it
      this.saveAlbum(formData)
    },
    fileChange (fieldName, fileList) {
      // handle file changes when uploading profile pic
      const formData = new FormData()
      formData.append('avatar', fileList[0])
      this.save(formData)
    },
    viewPhoto (index, name) {
      console.log('Index is: ' + index)
      console.log('Name is: ' + name)
      this.viewPhotoIndex = index
      this.displayPhoto = true
    },
    nextPhoto () {
      var albumLength = this.album.length
      this.viewPhotoIndex + 1 === albumLength ? this.viewPhotoIndex = 0 : this.viewPhotoIndex += 1
    },
    previousPhoto () {
      var albumLength = this.album.length
      this.viewPhotoIndex === 0 ? this.viewPhotoIndex = albumLength - 1 : this.viewPhotoIndex -= 1
    },
    deletePhoto () {
      if (!confirm('Are you sure you want to delete this photo?')) return

      var data = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        },
        data: { photo_name: this.album[this.viewPhotoIndex].name }
      }
      Axios.delete(`${CastingComplexAPI}/users/${this.profile.userId}/photos`, data)
        .then((data) => {
          console.log(data)
          this.album.splice(this.viewPhotoIndex, 1)
          if (this.album.length === 0) {
            this.viewPhotoIndex = 0
            this.displayPhoto = false
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
    background-color: white !important;
  }

  .card-mod .card__text {

    padding: 0px !important;

  }

  .card__media img {
    box-shadow: 1px 1px 5px black !important;
    cursor: pointer !important;
  }

  .flexbar {
    margin-top: -50px!important;
    border-bottom: solid 1px #e4e4e4 !important;
    background-color: white !important;
    max-height:50px !important;
    height: 50px !important;
  }

  .toolbar__content {
    height: 50px !important;
  }

  .flexbar-items {
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

  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .input-file + label {
    text-align: center;
    width: 100%;
    font-size: 1.25em;
    font-weight: 700;
    display: inline-block;
    cursor: pointer !important; /* "hand" cursor */
  }

   .upload-photos {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .upload-photos + label {
    font-size: 1.00em;
    font-weight: 700;
    color: white;
    padding: 10px 10px;
    border-radius: 5px;
    background-color: #085f89;
    display: inline-block;
    cursor: pointer;
    z-index: 999999999999999999999999;
  }

  .upload-photos + label:hover {
      background-color: #267297;
  }

  .dropbox {
    outline-offset: -10px;
    background: #085f89;
    color: white;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .dropbox:hover {
    background: #267297; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  div.gallery {
    width: 130px;
    height: 130px;
    overflow: hidden;
}

.photo {
  object-fit: cover;
}

  div.gallery > img {
    object-fit: cover;
    width: 130px;
    height: 130px;
    float: left;
    cursor: pointer !important;
  }

  .view-photo {
    max-width: 500px;
  }

  @media screen and (max-width: 600px){
    .view-photo {
      max-width: 200px;
    }
  }

</style>
