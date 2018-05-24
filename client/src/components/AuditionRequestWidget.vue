<template>
  <v-card>
    <v-card-title primary class="title">
      Audition requests
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="card-text-mod">
    <v-data-table
        :headers="headers"
        :items="auditionRequests"
        :no-data-text="noRequests"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.breakdown }}</td>
          <td class="text-xs-left">{{ props.item.role }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
        </template>
      </v-data-table>
    <v-card-actions>
      <v-btn color="primary" block small>View all requests</v-btn>
    </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      pagination: {
        rowsPerPage: 4
      },
      noRequests: 'No requests so far',
      headers: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Role', value: 'role' },
      { text: 'Status', value: 'status' }],
      auditionRequests: [],
      mockAuditionRequests: [
        {
          breakdown: 'Inspiring project',
          director: 'Stephen King',
          role: 'Role 1',
          status: 'Rejected'
        },
        {
          breakdown: 'Awesome project',
          director: 'C. Nolan',
          role: 'Role 4',
          status: 'Accepted'
        },
        {
          breakdown: 'Plan B',
          director: 'Michael Bay',
          role: 'Role 3',
          status: 'Waiting'
        }
      ]
    }
  },
  mounted () {
    // TODO: fetchAuditionRequests from an actor
    this.fetchAuditionRequests()
  },
  methods: {
    fetchAuditionRequests () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var actorId = JSON.parse(localStorage.getItem('logged_profile')).id
      Axios.get(`${CastingComplexAPI}/actors/${actorId}/auditions/requests`, config).then((response) => {
        console.log(response)
        this.auditionRequests = response.data
      }).catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
</style>
