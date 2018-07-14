<template>
  <v-dialog persistent v-model="sendMessageDialog" max-width="500px">
    <v-card>
      <v-card-title light primary-title class="headline primary white--text">
        Send message
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md12>
                <v-text-field
                  v-model="message"
                  color="primary"
                  multi-line
                  :rows=6
                  hint="Type your message here"
                  persistent-hint
                >
                </v-text-field>
              </v-flex>
              <v-flex md12>
                <v-alert transition="scale-transition" :value="messageSent" type="success">
                  Your message was sent! Check your inbox to see the conversation.
                  <v-btn flat color="white" @click.native="messageSent = false; cancel()">Close</v-btn>
                </v-alert>
              </v-flex>
            </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel()" color="error"><v-icon left>cancel</v-icon>cancel</v-btn>
        <v-btn @click="sendMessage()" color="primary"><v-icon left>send</v-icon>send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import Axios from 'axios'
import {bus} from '../main'
import io from 'socket.io-client'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      sendMessageDialog: false,
      fromUser: '',
      toUser: '',
      message: '',
      socket: '',
      messageSent: false
    }
  },
  methods: {
    cancel () {
      this.sendMessageDialog = false
    },
    sendMessage () {
      var data = {
        message: this.message,
        from: this.fromUser,
        to: this.toUser,
        read: false
      }
      this.socket.emit('send_message', data)
      this.messageSent = true
      this.message = ''
    }
  },
  mounted () {
    this.socket = io.connect(CastingComplexAPI)
  },
  created () {
    var vm = this
    bus.$on('open_message_dialog', function (data) {
      vm.fromUser = data.fromUser
      vm.toUser = data.toUser
      vm.sendMessageDialog = true
    })
  }
}
</script>
