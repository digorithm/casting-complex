<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex md4 lg6 xl6>
              <v-card>
                <v-card-title light primary-title class="headline primary white--text">
                  Review new users
                </v-card-title>
                <v-card-text>
                  <v-list subheader>
                    <v-subheader>Agents</v-subheader>
                    <v-list-tile
                      v-for="(agent, index) in agents"
                      :key="index"
                      @click="reviewAgentAccount(index)"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title>{{agent.firstName + ' ' + agent.lastName}}</v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn color="primary">
                          Review
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-subheader>Casting directors</v-subheader>
                    <v-list-tile
                      v-for="(director, index) in directors"
                      :key="index"
                      @click="reviewDirectorAccount(index)"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title>{{director.firstName + ' ' + director.lastName}}</v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn color="primary">
                          Review
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex md4 lg6 xl6>
              <v-card>
                <v-card-title light primary-title class="headline primary white--text">
                  Manage news
                  <v-spacer></v-spacer>
                  <v-btn @click="addNewsDialog = true" color="grey lighten-2">Add news</v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="news"
                    hide-actions
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.title }}</td>
                      <td>
                        <v-btn @click="editNews(props.item)" flat icon color="primary">
                          <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn @click="deleteNews(props.index, props.item)" flat icon color="error">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-dialog
      v-model="reviewAgentAccountDialog"
      width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Review agent account
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <h4>Name</h4>
                  {{agentBeingReviewed.firstName + ' ' + agentBeingReviewed.middleName + ' ' + agentBeingReviewed.lastName}}
                </v-flex>
                <v-flex md6>
                  <h4>Phone</h4>
                  {{ agentBeingReviewed.phone }}
                </v-flex>
                <v-flex md6>
                  <h4>Agency name</h4>
                  {{ agentBeingReviewed.agencyName }}
                </v-flex>
                <v-flex md6>
                  <h4>Position</h4>
                  {{ agentBeingReviewed.position }}
                </v-flex>
                <v-flex md6>
                  <h4>Country</h4>
                  {{ agentBeingReviewed.Country }}
                </v-flex>
                <v-flex md6>
                  <h4>City</h4>
                  {{ agentBeingReviewed.City }}
                </v-flex>
                <v-flex md6>
                  <h4>Roster types</h4>
                  <v-chip
                    v-for="types in agentBeingReviewed.rosterTypes"
                    :key="types.id"
                  >
                    {{types}}
                  </v-chip>
                </v-flex>
                <v-flex md6>
                  <h4>Agency divisions</h4>
                  <v-chip
                    v-for="division in agentBeingReviewed.agencyDivisions"
                    :key="division.id"
                  >
                    {{division}}
                  </v-chip>
                </v-flex>
                <v-flex md12>
                  <h3>References</h3>
                  <v-list three-line>
                    <v-list-tile
                      v-for="(reference, index) in agentBeingReviewed.references"
                      :key="index"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title v-html="reference.company"></v-list-tile-title>
                        <v-list-tile-sub-title>{{reference.contactName + ' - ' + reference.phone}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn
              color="error"
              flat
              @click="reviewAgentAccountDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="approveAgentAccount()"
            >
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
      v-model="reviewDirectorAccountDialog"
      width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Review casting director account
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <h4>Name</h4>
                  {{directorBeingReviewed.firstName + ' ' + directorBeingReviewed.middleName + ' ' + directorBeingReviewed.lastName}}
                </v-flex>
                <v-flex md6>
                  <h4>Phone</h4>
                  {{ directorBeingReviewed.phone }}
                </v-flex>
                <v-flex md6>
                  <h4>Company name</h4>
                  {{ directorBeingReviewed.companyName }}
                </v-flex>
                <v-flex md6>
                  <h4>Position</h4>
                  {{ directorBeingReviewed.position }}
                </v-flex>
                <v-flex md6>
                  <h4>Country</h4>
                  {{ directorBeingReviewed.Country }}
                </v-flex>
                <v-flex md6>
                  <h4>City</h4>
                  {{ directorBeingReviewed.City }}
                </v-flex>
                <v-flex md12>
                  <h4>Specializations</h4>
                  <v-chip
                    v-for="spec in directorBeingReviewed.specializations"
                    :key="spec.id"
                  >
                    {{spec}}
                  </v-chip>
                </v-flex>
                <v-flex md6>
                  <h3>References</h3>
                  <v-list three-line>
                    <v-list-tile
                      v-for="(reference, index) in directorBeingReviewed.references"
                      :key="index"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title v-html="reference.company"></v-list-tile-title>
                        <v-list-tile-sub-title>{{reference.contactName + ' - ' + reference.phone}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex md6>
                  <h3>Credits</h3>
                  <v-list three-line>
                    <v-list-tile
                      v-for="(credit, index) in directorBeingReviewed.credits"
                      :key="index"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title>{{credit.credit}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{credit.contact}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn
              color="error"
              flat
              @click="reviewDirectorAccountDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="approveDirectorAccount()"
            >
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
      v-model="addNewsDialog"
      width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Write news
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    v-model="newsTitle"
                    color="primary"
                    :rows=1
                    label="Title"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="newsText"
                    color="primary"
                    multi-line
                    :rows=6
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn
              color="error"
              flat
              @click="addNewsDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="addNews()"
            >
              Publish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
      v-model="editNewsDialog"
      width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Update news
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    v-model="newsEditingTitle"
                    color="primary"
                    :rows=1
                    label="Title"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="newsEditingText"
                    color="primary"
                    multi-line
                    :rows=6
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
             <v-btn
              color="error"
              flat
              @click="editNewsDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="updateNews()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
     <app-footer></app-footer>
</main>
</template>

<script>
import { isLoggedIn, isRegistrationInProgress, isAdmin } from '@/components/authentication'
import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      reviewAgentAccountDialog: false,
      reviewDirectorAccountDialog: false,
      addNewsDialog: false,
      editNewsDialog: false,
      agents: [],
      directors: [],
      news: [],
      headers: [{
        text: 'Title',
        value: 'title'
      }],
      agentBeingReviewed: {},
      agentBeingReviewedIndex: '',
      directorBeingReviewed: {},
      directorBeingReviewedIndex: '',
      newsText: '',
      newsTitle: '',
      newsEditingTitle: '',
      newsEditingText: ''
    }
  },
  beforeCreate () {
    if (!isLoggedIn() || isRegistrationInProgress() || !isAdmin()) {
      this.$router.push('/')
    }
  },
  mounted () {
    this.fetchAccountApprovalPendingAgents()
    this.fetchAccountApprovalPendingDirectors()
    this.fetchNews()
  },
  methods: {
    fetchNews () {
      Axios.get(`${CastingComplexAPI}/admins/news/`)
        .then((data) => {
          this.news = data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    editNews (news) {
      this.editNewsDialog = true
      this.newsEditingTitle = news.title
      this.newsEditingText = news.text
      this.newsEditingId = news.id
    },
    deleteNews (idx, news) {
      if (!confirm('Are you sure you want to delete this?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.delete(`${CastingComplexAPI}/admins/news/${news.id}`, config)
        .then((data) => {
          this.news.splice(idx, 1)
        }).catch((err) => {
          console.log(err)
        })
    },
    updateNews () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var data = { title: this.newsEditingTitle, text: this.newsEditingText }
      console.log(data)
      Axios.put(`${CastingComplexAPI}/admins/news/${this.newsEditingId}`, data, config).then(data => {
        this.editNewsDialog = false
        for (var news of this.news) {
          if (this.newsEditingId === news.id) {
            news.title = this.newsEditingTitle
            news.text = this.newsEditingText
          }
        }
        this.newsEditingTitle = ''
        this.newsEditingText = ''
        this.newsEditingId = ''
        
      })
    },
    addNews () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var data = { title: this.newsTitle, text: this.newsText }
      Axios.post(`${CastingComplexAPI}/admins/news/`, data, config).then(data => {
        this.newsText = ''
        this.newsTitle = ''
        this.addNewsDialog = false
        this.news.push(data.data)
      })
    },
    approveDirectorAccount () {
      if (!confirm('Are you sure you want to approve this account?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.post(`${CastingComplexAPI}/admins/approve/director/${this.directorBeingReviewed.id}`, {}, config).then(data => {
        this.directors.splice(this.directorBeingReviewedIndex, 1)
        this.reviewDirectorAccountDialog = false
        this.directorBeingReviewed = {}
        this.directorBeingReviewedIndex = ''
      })
    },
    approveAgentAccount () {
      if (!confirm('Are you sure you want to approve this account?')) return

      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      Axios.post(`${CastingComplexAPI}/admins/approve/agent/${this.agentBeingReviewed.id}`, {}, config).then(data => {
        this.agents.splice(this.agentBeingReviewedIndex, 1)
        this.reviewAgentAccountDialog = false
        this.agentBeingReviewed = {}
        this.agentBeingReviewedIndex = ''
      })
    },
    reviewAgentAccount (index) {
      this.reviewAgentAccountDialog = true
      this.agentBeingReviewed = this.agents[index]
      this.agentBeingReviewedIndex = index
    },
    reviewDirectorAccount (index) {
      this.reviewDirectorAccountDialog = true
      this.directorBeingReviewed = this.directors[index]
      this.directorBeingReviewedIndex = index
    },
    fetchAccountApprovalPendingDirectors () {
      Axios.get(`${CastingComplexAPI}/castingdirectors/`)
        .then((data) => {
          this.directors = data.data.data.filter(d => d.accountApproved === false)
          for (var director of this.directors) {
            console.log(Object.keys(director))
            this.fetchDirectorReferences(director.id).then(data => {
              director.references = data
            })
            this.fetchDirectorCredits(director.id).then(data => {
              director.credits = data
            })
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchAccountApprovalPendingAgents () {
      Axios.get(`${CastingComplexAPI}/agents/`)
        .then((data) => {
          this.agents = data.data.data.filter(a => a.accountApproved === false)
          for (var agent of this.agents) {
            this.fetchAgentReferences(agent.id).then(references => {
              agent.references = references
            })
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchDirectorReferences (directorId) {
      return Axios.get(`${CastingComplexAPI}/castingdirectors/${directorId}/references`)
        .then((data) => {
          return data.data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchDirectorCredits (directorId) {
      return Axios.get(`${CastingComplexAPI}/castingdirectors/${directorId}/credits`)
        .then((data) => {
          return data.data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    fetchAgentReferences (agentId) {
      return Axios.get(`${CastingComplexAPI}/agents/${agentId}/references`)
        .then((data) => {
          return data.data.data
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

  @media screen and (max-width: 960px){
    .content {
      padding-top: 0px !important;
      padding-bottom: 150px !important;
    }
  }

  .card__text {
    color: black !important;
    text-align: left !important;
  }
  .profile-btn {
    width: 100px !important;
    height: 100px !important;
  }
  .featured-actors {
    padding-bottom: 20px !important;
  }
</style>
