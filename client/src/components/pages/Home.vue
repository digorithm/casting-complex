<template>
 <main app class="l-home-page">
    <app-header></app-header>
     <v-content>
      <v-container fluid grid-list-md text-xs-center>
        <v-layout row justify-space-around>
          <v-flex xs6>
            <v-carousel>
              <v-carousel-item dark v-for="item in list" :key="item.id" :src="item.imageURL"></v-carousel-item>
            </v-carousel>
          </v-flex>
          <v-flex xs4>
            <v-card dark color="white">
              <v-card-text class="text-xs-center headline centered">Follow us!</v-card-text>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-btn color="primary">
                    <v-icon color="white">fa fa-facebook</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn color="primary">
                    <v-icon color="white">fa fa-twitter</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn color="primary">
                    <v-icon color="white">fa fa-instagram</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-card-text>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum lacus ut risus suscipit consequat ac sed nisl. Ut volutpat urna non est bibendum pretium. Maecenas luctus cursus tellus ut porttitor. Phasellus commodo neque nulla. Donec hendrerit a mi at congue. Fusce vel felis auctor, consequat erat non, pretium justo. Nulla egestas justo eu orci fringilla, eget venenatis risus scelerisque. Morbi interdum ligula mi, tempus tempus mi interdum nec. Ut suscipit neque orci, ac rutrum risus cursus et. Curabitur vel odio massa. Integer viverra sem sed massa ullamcorper ultricies. Pellentesque ultrices massa eget mi blandit, placerat convallis risus ullamcorper. Vestibulum nec sapien vehicula, pellentesque tellus non, varius lorem.
                </p>
                <p>
                  Etiam odio purus, vehicula quis urna ut, rhoncus mattis lacus. Aliquam in nisl diam. Aliquam ultricies placerat ultrices. Pellentesque eget condimentum quam, nec hendrerit tortor. Etiam nulla nibh, volutpat et scelerisque in, aliquet a massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce consectetur, felis a tincidunt porta, nulla turpis dignissim ligula, ut iaculis leo lorem eget eros. Aliquam nec ex maximus, cursus sapien non, molestie nunc. Aenean sit amet lectus lacinia, lacinia felis eget, auctor nisl. Quisque dictum est ac porta finibus. Sed facilisis dapibus feugiat. Curabitur vel odio at justo efficitur fermentum eu ut nunc.
                </p>
                <p>
                  Morbi quis vehicula tellus, ut ornare velit. Sed feugiat ex quis tortor vehicula laoreet. Morbi ultrices fermentum erat, et maximus lorem eleifend vitae. Nulla bibendum dignissim dui non fringilla. Praesent dapibus tempor ex vitae sollicitudin. Proin euismod, nisi vitae mattis posuere, quam tellus interdum felis, sit amet eleifend felis nunc eu nibh. Cras aliquam scelerisque tellus, at pellentesque ipsum convallis sit amet. Sed commodo orci id quam aliquet aliquam. Sed lacinia faucibus massa a suscipit. Etiam vel augue nec odio pharetra gravida. Vestibulum nulla risus, accumsan ut convallis at, molestie a erat.
                </p>
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
// import Authentication from '@/components/pages/Authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      cities: [],
      list: [
        {
          id: 1,
          imageURL: 'https://www.hdwallpapers.in/thumbs/2018/deadpool_2-t2.jpg'
        },
        {
          id: 2,
          imageURL: 'https://www.hdwallpapers.in/thumbs/2018/avengers_infinity_war_4k_8k_2-t2.jpg'
        },
        {
          id: 3,
          imageURL: 'https://www.hdwallpapers.in/thumbs/2018/tom_holland_as_spider_man_avengers_infinity_war_4k_8k-t2.jpg'
        },
        {
          id: 4,
          imageURL: 'https://www.hdwallpapers.in/thumbs/2018/hulk_in_avengers_infinity_war_4k_8k-t2.jpg'
        }
      ]
    }
  },
  mounted () {
    this.getCities()
  },
  methods: {
    getCities (context) {
      Axios.get(`${CastingComplexAPI}/extras/cities/28`)
        .then((data) => {
          this.cities = data.data
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
  @import "./../../assets/styles";
  .content {
    padding-top: 200px !important;
    padding-bottom: 150px !important;
  }
  .card__text {
    color: black !important;
    text-align: left !important;
  }
</style>
