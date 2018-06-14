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
            <img :src="'https://img.devidentify.com/' + registrar.email" alt="">
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

          <v-divider></v-divider>
          <template v-if="registrar.scores">
            <h4 class="subheading">Nilai - </h4>
            <div><strong>Prestasi</strong> {{ registrar.scores.achievement }}</div>
            <div><strong>Organisasi</strong> {{ registrar.scores.organization }}</div>
            <div><strong>Sosial</strong> {{ registrar.scores.socialActivity }}</div>
            <div><strong>Essay</strong> {{ registrar.scores.essay }}</div>
          </template>
        </v-card-text>
        <v-card-actions class="">

        </v-card-actions>
      </v-card>
    </v-flex>
    <v-btn
      color="primary"
      dark
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
        <v-card-title class="title pb-0">Beri nilai untuk {{ registrar.fullname }}</v-card-title>
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
          <v-btn color="primary" round :loading="loading" @click.native="submitScore">Submit</v-btn>
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
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      registrar: null,
      dialog: false,
      loading: false,
      score: 0
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['notify']),
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
      this.$axios.$get('/registrars/' + this.$route.params.id, {
        params: {
          filter: { include: 'scores' }
        }
      }).then(response => {
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
        this.notify({ type: 'error', message: error.message })
        console.log('--- error konfig ----')
        console.log(error.config);
      })
    },
    submitScore () {
      this.loading = true
      let data = {
        registrarId: this.registrar.id,
        scoredById: this.userInfo.id,
        essay: this.score
      }
      if (this.registrar.scores) {
        data.achievement = this.registrar.scores.achievement,
        data.organization = this.registrar.scores.organization,
        data.socialActivity = this.registrar.scores.socialActivity,
        data.id = this.registrar.scores.id
      }
      this.$axios.$post('/RegistrarScors/replaceOrCreate', data).then(response => {
        this.notify({ type: 'success', message: 'Berhasil nilai  ' + this.registrar.fullname + ' ' + this.score })
        this.$router.push('/essay')
        this.loading = false
        this.dialog = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loading = false
      })
    }
  },
  created () {
    this.getDataRegistrar()
  }
}
</script>
