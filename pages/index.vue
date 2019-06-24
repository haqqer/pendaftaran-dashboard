<template>
  <div>
    <!-- <v-layout v-if="loading" justify-center>
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
              <p>Pendaftar dinilai</p>
              <v-progress-linear v-model="percentScoredRegistrar"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>
    <v-layout class="mt-4">
      <v-flex md12>
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
    </v-layout> -->
    <p>hello</p>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'

// export default {
//   data () {
//     return {
//       totalRegistrar: 0,
//       registrarSelected: 0,
//       loading: false,
//       chartRoom: {}
//     }
//   },
//   computed: {
//     percentScoredRegistrar () {
//       return this.registrarSelected / this.totalRegistrar * 100
//     }
//   },
//   methods: {
//     ...mapActions(['notify']),
//     getTotalRegistrars () {
//       this.loading = true
//       this.$axios.$get('/registrars/count').then(response => {
//         this.totalRegistrar = response.count
//         console.log('total ', response)
//         this.loading = false
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     getRegistrarSelected () {
//       this.loading = true
//       this.$axios.$get('/registrars/count', {
//         params: {
//           where: { scoreEssay: { gt: 0 } }
//         }
//       }).then(response => {
//         this.registrarSelected = response.count
//         console.log('selected ', response)
//         this.loading = false
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     refreshRoomChart () {
//       this.chartRoom = {}
//       this.countHumanCapital()
//       this.countEducation()
//       this.countDigital()
//       this.countUrbanPlanning()
//       this.countEntrepreneurship()
//       this.countPoverty()
//     },
//     countHumanCapital () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Human Capital' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Human Capital': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     countEducation () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Education' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Education': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     countDigital () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Digital' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Digital': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     countUrbanPlanning () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Urban Planning' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Urban Planning': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     countEntrepreneurship () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Entrepreneurship' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Entrepreneurship': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     },
//     countPoverty () {
//       this.$axios.$get('/registrars/count', {
//         params: { where: { roomFirst: 'Poverty' } }
//       }).then(response => {
//         this.chartRoom = { ...this.chartRoom, 'Poverty': response.count }
//       }).catch(error => {
//         this.notify({ type: 'error', message: error.message })
//       })
//     }
//   },
//   mounted () {
//     this.getTotalRegistrars()
//     this.getRegistrarSelected()
//     this.$nextTick(() => {
//       this.refreshRoomChart()
//     })
//   }
// }
</script>
