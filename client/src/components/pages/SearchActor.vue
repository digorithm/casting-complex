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
                <v-card-text>
                  <v-layout column>
                    <v-layout row wrap align-center>
                      <v-flex md6>
                        <h3>Search attributes</h3>
                      </v-flex>
                      <v-flex md6>
                        <v-btn @click="searchActor()" color="primary" flat dark>Search
                          <v-icon dark right>search</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        v-model="searchQuery.actorName"
                        append-icon="search"
                        label="Search by name"
                      ></v-text-field>
                      <v-select
                        :items="Genders"
                        v-model="searchQuery.genderId"
                        label="Gender"
                        item-text="name"
                        multiple
                        chips
                        clearable
                        deletable-chips
                        item-value="id"
                        max-height="400"
                        persistent-hint
                      ></v-select>
                      <v-select
                        :items="Ethnicity"
                        v-model="searchQuery.ethnicityId"
                        label="Ethnicity"
                        chips
                        clearable
                        deletable-chips
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        multiple
                      ></v-select>
                      <v-select
                        :items="Hair"
                        v-model="searchQuery.hairId"
                        label="Hair"
                        chips
                        clearable
                        deletable-chips
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        multiple
                      ></v-select>
                      <v-select
                        :items="Eyes"
                        v-model="searchQuery.eyeId"
                        label="Eyes"
                        chips
                        clearable
                        deletable-chips
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        multiple
                      ></v-select>
                      <v-select
                        :items="Credits"
                        v-model="searchQuery.creditId"
                        label="Credits"
                        autocomplete
                        chips
                        clearable
                        deletable-chips
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        multiple
                      ></v-select>
                      <v-select
                        :items="Skills"
                        v-model="searchQuery.skills"
                        label="Skills"
                        autocomplete
                        chips
                        clearable
                        deletable-chips
                        item-text="name"
                        item-value="id"
                        max-height="400"
                        multiple
                      ></v-select>
                      <v-layout row wrap justify-space-around align-center>
                        <v-flex md5>
                          <v-text-field
                            label = "Min age"
                            v-model="searchQuery.minAge"
                          ></v-text-field>
                        </v-flex>
                        <v-flex md5>
                          <v-text-field
                            label = "Max age"
                            v-model="searchQuery.maxAge"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap justify-space-around align-center>
                        <v-flex md5>
                          <v-text-field
                            v-model="searchQuery.minWeight"
                            label = "Min weight"
                            suffix="kgs"
                          ></v-text-field>
                        </v-flex>
                        <v-flex md5>
                          <v-text-field
                            label = "Max weight"
                            v-model="searchQuery.maxWeight"
                            suffix="kgs"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap justify-space-around align-center>
                        <v-flex md5>
                          <v-text-field
                            v-model="searchQuery.minHeight"
                            label = "Min height"
                            suffix="cms"
                          ></v-text-field>
                        </v-flex>
                        <v-flex md5>
                          <v-text-field
                            label = "Max height"
                            suffix="cms"
                            v-model="searchQuery.maxHeight"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-radio-group v-model="searchQuery.isRepped">
                        <v-radio
                          label="Represented actors"
                          value="1"
                        ></v-radio>
                        <v-radio
                          label="Unrepped actors"
                          value="2"
                        ></v-radio>
                        <v-radio
                          label="Both"
                          value="3"
                        ></v-radio>
                      </v-radio-group>
                    </v-form>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="searchActor()" color="primary" flat block dark>Search
                    <v-icon dark right>search</v-icon>
                  </v-btn>
                  <v-btn @click="clear()" color="error" flat block dark>clear
                    <v-icon dark right>clear</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs12 md8 lg8 xl6>
                <v-card class="">
                  <v-card-title primary-title>
                    <h1> Showing {{ actors.length }} actors</h1>
                  </v-card-title>
                  <v-card-text>
                    <template v-if="isFecthing">
                      <v-progress-linear :indeterminate="true"></v-progress-linear>
                    </template>
                      <v-data-iterator
                        :items="actors"
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
                        <v-card flat>
                          <v-card-text>
                            <v-layout row wrap align-center>
                              <v-flex md12>
                                  <v-layout row wrap justify-center>
                                    <v-flex md3>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                      <v-avatar size="120px">
                                        <img :src=props.item.user.avatar />
                                      </v-avatar>
                                    </v-flex>
                                    <v-flex xs12 md3>
                                      <v-btn :to="{ name: 'Actor profile', params: { username: props.item.user.username }}" outline color="primary">
                                        View profile
                                      </v-btn>
                                    </v-flex>
                                  </v-layout>
                                 <h3 class="text-xs-center">
                                    {{ props.item.firstName + ' ' + props.item.lastName }}
                                  </h3>
                                  <p class="text-xs-center">
                                    {{props.item.City + ', ' + props.item.Country}}
                                  </p>
                              </v-flex>
                              <v-flex md12>
                                <v-chip color="primary" text-color="white" v-for="(credit, index) in props.item.Credits" :key="index">
                                    {{ credit }}
                                </v-chip>
                              </v-flex>
                              <v-flex md12>
                                <v-chip class="chip-mod" v-for="(skill, index) in props.item.Skills" :key="index">
                                  {{ skill }}
                                </v-chip>
                              </v-flex>
                            </v-layout>
                             <v-layout row wrap align-center>
                               <v-flex md12>
                              </v-flex>
                             </v-layout>
                          </v-card-text>
                        </v-card>
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
// import { isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'
import Axios from 'axios'
import _ from 'lodash'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      isFecthing: false,
      rowsPerPageItems: [10],
      pagination: {
        rowsPerPage: 10
      },
      actors: [],
      valid: '',
      Credits: [],
      Unions: [],
      Eyes: [],
      Hair: [],
      Ethnicity: [],
      Languages: [],
      Genders: [],
      Skills: [],
      emptySearchQuery: {
        actorName: null,
        genderId: [],
        ethnicityId: [],
        creditId: [],
        hairId: [],
        eyeId: [],
        minWeight: null,
        maxWeight: null,
        minHeight: null,
        maxHeight: null,
        isRepped: null,
        minAge: null,
        maxAge: null,
        skills: []
      },
      searchQuery: {
        actorName: null,
        genderId: [],
        ethnicityId: [],
        creditId: [],
        hairId: [],
        eyeId: [],
        minWeight: null,
        maxWeight: null,
        minHeight: null,
        maxHeight: null,
        isRepped: null,
        minAge: null,
        maxAge: null,
        skills: []
      }
    }
  },
  mounted () {
    this.fetchAllActors()
    this.getExtras()
  },
  methods: {
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    searchActor () {
      this.isFecthing = true
      if (_.isEqual(this.emptySearchQuery, this.searchQuery)) {
        this.fetchAllActors()
        return
      }
      Axios.get(`${CastingComplexAPI}/actors?searchQuery=${JSON.stringify(this.searchQuery)}`).then(response => {
        this.actors = response.data.data
        this.isFecthing = false
      })
        .catch(function (error) {
          console.log(error)
          this.isFecthing = false
        })
    },
    fetchAllActors () {
      this.isFecthing = true
      Axios.get(`${CastingComplexAPI}/actors`)
        .then((res) => {
          this.actors = res.data.data
          this.isFecthing = false
        }).catch((err) => {
          console.log(err)
          this.isFecthing = false
        })
    },
    clear () {
      this.$refs.form.reset()
    },
    getExtras (context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.Credits = data.data.data['Credit']
          this.Unions = data.data.data['Union']
          this.Eyes = data.data.data['Eye']
          this.Hair = data.data.data['Hair']
          this.Ethnicity = data.data.data['Ethnicity']
          this.Languages = data.data.data['Language']
          this.Genders = data.data.data['Gender']
          this.AgencyDivision = data.data.data['AgencyDivision']
          this.Skills = data.data.data['Skill']
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

  .chip-mod > .chip__content {
    height: 20px !important;
    font-size: 12px !important;
  }
</style>
