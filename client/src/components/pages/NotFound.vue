<template>
 <main app class="l-home-page">
    <app-header></app-header>
    <app-mobile-header></app-mobile-header>
    <login-modal></login-modal>
      <v-content>
        <v-container fluid grid-list-md>
          <v-layout row justify-center>
            <v-flex xs12 md12 lg8 xl8>
                <v-card class="">
                  <v-card-title primary-title>
                    <div>
                      <h1>Page not found</h1>
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <v-divider></v-divider>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-content>
      <app-footer></app-footer>
    </main>
</template>
