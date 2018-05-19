<template>
  <v-card>
    <v-card-title primary class="title">
      Audition requests
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="card-text-mod">
    <v-data-table
        :headers="headers"
        :items="mockAuditionRequests"
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
import {bus} from '../main'
import Axios from 'axios'
import { logout, isLoggedIn, isActor } from '@/components/authentication'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
       pagination: {
        rowsPerPage: 4
      },
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
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";

</style>
