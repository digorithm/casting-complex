<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex md4 lg4 xl3>
              <v-card>
                <v-card-title primary-title>
                  <h2>Audition requests</h2>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="requestHeaders"
                    :items="auditionRequests"
                    :no-data-text="noRequests"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.Breakdown.name }}</td>
                      <td class="text-xs-left">{{ props.item.role }}</td>
                      <td class="text-xs-left">{{ getStatusText(props.item.statusId) }}</td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md8 lg8 xl6>
              <v-card>
                <v-card-title primary-title>
                  <h2>Scheduled auditions</h2>
                </v-card-title>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex md12>
                        <v-data-table
                          :headers="headers2"
                          :items="actorsAuditions"
                          :no-data-text="noAuditions"
                          v-if="isAgent || isDirector"
                        >
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.project }}</td>
                            <td>{{ props.item.actorName }}</td>
                            <td class="text-xs-left">{{ props.item.startsWhen }}</td>
                          </template>
                        </v-data-table>
                        <v-data-table
                          :headers="headers"
                          :items="auditions"
                          hide-actions
                          :no-data-text="noAuditions"
                          v-if="isActor"
                        >
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.project }}</td>
                            <td class="text-xs-left">{{ props.item.address }}</td>
                            <td class="text-xs-left">{{ props.item.startsWhen }}</td>
                             <td>
                              <v-btn icon @click="cancelAudition(props.index, props.item)">
                                  <v-icon color="error">delete</v-icon>
                                </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-flex>
                    </v-layout>
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
import Axios from 'axios'
import { getProfile, isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  beforeMount () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  data () {
    return {
      isDirector: isDirector(),
      isActor: isActor(),
      isAgent: isAgent(),
      noRequests: 'No requests so far',
      requestHeaders: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Role', value: 'role' },
      { text: 'Status', value: 'status' }],
      auditionRequests: [],
      headers2: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Actor', value: 'actor' },
      { text: 'Date', value: 'date' }],
      headers: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Address', value: 'address' },
      { text: 'Date', value: 'date' }],
      auditions: [],
      actorsAuditions: [],
      noAuditions: 'It seems that you have no scheduled auditions!'
    }
  },
  mounted () {
    this.fetchAuditions()
    if (isActor()) {
      this.fetchAuditionRequests()
    }
  },
  methods: {
    cancelAudition (index, audition) {
      if (!confirm('Are you sure you want to cancel this audition?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      var breakdownId = audition.breakdownId

      var url = `${CastingComplexAPI}/breakdowns/${breakdownId}/auditions/${audition.id}`

      Axios.delete(url, config).then(response => {
        this.auditions.splice(index, 1)
      })
        .catch(err => {
          console.log(err)
        })
    },
    getStatusText (AuditionRequestStatusId) {
      if (AuditionRequestStatusId === 1) return 'Pending'
      if (AuditionRequestStatusId === 2) return 'Approved'
      if (AuditionRequestStatusId === 3) return 'Rejected'
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    fetchAuditionRequests () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var actorId = JSON.parse(localStorage.getItem('logged_profile')).id
      Axios.get(`${CastingComplexAPI}/actors/${actorId}/auditions/requests`, config).then((response) => {
        this.auditionRequests = response.data
      }).catch(error => { console.log(error) })
    },
    fetchAuditions () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var userId = JSON.parse(localStorage.getItem('logged_profile')).id

      if (isActor()) {
        Axios.get(`${CastingComplexAPI}/actors/${userId}/auditions`, config).then((response) => {
          this.auditions = response.data
          console.log(response.data)
        }).catch(error => { console.log(error) })
      } else if (isAgent()) {
        Axios.get(`${CastingComplexAPI}/agents/${userId}/auditions`, config).then((response) => {
          this.actorsAuditions = response.data
        }).catch(error => { console.log(error) })
      } else if (isDirector()) {
        Axios.get(`${CastingComplexAPI}/castingdirectors/${userId}/auditions`, config).then((response) => {
          this.actorsAuditions = response.data
          console.log(response.data)
        }).catch(error => { console.log(error) })
      }
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
