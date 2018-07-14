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
                    <v-text-field
                      v-model="searchQuery.searchString"
                      append-icon="search"
                      label="Search by name"
                      single-line
                      hide-details
                    ></v-text-field>
                    <v-select
                      :items="MediaTypes"
                      v-model="searchQuery.mediaType"
                      item-text="name"
                      item-value="id"
                      label="Media types"
                      multiple
                      autocomplete
                      chips
                    ></v-select>
                    <v-radio-group v-model="searchQuery.requiresUnion">
                      <v-radio
                        label="Requires union"
                        value="1"
                      ></v-radio>
                      <v-radio
                        label="Does not require union"
                        value="2"
                      ></v-radio>
                      <v-radio
                        label="Both"
                        value="3"
                      ></v-radio>
                    </v-radio-group>
                    <v-btn @click="searchBreakdown()" color="primary" flat block dark>Search
                      <v-icon dark right>search</v-icon>
                    </v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md8 lg8 xl6>
              <v-card>
                <v-card-media src="/static/img/bg12.jpg" height="100px"> </v-card-media>
                  <v-card-text>
                    <v-data-iterator
                      :items="allBreakdowns"
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
                      <h2> {{ props.item.name }} </h2>
                      <v-layout row wrap>
                        <v-flex md8>
                          <div class="synopsis">
                            <h4>Synopsis:</h4>
                            <p>{{props.item.synopsis}}</p>
                          </div>
                          <v-chip>{{props.item.mediaType}}</v-chip>
                          <template v-if="props.item.requiresUnion">
                            <v-chip color="error" text-color="white">Requires union</v-chip>
                          </template>
                        </v-flex>
                        <v-flex md4>
                          <div class="synopsis">
                            <h4>Rates:</h4>
                            <p>{{props.item.rates}}</p>
                          </div>
                          <div class="synopsis">
                            <h4>Cities for transmission:</h4>
                            <p>{{props.item.citiesForTransmission}}</p>
                          </div>
                          <div class="synopsis">
                            <h4>Casting director:</h4>
                            <p>{{props.item.directorName}}</p>
                          </div>
                          <v-btn :to="getLink(props.item.id)" small block color="primary">
                            <v-icon small left>open_in_new</v-icon> View job
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-divider></v-divider>
                     </v-flex>
                    </v-data-iterator>
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
import { isActor, isLoggedIn, isAccountApproved } from '@/components/authentication'
import _ from 'lodash'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
    if (!isActor() && !isAccountApproved()) {
      this.$router.push('/waiting-approval')
    }
  },
  beforeMount () {
    this.fetchBreakdowns()
    this.getExtras()
  },
  data () {
    return {
      search: '',
      rowsPerPageItems: [10],
      pagination: {
        rowsPerPage: 10
      },
      allBreakdowns: [],
      MediaTypes: [],
      emptySearchQuery: {
        requiresUnion: '3',
        mediaType: [],
        searchString: ''
      },
      searchQuery: {
        requiresUnion: '3',
        mediaType: [],
        searchString: ''
      }
    }
  },
  methods: {
    getLink (id) {
      return '/breakdowns/' + id
    },
    fetchBreakdowns () {
      Axios.get(`${CastingComplexAPI}/breakdowns`).then(response => {
        this.allBreakdowns = response.data.data
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
    },
    searchBreakdown () {
      if (_.isEqual(this.emptySearchQuery, this.searchQuery)) {
        this.fetchBreakdowns()
        return
      }
      Axios.get(`${CastingComplexAPI}/breakdowns?searchQuery=${JSON.stringify(this.searchQuery)}`).then(response => {
        this.allBreakdowns = response.data.data
      })
        .catch(function (error) {
          console.log(error)
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
  .synopsis h4,
  .synopsis p {
    display: inline !important;
  }
</style>
