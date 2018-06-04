<template>
  <v-card>
    <v-card-title class="headline">Pendaftar</v-card-title>
    <v-card-text>
      <v-data-table
        :items="registrarItems"
        class="elevation-1"
        :loading="loadingRegistrar"
        hide-actions
        hide-headers
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.fullname }}</td>
          <td class="text-xs-left">{{ props.item.institution }}</td>
          <td class="text-xs-left">{{ props.item.fat }}</td>
          <td class="text-xs-left">{{ props.item.carbs }}</td>
          <td class="text-xs-left">{{ props.item.protein }}</td>
          <td class="text-xs-left">{{ props.item.iron }}</td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat nuxt to="/inspire">Continue</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  data () {
    return {
      registrarItems: [],
      loadingRegistrar: false
    }
  },
  methods: {
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
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
