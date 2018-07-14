<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex md4 lg3 xl2>
              <v-card>
                <v-card-text>
                  <v-layout column>
                    <template v-if="isActor && breakdownRoles.length > 0">
                      <v-btn @click="openRequestAudition()" color="primary">
                        <v-icon left>send</v-icon> Request audition
                      </v-btn>
                      <h3 class="text-xs-center">or</h3>
                    </template>
                    <v-btn to="/job-board/" color="primary">
                      <v-icon left>work</v-icon> Go to job board
                    </v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md8 lg9 xl6>
              <v-card>
                <v-card-title primary-title>
                  <div class="same-line">
                    <h1 class="">
                      {{ breakdown.name }}
                    </h1>
                    <template v-if="breakdown.requiresUnion">
                        <v-chip color="error" text-color="white">Requires union</v-chip>
                    </template>
                  </div>
                </v-card-title>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex md12>
                        <v-alert transition="scale-transition" :value="requestSentNotification" type="success">
                          Your request was sent, good luck!
                          <v-btn flat color="white" @click.native="requestSentNotification = false">Close</v-btn>
                        </v-alert>
                        <v-alert transition="scale-transition" :value="duplicatedRequestNotification" type="error">
                          Oops, it seems you already requested an audition for this role. Check your requests!
                          <v-btn flat color="white" @click.native="duplicatedRequestNotification = false">Close</v-btn>
                        </v-alert>
                        <div>
                          <h2>Synopsis</h2>
                          <p>{{ breakdown.synopsis }}</p>
                        </div>
                        <div>
                          <h2>Storyline</h2>
                          <p>{{ breakdown.storyline }}</p>
                        </div>
                        <div>
                          <h2>Rates</h2>
                          <p>{{ breakdown.rates }}</p>
                        </div>
                        <div>
                          <h2>Comments</h2>
                          <p>{{ breakdown.comments }}</p>
                        </div>
                        <div>
                          <h2>Casting director</h2>
                          <p>{{ breakdown.directorName }}</p>
                        </div>
                        <div>
                          <h2>Contact</h2>
                          <p>{{ breakdown.contact }}</p>
                        </div>
                      </v-flex>
                      <v-flex md12>
                        <v-divider></v-divider>
                        <h2>Roles</h2>
                        <v-data-iterator
                          :items="breakdownRoles"
                          :rows-per-page-items="rowsPerPageItems"
                          :pagination.sync="pagination"
                          content-tag="v-layout"
                          row
                          wrap
                        >
                          <v-flex
                              slot="item"
                              slot-scope="props"
                              xs12
                              sm12
                              md12
                              lg12
                            >
                            <div class="same-line2">
                              <h4> Title: </h4>
                              <p>
                                {{ props.item.name }}
                              </p>
                            </div>
                            <div class="same-line2">
                              <h4> Age range: </h4>
                              <p>
                                {{ props.item.ageRange }}
                              </p>
                            </div>
                            <p> {{ props.item.description }} </p>
                          </v-flex>
                        </v-data-iterator>
                      </v-flex>
                      <v-flex md12>
                        <v-divider></v-divider>
                        <h2> Important dates </h2>
                      </v-flex>
                      <v-flex md6>
                        <v-layout column>
                          <v-flex md6>
                            <div>
                              <h4>Shooting starts</h4>
                              <p>{{ breakdown.shootingStartsWhenFormatted }}</p>
                            </div>
                          </v-flex>
                          <v-flex md6>
                            <div>
                              <h4>Shooting ends</h4>
                              <p>{{ breakdown.shootingEndsWhenFormatted }}</p>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex md6>
                        <v-layout column>
                          <v-flex md6>
                            <div>
                              <h4>Submission deadline</h4>
                              <p>{{ breakdown.submissionDeadlineFormatted }}</p>
                            </div>
                          </v-flex>
                          <v-flex md6>
                            <div>
                              <h4>Callbacks</h4>
                              <p>{{ breakdown.callbackDateFormatted }}</p>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex md12>
                        <v-alert transition="scale-transition" :value="requestSentNotification" type="success">
                          Your request was sent, good luck!
                          <v-btn flat color="white" @click.native="requestSentNotification = false">Close</v-btn>
                        </v-alert>
                        <v-alert transition="scale-transition" :value="duplicatedRequestNotification" type="error">
                          Oops, it seems you already requested an audition for this role. Check your requests!
                          <v-btn flat color="white" @click.native="duplicatedRequestNotification = false">Close</v-btn>
                        </v-alert>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="openRequestAudition()" v-if="isActor && breakdownRoles.length > 0" color="primary">
                      <v-icon left>send</v-icon> Request audition
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!ownsBreakdown" @click="sendMessageDialog()" block color="primary">
                      <v-icon left>message</v-icon> Message the casting director
                    </v-btn>
                  </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
          <v-dialog v-model="requestAudition" max-width="400px">
            <v-card>
              <v-card-title primary-title>
                  <h1> Request audition </h1>
              </v-card-title>
              <v-card-text>
                <v-divider></v-divider>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-layout row wrap justify-center>
                    <v-flex md12>
                      <v-select
                        :items="breakdownRoles"
                        v-model="selectedRoleId"
                        :rules="[v => !!v || 'Item is required']"
                        label="Select role"
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        persistent-hint
                      ></v-select>
                      <v-text-field
                        v-model="form.comments"
                        label="Additional comments"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block @click="submitAuditionRequest()" color="primary">
                  <v-icon left>send</v-icon> Send request
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-content>
    <send-message-dialog></send-message-dialog>
    <app-footer></app-footer>
  </main>
