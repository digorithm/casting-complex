<template>
 <main app>
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
    <v-content>
      <v-container fluid grid-list-md text-xs-center>
        <v-flex xl6 offset-xl3 lg8 offset-lg2 md12 xs12 sm12>
          <v-card>
            <v-card-media src="/static/img/join-actor.jpg" height="200px">
            </v-card-media>
            <v-layout row justify-center mb-3>
              <v-card-title primary-title>
                <div>
                  <h2 class="headline">Hi {{ firstName() }}, we are almost done!</h2>
                </div>
              </v-card-title>
            </v-layout>
            <v-form v-model="valid" ref="form">
              <v-layout justify-space-around>
                <v-flex sm10 xs10>
                  <h3> Please enter 3 references </h3>
                  <v-layout row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Company"
                    name="name"
                    v-model="firstCompany"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="name"
                    v-model="firstContact"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Phone"
                    name="phone"
                    v-model="firstPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Company"
                    name="name"
                    v-model="secondCompany"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="name"
                    v-model="secondContact"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Phone"
                    name="phone"
                    v-model="secondPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Company"
                    name="name"
                    v-model="thirdCompany"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="name"
                    v-model="thirdContact"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Phone"
                    name="phone"
                    v-model="thirdPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <h3 v-if=isDirector> Please enter 3 credits</h3>
                  <v-layout v-if=isDirector row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Name"
                    name="name"
                    v-model="firstCreditName"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-select
                    :items="CreditTypes"
                    v-model="firstCreditType"
                    label="Type"
                    item-text="name"
                    :rules="requiredRules"
                    item-value="id"
                    max-height="400"
                    hint="Select type"
                    ></v-select>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="phone"
                    v-model="firstCreditPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout v-if=isDirector row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Name"
                    name="name"
                    v-model="secondCreditName"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-select
                    :items="CreditTypes"
                    v-model="secondCreditType"
                    label="Type"
                    item-text="name"
                    :rules="requiredRules"
                    item-value="id"
                    max-height="400"
                    hint="Select type"
                    ></v-select>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="phone"
                    v-model="secondCreditPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout v-if=isDirector row>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Name"
                    name="name"
                    v-model="thirdCreditName"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-select
                    :items="CreditTypes"
                    v-model="thirdCreditType"
                    label="Type"
                    item-text="name"
                    :rules="requiredRules"
                    item-value="id"
                    max-height="400"
                    hint="Select type"
                    ></v-select>
                    </v-flex>
                    <v-flex sm10 xs10>
                    <v-text-field
                    label="Contact"
                    name="phone"
                    v-model="thirdCreditPhone"
                    :rules="requiredRules"
                    required
                    ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-btn class="small-btn" block color="primary" @click="submit" :disabled="!valid" >Submit</v-btn>
                  <v-btn class="small-btn" block color="error" @click="cancel" > Cancel account creation </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
        </v-flex>
      </v-container>
    </v-content>
    <app-footer></app-footer>
</main>
</template>

