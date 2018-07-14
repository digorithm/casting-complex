<template>
<v-card>
  <v-card-title primary class="title">
      News
    </v-card-title>
    <v-divider></v-divider>
       <v-data-iterator
      :items="news"
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
          <v-card-title><h4>{{ props.item.title }}</h4></v-card-title>
          <v-card-text>
            {{ props.item.text }}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-data-iterator>
</v-card>
</template>

<script>
import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  // TODO: Add news endpoint and call it here. This table on the database will be populated by an admin through an UI that I will create later.
  data () {
    return {
      rowsPerPageItems: [1, 4, 8, 12],
      pagination: {
        rowsPerPage: 1
      },
      news: []
    }
  },
  mounted () {
    this.fetchNews()
  },
  methods: {
    fetchNews () {
      Axios.get(`${CastingComplexAPI}/admins/news/`)
        .then((data) => {
          this.news = data.data
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
  
</style>
