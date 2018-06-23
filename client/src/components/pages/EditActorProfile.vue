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
                <v-tab ripple >
                  Edit your skills
                </v-tab>
                <v-tab ripple >
                  Edit your experiences
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
                            <v-text-field
                              label="Legal name"
                              name="fullname"
                              v-model="legalName"
                              :error-messages="legalNameErrors"
                              @input="$v.legalName.$touch()"
                              @blur="$v.legalName.$touch()"
                              required
                            ></v-text-field>
                            <v-text-field
                              slot="activator"
                              v-model="birthdate"
                              label="Birthday"
                              hint="MM/DD/YYYY format"
                              persistent-hint
                              @blur="date = parseDate(birthdate)"
                            ></v-text-field>
                            <v-select
                              :items="Genders"
                              v-model="genderId"
                              label="Gender"
                              item-text="name"
                              item-value="id"
                              max-height="400"
                              persistent-hint
                            ></v-select>
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
                            <v-text-field
                              label="Suite/Apt"
                              name="number"
                              v-model="suite"
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
                              label="Height"
                              name="height"
                              v-model="height"
                              suffix="cm"
                            ></v-text-field>
                            <v-text-field
                              label="Weight"
                              name="weight"
                              v-model="weight"
                              suffix="kg"
                            ></v-text-field>
                            <v-select
                              :items="Eyes"
                              v-model="eyeId"
                              label="Eyes"
                              item-text="name"
                              item-value="id"
                              max-height="400"
                              hint="Pick the color of your eyes"
                              persistent-hint
                            ></v-select>
                            <v-select
                              :items="Hair"
                              v-model="hairId"
                              label="Hair"
                              item-text="name"
                              item-value="id"
                              max-height="400"
                              hint="Pick the color of your hair"
                              persistent-hint
                            ></v-select>
                            <v-select
                              :items="Ethnicity"
                              v-model="ethnicityId"
                              label="Ethnicity"
                              item-text="name"
                              item-value="id"
                              max-height="400"
                              hint="Pick your ethnicity"
                              persistent-hint
                            ></v-select>
                            <v-select
                              :items="Credits"
                              v-model="creditId"
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
                              v-model="unionId"
                              label="Unions"
                              item-text="name"
                              item-value="id"
                              multiple
                              max-height="400"
                              hint="Pick your unions"
                              persistent-hint
                            ></v-select>
                            <v-select
                              autocomplete
                              :items="Languages"
                              v-model="languageId"
                              label="Languages"
                              item-text="name"
                              item-value="id"
                              multiple
                              max-height="400"
                              hint="Pick the languages that you speak"
                              persistent-hint
                            ></v-select>
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
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-form v-model="validSkills" ref="form">
                        <v-layout row wrap align-start justify-space-around>
                          <v-flex sm5 xs12>
                           <h3>Search, select, and add some skills</h3>
                           <v-select
                              v-model="selectedSkill"
                              :items="Skills"
                              chips
                              autocomplete
                              label="Type here to search"
                              tags
                              solo
                              prepend-icon="filter_list"
                              append-icon=""
                              clearable
                            >
                              <template slot="selection" slot-scope="data">
                                <v-chip
                                  :selected="data.selected"
                                  close
                                  @input="removeSkill(data.item)"
                                >
                                  <strong>{{ data.item }}</strong>&nbsp;
                                </v-chip>
                              </template>
                            </v-select>
                          </v-flex>
                          <v-flex sm2 xs12 py-4>
                            <v-btn @click="submitSkillUpdate" color="primary">Add</v-btn>
                          </v-flex>
                          <v-flex sm4 xs12>
                            <h3>Your skills</h3>
                             <v-chip
                                v-for="skill in actorSkills"
                                :key="skill.name"
                                v-model="skill.isOpen"
                                close
                                @input="deleteSkill(skill)"
                              >
                                {{skill.name}}
                              </v-chip>
                          </v-flex>
                        </v-layout>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-form v-model="validExperiences" ref="form">
                        <v-flex sm3>
                              <h3>Add a new experience</h3>
                            </v-flex>
                        <v-layout row wrap justify-space-around align-center>
                            <v-flex sm3 xs12>
                              <v-text-field
                                v-model="project"
                                label="Project name"
                                required
                              ></v-text-field>
                            </v-flex>
                            <v-flex sm2 xs12>
                              <v-text-field
                                v-model="role"
                                label="Role"
                                required
                              ></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12>
                              <v-select
                                autocomplete
                                :items="AgencyDivision"
                                item-text="name"
                                item-value="id"
                                v-model="projectType"
                                label="Type"
                                required
                              ></v-select>
                            </v-flex>
                            <v-flex sm1 xs12>
                              <v-text-field
                                v-model="year"
                                label="Year"
                                required
                              ></v-text-field>
                            </v-flex>
                            <v-flex sm1 xs12>
                              <v-btn @click="addExperience" small color="primary">Add</v-btn>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-layout row wrap>
                          <v-dialog v-model="dialog" max-width="700px">
                            <v-card>
                              <v-card-title>
                                <span class="headline">Edit experience</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container grid-list-md>
                                  <v-layout wrap>
                                    <v-flex xs12 sm6 md4>
                                      <v-text-field v-model="editedExperience.project" label="Project name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md3>
                                      <v-text-field v-model="editedExperience.role" label="Role"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md3>
                                      <v-select
                                        autocomplete
                                        :items="AgencyDivision"
                                        item-text="name"
                                        item-value="id"
                                        v-model="editedExperience.typeId"
                                        label="Type"
                                      ></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md2>
                                      <v-text-field v-model="editedExperience.year" label="Year"></v-text-field>
                                    </v-flex>
                                  </v-layout>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="saveEditExperience">Save</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <h3>Your experiences</h3>
                          <v-flex sm12>
                            <v-data-table
                            :headers="headers"
                            :items="experiences"
                            :no-data-text="noExperience"
                          >
                            <template slot="items" slot-scope="props">
                              <td>{{ props.item.project }}</td>
                              <td class="text-xs-left">{{ props.item.role }}</td>
                              <td class="text-xs-left">{{ props.item.type }}</td>
                              <td class="text-xs-left">{{ props.item.year }}</td>
                              <td class="justify-center layout px-0">
                                <v-btn icon class="mx-0" @click="editExperience(props.item)">
                                  <v-icon color="teal">edit</v-icon>
                                </v-btn>
                                <v-btn icon class="mx-0" @click="deleteExperience(props.item)">
                                  <v-icon color="pink">delete</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>
                          </v-flex>
                        </v-layout>
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
    suite: { required },
    countryId: { required },
    cityId: { required },
    lastName: { required, maxLength: maxLength(20) },
    legalName: { required, maxLength: maxLength(70) },
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
      noExperience: 'No added experiences',
      Skills: [],
      dialog: false,
      selectedSkill: '',
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
      validSkills: '',
      Credits: [],
      Unions: [],
      Genders: [],
      active: null,
      Eyes: [],
      Hair: [],
      Cities: [],
      Countries: [],
      Languages: [],
      Ethnicity: [],
      AgencyDivision: [],
      firstName: '',
      middleName: '',
      lastName: '',
      legalName: '',
      streetAddress: '',
      zipPostal: '',
      phone: '',
      mobile: '',
      suite: '',
      height: '',
      weight: '',
      profile: '',
      ethnicityId: '',
      countryId: '',
      cityId: '',
      email: '',
      languageId: '',
      genderId: '',
      skillId: '',
      creditId: '',
      unionId: '',
      hairId: '',
      eyeId: '',
      birthdate: '',
      actorSkills: '',
      date: '', // send this data to the backend
      project: '',
      role: '',
      projectType: '',
      year: '',
      experiences: '',
      validExperiences: '',
      editedIndex: -1,
      editedExperience: {
        id: '',
        project: '',
        role: '',
        typeId: '',
        year: ''
      },
      defaultExperience: {
        id: '',
        project: '',
        role: '',
        typeId: '',
        year: ''
      }
    }
  },
  watch: {
    date (val) {
      this.birthdate = this.formatDate(this.date)
    }
  },
  created () {
    // TODO : check if user logged!
    // Here we map the user data from the localStorage to the props of the component
    this.mapActorToProps()
    this.getCountries()
    this.getCities(this.loggedProfile.countryId)
    this.getExtras()
  },
  methods: {
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedExperience = Object.assign({}, this.defaultExperience)
        this.editedIndex = -1
      }, 300)
    },
    saveEditExperience () {
      this._saveEditExperience().then(data => {
        var profileToUpdate = JSON.parse(localStorage.getItem('logged_profile'))
        profileToUpdate.Experiences = data.data
        localStorage.setItem('logged_profile', JSON.stringify(profileToUpdate))
        this.mapActorToProps()
        this.close()
      }).catch(e => {
        console.log(e)
      })
    },
    _saveEditExperience () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      return Axios.put(`${CastingComplexAPI}/actors/experiences/${this.editedExperience.id}`, this.editedExperience, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    editExperience (item) {
      this.editedIndex = this.experiences.indexOf(item)
      this.editedExperience = Object.assign({}, item)
      this.dialog = true
    },
    deleteExperience (item) {
      const index = this.experiences.indexOf(item)

      if (confirm('Are you sure you want to delete this experience?')) {
        this._deleteExperience(item.id).then(data => {
          this.experiences.splice(index, 1)
          var profileToUpdate = JSON.parse(localStorage.getItem('logged_profile'))
          profileToUpdate.Experiences = data.data
          localStorage.setItem('logged_profile', JSON.stringify(profileToUpdate))
          this.mapActorToProps()
        }).catch(e => {
          console.log(e)
        })
      }
    },
    _deleteExperience (id) {
      var data = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }

      return Axios.delete(`${CastingComplexAPI}/actors/experiences/${id}`, data).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    addExperience () {
      this._addExperience().then(data => {
        var profileToUpdate = JSON.parse(localStorage.getItem('logged_profile'))
        profileToUpdate.Experiences = data.data
        localStorage.setItem('logged_profile', JSON.stringify(profileToUpdate))
        this.mapActorToProps()
      }).catch(e => {
        console.log(e)
      })
    },
    _addExperience () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var actorId = JSON.parse(localStorage.getItem('logged_profile')).id

      var experience = {
        project: this.project,
        typeId: this.projectType,
        role: this.role,
        year: this.year,
        ActorId: actorId
      }

      return Axios.post(`${CastingComplexAPI}/actors/experiences`, experience, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    deleteSkill (skill) {
      skill.isOpen = false
      this._deleteSkill(skill).then(data => {
        var profileToUpdate = JSON.parse(localStorage.getItem('logged_profile'))
        profileToUpdate.skillId = data.data.map(s => s.id)
        profileToUpdate.Skills = data.data.map(s => s.name)
        localStorage.setItem('logged_profile', JSON.stringify(profileToUpdate))
        this.mapActorToProps()
      }).catch(e => {
        console.log(e)
      })
    },
    _deleteSkill (skill) {
      var data = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        },
        params: {'skill': skill.name}
      }

      return Axios.delete(`${CastingComplexAPI}/actors/skills`, data).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    submitSkillUpdate () {
      if (this.selectedSkill.length === 0) return
      this.updateSkills().then(data => {
        var profileToUpdate = JSON.parse(localStorage.getItem('logged_profile'))
        profileToUpdate.skillId = data.data.map(s => s.id)
        profileToUpdate.Skills = data.data.map(s => s.name)
        localStorage.setItem('logged_profile', JSON.stringify(profileToUpdate))
        this.mapActorToProps()
        this.selectedSkill = []

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
    },
    updateSkills () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var updatedSkills = this.selectedSkill

      return Axios.post(`${CastingComplexAPI}/actors/skills`, updatedSkills, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    removeSkill (item) {
      this.selectedSkill.splice(this.selectedSkill.indexOf(item), 1)
      this.selectedSkill = [...this.selectedSkill]
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
    mapActorToProps () {
      var profile = JSON.parse(localStorage.getItem('logged_profile'))
      this.firstName = profile.firstName
      this.middleName = profile.middleName
      this.lastName = profile.lastName
      this.legalName = profile.legalName
      this.streetAddress = profile.streetAddress
      this.zipPostal = profile.zipPostal
      this.phone = profile.phone
      this.mobile = profile.mobile
      this.suite = profile.suite
      this.height = profile.height
      this.weight = profile.weight
      this.ethnicityId = profile.ethnicityId
      this.countryId = profile.countryId
      this.cityId = profile.cityId
      this.profile = profile.profile
      this.email = profile.user.email
      this.languageId = profile.languageId
      this.creditId = profile.creditId
      this.unionId = profile.unionId
      this.hairId = profile.hairId
      this.experiences = profile.Experiences
      this.genderId = profile.genderId
      this.eyeId = profile.eyeId
      this.skillId = profile.skillId
      this.actorSkills = profile.Skills.map(function (skill) {
        return {name: skill, isOpen: true}
      })
      if (profile.birthdate === 'Invalid date') {
        this.birthdate = ''
        this.date = ''
      } else {
        this.birthdate = this.formatDate(profile.birthdate)
        this.date = profile.birthdate
      }
    },
    submit () {
      // Trigger validation
      this.$v.$touch()
      // If all fields are valid, submit request
      if (!this.$v.$error) {
        this.updateActor().then(data => {
          // If all went smoothly, add session token to browser in order to keep session
          localStorage.setItem('logged_profile', JSON.stringify(data.data.data))
          this.mapActorToProps()
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
    updateActor () {
      var config = {
        headers: {
          'x-access-token': localStorage.getItem('session_token'),
          'Content-Type': undefined
        }
      }
      var updatedActor = {
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
        legalName: this.legalName,
        streetAddress: this.streetAddress,
        zipPostal: this.zipPostal,
        phone: this.phone,
        mobile: this.phone,
        suite: this.suite,
        height: this.height,
        profile: this.profile,
        weight: this.weight,
        hairId: this.hairId,
        eyeId: this.eyeId,
        ethnicityId: this.ethnicityId,
        genderId: this.genderId,
        languageId: this.languageId,
        cityId: this.cityId,
        countryId: this.countryId,
        creditId: this.creditId,
        unionId: this.unionId,
        birthdate: (this.date === '' ? null : this.date)
      }
      return Axios.put(`${CastingComplexAPI}/actors`, updatedActor, config).then(function (response) {
        return response
      })
        .catch(function (error) {
          return Promise.reject(error.response.data)
        })
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
          this.Eyes = data.data.data['Eye']
          this.Hair = data.data.data['Hair']
          this.Ethnicity = data.data.data['Ethnicity']
          this.Languages = data.data.data['Language']
          this.Genders = data.data.data['Gender']
          this.AgencyDivision = data.data.data['AgencyDivision']
          this.Skills = data.data.data['Skill'].map(s => s.name)
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
