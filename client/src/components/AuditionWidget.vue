<template>
  <v-card>
    <v-card-title primary class="title">
      Auditions
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="card-text-mod">
      <v-data-table
        :headers="headers2"
        :items="actorsAuditions"
        hide-actions
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
        </template>
      </v-data-table>
      <v-layout justify-center>
       <v-card-actions>
        <v-btn :to="{name: 'Auditions'}" color="primary" small>View all auditions</v-btn>
      </v-card-actions>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Axios from 'axios'
import { isActor, isAgent, isDirector } from '@/components/authentication'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      isDirector: isDirector(),
      isActor: isActor(),
      isAgent: isAgent(),
      headers: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Address', value: 'address' },
      { text: 'Date', value: 'date' }],
      headers2: [{
        text: 'Project',
        align: 'left',
        sortable: false,
        value: 'breakdown'
      },
      { text: 'Actor', value: 'actor' },
      { text: 'Date', value: 'date' }],
      actorsAuditions: [],
      auditions: [],
      noAuditions: 'It seems that you have no scheduled auditions!',
      mockAuditions: [
        {
          breakdown: 'Cool project',
          address: '1988 stephens street',
          date: 'Jun 8 2018, 3pm',
          director: 'The director name'
        },
        {
          breakdown: 'Another project',
          address: '2033 random address',
          date: 'Jun 9 2018, 3pm',
          director: 'The director name'
        },
        {
          breakdown: 'Yet another project',
          address: '1866 random street',
          date: 'Jun 10 2018, 3pm',
          director: 'The director name'
        }
      ],
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
      ]
    }
  },
  mounted () {
    this.fetchAuditions()
  },
  methods: {
    fetchAuditions () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var userId = JSON.parse(localStorage.getItem('logged_profile')).id

      if (this.isActor) {
        Axios.get(`${CastingComplexAPI}/actors/${userId}/auditions`, config).then((response) => {
          this.auditions = response.data
        }).catch(error => { console.log(error) })
      } else if (this.isAgent) {
        Axios.get(`${CastingComplexAPI}/agents/${userId}/auditions`, config).then((response) => {
          this.actorsAuditions = response.data
        }).catch(error => { console.log(error) })
      } else if (this.isDirector) {
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
  @import "./../assets/styles";

  .card-text-mod {
    padding: 0 !important;
  }
</style>
