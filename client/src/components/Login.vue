<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-media src="/static/img/login2.jpg" height="200px">
        </v-card-media>
        <v-card-title>
          <span class="headline">Welcome back!</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
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
              <v-text-field
                    label="Email or username" required
                    v-model="usernameOrEmail"
                    :error-messages="loginErrors"
                    @input="$v.usernameOrEmail.$touch()"
                    @blur="$v.usernameOrEmail.$touch()"
                  ></v-text-field>
              <v-flex xs12>
                <v-text-field
                    v-model="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    name="password"
                    label="Password"
                    :error-messages="passwordErrors"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    required
                  ></v-text-field>
                  <small><a href="/" >Recover password</a></small>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="submit">Sign in</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import {bus} from '../main'
import { login } from '@/components/authentication'

export default {
  mixins: [validationMixin],
  validations: {
    usernameOrEmail: { required },
    password: { required }
  },
  data: () => ({
    dialog: '',
    color: 'error',
    mode: '',
    y: 'top',
    e1: false,
    snackbar: false,
    timeout: 6000,
    errorMessage: 'Hello, I\'m a snackbar',
    password: '',
    usernameOrEmail: '',
    authFailed: false
  }),
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$error) {
        var loginRequest = {
          username: this.usernameOrEmail,
          password: this.password
        }
        login(loginRequest).then(success => {
          if (success) {
            this.dialog = false
            // Sends signal back
            bus.$emit('logged', true)
          } else {
            this.snackbar = true
            this.errorMessage = 'Email/username or password incorrect! :-('
            this.authFailed = true
            this.$v.$touch()
          }
        })
      }
    }
  },
  computed: {
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      this.authFailed && errors.push('Wrong password or username/email')
      !this.$v.password.required && errors.push('Password is required.')
      return errors
    },
    loginErrors () {
      const errors = []
      if (!this.$v.usernameOrEmail.$dirty) return errors
      this.authFailed && errors.push('Wrong password or username/email')
      !this.$v.usernameOrEmail.required && errors.push('Username or email is required.')
      return errors
    }
  },
  created () {
    // Listen signal to open login modal
    var vm = this
    bus.$on('dialog', function (value) {
      vm.dialog = value
    })
  }
}
</script>
