<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex md4 lg4 xl2>
              <v-card>
                <v-card-title primary-title>
                  <h2>Recent messages</h2>
                </v-card-title>
                <v-card-text>
                  <v-list two-line>
                    <template v-for="(chat, index) in chats">
                      <v-list-tile avatar @click="toUser = chat.username" :key=index>
                        <v-list-tile-avatar>
                          <img :src="chat.avatar" >
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="chat.username"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="chat.lastMessage"></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md8 lg8 xl6>
              <v-card>
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex md12>
                        <v-select
                          autocomplete
                          :items="Users"
                          item-text="username"
                          item-value="username"
                          v-model="toUser"
                          label="Search by username"
                        >
                          <template slot="selection" scope="data">
                            <v-chip
                              @input="data.parent.selectItem(data.item)"
                              :selected="data.selected"
                              close
                              v-model="userChip"
                              :key="JSON.stringify(data.item)"
                            >
                              <v-avatar>
                                <img :src="data.item.avatar">
                              </v-avatar>
                              {{ data.item.username }}
                            </v-chip>
                          </template>
                          <template slot="item" scope="data">
                            <template v-if="typeof data.item !== 'object'">
                              <v-list-tile-content v-text="data.item"></v-list-tile-content>
                            </template>
                            <template v-else>
                              <v-list-tile-avatar>
                                <img :src="data.item.avatar">
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="data.item.username"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="data.item.email"></v-list-tile-sub-title>
                              </v-list-tile-content>
                            </template>
                          </template>
                        </v-select>
                      </v-flex>
                      <v-flex md12>
                        <template v-if="toUser">
                          <div class="square" id="messagebox" ref="messagebox">
                              <ul class="messages">
                                <li v-for="(message, index) in messages" :key=index>
                                  <template v-if="message.from === profile.user.username">
                                    <v-layout row wrap mb-3>
                                      <v-spacer></v-spacer>
                                      <v-flex md8 class="text-xs-right">
                                        <p class="message me">
                                          {{message.message}}
                                        </p>
                                      </v-flex>
                                      <v-flex md1 mr-3 class="text-xs-right">
                                        <v-avatar>
                                          <img :src="profile.user.avatar">
                                        </v-avatar>
                                      </v-flex>
                                    </v-layout>
                                  </template>
                                  <template v-else>
                                    <v-layout row wrap mb-3>
                                      <v-flex md1>
                                        <v-avatar>
                                          <img :src="profile.user.avatar">
                                        </v-avatar>
                                      </v-flex>
                                      <v-flex md8>
                                        <p class="message other-person">
                                          {{message.message}}
                                        </p>
                                      </v-flex>
                                    </v-layout>
                                  </template>
                                </li>
                              </ul>
                          </div>
                        </template>
                      </v-flex>
                      <v-flex md12>
                        <template v-if="toUser">
                          <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                              @keyup.enter="sendMessage()"
                              label="Type your message"
                              v-model="messageToSend"
                            ></v-text-field>
                            <v-btn @click="sendMessage()" flat block color="primary"><v-icon left>send</v-icon>send</v-btn>
                          </v-form>
                        </template>
                      </v-flex>
                    </v-layout>
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
import Axios from 'axios'
import io from 'socket.io-client'
import _ from 'lodash'
import { getProfile, isLoggedIn, isActor, isAgent, isDirector } from '@/components/authentication'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  beforeMount () {
    if (!isLoggedIn()) {
      this.$router.push('/')
    }
  },
  data () {
    return {
      userChip: true,
      valid: false,
      isDirector: isDirector(),
      isActor: isActor(),
      isAgent: isAgent(),
      isConnected: false,
      socketMessage: '',
      socket: '',
      chatLoaded: false,
      profile: '',
      toUser: null,
      Users: [],
      chatSelected: false,
      messageToSend: '',
      messages: [],
      chats: []
    }
  },
  watch: {
    toUser: function (username) {
      if (this.toUser) {
        this.openChatWithUser(username)
      }
    },
    userChip: function (val) {
      if (val === false) {
        this.closeChatWithUser()
      }
    }
  },
  updated () {
    var box = this.$refs['messagebox']
    if (box) {
      box.scrollTop = box.scrollHeight
    }
  },
  mounted () {
    this.profile = getProfile()
    this.socket = io.connect(CastingComplexAPI)
    this.socket.emit('open_chat', {username: this.profile.user.username})
    this.fetchUsers()

    this.socket.on('new_message', (data) => {
      // Display message if it is the opened chat
      if (data.from === this.toUser || data.from === this.profile.user.username) {
        this.messages.push(data)
      }
      // If it's in the recent chat, push to that
      var foundChat = false
      for (var chat of this.chats) {
        if (chat.username === data.from || chat.username === data.to) {
          chat.lastMessage = data.message
          foundChat = true
        }
      }

      if (!foundChat) {
        this.socket.emit('refresh_preview', {username: this.profile.user.username})
      }
    })

    this.socket.on('load_chat', (data) => {
      this.messages = data
    })

    this.socket.on('chat_previews', (data) => {
      this.chats = data
      this.chats = _.uniqBy(this.chats, 'username')
    })
  },
  sockets: {
    connect: function () {
      console.log('scket connected')
    }
  },
  methods: {
    sendMessage () {
      var data = {
        message: this.messageToSend,
        from: this.profile.user.username,
        to: this.toUser
      }
      this.socket.emit('send_message', data)
      this.$refs.form.reset()
    },
    openChatWithUser (username) {
      this.chatSelected = true
      this.userChip = true
      var data = {fromUser: this.profile.user.username, toUser: username}
      this.socket.emit('open_chat_with_user', data)
    },
    closeChatWithUser () {
      this.toUser = null
    },
    fetchUsers () {
      Axios.get(`${CastingComplexAPI}/users`)
        .then((res) => {
          this.Users = res.data.data
        }).catch((err) => {
          console.log(err)
        })
    },
    sendSomething () {
      this.socket.emit('something', {my: 'data'})
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

    .square{
      width: 100%;
      height: 500px;
      overflow: auto;
      overflow-x: hidden;
      Background-color: #fff;/* Your Color */
  }

  .messages {
    list-style-type: none;
  }
  .message {
    overflow-wrap: break-word;
    display: inline-block;
    clear: both;
    padding: 10px;
    padding-right: 15px;
    border-radius: 20px;
    margin-bottom: 2px;
  }

  .other-person {
    background: #eee;
    float: left;
  }

  .me {
    background: #085f89;
    color: #fff;
  }

</style>
