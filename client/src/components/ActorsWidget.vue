<template>
  <v-card>
    <v-card-title primary class="title">
      New actors in the platform
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
       <v-data-iterator
      :items="actorsMock"
      :rows-per-page-items="[1]"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap
      :no-data-text="noActors"
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
          <v-layout row wrap align-content-start>
              <v-flex d-flex md8 lg12 xl5 :style=getProfileCardStyle()>
                <v-avatar
                slot="activator"
                size="180px"
                :tile="true"
                >
                  <img :src=props.item.photoPath />
                </v-avatar>
              </v-flex>
              <v-flex md3 lg12 xl7 class="text-xs-center">
                <h2> {{ props.item.firstName }} {{ props.item.lastName }}, {{ props.item.age }}</h2>
                <p> {{ props.item.from }} </p>
                <p> <em> {{ props.item.profile }} </em> </p>
                <v-card-actions>
                  <v-btn color="primary" block flat small>View profile</v-btn>
                </v-card-actions>
              </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-data-iterator>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn color="primary" block small>View more actors</v-btn>
      </v-card-actions>
    </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`
// Important: limit this short profile bio to 80 characters

export default {
  data () {
    return {
      windowSize: {
        x: 0,
        y: 0
      },
      rowsPerPageItems: [1, 4, 8, 12],
      pagination: {
        rowsPerPage: 1
      },
      noActors: 'No recently joined actors ',
      actors: [],
      actorsMock: [
        {
          firstName: 'Rodrigo',
          lastName: 'Araujo',
          from: 'Vancouver, Canada',
          age: '24',
          isRepresented: false,
          profile: 'Passionate about filmmaking, acting, writing, and technology.',
          photoPath: '/static/img/profile.jpg',
          ethnicity: 'Caucasian',
          credits: 'Acting, Singing'
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          from: 'Vancouver, Canada',
          age: '27',
          isRepresented: false,
          profile: 'Passionate actor',
          photoPath: '/static/img/woman1.jpg',
          ethnicity: 'Caucasian',
          credits: 'Acting, Singing'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    getProfileCardStyle () {
      var breakpoint = this.$vuetify.breakpoint.name
      if (breakpoint === 'xl') {
        return 'padding: 0px;margin-left: -20px;'
      }
      return ''
    },
    getWindowSize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
  .list__tile__content {
    text-align: right !important;
  }
</style>
