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
              <v-avatar
                tile
                size="38px"
                color="grey"
                class="mx-3">
                <img :src="getRoomImageUrl(registrar.roomFirst)" alt="">
              </v-avatar>
            </h3>
            <div style="text-transform: capitalize;">{{ registrar.institution.toLowerCase() }}</div>
            <v-btn v-if="registrar.socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.socmed.instagram" target="_blank">
              <v-icon>fab fa-instagram</v-icon>
            </v-btn>
            <v-btn v-if="registrar.socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.socmed.line" target="_blank">
              <v-icon>fab fa-line</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-tabs
            slot="extension"
            v-model="tabs"
            centered
            dark
            class="mb-4"
            icons-and-text
            color="primary"
            slider-color="white">
            <v-tab
              v-for="menu in tabMenu"
              :key="menu.name">
              {{ menu.name }}
              <v-icon>{{menu.icon}}</v-icon>
            </v-tab>
          </v-tabs>
          <v-tab-items v-model="tabs">
            <v-tab-item>
              asdfasdf 1
            </v-tab-item>
            <v-tab-item>
              asdfasdf 2
            </v-tab-item>
            <v-tab-item>
              asdfasdf 3
            </v-tab-item>
            <v-tab-item>
              asdfasdf 4
            </v-tab-item>
          </v-tab-items>
          <p style="text-transform: capitalize;">
            <v-icon :color="registrar.gender == 'male' ? 'info' : 'pink'">{{ iconGender(registrar.gender) }}</v-icon>
            {{ registrar.dateOfBirth | moment('from', 'now', true) }} ,
            Domisili {{ registrar.city.toLowerCase() }}
          </p>
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

          <h4 class="subheading">Nilai - </h4>
          <div><strong>Prestasi</strong> {{ registrar.scoreAuto.achievement }}</div>
          <div><strong>Organisasi</strong> {{ registrar.scoreAuto.organization }}</div>
          <div><strong>Sosial</strong> {{ registrar.scoreAuto.socialActivity }}</div>
          <div><strong>Essay</strong> {{ registrar.scoreEssay }}</div>
          <div><strong>Total</strong> {{ registrar.scoreTotal }}</div>
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
    <v-dialog v-model="dialog" :persistent="loading" max-width="290">
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
      score: 0,
      tabs: 0,
      tabMenu: [
        { icon: 'assignment', name: 'Essay' },
        { icon: 'person', name: 'Bio' },
        { icon: 'account_box', name: 'Prestasi' },
        { icon: 'account_box', name: 'Organisasi' },
        { icon: 'account_box', name: 'Aktifitas Sosial' },
      ]
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

      let registrar = {...this.registrar}
      registrar.scoreEssay = this.score
      delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/Registrars/' + this.registrar.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: 'Berhasil nilai  ' + this.registrar.fullname + ' ' + this.score })
        this.$router.push('/essay')
        // this.getDataRegistrar()
        this.loading = false
        this.dialog = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loading = false
      })
    },
    getRoomImageUrl (room) {
      switch (room) {
        case 'Education':
          return 'https://user-images.githubusercontent.com/21119252/41973205-85ec42bc-7a3e-11e8-9a29-e3f296080e21.png'
        case 'Digital':
          return 'https://user-images.githubusercontent.com/21119252/41973182-71436b92-7a3e-11e8-9d7e-8f039c0e67e3.png'
        case 'Poverty':
          return 'https://user-images.githubusercontent.com/21119252/41973269-aa219768-7a3e-11e8-8e77-6023aef4d135.png'
        case 'Human Capital':
          return 'https://user-images.githubusercontent.com/21119252/41973250-a087b4e4-7a3e-11e8-845b-ec4c8c38d34f.png'
        case 'Entrepreneurship':
          return 'https://user-images.githubusercontent.com/21119252/41973233-91527996-7a3e-11e8-9b1c-34e2b8ee0118.png'
        case 'Urban Planning':
          return 'https://user-images.githubusercontent.com/21119252/41973340-e2cc96bc-7a3e-11e8-8a25-a079c0b6e279.png'
        default:
          return 'https://user-images.githubusercontent.com/21119252/41821836-c2787e10-7810-11e8-8d2a-cc829bea4ae3.png'
      }
    }
  },
  created () {
    this.getDataRegistrar()
  }
}
</script>
