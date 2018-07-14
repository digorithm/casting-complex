<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row wrap justify-center>
            <v-flex d-flex xs12 sm6 md3 xl2 mr-3>
              <profile-widget></profile-widget>
            </v-flex>
            <v-flex d-flex xs12 sm6 md4>
              <v-layout row wrap>
                <v-flex d-flex mb-3 mr-3>
                  <audition-widget></audition-widget>
                </v-flex>
                <v-flex d-flex mr-3>
                  <breakdown-widget></breakdown-widget>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm6 md4>
              <v-layout row wrap>
                <v-flex d-flex mb-3>
                  <actors-widget></actors-widget>
                </v-flex>
                <v-flex d-flex>
                  <news-widget></news-widget>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
     <app-footer></app-footer>
</main>
</template>

<script>
import { isLoggedIn, isRegistrationInProgress, isAgent, isAccountApproved } from '@/components/authentication'

export default {
  data () {
    return {
    }
  },
  beforeCreate () {
    if (!isLoggedIn() || isRegistrationInProgress() || !isAgent()) {
      this.$router.push('/')
    }
    if (!isAccountApproved()) {
      this.$router.push('/waiting-approval')
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import "./../../assets/styles";

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

  .card__text {
    color: black !important;
    text-align: left !important;
  }
  .profile-btn {
    width: 100px !important;
    height: 100px !important;
  }
  .featured-actors {
    padding-bottom: 20px !important;
  }
</style>
