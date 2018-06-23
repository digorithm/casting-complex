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
                              :items="mockActorsAuditions"
                              :no-data-text="noAuditions"
                            >
                                <template slot="items" slot-scope="props">
                                <td>{{ props.item.breakdown }}</td>
                                <td>{{ props.item.actor }}</td>
                                <td>{{ props.item.address }}</td>
                                <td class="text-xs-left">{{ props.item.date }}</td>
                                <td>
                                <v-btn flat @click="editItem(props.item)">
                                  <v-icon color="primary" left>visibility</v-icon> Edit/View
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
                              v-for="(actor, index) in auditionRequestsMock"
                              :key="index"
                              my-3
                              mx-2
                              xl3
                              >
                              <v-layout column>
                                <v-flex md12>
                                  <h3> {{ actor.name }} </h3>
                                  <v-avatar size="120px">
                                    <img class="actor-avatar" :src=actor.photo />
                                  </v-avatar>
                                  <p>Role: {{ actor.role }}</p>
                                </v-flex>
                                <v-flex md12>
                                  <v-btn block color="primary" small><v-icon left small>visibility</v-icon> view</v-btn>
                                </v-flex>
                                <v-flex d-flex md12>
                                  <v-flex md6>
                                    <v-btn block color="success" small><v-icon left small>thumb_up</v-icon> accept</v-btn>
                                  </v-flex>
                                  <v-flex md6>
                                    <v-btn block color="error" small><v-icon left small>thumb_down</v-icon> reject</v-btn>
                                  </v-flex>
                                </v-flex>
                              </v-layout>
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
      active: '',
      valid: '',
      search: '',
      publishedAlert: false,
      failedPublicationAlert: false,
      headers: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Actor', value: 'actor' },
      { text: 'Address', value: 'address' },
      { text: 'Date', value: 'date' }],
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
      mockActorsAuditions: [
        {
          breakdown: 'Cool project',
          actor: 'Rodrigo',
          address: '1988 stephens street',
          date: 'Jun 8 2018, 3pm',
          director: 'The director name'
        },
        {
          breakdown: 'Another project',
          actor: 'Seran',
          address: '2033 random address',
          date: 'Jun 9 2018, 3pm',
          director: 'The director name'
        },
        {
          breakdown: 'Yet another project',
          actor: 'Jane',
          address: '1866 random street',
          date: 'Jun 10 2018, 3pm',
          director: 'The director name'
        }
      ],
      auditionRequestsMock: [
        {
          name: 'John',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/man1.jpg'
        },
        {
          name: 'Jane',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/woman1.jpg'
        },
        {
          name: 'Rodrigo',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/man2.jpg'
        },
        {
          name: 'Guli',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/woman2.jpg'
        },
        {
          name: 'Ed',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/man3.jpg'
        },
        {
          name: 'Jess',
          username: 'jhon',
          role: 'Role name',
          photo: '/static/img/woman3.jpg'
        }
      ],
      form: {
        name: '',
        description: '',
        ageRange: ''
      },
      roleBeingEdited: ''
    }
  },
  methods: {
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
      console.log(JSON.stringify(this.form))
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
