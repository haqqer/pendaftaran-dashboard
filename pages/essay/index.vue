<template>
  <v-layout v-if="registrarItems.length < 1 && loadingRegistrar" justify-center>
    <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
      style=""
      color="primary"></v-progress-circular>
  </v-layout>
  <v-layout v-else>
    <v-flex md8>
      <v-card v-for="registrar in registrarItems" :key="registrar.id" class="mb-4">
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
            <div class="caption">{{ registrar.id }}</div>
          </div>
        </v-card-title>
        <v-card-text>
          <strong>Motivasi Ikut FLS</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayMotivationJoin) }} kata )</small>
          <p>{{ shortText(registrar.essayMotivationJoin) }}</p>

          <strong>Alasan memilih room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayRoomSelected) }} kata )</small>
          <p>{{ shortText(registrar.essayRoomSelected) }}</p>

          <strong>Studi kasus room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayCaseStudy) }} kata )</small>
          <p>{{ shortText(registrar.essayCaseStudy) }}</p>

          <v-divider></v-divider>

          <h4 class="subheading">Nilai - </h4>
          <div><strong>Prestasi</strong> {{ registrar.scoreAuto.achievement }}</div>
          <div><strong>Organisasi</strong> {{ registrar.scoreAuto.organization }}</div>
          <div><strong>Sosial</strong> {{ registrar.scoreAuto.socialActivity }}</div>
          <div><strong>Essay</strong> {{ registrar.scoreEssay }}</div>
          <div><strong>Total</strong> {{ registrar.scoreTotal }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="">
          <v-layout align-center justify-center>
            <v-flex md6>
              <v-btn block round color="primary" :to="registrar.id" append>Baca selengkapnya</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
      <v-btn v-if="!maxReached" block color="info" large round :loading="loadingRegistrar" @click="loadMoreData()">Load More</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      registrarItems: [],
      loadingRegistrar: false,
      skip: 0,
      limit: 5,
      maxReached: false
    }
  },
  computed: {
    ...mapState(['roomSelected'])
  },
  watch: {
    roomSelected () {
      this.registrarItems = []
      this.fetchDataRegistrars()
    }
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
    shortText (str) {
      if (str.length < 200) return str
      return str.trim()    // remove leading and trailing spaces
                .substring(0, 200)    // get first 600 characters
                .split(" ") // separate characters into an array of words
                .slice(0, -1)    // remove the last full or partial word
                .join(" ") + " ..."
    },
    loadMoreData () {
      this.skip += 1
      this.fetchDataRegistrars()
    },
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      this.$axios.$get('/registrars', {
        params: {
          filter: {
            // order: 'scoreAuto.total DESC',
            where: {
              and : [
                { roomFirst: { like: this.roomSelected } },
                { and: [
                  {acceptanceStatus: { neq: 1 }},
                  {acceptanceStatus: { neq: 2 }},
                  {acceptanceStatus: { neq: 3 }},
                ]},
                { scoreEssay: { lt: 5 } }
              ]
            },
            skip: this.skip * this.limit,
            limit: this.limit
          }
        }
      }).then(response => {
        this.registrarItems = [ ...this.registrarItems, ...response ]
        console.log('registrar ', response)
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
        this.notify({ type: 'error', message: error.message })
        this.loadingRegistrar = false
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
