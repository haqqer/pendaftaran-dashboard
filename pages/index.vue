<template>
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
            <p>Pendaftar dinilai</p>
            <v-progress-linear v-model="percentScoredRegistrar"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      totalRegistrar: 0,
      registrarSelected: 0,
      loading: false
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
      this.$axios.$get('/registrars/count').then(response => {
        this.totalRegistrar = response.count
        console.log('total ', response)
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    getRegistrarSelected () {
      this.loading = true
      this.$axios.$get('/registrars/count', {
        params: {
          where: { scoreEssay: { gt: 0 } }
        }
      }).then(response => {
        this.registrarSelected = response.count
        console.log('selected ', response)
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    }
  },
  mounted () {
    this.getTotalRegistrars()
    this.getRegistrarSelected()
  }
}
</script>
