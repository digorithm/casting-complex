<template>
  <v-card>
    <v-card-title primary class="title">
      Recently published breakdowns
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
       <v-data-iterator
      :items="breakdownsMock"
      :rows-per-page-items="[1]"
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
        <v-card>
          <v-card-title><h4>{{ props.item.name }}</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Director:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.director }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Requires union:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.requiresUnion }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Rates:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.rates }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Cities for transmission:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.citiesForTransmission }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Synopsis:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.synopsis }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block small>View all breakdowns</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {bus} from '../main'

export default {
  data () {
    return {
      rowsPerPageItems: [1, 4, 8, 12],
      pagination: {
        rowsPerPage: 1
      },
      breakdownsMock: [
        {
          name: 'Star Wars IX',
          director: 'J.J. Abrams',
          requiresUnion: 'yes',
          rates: '$500/hour',
          citiesForTransmission: 'All planet',
          synopsis: 'The next installment in the franchise. ',
        },
        {
          name: 'X-Men: Dark Phoenix',
          director: 'Simon Kinberg',
          requiresUnion: 'no',
          rates: 'TBD',
          citiesForTransmission: 'All planet',
          synopsis: 'The next installment in the franchise. ',
        }
      ]
      
    }
  },
  methods: {
    // TODO: load breakdowns
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
  .list__tile__content {
    text-align: right !important;
  }
  
</style>
