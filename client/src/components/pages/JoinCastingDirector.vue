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
            <v-layout row justify-center>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline">Joining as casting director</h3>
                </div>
              </v-card-title>
            </v-layout>
            <v-form v-model="valid" ref="form">
              <v-layout row justify-space-around>
                <v-flex sm5 xs5>
                  <v-text-field
                    label="First name"
                    name="firstname"
                    v-model="firstName"
                    :error-messages="firstNameErrors"
                    @input="$v.firstName.$touch()"
                    @blur="$v.firstName.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Middle name"
                    name="secondname"
                    v-model="middleName"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Last name"
                    name="lastname"
                    v-model="lastName"
                    :error-messages="lastNameErrors"
                    @input="$v.lastName.$touch()"
                    @blur="$v.lastName.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Legal name"
                    name="fullname"
                    v-model="legalName"
                    :error-messages="legalNameErrors"
                    @input="$v.legalName.$touch()"
                    @blur="$v.legalName.$touch()"
                    required
                  ></v-text-field>
                  <v-select
                    autocomplete
                    @change="getCities"
                    item-text="name"
                    item-value="id"
                    :items="Countries"
                    v-model="selectedCountry"
                    label="Country"
                    single-line
                    :error-messages="countryErrors"
                    @input="$v.selectedCountry.$touch()"
                    @blur="$v.selectedCountry.$touch()"
                    required
                  ></v-select>
                  <v-text-field
                    label="Company name"
                    name="name"
                    v-model="companyName"
                    :error-messages="companyNameErrors"
                    @input="$v.companyName.$touch()"
                    @blur="$v.companyName.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Username"
                    name="Username"
                    v-model="username"
                    :error-messages="usernameErrors"
                    @input="$v.username.$touch()"
                    @blur="$v.username.$touch()"
                    required
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-layout row justify-content-start>
                  <v-snackbar
                    :timeout="timeout"
                    :color="color"
                    :top="y === 'top'"
                    :multi-line="mode === 'multi-line'"
                    :vertical="mode === 'vertical'"
                    v-model="snackbar"
                  >
                    {{ errorMessage }}
                    <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
                  </v-snackbar>
                  </v-layout>

                </v-flex>
                <v-flex sm5 xs5>
                  <v-text-field
                    label="Phone"
                    name="phone"
                    v-model="phone"
                    :error-messages="phoneErrors"
                    @input="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    name="email"
                    v-model="email"
                    :error-messages="emailErrors"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Street address"
                    name="address1"
                    v-model="streetAddress"
                    :error-messages="streetAddressErrors"
                    @input="$v.streetAddress.$touch()"
                    @blur="$v.streetAddress.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field name="zip" label="Zip/Postal-code" v-model="postalCode" :error-messages="postalCodeErrors"
                    @input="$v.postalCode.$touch()"
                    @blur="$v.postalCode.$touch()" required ></v-text-field>
                  <v-select
                  autocomplete
                  :items="Cities"
                  item-text="name"
                  item-value="id"
                  v-model="selectedCity"
                  :disabled="!countrySelected"
                  label="City"
                  single-line
                  :error-messages="cityErrors"
                  @input="$v.selectedCity.$touch()"
                  @blur="$v.selectedCity.$touch()"
                  required
                  ></v-select>
                  <v-text-field
                    label="Job title or position"
                    name="name"
                    v-model="position"
                    :error-messages="positionErrors"
                    @input="$v.position.$touch()"
                    @blur="$v.position.$touch()"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    name="password"
                    label="Password"
                    hint="At least 6 characters"
                    min="6"
                    counter
                    :error-messages="passwordErrors"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-btn class="small-btn" block color="primary" @click="submit" :disabled="!valid" >Proceed</v-btn>
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
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import { isLoggedIn, isDirector } from '@/components/authentication'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  mixins: [validationMixin],
  validations: {
    firstName: { required, maxLength: maxLength(20) },
    password: { required, minLength: minLength(6) },
    phone: { required },
    streetAddress: { required },
    postalCode: { required },
    selectedCountry: { required },
    selectedCity: { required },
    companyName: { required },
    position: { required },
    lastName: { required, maxLength: maxLength(20) },
    legalName: { required, maxLength: maxLength(70) },
    email: { required,
      email,
      isUnique (value) {
        // standalone validator ideally should not assume a field is required
        if (value === '') return true
        // Call endpoint to check if email is unique
        return this.isEmailUnique(value).then((val) => {
          return val
        }).catch((val) => {
          return true
        })
      }
    },
    username: { required,
      isUnique (value) {
        // standalone validator ideally should not assume a field is required
        if (value === '') return true
        // Call endpoint to check if username is unique
        return this.isUsernameUnique(value).then((val) => {
          return val
        }).catch((val) => {
          return true
        })
      }
    }
  },
  computed: {
    firstNameErrors () {
      const errors = []
      if (!this.$v.firstName.$dirty) return errors
      !this.$v.firstName.maxLength && errors.push('Name must be at most 10 characters long')
      !this.$v.firstName.required && errors.push('Name is required.')
      return errors
    },
    lastNameErrors () {
      const errors = []
      if (!this.$v.lastName.$dirty) return errors
      !this.$v.lastName.maxLength && errors.push('Name must be at most 10 characters long')
      !this.$v.lastName.required && errors.push('Name is required.')
      return errors
    },
    legalNameErrors () {
      const errors = []
      if (!this.$v.legalName.$dirty) return errors
      !this.$v.legalName.maxLength && errors.push('Name must be at most 10 characters long')
      !this.$v.legalName.required && errors.push('Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      !this.$v.email.isUnique && errors.push('E-mail must be unique')
      return errors
    },
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('Username is required')
      !this.$v.username.isUnique && errors.push('Username must be unique')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push('Minimum of 6 characters')
      !this.$v.password.required && errors.push('Password is required')
      return errors
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push('Phone is required')
      return errors
    },
    streetAddressErrors () {
      const errors = []
      if (!this.$v.streetAddress.$dirty) return errors
      !this.$v.streetAddress.required && errors.push('Street address is required')
      return errors
    },
    postalCodeErrors () {
      const errors = []
      if (!this.$v.postalCode.$dirty) return errors
      !this.$v.postalCode.required && errors.push('Postal code is required')
      return errors
    },
    countryErrors () {
      const errors = []
      if (!this.$v.selectedCountry.$dirty) return errors
      !this.$v.selectedCountry.required && errors.push('Country is required')
      return errors
    },
    cityErrors () {
      const errors = []
      if (!this.$v.selectedCity.$dirty) return errors
      !this.$v.selectedCity.required && errors.push('City is required')
      return errors
    },
    companyNameErrors () {
      const errors = []
      if (!this.$v.companyName.$dirty) return errors
      !this.$v.companyName.required && errors.push('Company name is required')
      return errors
    },
    positionErrors () {
      const errors = []
      if (!this.$v.position.$dirty) return errors
      !this.$v.position.required && errors.push('Position is required')
      return errors
    }
  },
  data: () => ({
    y: 'top',
    snackbar: false,
    color: 'error',
    mode: '',
    timeout: 6000,
    errorMessage: 'Hello, I\'m a snackbar',
    e1: false,
    username: '',
    password: '',
    postalCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    legalName: '',
    phone: '',
    email: '',
    streetAddress: '',
    selectedCity: [],
    Cities: [],
    companyName: '',
    position: '',
    countrySelected: false,
    selectedCountry: [],
    Countries: [],
    enabled: false,
    valid: false,
    name: ''
  }),
  beforeCreate () {
    var referencesSent = localStorage.getItem('references_sent')
    if (isLoggedIn()) {
      if (!isDirector()) {
        this.$router.push('/')
      } else {
        if (referencesSent === 'false' || referencesSent === null) {
          this.$router.push('/references')
        } else {
          this.$router.push('/')
        }
      }
    }
  },
  mounted () {
    // Initially load all countries
    this.getCountries()
    this.getExtras()
  },
  methods: {
    isUsernameUnique (username) {
      return Axios.get(`${CastingComplexAPI}/users?username=${username}`)
        .then(() => {
          return false
        }).catch(() => {
          return true
        })
    },
    isEmailUnique (email) {
      return Axios.get(`${CastingComplexAPI}/users?email=${email}`)
        .then(() => {
          return false
        }).catch(() => {
          return true
        })
    },
    getExtras (context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.Credits = data.data.data['Credit']
          this.Unions = data.data.data['Union']
        }).catch((err) => {
          console.log(err)
        })
    },
    getCities (country) {
      // add COMMENTABOUTBELOWLINE
      if (typeof country === 'number') {
        Axios.get(`${CastingComplexAPI}/extras/cities/${country}`)
          .then((data) => {
            this.Cities = data.data.data
            this.countrySelected = true
          }).catch((err) => {
            console.log(err)
          })
      }
    },
    getCountries (context) {
      Axios.get(`${CastingComplexAPI}/extras/countries`)
        .then((data) => {
          this.Countries = data.data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    submit () {
      // Trigger validation
      this.$v.$touch()
      // If all fields are valid, submit request
      if (!this.$v.$error) {
        this.signUpDirector().then(data => {
          // If all went smoothly, add session token to browser in order to keep session
          localStorage.setItem('session_token', data.data.session_token)
          localStorage.setItem('logged_profile', JSON.stringify(data.data.data))
          this.$router.push('/references')
        }).catch(e => {
          // If something went wrong, we use a snackbar to show the error
          this.snackbar = true
          this.errorMessage = e.error
        })
      }
    },
    signUpDirector () {
      var signUpDirector = {
        user: {
          username: this.username,
          email: this.email,
          roleId: 2,
          password: this.password
        },
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        legalName: this.legalName,
        zipPostal: this.postalCode,
        cityId: this.selectedCity,
        countryId: this.selectedCountry,
        companyName: this.companyName,
        position: this.position,
        streetAddress: this.streetAddress,
        phone: this.phone,
        mobile: this.phone,
        specializationId: []
      }
      return Axios.post(`${CastingComplexAPI}/castingdirectors`, signUpDirector).then(function (response) {
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
  @media screen and (max-width: 600px){
    .small-btn {
      font-size: 10px !important;
    }
    .input-group label {
      font-size: 10px !important;
    }
    .content {
      padding-top: 0px !important;
      padding-bottom: 150px !important;
    }
  }
  @import "./../../assets/styles";
  .input-group.input-group--selection-controls .input-group__input .icon--selection-control {
    color: rgba(0,0,0,.54) !important;
  }
  .role-btn {
    font-size: 14px !important;
  }

  @media screen and (max-width: 600px){
    .role-btn {
      font-size: 12px !important;
    }
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
