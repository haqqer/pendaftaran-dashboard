<template>
  <div>
    <v-layout>
      <v-flex md8>
        <v-card v-for="registrar in registrarItems" :key="registrar.id" class="mb-4">
          <v-card-title>
            <v-avatar
              tile
              size="48px"
              color="grey"
              class="mr-3">
              <img src="~/static/images/fls-logo-mini.png" alt="">
            </v-avatar>
            <div>
              <h3 class="title mb-0">
                {{ registrar.fullname }}
                <v-icon color="info">fas fa-mars</v-icon>
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
            <v-layout align-center>
              <v-flex xs2>
                <v-text-field
                  v-model="nilai"
                  label="Nilai"
                  data-vv-as="Nilai"
                  :error-messages="errors.collect('nilai')"
                  v-validate="'required|min_value:1|max_value:100'"
                  data-vv-name="nilai"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-btn color="primary">beri nilai</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      registrarItems: [],
      loadingRegistrar: false,
      nilai: 1
    }
  },
  methods: {
    wordCount (str) {
      return str.split(' ')
                .filter(function(n) { return n != '' })
                .length;
    },
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      this.$axios.get('http://128.199.72.101:3000/api/registrars').then(response => {
        this.registrarItems = response.data
        console.log('registrar ', response.data)
        this.loadingRegistrar = false
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
    this.fetchDataRegistrars()
  }
}
</script>
