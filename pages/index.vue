<template>
  <div>
    <v-layout v-if="loading" justify-center>
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
        style=""
        color="primary"></v-progress-circular>
    </v-layout>
    <v-layout v-else>
      <v-flex md3 class="mx-2">
          <v-card color="grey">
            <v-card-title>
              <v-icon x-large>assignment</v-icon>
              <h1 class="display-1 ml-4">{{ registrarSelected }} / {{ totalRegistrar }}</h1>
            </v-card-title>
            <v-card-text>
              <p>Pendaftar yang belum</p>
              <v-progress-linear v-model="percentScoredRegistrar"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>
    <v-layout class="mt-4 mb-5">
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <p class="subheading">Pendaftar Total : <strong>{{ totalRegistrar }}</strong></p>
            <v-spacer></v-spacer>
            <p>{{ new Date() | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</p>
          </v-card-title>          
        </v-card>
      </v-flex>      
    </v-layout>
    <v-layout class="mt-4" wrap row>
      <v-flex xs12 md6> 
        <v-card>
          <v-card-title>
          </v-card-title>
          <v-card-text>
            <pie-chart :data="chartStatus" :download="true" :library="{plugins: { datalabels: {color: '#ffff'}}}"></pie-chart>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6 class="mt-5">
        <v-card>
          <v-card-title>
            <p class="subheading">Pendaftar Total : <strong>{{ totalRegistrar }}</strong></p>
            <v-spacer></v-spacer>
            <p>{{ new Date() | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</p>
          </v-card-title>
          <v-card-text>
            <pie-chart :data="chartRoom" :download="true" :library="{plugins: { datalabels: {color: '#ffff'}}}"></pie-chart>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <p>hello</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      totalRegistrar: 0,
      registrarSelected: 0,
      loading: false,
      chartRoom: {},
      chartStatus: {}
    }
  },
  computed: {
    percentScoredRegistrar () {
      return this.registrarSelected / this.totalRegistrar * 100
    }
  },
  methods: {
    ...mapActions(['notify']),
    getTotalRegistrars () {
      this.loading = true
      this.$axios.$get('/delegates/count').then(response => {
        console.log('total ', response.data)
        this.totalRegistrar = response.data.count
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    getRegistrarSelected () {
      this.loading = true
      this.$axios.$get('/delegates/count', {
        params: {
          status: 0
        }
      }).then(response => {
        this.registrarSelected = response.data.count
        console.log('selected ', response)
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    refreshRoomChart () {
      this.chartRoom = {}
      this.countHumanCapital()
      this.countEducation()
      this.countDigital()
      this.countUrbanPlanning()
      this.countEntrepreneurship()
      this.countPoverty()
    },
    countHumanCapital () {
      this.$axios.$get('/delegates/count', {
        params: {
          room: 1
        } 
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'Digital': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    countEducation () {
      this.$axios.$get('/delegates/count', {
        params: { room: 2 }
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'Education': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    countDigital () {
      this.$axios.$get('/delegates/count', {
        params: { room: 3 }
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'Environment': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    countUrbanPlanning () {
      this.$axios.$get('/delegates/count', {
        params: { room: 4 }
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'International Relation': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    countEntrepreneurship () {
      this.$axios.$get('/delegates/count', {
        params: { room: 5 }
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'Technopreneur': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    countPoverty () {
      this.$axios.$get('/delegates/count', {
        params: { room: 6 }
      }).then(response => {
        this.chartRoom = { ...this.chartRoom, 'Urban Planning': response.data.count }
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    async countStatus () {
      const belumDinilai = await this.$axios.get('/delegates/count', {params: {status:0}});
      const sudahDinilai = await this.$axios.get('/delegates/count', {params: {status:1}});
      const waitingList = await this.$axios.get('/delegates/count', {params: {status:2}});
      const diterima = await this.$axios.get('/delegates/count', {params: {status:3}});
      this.chartStatus = {
        'Belum dinilai':  belumDinilai.data.data.count,
        'Sudah Dinilai':  sudahDinilai.data.data.count,
        'Waiting List':  waitingList.data.data.count,
        'Diterima':  diterima.data.data.count
      }
      console.log('belum dinilai ');
      console.log(belumDinilai);
    }
  },
  async mounted () {
    this.getTotalRegistrars()
    this.getRegistrarSelected()
    this.$nextTick(() => {
      this.refreshRoomChart()
    })
    await this.countStatus() 
  }
}
</script>
