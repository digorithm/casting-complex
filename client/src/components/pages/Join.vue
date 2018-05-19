<template>
 <main app>
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
    <v-content>
      <v-container fluid grid-list-md text-xs-center>
        <v-flex xs12 sm4 md6 lg6 xl4 offset-sm3 offset-xl4>
          <v-card>
            <v-card-media src="/static/img/join.jpg" height="200px">
            </v-card-media>
            <v-layout row justify-center>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline">Join as...</h3>
                </div>
              </v-card-title>
            </v-layout>
            <v-layout row justify-center>
              <v-card-actions>
                <v-btn class="role-btn" to="/join-actor" color="primary">Actor</v-btn>
                <v-btn class="role-btn" to="/join-director" color="primary">Casting Director</v-btn>
                <v-btn class="role-btn" to="/join-agent" color="primary">Agent</v-btn>
              </v-card-actions>
            </v-layout>
            <v-card-text>
              <h3> Joining as an actor </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla. Donec hendrerit a mi at congue.
              </p>
              <h3> Joining as a casting director </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla. Donec hendrerit a mi at congue.
              </p>
              <h3> Joining as an agent </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla. Donec hendrerit a mi at congue.
              </p>
           </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-content>
    <app-footer></app-footer>
</main>
</template>

<script>
// import Authentication from '@/components/pages/Authentication'
export default {
  data: () => ({
    show: false
  })
}
</script>

<style lang="scss">
@import "./../../assets/styles";

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
    padding-bottom: $content-padding-top;
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
