<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row justify-center>
            <v-flex xs12 md12 lg8 xl8>
                <v-card class="">
                  <v-card-title primary-title>
                    <v-breadcrumbs divider="/">
                      <v-breadcrumbs-item
                        href="#/breakdowns"
                      >
                        <h1>Your breakdowns</h1>
                      </v-breadcrumbs-item>
                      <v-breadcrumbs-item
                      >
                        <h2>Manage breakdown: {{breakdown.name}}</h2>
                      </v-breadcrumbs-item>
                    </v-breadcrumbs>
                    <v-spacer></v-spacer>
                    <v-btn @click="deleteBreakdown()" flat color="error">
                      <v-icon small left>delete</v-icon> Delete
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-tabs
                      v-model="active"
                      color="white"
                      light
                      show-arrows
                      centered
                      slider-color="primary"
                    >
                      <v-tab ripple >
                        Scheduled auditions
                      </v-tab>
                      <v-tab ripple >
                        Audition requests
                      </v-tab>
                      <v-tab ripple >
                        Breakdown roles
                      </v-tab>
                      <v-tab-item>
                        <v-layout row wrap mt-3>
                          <v-flex md3 ml-2>
                            <v-text-field
                              v-model="search"
                              append-icon="search"
                              label="Search"
                              single-line
                              hide-details
                            ></v-text-field>
                          </v-flex>
                          <v-flex md12>
                            <v-data-table
                              :headers="headers"
                              :search="search"
                              :items="auditions"
                              :no-data-text="noAuditions"
                            >
                                <template slot="items" slot-scope="props">
                                <td>{{ props.item.project }}</td>
                                <td>{{ props.item.actorName }}</td>
                                <td>{{ props.item.address }}</td>
                                <td class="text-xs-left">{{ props.item.startsWhen }}</td>
                                <td>
                                <v-btn flat @click="editAudition(props.index, props.item)">
                                  <v-icon color="primary" left>visibility</v-icon> Edit/View
                                </v-btn>
                                </td>
                                <td>
                                <v-btn icon @click="cancelAudition(props.index, props.item)">
                                  <v-icon color="error">delete</v-icon>
                                </v-btn>
                              </td>
                              </template>
                              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                              </v-alert>
                            </v-data-table>
                          </v-flex>
                        </v-layout>
                      </v-tab-item>
                      <v-tab-item>
                        <v-layout row wrap mt-3 justify-space-around>
                            <v-flex
                              align-center
                              v-for="(request, index) in auditionRequests"
                              :key="index"
                              my-3
                              mx-2
                              xl3
                              >
                              <v-layout column>
                                <v-flex md12>
                                  <h3> {{ request.Actor.firstName + ' ' + request.Actor.lastName}} </h3>
                                  <v-avatar size="120px">
                                    <img class="actor-avatar" :src=request.actorPhoto />
                                  </v-avatar>
                                  <p>Role: {{ request.roleName }}</p>
                                </v-flex>
                                <v-flex md12>
                                  <v-btn :to="{ name: 'Actor profile', params: { username: request.username }}" block color="primary" small><v-icon left small>visibility</v-icon> view</v-btn>
                                </v-flex>
                                <v-flex d-flex md12>
                                    <v-btn @click="replyToRequest(index, request.roleId, request.id)" block color="primary" small><v-icon left small>reply</v-icon> Reply to request</v-btn>
                                </v-flex>
                              </v-layout>
                            </v-flex>
                            <v-flex md12>
                              <v-alert transition="scale-transition" :value="replySentAlert" type="success">
                                Your reply was sent!
                                <v-btn flat color="white" @click.native="replySentAlert = false">Close</v-btn>
                              </v-alert>
                            </v-flex>
                        </v-layout>
                      </v-tab-item>
                      <v-tab-item>
                        <v-layout row wrap mt-3>
                          <v-flex md12>
                            <v-data-table
                              :headers="headers2"
                              :items="breakdownRoles"
                              :no-data-text="noRoles"
                            >
                                <template slot="items" slot-scope="props">
                                  <td>{{ props.item.name }}</td>
                                <td>{{ props.item.description }}</td>
                                <td>{{ props.item.ageRange }}</td>
                                <td>
                                <v-btn flat icon @click="editRole(props.index, props.item)">
                                  <v-icon color="primary">edit</v-icon>
                                </v-btn>
                                <v-btn flat icon @click="deleteRole(props.index, props.item)">
                                  <v-icon color="error">delete</v-icon>
                                </v-btn>
                              </td>
                              </template>
                            </v-data-table>
                            <v-btn @click="openAddRoleDialog()" color="primary">Submit a new role</v-btn>
                            <v-alert transition="scale-transition" :value="publishedAlert" type="success">
                              Role was successfully published!
                              <v-btn flat color="white" @click.native="publishedAlert = false">Close</v-btn>
                            </v-alert>
                          </v-flex>
                        </v-layout>
                        <v-dialog persistent v-model="addRoleDialog" max-width="400px">
                          <v-card>
                            <v-card-title primary-title>
                              <template v-if="!isEditingRole">
                                <h1> Submit a new role for {{breakdown.name}} </h1>
                              </template>
                              <template v-if="isEditingRole">
                                <h1> Edit role </h1>
                              </template>
                            </v-card-title>
                            <v-card-text>
                              <v-divider></v-divider>
                              <v-form ref="form" v-model="valid" lazy-validation>
                                <v-layout row wrap justify-center>
                                  <v-flex md12>
                                    <v-text-field
                                      v-model="form.name"
                                      :rules="[v => !!v || 'Item is required']"
                                      label="Name"
                                      required
                                    ></v-text-field>
                                    <v-text-field
                                      v-model="form.description"
                                      :rules="[v => !!v || 'Item is required']"
                                      label="Description"
                                      required
                                    ></v-text-field>
                                    <v-text-field
                                      v-model="form.ageRange"
                                      :rules="[v => !!v || 'Item is required']"
                                      label="Age range"
                                      required
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex md12>
                                    <v-alert transition="scale-transition" :value="failedPublicationAlert" type="error">
                                      Oops, something went wrong, try again later!
                                      <v-btn flat color="white" @click.native="failedPublicationAlert=false">close</v-btn>
                                    </v-alert>
                                  </v-flex>
                                </v-layout>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="error"
                                v-if="!isEditingRole"
                                flat
                                @click.stop="addRoleDialog=false;
                                            publishedAlert = false;
                                            failedPublicationAlert=false;"
                              >
                                  Close
                              </v-btn>
                              <v-btn
                                color="error"
                                v-if="isEditingRole"
                                flat
                                @click.stop="cancelRoleEditing()"
                              >
                                  Close
                              </v-btn>
                              <v-btn
                                  v-if="!isEditingRole"
                                  :disabled="!valid"
                                  @click="submit"
                                  color="primary"
                                >
                                  submit
                                </v-btn>
                                <v-btn
                                  v-if="isEditingRole"
                                  :disabled="!valid"
                                  @click="updateRole"
                                  color="primary"
                                >
                                  Update
                                </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog persistent v-model="replyRequestDialog" max-width="400px">
                          <v-card>
                            <v-card-title primary-title>
                              <h1> Reply to request </h1>
                            </v-card-title>
                            <v-card-text>
                              <template v-if="!accepting">
                                <p><strong>Important!</strong></p>
                                <p>Clicking on decline will immediately decline the request, make sure of your decision before clicking on it!</p>
                                <p>By clicking on accept, you must also schedule an audition for this actor. But don't worry, this audition can be re-edited later.</p>
                              </template>
                              <template v-if="accepting">
                                <p>Provide the necessary information to schedule the audition. You can re-edit it later.</p>
                              </template>
                              <v-divider></v-divider>
                              <v-form ref="form" v-model="valid" lazy-validation>
                                <v-layout mt-3 row wrap justify-center>
                                  <v-flex md12>
                                    <v-layout v-if="!accepting" row wrap>
                                      <v-flex md6 class="text-xs-center">
                                        <v-btn @click="accepting=true" color="primary" dark>Accept
                                          <v-icon dark right>check_circle</v-icon>
                                        </v-btn>
                                      </v-flex>
                                      <v-flex md6 class="text-xs-center">
                                        <v-btn @click="answerAuditionRequest('reject')" color="red" dark>Decline
                                          <v-icon dark right>block</v-icon>
                                        </v-btn>
                                      </v-flex>
                                      </v-layout>
                                      <template v-if="accepting">
                                        <v-menu
                                          ref="dateMenu"
                                          :close-on-content-click="false"
                                          v-model="dateMenu"
                                          :nudge-right="40"
                                          lazy
                                          transition="scale-transition"
                                          offset-y
                                          full-width
                                          min-width="290px"
                                        >
                                          <v-text-field
                                            slot="activator"
                                            v-model="auditionForm.startsWhenFormatted"
                                            label="Date"
                                            hint="MM/DD/YYYY format"
                                            :rules="[v => !!v || 'Item is required']"
                                            persistent-hint
                                            @blur="auditionForm.startsWhen = parseDate(auditionForm.startsWhenFormatted)"
                                          ></v-text-field>
                                          <v-date-picker v-model="auditionForm.startsWhen" @input="dateMenu=false"></v-date-picker>
                                        </v-menu>
                                        <v-menu
                                          ref="dateMenu2"
                                          :close-on-content-click="false"
                                          v-model="dateMenu2"
                                          :nudge-right="40"
                                          :return-value.sync="auditionForm.time"
                                          lazy
                                          transition="scale-transition"
                                          offset-y
                                          full-width
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <v-text-field
                                            slot="activator"
                                            v-model="auditionForm.time"
                                            label="Time"
                                            readonly
                                          ></v-text-field>
                                          <v-time-picker v-model="auditionForm.time" @change="$refs.dateMenu2.save(auditionForm.time)"></v-time-picker>
                                        </v-menu>
                                        <v-text-field
                                          v-model="auditionForm.address"
                                          :rules="[v => !!v || 'Item is required']"
                                          label="Audition location"
                                          required
                                        ></v-text-field>
                                        <v-text-field
                                          v-model="auditionForm.comments"
                                          label="Comments"
                                        ></v-text-field>
                                      </template>
                                  </v-flex>
                                </v-layout>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn @click="cancelReplyDialog()" flat color="error">
                                cancel
                              </v-btn>
                              <v-btn v-if="accepting" @click="acceptAndSchedule()" flat color="primary">
                                Accept and schedule
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog persistent v-model="editAuditionDialog" max-width="400px">
                          <v-card>
                            <v-card-title primary-title>
                              <h1> View/edit schedule </h1>
                            </v-card-title>
                            <v-card-text>
                              <v-divider></v-divider>
                              <v-form ref="form" v-model="valid" lazy-validation>
                                <v-layout mt-3 row wrap justify-center>
                                  <v-flex md12>
                                        <v-menu
                                          ref="dateMenuEditAudition"
                                          :close-on-content-click="false"
                                          v-model="dateMenuEditAudition"
                                          :nudge-right="40"
                                          lazy
                                          transition="scale-transition"
                                          offset-y
                                          full-width
                                          min-width="290px"
                                        >
                                          <v-text-field
                                            slot="activator"
                                            v-model="auditionForm.startsWhenFormatted"
                                            label="Date"
                                            hint="MM/DD/YYYY format"
                                            :rules="[v => !!v || 'Item is required']"
                                            persistent-hint
                                            @blur="auditionForm.startsWhen = parseDate(auditionForm.startsWhenFormatted)"
                                          ></v-text-field>
                                          <v-date-picker v-model="auditionForm.startsWhen" @input="dateMenuEditAudition=false"></v-date-picker>
                                        </v-menu>
                                        <v-menu
                                          ref="dateMenuEditAudition2"
                                          :close-on-content-click="false"
                                          v-model="dateMenuEditAudition2"
                                          :nudge-right="40"
                                          :return-value.sync="auditionForm.time"
                                          lazy
                                          transition="scale-transition"
                                          offset-y
                                          full-width
                                          max-width="290px"
                                          min-width="290px"
                                        >
                                          <v-text-field
                                            slot="activator"
                                            v-model="auditionForm.time"
                                            label="Time"
                                            readonly
                                          ></v-text-field>
                                          <v-time-picker v-model="auditionForm.time" @change="$refs.dateMenuEditAudition2.save(auditionForm.time)"></v-time-picker>
                                        </v-menu>
                                        <v-text-field
                                          v-model="auditionForm.address"
                                          :rules="[v => !!v || 'Item is required']"
                                          label="Audition location"
                                          required
                                        ></v-text-field>
                                        <v-text-field
                                          v-model="auditionForm.comments"
                                          label="Comments"
                                        ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn @click="cancelEditAudition()" flat color="error">
                                cancel
                              </v-btn>
                              <v-btn  @click="updateAudition()" flat color="primary">
                                Update audition
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
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
// import { isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'
import Axios from 'axios'
import _ from 'lodash'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      dateMenuEditAudition2: '',
      dateMenuEditAudition: '',
      dateMenu: '',
      dateMenu2: '',
      auditionForm: {
        address: '',
        comments: '',
        startsWhen: '',
        endsWhen: '',
        startsWhenFormatted: '',
        endsWhenFormatted: '',
        time: null,
        id: ''
      },
      accepting: '',
      replySentAlert: false,
      active: '',
      valid: '',
      search: '',
      publishedAlert: false,
      failedPublicationAlert: false,
      headers: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'project'
      },
      { text: 'Actor', value: 'actorName' },
      { text: 'Address', value: 'address' },
      { text: 'Date', value: 'startsWhen' }],
      headers2: [{
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Description',
        sortable: false,
        value: 'description'
      },
      { text: 'Age range', value: 'ageRange' },
      { text: 'Edit | Delete', value: 'delete' }],
      noRoles: 'No added roles',
      noAuditions: 'No scheduled auditions',
      directorId: '',
      breakdown: '',
      addRoleDialog: '',
      isEditingRole: false,
      breakdownRoles: [],
      auditions: [],
      auditionRequests: [],
      form: {
        name: '',
        description: '',
        ageRange: ''
      },
      roleBeingEdited: '',
      replyingRequest: {
        roleId: '',
        reqId: '',
        idx: ''
      },
      replyRequestDialog: false,
      editAuditionDialog: false,
      auditionBeingEdited: ''
    }
  },
  watch: {
    'auditionForm.startsWhen': function (val) {
      this.auditionForm.startsWhenFormatted = this.formatDate(this.auditionForm.startsWhen)
    },
    'auditionForm.endsWhen': function (val) {
      this.auditionForm.endsWhenFormatted = this.formatDate(this.auditionForm.endsWhen)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    deleteRole (index, role) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      const url = `${CastingComplexAPI}/breakdowns/${this.breakdown.id}/roles/${role.id}`
      Axios.delete(url, config).then(response => {
        this.breakdownRoles.splice(index, 1)
      })
        .catch(err => {
          console.log(err)
        })
    },
    deleteBreakdown () {
      if (confirm('Are you sure you want to delete this breakdown?')) {
        var config = {
          headers: {
            'x-access-token': localStorage.getItem('session_token'),
            'Content-Type': undefined
          }
        }
        const url = `${CastingComplexAPI}/breakdowns/${this.breakdown.id}`
        Axios.delete(url, config).then(response => {
          return this.$router.push('/breakdowns')
        })
          .catch(err => {
            console.log(err)
          })
      }
    },
    updateRole () {
      var diff = _.reduce(this.form, (result, value, key) => {
        return _.isEqual(value, this.breakdownRoles[this.roleBeingEdited][key]) ? result : result.concat(key)
      }, [])

      if (diff.length === 0) return

      // Filter form to send only the modified fields
      var finalForm = _.pick(this.form, _(this.form).keys().filter(function (key) {
        return _.includes(diff, key)
      }).value())

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      const url = `${CastingComplexAPI}/breakdowns/${this.breakdown.id}/roles/${this.breakdownRoles[this.roleBeingEdited].id}`

      Axios.put(url, finalForm, config).then(response => {
        this.breakdownRoles.splice(this.roleBeingEdited, 1, response.data.data)
        this.isEditingRole = false
        this.roleBeingEdited = ''
        this.addRoleDialog = false
        this.$refs.form.reset()
      })
        .catch(err => {
          console.log(err)
        })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async cancelRoleEditing () {
      this.addRoleDialog = false
      this.publishedAlert = false
      this.failedPublicationAlert = false
      this.isEditingRole = false
      await this.sleep(200)
      this.$refs.form.reset()
    },
    editRole (index, role) {
      var originalFields = Object.keys(this.form)
      var toCopy = _.pick(role, _(role).keys().filter(function (key) {
        return _.includes(originalFields, key)
      }).value())
      this.form = _.clone(toCopy)
      this.isEditingRole = true
      this.roleBeingEdited = index
      this.addRoleDialog = true
    },
    fetchBreakdownRoles (breakdownId) {
      Axios.get(`${CastingComplexAPI}/breakdowns/${breakdownId}/roles`).then(response => {
        this.breakdownRoles = response.data.data
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    submit () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.post(`${CastingComplexAPI}/breakdowns/${this.breakdown.id}/roles`, this.form, config).then(res => {
        this.$refs.form.reset()
        this.publishedAlert = true
        this.breakdownRoles.unshift(res.data.data)
        this.addRoleDialog = false
      })
        .catch(error => {
          console.log(error)
        })
    },
    openAddRoleDialog () {
      this.addRoleDialog = true
    },
    fetchBreakdown (breakdownId) {
      return Axios.get(`${CastingComplexAPI}/breakdowns/${breakdownId}`).then(response => {
        return response.data.data
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    fetchActorProfilePic (actorId, idx) {
      Axios.get(`${CastingComplexAPI}/users/${actorId}/photos/profile`)
        .then((data) => {
          var src = 'data:image/jpeg;base64,' + data.data.avatar
          this.auditionRequests[idx].actorPhoto = src
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchAuditionRequest (breakdownId) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      Axios.get(`${CastingComplexAPI}/breakdowns/${breakdownId}/requests`, config).then(response => {
        var tempRequests = response.data

        this.auditionRequests = tempRequests.filter(r => r.isScheduled === false)
        for (var [idx, request] of this.auditionRequests.entries()) {
          this.fetchActorProfilePic(request.Actor.id, idx)
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    answerAuditionRequest (answer) {
      var roleId = this.replyingRequest.roleId
      var reqId = this.replyingRequest.reqId

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      var url = `${CastingComplexAPI}/breakdowns/${this.$route.params.breakdown_id}/roles/${roleId}/requests/${reqId}/answer`

      var data = {accepts: answer === 'accept'}

      Axios.post(url, data, config).then(res => {
        if (!data.accepts) this.auditionRequests.splice(this.replyingRequest.idx, 1)
        this.closeReplyDialog(data.accepts)
      })
        .catch(error => {
          console.log(error.response)
        })
    },
    scheduleAudition (form) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      var url = `${CastingComplexAPI}/breakdowns/${this.$route.params.breakdown_id}/auditions`

      Axios.post(url, form, config).then(res => {
        this.auditions.push(res.data.data)
      })
        .catch(error => {
          console.log(error.response)
        })
    },
    replyToRequest (index, roleId, reqId) {
      this.replyingRequest.roleId = roleId
      this.replyingRequest.reqId = reqId
      this.replyingRequest.idx = index
      this.replyRequestDialog = true
    },
    closeReplyDialog (wasAccepted) {
      // Reset everything just in case
      this.auditionForm.comments = ''
      this.auditionForm.address = ''
      this.auditionForm.startsWhen = ''
      this.auditionForm.startsWhenFormatted = ''
      this.auditionForm.time = null
      this.auditionForm.id = ''
      this.replyingRequest.roleId = ''
      this.replyingRequest.reqId = ''
      this.replyingRequest.idx = ''
      this.replyRequestDialog = false
      this.replySentAlert = true
      this.accepting = false
    },
    convertTime12to24 (time12h) {
      const [time, modifier] = time12h.trim().split(' ')

      let [hours, minutes] = time.split(':')

      if (hours === '12') {
        hours = '00'
      }

      if (modifier === 'pm') {
        hours = parseInt(hours, 10) + 12
      }

      return hours + ':' + minutes
    },
    cancelReplyDialog () {
      this.replyingRequest.roleId = ''
      this.replyingRequest.reqId = ''
      this.replyRequestDialog = false
      this.accepting = false
    },
    cancelAudition (index, audition) {
      if (!confirm('Are you sure you want to cancel this audition?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      var breakdownId = this.$route.params.breakdown_id

      var url = `${CastingComplexAPI}/breakdowns/${breakdownId}/auditions/${audition.id}`

      Axios.delete(url, config).then(response => {
        this.auditions.splice(index, 1)
      })
        .catch(err => {
          console.log(err)
        })
    },
    updateAudition () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      var finalForm = {}
      finalForm.comments = this.auditionForm.comments
      finalForm.address = this.auditionForm.address

      // -07:00 is for the local America/Vancouver time. Bugs might arise from this...
      finalForm.endsWhen = this.auditionForm.startsWhen + 'T' + this.auditionForm.time + '-07:00'
      finalForm.startsWhen = this.auditionForm.startsWhen + 'T' + this.auditionForm.time + '-07:00'

      var breakdownId = this.$route.params.breakdown_id

      var url = `${CastingComplexAPI}/breakdowns/${breakdownId}/auditions/${this.auditionForm.id}`

      // send this final form to the put endpoint
      Axios.put(url, finalForm, config).then(response => {
        this.auditions.splice(this.auditionBeingEdited, 1, response.data.data)
        this.cancelEditAudition()
      })
        .catch(err => {
          console.log(err)
        })
      // get the returning new audition, update the audition list
    },
    async cancelEditAudition () {
      this.editAuditionDialog = false
      await this.sleep(1000)
      this.auditionForm.comments = ''
      this.auditionForm.address = ''
      this.auditionForm.startsWhen = ''
      this.auditionForm.startsWhenFormatted = ''
      this.auditionForm.time = null
      this.auditionForm.id = ''
      this.auditionBeingEdited = ''
    },
    editAudition (index, audition) {
      this.auditionForm.address = audition.address
      this.auditionForm.comments = audition.comments

      var dateAndTime = audition.startsWhen.split(',')

      dateAndTime[0] = dateAndTime[0].replace('th', '')
      dateAndTime[0] = dateAndTime[0].replace('st', '')
      dateAndTime[0] = dateAndTime[0].replace('nd', '')
      dateAndTime[0] = dateAndTime[0].replace('rd', '')

      // Weird trick
      this.auditionForm.startsWhen = new Date(Date.parse(dateAndTime[0])).toISOString().split('T')[0]

      this.auditionForm.time = this.convertTime12to24(dateAndTime[1])
      this.auditionForm.id = audition.id

      this.editAuditionDialog = true
      this.auditionBeingEdited = index
    },
    acceptAndSchedule () {
      var finalForm = {}
      finalForm.comments = this.auditionForm.comments
      finalForm.address = this.auditionForm.address

      // -07:00 is for the local America/Vancouver time. Bugs might arise from this...
      finalForm.endsWhen = this.auditionForm.startsWhen + 'T' + this.auditionForm.time + '-07:00'
      finalForm.startsWhen = this.auditionForm.startsWhen + 'T' + this.auditionForm.time + '-07:00'
      finalForm.auditionRequestId = this.replyingRequest.reqId

      this.answerAuditionRequest('accept')
      this.scheduleAudition(finalForm)
      this.auditionRequests.splice(this.replyingRequest.idx, 1)
    },
    fetchAuditions (breakdownId) {
      Axios.get(`${CastingComplexAPI}/breakdowns/${breakdownId}/auditions`).then(response => {
        this.auditions = response.data.data
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  beforeMount () {
    if (localStorage.getItem('logged_profile')) {
      this.directorId = JSON.parse(localStorage.getItem('logged_profile')).id
      if (!this.directorId) {
        return this.$router.push('/')
      }
    } else {
      return this.$router.push('/')
    }
  },
  mounted () {
    this.fetchBreakdown(this.$route.params.breakdown_id).then(breakdown => {
      if (breakdown.CastingDirectorId !== this.directorId) {
        return this.$router.push('*')
      }
      this.breakdown = breakdown
      this.fetchBreakdownRoles(breakdown.id)
      this.fetchAuditionRequest(breakdown.id)
      this.fetchAuditions(breakdown.id)
    }).catch(e => {
      return this.$router.push('*')
    })
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

  .actor-avatar {
    object-fit: cover !important;
    cursor: pointer !important;
  }
</style>