</template>

<script>
import Axios from 'axios'
import { getProfile, isLoggedIn, isActor } from '@/components/authentication'
import {bus} from '../../main'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  beforeMount () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
    this.fetchBreakdown()
    this.fetchBreakdownRoles()
    this.getExtras()
    this.actorProfile = getProfile()
  },
  data () {
    return {
      requestSentNotification: false,
      duplicatedRequestNotification: false,
      requestAudition: false,
      valid: '',
      isActor: isActor(),
      search: '',
      rowsPerPageItems: [10],
      pagination: {
        rowsPerPage: 10
      },
      breakdown: '',
      breakdownRoles: [],
      MediaTypes: [],
      searchQuery: {
        requiresUnion: false
      },
      actorProfile: {},
      form: {
        comments: ''
      },
      selectedRoleId: '',
      directorUsername: '',
      ownsBreakdown: ''
    }
  },
  mounted () {
  },
  methods: {
    sendMessageDialog () {
      console.log(this.ownsBreakdown)
      var data = {fromUser: this.actorProfile.user.username, toUser: this.directorUsername}
      bus.$emit('open_message_dialog', data)
    },
    fetchCastingDirectorById (id) {
      return Axios.get(`${CastingComplexAPI}/castingdirectors/${id}/`).then(response => {
        return response
      }).catch(err => {
        console.log(err)
      })
    },
    submitAuditionRequest () {
      if (!this.$refs.form.validate()) { return }

      var url = `${CastingComplexAPI}/breakdowns/${this.breakdown.id}/roles/${this.selectedRoleId}/requests`
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      this.form.ActorId = this.actorProfile.id

      Axios.post(url, this.form, config).then(response => {
        this.requestAudition = false
        this.requestSentNotification = true
      })
        .catch(error => {
          if (error.response.data.error === 'Duplicated request') {
            this.duplicatedRequestNotification = true
          }
          this.requestAudition = false
        })
    },
    openRequestAudition () {
      this.requestAudition = true
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    fetchBreakdownRoles () {
      Axios.get(`${CastingComplexAPI}/breakdowns/${this.$route.params.breakdown_id}/roles`).then(response => {
        this.breakdownRoles = response.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    fetchBreakdown () {
      Axios.get(`${CastingComplexAPI}/breakdowns/${this.$route.params.breakdown_id}`).then(response => {
        this.breakdown = response.data.data
        this.breakdown.shootingStartsWhenFormatted = this.formatDate(this.breakdown.shootingStartsWhen)
        this.breakdown.shootingEndsWhenFormatted = this.formatDate(this.breakdown.shootingEndsWhen)
        this.breakdown.submissionDeadlineFormatted = this.formatDate(this.breakdown.submissionDeadline)
        this.breakdown.callbackDateFormatted = this.formatDate(this.breakdown.callbackDate)
        this.fetchCastingDirectorById(this.breakdown.CastingDirectorId).then(director => {
          this.directorUsername = director.data.data.user.username
          this.ownsBreakdown = this.actorProfile.user.username === this.directorUsername
        })
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    getExtras (context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.MediaTypes = data.data.data['AgencyDivision']
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
  .same-line h1,
  .same-line p {
    display: inline !important;
  }
  .same-line2 h4,
  .same-line2 p {
    display: inline !important;
  }
</style>
