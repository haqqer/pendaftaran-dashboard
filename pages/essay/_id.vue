<template>
  <v-layout v-if="registrar">
    <v-flex md8>
      <v-card class="mb-4">
        <v-card-title>
          <v-avatar
            tile
            size="48px"
            color="grey"
            class="mr-3">
            <img v-if="registrar.gender == 'female'" :src="'https://randomuser.me/api/portraits/women/' + Math.floor(Math.random() * 99) + '.jpg'" alt="">
            <img v-else :src="'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 99) + '.jpg'" alt="">
          </v-avatar>
          <div>
            <h3 class="title mb-0">
              {{ registrar.fullname }}
              <v-icon :color="registrar.gender == 'male' ? 'info' : 'pink'">{{ iconGender(registrar.gender) }}</v-icon>
            </h3>
            <div style="text-transform: capitalize;">{{ registrar.city.toLowerCase() }}</div>
            <v-btn v-if="registrar.socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.socmed.instagram" target="_blank">
              <v-icon>fab fa-instagram</v-icon>
            </v-btn>
            <v-btn v-if="registrar.socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.socmed.line" target="_blank">
              <v-icon>fab fa-line</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <strong>Motivasi Ikut FLS</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayMotivationJoin) }} kata )</small>
          <p>{{ registrar.essayMotivationJoin }}</p>

          <strong>Alasan memilih room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayRoomSelected) }} kata )</small>
          <p>{{ registrar.essayRoomSelected }}</p>

          <strong>Studi kasus room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayCaseStudy) }} kata )</small>
          <p>{{ registrar.essayCaseStudy }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="">
          <v-layout align-center justify-center>
            <v-flex md6>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-btn
      color="primary"
      dark
      large
      fixed
      bottom
      right
      fab
      @click.stop="dialog = true"
    >
      <v-icon>assignment</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline pb-0">Beri nilai untuk {{ registrar.fullname }}</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="score"
              label="Nilai"
              data-vv-as="Nilai"
              :error-messages="errors.collect('nilai')"
              v-validate="'required|min_value:1|max_value:100'"
              prepend-icon="assignment"
              data-vv-name="nilai"
            ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" outline round @click.native="dialog = false">Batal</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" round @click.native="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-layout v-else justify-center>
    <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
      style=""
      color="primary"></v-progress-circular>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      registrar: null,
      dialog: false,
      score: 0
    }
  },
  methods: {
    iconGender (gender) {
      switch (gender) {
        case 'male':
          return 'fas fa-mars'
        case 'female':
          return 'fas fa-venus'
        default:
          return 'fas fa-genderless'
      }
    },
    wordCount (str) {
      return str.split(' ')
                .filter(function(n) { return n != '' })
                .length;
    },
    getDataRegistrar () {
      this.$axios.$get('/registrars/' + this.$route.params.id).then(response => {
        this.registrar = response
        console.log('registrar ', response)
        // this.loadingRegistrar = false
      }).catch(error => {
        console.log('--- awh error ----')
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('--- error respon ----')
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('--- error request ----')
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('--- error lain ----')
          console.log('Error', error.message);
        }
        console.log('--- error konfig ----')
        console.log(error.config);
      })
    }
  },
  created () {
    this.getDataRegistrar()
  }
}
</script>
