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
                <v-flex sm6 xs10>
                  <div> <h3> Select your plan </h3> </div>
                  <v-radio-group v-model="paymentOption">
                  <v-radio
                    :label="`$99/year, billed annualy`"
                    :value="1"
                  ></v-radio>
                  <v-radio
                    :label="`$10/month, billed monthly`"
                    :value="2"
                  ></v-radio>
                  </v-radio-group>
                  <div> <h3> Payment information </h3> </div>
                  <v-text-field
                    label="Name on credit card"
                    name="name"
                    v-model="nameCreditCard"
                    :error-messages="nameErrors"
                    @input="$v.nameCreditCard.$touch()"
                    @blur="$v.nameCreditCard.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Credit card number"
                    name="number"
                    v-model="creditCardNumber"
                    :mask="`credit-card`"
                    :error-messages="numberErrors"
                    @input="$v.creditCardNumber.$touch()"
                    @blur="$v.creditCardNumber.$touch()"
                    required
                  ></v-text-field>
                  <v-layout row>
                    <v-select
                    label="Month"
                    name="number"
                    :items="months"
                    item-text="name"
                    item-value="id"
                    v-model="month"
                    max-height="400"
                    hint="Expiry month"
                    persistent-hint
                    :error-messages="monthErrors"
                    @input="$v.month.$touch()"
                    @blur="$v.month.$touch()"
                    required
                    ></v-select>
                    <v-select
                    label="Year"
                    name="number"
                    :items="years"
                    v-model="year"
                    :error-messages="yearErrors"
                    @input="$v.year.$touch()"
                    @blur="$v.year.$touch()"
                    required
                    ></v-select>
                  </v-layout>
                  <v-text-field
                    label="CVV"
                    name="number"
                    v-model="cvv"
                    :error-messages="cvvErrors"
                    @input="$v.cvv.$touch()"
                    @blur="$v.cvv.$touch()"
                    required
                    ></v-text-field>
                   <v-btn class="small-btn" block color="primary" @click="submit" :disabled="!valid" >Pay ${{ total() }}
                   </v-btn>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { isLoggedIn } from '@/components/authentication'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  mixins: [validationMixin],
  validations: {
    nameCreditCard: { required },
    creditCardNumber: { required },
    month: { required },
    year: { required },
    cvv: { required }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.nameCreditCard.$dirty) return errors
      !this.$v.nameCreditCard.required && errors.push('Name is required.')
      return errors
    },
    numberErrors () {
      const errors = []
      if (!this.$v.creditCardNumber.$dirty) return errors
      !this.$v.creditCardNumber.required && errors.push('Credit card is required.')
      return errors
    },
    monthErrors () {
      const errors = []
      if (!this.$v.month.$dirty) return errors
      !this.$v.month.required && errors.push('Month is required.')
      return errors
    },
    yearErrors () {
      const errors = []
      if (!this.$v.year.$dirty) return errors
      !this.$v.year.required && errors.push('Year is required.')
      return errors
    },
    cvvErrors () {
      const errors = []
      if (!this.$v.cvv.$dirty) return errors
      !this.$v.cvv.required && errors.push('CVV is required.')
      return errors
    }
  },
  data: () => ({
    year: '',
    month: '',
    nameCreditCard: '',
    creditCardNumber: '',
    cvv: '',
    months: [{name: 'January', id: 1}, {name: 'February', id: 2}, {name: 'March', id: 3}, {name: 'April', id: 4}, {name: 'May', id: 5}, {name: 'June', id: 6}, {name: 'July', id: 7}, {name: 'August', id: 8}, {name: 'September', id: 9}, {name: 'October', id: 10}, {name: 'November', id: 11}, {name: 'December', id: 12}],
    years: [],
    valid: false,
    paymentOption: 1,
    firstName: function () {
      var loggedProfile = localStorage.getItem('logged_profile')
      if (loggedProfile !== null) {
        return JSON.parse(loggedProfile).firstName
      } else { return '' }
    },
    total: function () { if (this.paymentOption === 2) return 10; else return 99 }
  }),
  mounted () {
    this.getYears()
  },
  beforeCreate () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  methods: {
    cancel () {
      this.destroySignedActor().then(() => {
        localStorage.removeItem('session_token')
        localStorage.removeItem('logged_profile')
        this.$router.push('/')
      }).catch(e => {
        console.log(e)
      })
    },
    submit () {
      console.log('Skipping payment for now')
      console.log('submitted')
      localStorage.removeItem('registration_in_progress')
      // TODO: This redirect should be to user's dashboard
      this.$router.push('/actor-dashboard')
    },
    getYears () {
      var endYear = 10
      var currentYear = new Date().getFullYear()

      var initialYear = currentYear
      while (initialYear <= (currentYear + endYear)) {
        this.years.push(initialYear++)
      }
    },
    destroySignedActor () {
      let config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token')
        }
      }
      return Axios.delete(`${CastingComplexAPI}/actors`, config).then(function (response) {
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
