<template>
  <v-app>
    <v-container>
      <router-view/>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "./assets/styles";

.application {
  font-family: $body-font !important;
}

</style>
