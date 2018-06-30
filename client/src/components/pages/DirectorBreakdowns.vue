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
                    </v-breadcrumbs>
                    <v-spacer></v-spacer>
                    <v-btn :to="{name: 'Search actor'}" color="primary">
                      <v-icon left>search</v-icon>
                      Search actors
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-divider></v-divider>
                      <v-data-iterator
                        :items="directorBreakdowns"
                        :rows-per-page-items="rowsPerPageItems"
                        :pagination.sync="pagination"
                        content-tag="v-layout"
                        row
                        wrap
                      >
                        <v-flex md4 pa-2 slot="item" slot-scope="props">
                          <v-card>
                            <v-card-title primary-title>
                              <h3>{{ props.item.name }}</h3>
                            </v-card-title>
                            <v-card-text>
                              {{ props.item.synopsis.substring(0,250) }}
                            </v-card-text>
                            <v-card-actions>
                              <v-btn @click="edit(props.index, props.item)" flat color="primary">
                                <v-icon left small>edit</v-icon> Edit
                              </v-btn>
                              <v-btn :to="getManageLink(props.item.id)" flat color="primary">
                                <v-icon left small>people</v-icon> Manage
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-flex>
                      </v-data-iterator>
                      <v-alert transition="scale-transition" :value="publishedAlert" type="success">
                        Breakdown was successfully published!
                        <v-btn flat color="white" @click.native="publishedAlert = false">Close</v-btn>
                      </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="openAddBreakdownDialog()" color="primary">Submit a new breakdown</v-btn>
                  </v-card-actions>
                </v-card>
            </v-flex>
          </v-layout>
      </v-container>
      <v-dialog persistent v-model="addBreakdownDialog" max-width="1000px">
        <v-card>
          <v-card-title primary-title>
            <template v-if="!isEditingBreakdown">
              <h1> Submit a new breakdown </h1>
            </template>
            <template v-if="isEditingBreakdown">
              <h1> Edit breakdown </h1>
            </template>
            <p>Fill all required fields to publish your breakdown. Upon submission, it will be available to all actors, agents, and director on the <a>job board</a>. After submission, you can edit the breakdown by clicking on <em> edit </em> that will be on the recently added breakdown on your <a>breakdown page</a> and you can manage the roles, actors, and auditions by clicking on <em>manage</em>.</p>
            <v-divider></v-divider>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-layout row wrap justify-center>
                <v-flex md5 mx-4>
                  <v-text-field
                    v-model="form.name"
                    :rules="[v => !!v || 'Item is required']"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="form.rates"
                    :rules="[v => !!v || 'Item is required']"
                    label="Rates"
                    required
                  ></v-text-field>
                  <v-select
                    autocomplete
                    :items="MediaTypes"
                    item-text="name"
                    item-value="id"
                    v-model="form.mediaTypeId"
                    :rules="[v => !!v || 'Item is required']"
                    label="Media type"
                    required
                  ></v-select>
                  <v-menu
                    ref="dateMenu1"
                    :close-on-content-click="false"
                    v-model="dateMenu1"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.submissionDeadlineFormatted"
                      label="Submission deadline"
                      hint="MM/DD/YYYY format"
                      :rules="[v => !!v || 'Item is required']"
                      @blur="form.submissionDeadline = parseDate(form.submissionDeadlineFormatted)"
                      persistent-hint
                    ></v-text-field>
                    <v-date-picker v-model="form.submissionDeadline" @input="dateMenu1=false"></v-date-picker>
                  </v-menu>
                  <v-menu
                    ref="dateMenu2"
                    :close-on-content-click="false"
                    v-model="dateMenu2"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.shootingStartsWhenFormatted"
                      label="Shooting starts when?"
                      hint="MM/DD/YYYY format"
                      :rules="[v => !!v || 'Item is required']"
                      persistent-hint
                      @blur="form.shootingStartsWhen = parseDate(form.shootingStartsWhenFormatted)"
                    ></v-text-field>
                    <v-date-picker v-model="form.shootingStartsWhen" @input="dateMenu2=false"></v-date-picker>
                  </v-menu>
                  <v-menu
                    ref="dateMenu3"
                    :close-on-content-click="false"
                    v-model="dateMenu3"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.shootingEndsWhenFormatted"
                      label="Shooting ends when?"
                      hint="MM/DD/YYYY format"
                      :rules="[v => !!v || 'Item is required']"
                      persistent-hint
                      @blur="form.shootingEndsWhen = parseDate(form.shootingEndsWhenFormatted)"
                    ></v-text-field>
                    <v-date-picker v-model="form.shootingEndsWhen" @input="dateMenu3=false"></v-date-picker>
                  </v-menu>
                  <v-menu
                    ref="dateMenu4"
                    :close-on-content-click="false"
                    v-model="dateMenu4"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.callbackDateFormatted"
                      label="Callback date"
                      :rules="[v => !!v || 'Item is required']"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      @blur="form.callbackDate = parseDate(form.callbackDateFormatted)"
                    ></v-text-field>
                    <v-date-picker v-model="form.callbackDate" @input="dateMenu4=false"></v-date-picker>
                  </v-menu>
                  <v-text-field
                    v-model="form.contact"
                    :rules="[v => !!v || 'Item is required']"
                    label="Contact"
                    hint="Briefly give directions on how to contact you"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md5 mx-4>
                  <v-text-field
                    v-model="form.citiesForTransmission"
                    :rules="[v => !!v || 'Item is required']"
                    label="Cities for transmission"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="form.synopsis"
                    multi-line
                    :rules="[v => !!v || 'Item is required']"
                    rows=2
                    label="Short synopsis"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.storyline"
                    multi-line
                    label="Storyline"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.comments"
                    multi-line
                    label="Comments"
                    rows=2
                  ></v-text-field>
                  <v-checkbox
                    v-model="form.requiresUnion"
                    label="Does it require union?"
                  ></v-checkbox>
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
              v-if="!isEditingBreakdown"
              flat
              @click.stop="addBreakdownDialog=false;
                           publishedAlert = false;
                           failedPublicationAlert=false;"
             >
                Close
             </v-btn>
             <v-btn
              color="error"
              v-if="isEditingBreakdown"
              flat
              @click.stop="cancelEditing()"
             >
                Close
             </v-btn>
             <v-btn
                v-if="!isEditingBreakdown"
                :disabled="!valid"
                @click="submit"
                color="primary"
              >
                submit
              </v-btn>
              <v-btn
                v-if="isEditingBreakdown"
                :disabled="!valid"
                @click="updateBreakdown"
                color="primary"
              >
                Update
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      publishedAlert: false,
      failedPublicationAlert: false,
      dateMenu1: '',
      dateMenu2: '',
      dateMenu3: '',
      dateMenu4: '',
      MediaTypes: [],
      form: {
        name: '',
        rates: '',
        requiresUnion: false,
        contact: '',
        citiesForTransmission: '',
        synopsis: '',
        storyline: '',
        comments: '',
        mediaTypeId: '',
        submissionDeadlineFormatted: '',
        submissionDeadline: '',
        shootingStartsWhenFormatted: '',
        shootingStartsWhen: '',
        shootingEndsWhenFormatted: '',
        shootingEndsWhen: '',
        callbackDateFormatted: '',
        callbackDate: ''
      },
      valid: true,
      addBreakdownDialog: false,
      rowsPerPageItems: [9],
      pagination: {
        rowsPerPage: 9
      },
      directorBreakdowns: [],
      isEditingBreakdown: false,
      breakdownBeingEdited: ''
    }
  },
  mounted () {
    var directorId = JSON.parse(localStorage.getItem('logged_profile')).id
    this.getExtras()
    this.fetchDirectorBreakdowns(directorId)
  },
  watch: {
    'form.submissionDeadline': function (val) {
      this.form.submissionDeadlineFormatted = this.formatDate(this.form.submissionDeadline)
    },
    'form.shootingStartsWhen': function (val) {
      this.form.shootingStartsWhenFormatted = this.formatDate(this.form.shootingStartsWhen)
    },
    'form.shootingEndsWhen': function (val) {
      this.form.shootingEndsWhenFormatted = this.formatDate(this.form.shootingEndsWhen)
    },
    'form.callbackDate': function (val) {
      this.form.callbackDateFormatted = this.formatDate(this.form.callbackDate)
    }
  },
  methods: {
    getManageLink (breakdownId) {
      return `/breakdowns/${breakdownId}/manage`
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async cancelEditing () {
      this.addBreakdownDialog = false
      this.publishedAlert = false
      this.failedPublicationAlert = false
      this.isEditingBreakdown = false
      await this.sleep(200)
      this.resetForm()
    },
    resetForm () {
      this.form.name = ''
      this.form.rates = ''
      this.form.requiresUnion = false
      this.form.contact = ''
      this.form.citiesForTransmission = ''
      this.form.synopsis = ''
      this.form.storyline = ''
      this.form.comments = ''
      this.form.mediaTypeId = ''
      this.form.submissionDeadlineFormatted = ''
      this.form.submissionDeadline = ''
      this.form.shootingStartsWhenFormatted = ''
      this.form.shootingStartsWhen = ''
      this.form.shootingEndsWhenFormatted = ''
      this.form.shootingEndsWhen = ''
      this.form.callbackDateFormatted = ''
      this.form.callbackDate = ''
    },
    updateBreakdown () {
      var diff = _.reduce(this.form, (result, value, key) => {
        return _.isEqual(value, this.directorBreakdowns[this.breakdownBeingEdited][key]) ? result : result.concat(key)
      }, [])

      // Select fields to update
      var fieldsToUpdate = diff.filter(k => !k.includes('Formatted'))

      if (fieldsToUpdate.length === 0) return

      // Filter form to send only the modified fields
      var finalForm = _.pick(this.form, _(this.form).keys().filter(function (key) {
        return _.includes(fieldsToUpdate, key)
      }).value())

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.put(`${CastingComplexAPI}/breakdowns/${this.directorBreakdowns[this.breakdownBeingEdited].id}`, finalForm, config).then(response => {
        this.directorBreakdowns.splice(this.breakdownBeingEdited, 1, response.data.data)
        this.isEditingBreakdown = false
        this.breakdownBeingEdited = ''
        this.addBreakdownDialog = false
        this.resetForm()
      })
        .catch(err => {
          console.log(err)
        })
    },
    edit (index, breakdown) {
      var originalFields = Object.keys(this.form)
      var toCopy = _.pick(breakdown, _(breakdown).keys().filter(function (key) {
        return _.includes(originalFields, key)
      }).value())
      this.form = _.clone(toCopy)
      this.form.shootingStartsWhenFormatted = this.formatDate(breakdown.shootingStartsWhen)
      this.form.shootingEndsWhenFormatted = this.formatDate(breakdown.shootingEndsWhen)
      this.form.submissionDeadlineFormatted = this.formatDate(breakdown.submissionDeadline)
      this.form.callbackDateFormatted = this.formatDate(breakdown.callbackDate)
      this.isEditingBreakdown = true
      this.breakdownBeingEdited = index
      this.addBreakdownDialog = true
    },
    fetchDirectorBreakdowns (directorId) {
      Axios.get(`${CastingComplexAPI}/breakdowns/directors/${directorId}`).then(response => {
        this.directorBreakdowns = response.data
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    openAddBreakdownDialog () {
      this.$refs.form.reset()
      this.addBreakdownDialog = true
    },
    submit () {
      if (this.$refs.form.validate() && !this.isEditingBreakdown) {
        console.log(JSON.stringify(this.form))
        this._submitBreakdown(this.form).then(res => {
          this.$refs.form.reset()
          this.publishedAlert = true
          this.directorBreakdowns.unshift(res.data)
          this.addBreakdownDialog = false
        }).catch(err => {
          console.log(err)
          this.failedPublicationAlert = true
        })
      }
    },
    _submitBreakdown (data) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      return Axios.post(`${CastingComplexAPI}/breakdowns`, data, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
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
</style>
