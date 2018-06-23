<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container>
          <v-layout row justify-center>
            <v-flex xs12 md12 lg8 xl8>
              <v-tabs
                v-model="active"
                color="primary"
                dark
                show-arrows
                centered
                slider-color="yellow"
              >
                <v-tab ripple >
                  Edit general information
                </v-tab>
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-form v-model="valid" ref="form">
                        <v-layout row wrap justify-space-around>
                          <v-flex sm5 xs12>
                            <h3>Personal information</h3>
                            <v-text-field
                              label="First name"
                              name="firstname"
                              v-model=firstName
                              :error-messages="firstNameErrors"
                              @input="$v.firstName.$touch()"
                              @blur="$v.firstName.$touch()"
                              required
                            ></v-text-field>
                            <v-text-field
                              label="Middle name"
                              name="secondname"
                              v-model="middleName"
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
                            <h3>Contact information</h3>
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
                            <v-text-field name="zip" label="Zip/Postal-code" v-model="zipPostal" :error-messages="postalCodeErrors"
                              @input="$v.zipPostal.$touch()"
                              @blur="$v.zipPostal.$touch()" required ></v-text-field>
                            <v-select
                              autocomplete
                              @change="getCities"
                              item-text="name"
                              item-value="id"
                              :items="Countries"
                              v-model="countryId"
                              label="Country"
                              single-line
                              :error-messages="countryErrors"
                              @input="$v.countryId.$touch()"
                              @blur="$v.countryId.$touch()"
                              required
                            ></v-select>
                            <v-select
                              autocomplete
                              :items="Cities"
                              item-text="name"
                              item-value="id"
                              v-model="cityId"
                              label="City"
                              single-line
                              :error-messages="cityErrors"
                              @input="$v.cityId.$touch()"
                              @blur="$v.cityId.$touch()"
                              required
                            ></v-select>
                            <v-spacer></v-spacer>
                          </v-flex>
                          <v-flex sm5 xs12>
                            <h3>Profile details</h3>
                            <v-text-field
                              label="Agency name"
                              name="agencyName"
                              v-model="agencyName"
                            ></v-text-field>
                            <v-text-field
                              label="Position"
                              name="position"
                              v-model="position"
                            ></v-text-field>
                            <v-text-field
                              label="Roster size"
                              name="sizeOfRoster"
                              v-model="sizeOfRoster"
                            ></v-text-field>
                            <v-select
                              :items="AgencyDivisions"
                              v-model="agencyDivisionId"
                              label="Agency divisions"
                              item-text="name"
                              item-value="id"
                              multiple
                              max-height="400"
                              hint="Pick your agency divisions"
                              persistent-hint
                            ></v-select>
                            <v-select
                              :items="RosterTypes"
                              v-model="rosterTypeId"
                              label="Roster types"
                              item-text="name"
                              item-value="id"
                              multiple
                              max-height="400"
                              hint="Pick your roster types"
                              persistent-hint
                            ></v-select>
                            <v-divider></v-divider>
                            <v-text-field
                            v-model="profile"
                            color="teal"
                            multi-line
                            :rows=14
                          >
                              <div slot="label">
                                Bio
                              </div>
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row>
                          <v-btn class="small-btn" block color="primary" @click="submit" :disabled="!valid" >Update profile</v-btn>
                        </v-layout>
                        <v-snackbar
                          :timeout="timeout"
                          bottom
                          :color="snackColor"
                          v-model="snackbar"
                        >
                          {{ snackbarText }}
                          <v-btn flat color="white" @click.native="snackbar = false">Close</v-btn>
                        </v-snackbar>
                      </v-form>
                      </v-card-text>
                    </v-card>
                </v-tab-item>
              </v-tabs>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    <app-footer></app-footer>
</main>
</template>

<script>
import Axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

