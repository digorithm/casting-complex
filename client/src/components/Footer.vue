<template>
  <v-footer app height="auto" color="primary" absolute dense>
    <v-layout row wrap justify-center>
      <v-btn
        color="white"
        flat
        v-for="link in links"
        :key="link"
      >
        {{ link.title }}
      </v-btn>
      <v-flex xs12 py-3 text-xs-center white--text>
        &copy;2018 — <strong>Casting Complex</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      links: [
        { title: 'Terms and conditions', path: '/terms' },
        { title: 'Privacy policy', path: '/policy' },
        { title: 'Parlez-vous francais', path: '/french' }
      ]
    }
  }
}
</script>

<style lang="scss">
.footer {
  // position: static !important;
  width: 100% !important;
  bottom: 0 !important;
  min-height: 60px !important;
}
</style>
