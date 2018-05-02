<template>
  <v-toolbar app class="primary hidden-sm-and-down" absolute dense prominent>
    <v-toolbar-title class="centered"> Casting Complex </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="main-toolbar" slot="extension">
      <v-btn
        flat
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path">
        <v-icon class="hidden-sm-and-down" left dark>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  data () {
    return {
      styleObject: {
        fontSize: '105px'
      },
      menuItems: [
        { title: 'Home', path: '/', icon: 'home' },
        { title: 'About us', path: '/about', icon: 'info' },
        { title: 'Pricing', path: '/pricing', icon: 'attach_money' },
        { title: 'Contact', path: '/contact', icon: 'contacts' },
        { title: 'Join', path: '/join', icon: 'face' },
        { title: 'Sign in', path: '/login', icon: 'lock_open' }
      ]
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";

  .btn.btn-signin {
    height: $sign-in-btn-height !important;
    margin-top: ($navbar-height - $sign-in-btn-height)/2 !important;
    width: $sign-in-btn-width important;
    background-color: #989898 !important;
    color: black;
  }

  .main-toolbar {
    width: 100% !important;
    display: flex;
    justify-content: space-around;
  }

  .btn.btn-nav {
    height: $sign-in-btn-height !important;
    width: $sign-in-btn-width important;
    background-color: white !important;
    color: black !important;
    padding-top: 5px;
  }

  .btn__content {
    font-weight: 700 !important;
  }

  .toolbar__extension {
    background-color: white !important;
  }
  .toolbar__content {
    height: $navbar-height !important;
  }
  .toolbar__title {
    font-size: 68px !important;
    display: flex;
    justify-content: space-around;
    width: 100% !important;
    color: white;
    font-family: $logo;
  }
  .l-header-container {
    background-color: $background-color;
    margin: 0 auto;
    padding: 0 15px;
    min-width: 272px;
    label, input, .icon, .input-group__selections__comma {
      color: #29b6f6!important;
    }
    .input-group__details {
      &:before {
        background-color: $border-color-input !important;
      }
    }
    .btn {
      margin-top: 15px;
    }
  }
</style>
