<template>
 <main app>
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <v-content>
      <v-container fluid grid-list-md text-xs-center>
        <v-flex xl6 offset-xl3 lg8 offset-lg2 md12 xs12 sm12>
          <v-card>
            <v-card-media src="/static/img/join-actor.jpg" height="200px">
            </v-card-media>
            <v-layout row justify-center>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline">Joining as actor</h3>
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
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Legal name"
                    name="fullname"
                    v-model="legalName"
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
                    required
                  ></v-select>
                  <v-select
                    autocomplete
                    :items="Cities"
                    item-text="name"
                    item-value="id"
                    v-model="selectedCity"
                    :disabled="!countrySelected"
                    label="City"
                    single-line
                    required
                  ></v-select>
                  <v-text-field
                    label="Username"
                    name="Username"
                    v-model="username"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    name="password"
                    label="Password"
                    hint="At least 8 characters"
                    min="8"
                    counter
                    required
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-checkbox
                    label="I have an agent"
                    v-model="isRepresented"
                  ></v-checkbox>
                  <v-layout row justify-content-start>
                  <v-btn class="small-btn" block color="primary" @click="submit" :disabled="!valid" >Proceed to payment</v-btn>
                  </v-layout>
                  
                </v-flex>
                <v-flex sm5 xs5>
                  <v-text-field
                    label="Phone"
                    name="phone"
                    v-model="phone"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    name="email"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Street address"
                    name="address1"
                    v-model="streetAddress"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Suite/Apt"
                    name="number"
                    v-model="suite"
                    required
                  ></v-text-field>
                  <v-text-field name="zip" label="Zip/Postal-code" v-model="postalCode" required ></v-text-field>
                   <v-select
                    :items="Credits"
                    v-model="selectedCredits"
                    label="Credits"
                    item-text="name"
                    item-value="id"
                    multiple
                    max-height="400"
                    hint="Pick your credits"
                    persistent-hint
                  ></v-select>
                  <v-select
                    :items="Unions"
                    v-model="selectedUnions"
                    label="Unions"
                    item-text="name"
                    item-value="id"
                    multiple
                    max-height="400"
                    hint="Pick your unions"
                    persistent-hint
                  ></v-select>
                   <v-text-field name="firstname" label="Name of your agent" v-if="isRepresented" v-model="agentName" required></v-text-field>
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
// import Authentication from '@/components/pages/Authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`
var _ = require('lodash');

export default {
    data: () => ({
      e1: false,
      selectedCredits: [],
      selectedUnions: [],
      username: '',
      password: '',
      valid: true,
      postalCode: '',
      firstName: '',
      middleName: '',
      lastName: '',
      agentName: '',
      isRepresented: false,
      legalName: '',
      phone: '',
      email: '',
      streetAddress: '',
      suite: '',
      selectedCity: [],
      Cities: [],
      countrySelected: false,
      selectedCountry: [],
      Countries: [],
      Credits: [],
      Unions: [],
      enabled: false,
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]
    }),
    mounted () {
      // Initially load all countries
      this.getCountries()
      this.getExtras()
  },
  methods: {
    getExtras(context) {
      Axios.get(`${CastingComplexAPI}/extras`)
        .then((data) => {
          this.Credits = data.data.data["Credit"] 
          this.Unions = data.data.data["Union"] 
        }).catch((err) => {
          console.log(err)
        })
    },
    getCities(country) {
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
        if (this.$refs.form.validate()) {
          var signUpActor = {
            user: {
              username: this.username,
              email: this.email,
              roleId: 1,
              password: this.password
            },
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            legalName: this.legalName,
            streetAddress: this.streetAddress,
            phone: this.phone,
            mobile: this.phone,
            suite: this.suite,
            isRepresented: this.isRepresented,
            creditId: this.selectedCredits,
            unionId: this.selectedUnions
          }
          console.log(signUpActor)
          Axios.post(`${CastingComplexAPI}/actors`, signUpActor).then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log("im here")
            console.log(error);
          });
        }
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
      padding-top: 200px !important;
      padding-bottom: 150px !important;
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