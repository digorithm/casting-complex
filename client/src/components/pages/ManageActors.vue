<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex xs12 md12 lg8 xl6>
                <v-card>
                  <v-card-title primary-title>
                    <h1>Your actors</h1>
                    <v-spacer></v-spacer>
                    <v-btn :to="{name: 'Search actor'}" color="primary">
                      <v-icon left>search</v-icon>
                      Find actors
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-layout row wrap justify-space-around>
                      <v-flex
                        align-center
                        v-for="(actor, index) in actors"
                        :key="index"
                        my-3
                        mx-2
                        lg3
                        xl3
                        >
                        <v-layout column>
                          <v-flex md12>
                            <h3> {{ actor.firstName + ' ' + actor.lastName}} </h3>
                            <v-avatar size="120px">
                              <img :src=actor.user.avatar />
                            </v-avatar>
                          </v-flex>
                          <v-flex md12>
                            <v-btn :to="{ name: 'Actor profile', params: { username: actor.user.username }}" block color="primary" small><v-icon left small>visibility</v-icon> view</v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex lg3 xl2>
                <v-card>
                  <v-card-title primary-title>
                    <h1>Requests</h1>
                  </v-card-title>
                  <v-card-text>
                    <v-layout row wrap justify-space-around>
                      <v-flex
                        align-center
                        v-for="(request, index) in repRequests"
                        :key="index"
                        xl12
                        >
                          <v-flex md12>
                            <h3> {{ request.actor.actorName}} </h3>
                            <v-avatar size="120px">
                              <img class="actor-avatar" :src=request.actor.avatar />
                            </v-avatar>
                          </v-flex>
                          <v-flex md12>
                            <v-btn :to="{ name: 'Actor profile', params: { username: request.actor.username }}" block color="primary" small><v-icon left small>visibility</v-icon> view</v-btn>
                          </v-flex>
                          <v-flex d-flex md12>
                              <v-btn block class="mr-2" @click="replyToRequest(index, true, request.id)" color="primary" small>
                                <v-icon left small>thumb_up</v-icon> Accept
                                </v-btn>
                              <v-btn block @click="replyToRequest(index, false, request.id)" color="error" small><v-icon left small>thumb_down</v-icon> decline</v-btn>
                          </v-flex>
                          <v-divider></v-divider>
                      </v-flex>
                    </v-layout>
                    <v-alert transition="scale-transition" :value="replySentAlert" type="success">
                      Your reply was sent!
                      <v-btn flat color="white" @click.native="replySentAlert = false">Close</v-btn>
                    </v-alert>
                    <v-alert transition="scale-transition" :value="actorAlreadyReppedAlert" type="error">
                      Unfortunately this actor already has an agent. Sorry!
                      <v-btn flat color="white" @click.native="actorAlreadyReppedAlert = false">Close</v-btn>
                    </v-alert>
                    <v-alert transition="scale-transition" :value="somethingWentWrongAlert" type="error">
                      Something went wrong. We are on it!
                      <v-btn flat color="white" @click.native="somethingWentWrongAlert = false">Close</v-btn>
                    </v-alert>
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
import { isLoggedIn, isAgent, isAccountApproved } from '@/components/authentication'
import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      agentId: '',
      actors: [],
      repRequests: [],
      replySentAlert: false,
      actorAlreadyReppedAlert: false,
      somethingWentWrongAlert: false
    }
  },
  beforeCreate () {
    if (!isLoggedIn() && !isAgent()) {
      this.$router.push('/')
    }
    if (!isAccountApproved()) {
      this.$router.push('/waiting-approval')
    }
  },
  beforeMount () {
    if (localStorage.getItem('logged_profile')) {
      this.agentId = JSON.parse(localStorage.getItem('logged_profile')).id
      if (!this.agentId) {
        return this.$router.push('/')
      }
    } else {
      return this.$router.push('/')
    }
  },
  mounted () {
    this.fetchAgentActors(this.agentId)
    this.fetchRepRequests(this.agentId)
  },
  methods: {
    replyToRequest (index, accepts, reqId) {
      var confirmMsg = accepts ? 'accept' : 'reject'
      if (!confirm(`Are you sure you want to ${confirmMsg} this actor?`)) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      const url = `${CastingComplexAPI}/agents/${this.agentId}/requests/${reqId}/reply`
      return Axios.post(url, {accepts: accepts}, config)
        .then(x => {
          this.replySentAlert = true
          if (accepts) {
            this.fetchAgentActors(this.agentId)
          }
          this.repRequests.splice(index, 1)
        })
        .catch(err => {
          if (err.response.data.error.error === 'Actor is repped') {
            this.actorAlreadyReppedAlert = true
            this.repRequests.splice(index, 1)
          } else {
            this.somethingWentWrongAlert = true
          }
        })
    },
    fetchRepRequests (agentId) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.get(`${CastingComplexAPI}/agents/${agentId}/requests`, config).then(res => {
        this.repRequests = res.data
      }).catch(e => {
        console.log(e)
      })
    },
    fetchAgentActors (agentId) {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.get(`${CastingComplexAPI}/agents/${agentId}/actors`, config).then(res => {
        this.actors = res.data.data
      }).catch(e => {
        console.log(e)
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
