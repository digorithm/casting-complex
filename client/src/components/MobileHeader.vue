<template>
  <div class="hidden-md-and-up">
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">
            <p class="header-title"> Casting Complex</p>
          </div>
          <v-btn
        flat
        class="modified-btn-content"
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path">
        {{ item.title }}
      </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
</template>

<script>
// import Authentication from '@/components/pages/Authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
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

.header-title {
    font-size: 50px !important;
    display: flex;
    justify-content: space-around;
    width: 100% !important;
    color: white;
    font-family: $logo !important;
}

@media screen and (max-width: 600px){
    .header-title {
      font-size: 35px !important;
    }
    .icon.material-icons{
      color: white !important;
    }
  }

.expansion-panel__container {
  background-color: $background-color !important;
}

.modified-btn-content {
  color: white !important;
}

</style>