const CastingComplexAPI = `http://${window.location.hostname}:5050`
export default {
  mixins: [validationMixin],
  validations: {
    firstName: { required, maxLength: maxLength(20) },
    phone: { required },
    streetAddress: { required },
    zipPostal: { required },
    countryId: { required },
    cityId: { required },
    lastName: { required, maxLength: maxLength(20) },
    email: { required,
      email,
      isUnique (value) {
        // standalone validator ideally should not assume a field is required
        if (value === '') return true
        // If it's the same as the current email, it's all good
        if (value === this.loggedProfile.user.email) return true
        // Call endpoint to check if email is unique
        return this.isEmailUnique(value).then((val) => {
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
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      !this.$v.email.isUnique && errors.push('E-mail must be unique')
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
      if (!this.$v.zipPostal.$dirty) return errors
      !this.$v.zipPostal.required && errors.push('Postal code is required')
      return errors
    },
    countryErrors () {
      const errors = []
      if (!this.$v.countryId.$dirty) return errors
      !this.$v.countryId.required && errors.push('Country is required')
      return errors
    },
    cityErrors () {
      const errors = []
      if (!this.$v.cityId.$dirty) return errors
      !this.$v.cityId.required && errors.push('City is required')
      return errors
    }
  },
  data () {
    return {
      headers: [{
        text: 'Project',
        align: 'left',
        value: 'project'
      },
      { text: 'Role', value: 'role' },
      { text: 'Type', value: 'type' },
      { text: 'Year', value: 'year' }],
      dialog: false,
      snackbar: false,
      y: 'bottom',
      snackColor: '',
      x: null,
      timeout: 6000,
      mode: 'vertical',
      snackbarText: 'Hello, I\'m a snackbar',
      loggedProfile: (function () { return JSON.parse(localStorage.getItem('logged_profile')) })(),
      menu1: false,
      valid: '',
      active: null,
      Cities: [],
      Countries: [],
      AgencyDivisions: [],
      agencyDivisionId: '',
      RosterTypes: [],
      rosterTypeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      streetAddress: '',
      zipPostal: '',
      phone: '',
      mobile: '',
      profile: '',
      countryId: '',
      cityId: '',
      email: '',
      agencyName: '',
      sizeOfRoster: '',
      position: ''
    }
  },
  created () {
    // TODO : check if user logged!
    // Here we map the user data from the localStorage to the props of the component
    this.mapAgentToProps()
    this.getCountries()
    this.getCities(this.loggedProfile.countryId)
    this.getExtras()
  },
  methods: {
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
    mapAgentToProps () {
      var profile = JSON.parse(localStorage.getItem('logged_profile'))
      this.firstName = profile.firstName
      this.middleName = profile.middleName
      this.lastName = profile.lastName
      this.streetAddress = profile.streetAddress
      this.zipPostal = profile.zipPostal
      this.phone = profile.phone
      this.mobile = profile.mobile
      this.countryId = profile.countryId
      this.cityId = profile.cityId
      this.profile = profile.profile
      this.email = profile.user.email
      this.rosterTypeId = profile.rosterTypeId
      this.agencyDivisionId = profile.agencyDivisionId
      this.agencyName = profile.agencyName
      this.sizeOfRoster = profile.sizeOfRoster
      this.position = profile.position
    },
    submit () {
      // Trigger validation
      this.$v.$touch()
      // If all fields are valid, submit request
      var invalidFields = Object.keys(this.$v.$params)
      console.log(invalidFields)
      if (!this.$v.$error) {
        this.updateAgent().then(data => {
          // If all went smoothly, add session token to browser in order to keep session
          localStorage.setItem('logged_profile', JSON.stringify(data.data.data))
          this.mapAgentToProps()
          this.snackColor = 'success'
          this.snackbar = true
          this.snackbarText = 'Profile updated! :-)'
        }).catch(e => {
          // If something went wrong, we use a snackbar to show the error
          console.log(e)
          this.snackColor = 'error'
          this.snackbar = true
          this.snackbarText = 'Oh no! Something went wrong. We are on it!'
        })
      }
    },
    updateAgent () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var updatedAgent = {
        user: (function (emailProp, profileEmail) {
          if (emailProp === profileEmail) {
            return null
          } else {
            return { email: emailProp }
          }
        })(this.email, this.loggedProfile.user.email),
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        streetAddress: this.streetAddress,
        zipPostal: this.zipPostal,
        phone: this.phone,
        mobile: this.phone,
        profile: this.profile,
        rosterTypeId: this.rosterTypeId,
        agencyDivisionId: this.agencyDivisionId,
        cityId: this.cityId,
        countryId: this.countryId,
        agencyName: this.agencyName,
        sizeOfRoster: this.sizeOfRoster,
        position: this.position
      }
      return Axios.put(`${CastingComplexAPI}/agents`, updatedAgent, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
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
          this.AgencyDivisions = data.data.data['AgencyDivision']
          this.RosterTypes = data.data.data['RosterType']
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

</style>
