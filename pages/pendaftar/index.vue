<template>
  <v-card>
    <v-card-title class="headline">Pendaftar</v-card-title>
    <v-card-text>
      <v-data-table
        :items="registrarItems"
        class="elevation-1"
        :loading="loadingRegistrar"
        :headers="headers"
        disable-initial-sort
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.fullname }}</td>
          <td class="text-xs-left">{{ props.item.institution }}</td>
          <td class="text-xs-left">{{ props.item.scoreAuto.achievement }}</td>
          <td class="text-xs-left">{{ props.item.scoreAuto.organization }}</td>
          <td class="text-xs-left">{{ props.item.scoreAuto.socialActivity }}</td>
          <td class="text-xs-left">
            <strong>{{ props.item.scoreAuto.total }}</strong>
          </td>
          <td class="text-xs-left">{{ props.item.scoreEssay }}</td>
          <td class="text-xs-left">
            <strong>{{ props.item.scoreTotal }}</strong>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  data () {
    return {
      headers: [
        { text: 'Nama', value: 'name' },
        { text: 'Kampus', value: 'university' },
        { text: 'Prestasi', value: 'achievement' },
        { text: 'Organisasi', value: 'organizaion' },
        { text: 'Aktifitas Sosial', value: 'social' },
        { text: 'Jumlah', value: 'totalAuto' },
        { text: 'Essay', value: 'essay' },
        { text: 'Jumlah Semua', value: 'total' },
      ],
      registrarItems: [],
      loadingRegistrar: false
    }
  },
  methods: {
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      this.$axios.$get('/registrars').then(response => {
        this.registrarItems = response
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
        console.log('--- error konfig ----')
        console.log(error.config);
      })
    }
  },
  created () {
    this.fetchDataRegistrars()
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
