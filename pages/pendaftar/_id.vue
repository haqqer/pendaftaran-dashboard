<template>
  <v-layout v-if="registrar">
    <v-flex md8>
      <detail-registrar :registrar="registrar[0]"></detail-registrar>
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
        <v-card-title class="title pb-0">Beri nilai untuk {{ registrar.fullName }}</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="score.essayMotivationJoin"
              label="essayMotivationJoin"
              data-vv-as="essayMotivationJoin"
              :error-messages="errors.collect('essayMotivationJoin')"
              v-validate="'required|min_value:1|max_value:100'"
              prepend-icon="assignment"
              data-vv-name="essayMotivationJoin"
            ></v-text-field>
          <v-text-field
              v-model="score.essayRoomSelected"
              label="essayRoomSelected"
              data-vv-as="essayRoomSelected"
              :error-messages="errors.collect('essayRoomSelected')"
              v-validate="'required|min_value:1|max_value:100'"
              prepend-icon="assignment"
              data-vv-name="essayRoomSelected"
            ></v-text-field>
          <v-text-field
              v-model="score.essayCaseStudy"
              label="essayCaseStudy"
              data-vv-as="essayCaseStudy"
              :error-messages="errors.collect('essayCaseStudy')"
              v-validate="'required|min_value:1|max_value:100'"
              prepend-icon="assignment"
              data-vv-name="essayCaseStudy"
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
import DetailRegistrar from '@/components/registrar/DetailRegistrar'

export default {
  data () {
    return {
      registrar: null,
      loadingRegistrar: false,
      dialog: false,
      loading: false,
      score: {
        essayMotivationJoin: 0,
        essayRoomSelected: 0,
        essayCaseStudy: 0,
      },
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['notify']),
    getDataRegistrar () {
      console.log(this.userInfo);
      this.loadingRegistrar = true
      this.$axios.$get('/delegates/' + this.$route.params.id, {
        params: {
        }
      }).then(response => {
        this.registrar = response.data
        // console.log(this.re)
        console.log('registrar ', this.registrar)
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
    },
    submitScore () {
      this.loading = true

      let registrar = {...this.registrar[0]}
      // registrar.Score.essayMotivationJoin = parseInt(score.essayMotivationJoin)
      registrar.userId = this.userInfo.id
      console.log('user info')
      console.log(this.userInfo);
      
      let score = this.score;
      console.log('[score] '+score.essayMotivationJoin);
      console.log(registrar)
      registrar.Score.essayMotivationJoin = parseInt(score.essayMotivationJoin)
      registrar.Score.essayRoomSelected = parseInt(score.essayRoomSelected)
      registrar.Score.essayCaseStudy = parseInt(score.essayCaseStudy)
      
      // delete registrar['id']
      console.log(registrar.id);
      console.log('score : ',score);
      this.$axios({
        method: 'PUT',
        url: '/scores/' + registrar.id,
        data: registrar.Score
      }).then(response => {
        console.log('penilaian :',response);
        console.log(this.userInfo.id);
        return this.$axios({
          method: 'PUT',
          url: '/delegates/' + registrar.id, 
          data: {
            userId: this.userInfo.id,
            status: 1
          }  
        })
      }).then(user => {
        this.notify({ type: 'success', message: 'Berhasil essayMotivationJoin  ' + registrar.fullName })
        this.$router.push('/pendaftar')
        // this.getDataRegistrar()
        this.loading = false
        this.dialog = false        
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loading = false
      })
    },

  },
  mounted () {
    this.getDataRegistrar()
  },
  components: { DetailRegistrar }
}
</script>