<script>
import Axios from 'axios'
import { isLoggedIn, isAgent, isDirector } from '@/components/authentication'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data: () => ({
    isDirector: false,
    firstCompany: '',
    firstContact: '',
    firstPhone: '',
    secondCompany: '',
    secondContact: '',
    secondPhone: '',
    thirdCompany: '',
    thirdContact: '',
    thirdPhone: '',
    firstCreditName: '',
    firstCreditType: '',
    firstCreditPhone: '',
    secondCreditName: '',
    secondCreditType: '',
    secondCreditPhone: '',
    thirdCreditName: '',
    thirdCreditType: '',
    thirdCreditPhone: '',
    CreditTypes: [],
    requiredRules: [
      v => !!v || 'This is required'
    ],
    valid: false,
    firstName: function () {
      var loggedProfile = localStorage.getItem('logged_profile')
      if (loggedProfile !== null) {
        return JSON.parse(loggedProfile).firstName
      } else { return '' }
    }
  }),
  mounted () {
    this.getExtras()
    var roleId = JSON.parse(localStorage.getItem('logged_profile')).user.roleId
    this.isDirector = (roleId === 2)
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  methods: {
    getExtras (context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.CreditTypes = data.data.data['CastingSpecialization']
        }).catch((err) => {
          console.log(err)
        })
    },
    cancel () {
      this.destroySignedUser().then(() => {
        localStorage.removeItem('session_token')
        localStorage.removeItem('logged_profile')
        this.$router.push('/')
      }).catch(e => {
        console.log(e)
      })
    },
    submit () {
      if (this.$refs.form.validate()) {
        var references = []

        var firstReference = {
          company: this.firstCompany,
          contactName: this.firstContact,
          phone: this.firstPhone,
          UserId: JSON.parse(localStorage.getItem('logged_profile')).user.id
        }

        var secondReference = {
          company: this.secondCompany,
          contactName: this.secondContact,
          phone: this.secondPhone,
          UserId: JSON.parse(localStorage.getItem('logged_profile')).user.id
        }

        var thirdReference = {
          company: this.thirdCompany,
          contactName: this.thirdContact,
          phone: this.thirdPhone,
          UserId: JSON.parse(localStorage.getItem('logged_profile')).user.id
        }

        references.push(firstReference, secondReference, thirdReference)

        this.sendReferences(references).then(data => {
        }).catch(e => {
          console.log(e)
        })

        if (this.isDirector) {
          var credits = []

          var firstCredit = {
            credit: this.firstCreditName,
            contact: this.firstCreditPhone,
            creditTypeId: this.firstCreditType,
            castingDirectorId: JSON.parse(localStorage.getItem('logged_profile')).id
          }

          var secondCredit = {
            credit: this.secondCreditName,
            contact: this.secondCreditPhone,
            creditTypeId: this.secondCreditType,
            castingDirectorId: JSON.parse(localStorage.getItem('logged_profile')).id
          }

          var thirdCredit = {
            credit: this.thirdCreditName,
            contact: this.thirdCreditPhone,
            creditTypeId: this.thirdCreditType,
            castingDirectorId: JSON.parse(localStorage.getItem('logged_profile')).id
          }

          credits.push(firstCredit, secondCredit, thirdCredit)

          this.sendCredits(credits).then(data => {
          }).catch(e => {
            console.log(e)
          })
        }

        localStorage.removeItem('registration_in_progress')

        if (isAgent()) {
          this.$router.push('/agent-dashboard')
        } else {
          this.$router.push('/director-dashboard')
        }
      }
    },
    sendReferences (references) {
      let config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token')
        }
      }

      var data = { references: references }

      var roleResource = (this.isDirector ? 'castingdirectors' : 'agents')

      return Axios.post(`${CastingComplexAPI}/${roleResource}/references`, data, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    sendCredits (credits) {
      // sendCredits is only used by directors, so there's no need to check isDirector
      let config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token')
        }
      }

      var data = { credits: credits }

      return Axios.post(`${CastingComplexAPI}/castingdirectors/credits`, data, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    destroySignedUser () {
      let config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token')
        }
      }
      var roleResource = (this.isDirector ? 'castingdirectors' : 'agents')

      return Axios.delete(`${CastingComplexAPI}/${roleResource}`, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    }
  }
}
</script>

<style lang="scss">
@import "./../../assets/styles";

@media screen and (max-width: 600px){
  .content {
    padding-top: 0px !important;
    padding-bottom: 150px !important;
  }
}

.input-group.input-group--selection-controls .input-group__input .icon--selection-control {
  color: rgba(0,0,0,.54) !important;
}

.role-btn {
  font-size: 14px !important;
}

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

.fa-question-circle {
  color: $background-color !important;
  font-size: 32px !important;
}

.card__text {
  color: black !important;
  text-align: left !important;
}
.profile-btn {
  width: 100px !important;
  height: 100px !important;
}
</style>
