<template>
<v-card>
  <v-card-title primary class="title">
      News
    </v-card-title>
    <v-divider></v-divider>
       <v-data-iterator
      :items="newsMock"
      :rows-per-page-items="[1]"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm12
        md12
        lg12
      >
        <v-card flat>
          <v-card-title><h4>{{ props.item.name }}</h4></v-card-title>
          <v-card-text>
            {{ props.item.news }}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-data-iterator>
</v-card>
</template>

<script>

export default {
  // TODO: Add news endpoint and call it here. This table on the database will be populated by an admin through an UI that I will create later.
  data () {
    return {
      rowsPerPageItems: [1, 4, 8, 12],
      pagination: {
        rowsPerPage: 1
      },
      newsMock: [
        {
          name: 'News headline',
          news: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla, Phasellus commodo neque nulla Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla'
        },
        {
          name: 'News headline 2',
          news: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla'
        }
      ]
    }
  },
  methods: {
    // TODO: load breakdowns
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
  .list__tile__content {
    text-align: right !important;
  }
</style>
