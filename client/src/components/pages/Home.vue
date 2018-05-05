<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
     <v-content>
      <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap justify-space-around>
          <v-flex d-flex lg6 md12 xs12>
            <v-layout column>
              <v-flex d-flex>
                <v-carousel>
                  <v-carousel-item dark v-for="item in list" :key="item.id" :src="item.imageURL"></v-carousel-item>
                </v-carousel>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex lg4 md12 sm12 xs12>
            <v-layout column>
              <v-flex d-flex>
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
                      Nulla egestas justo eu orci fringilla, eget venenatis risus scelerisque. Morbi interdum ligula mi, tempus tempus mi interdum nec. Ut suscipit neque orci, ac rutrum risus cursus et. Curabitur vel odio massa. Integer viverra sem sed massa ullamcorper ultricies. Pellentesque ultrices massa eget mi blandit, placerat convallis risus ullamcorper. Vestibulum nec sapien vehicula, pellentesque tellus non, varius lorem.
                    </p>
                    
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex d-flex>
                  <v-card class="featured-actors">
                    <v-container fluid grid-list-md>
                      <v-layout row>
                        <v-flex md7>
                          <div>
                            <div class="headline">{{ featuredActor.name }}</div>
                            <div>Featured actor</div>
                          </div>
                          <br/>
                          <div style="text-align: left;">
                            <strong> Casting credits: </strong>
                            {{ featuredActor.credits }}
                          </div>
                          <br/>
                          <div style="text-align: left;">
                            <strong> Projects: </strong>
                            {{ featuredActor.previousProjects }}
                          </div>
                          <br/>
                          <div style="text-align: left;">
                            <em> "{{ featuredActor.shortBio }}" </em>
                          </div>
                        </v-flex>
                        <v-flex lg5 md5 sm5 xs10>
                          <v-card-media
                            class="white--text"
                            height="220px"
                            :src=featuredActor.path
                          ></v-card-media>
                        </v-flex>
                      </v-layout>
                      <v-btn block color="primary" dark>
                        Visit profile
                      </v-btn>
                    </v-container>
                  </v-card>
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
// import Authentication from '@/components/pages/Authentication'
import Axios from 'axios'
const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  data () {
    return {
      featuredActor: {
        id: 1,
        name: 'Jane Doe',
        credits: "Actor, Singer, Dancer",
        previousProjects: "Awesome TV Show, Great Movie 2",
        shortBio: "Passionate about film industry and acting",
        path: "/static/img/actor3.jpg",
        profile: "/"
      },
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
          console.log(data.name)
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
