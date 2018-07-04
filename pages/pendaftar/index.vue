<template>
  <v-card>
    <v-card-title class="headline pb-0">
      Pendaftar
    </v-card-title>
    <v-card-text>
      <v-toolbar flat dark color="primary">
        <!-- <v-btn-toggle dark v-model="scored">
          <v-btn flat value="true">
            Left
          </v-btn>
          <v-btn flat value="false">
            Center
          </v-btn>
        </v-btn-toggle>
        <v-divider vertical class="mx-4"></v-divider> -->
        <div class="subheading mr-1">Room: </div>
        <v-select
          class="mt-2"
          v-model="filter.room"
          :items="roomLists"
          item-text="text"
          item-value="value"
          label="Solo field"
          solo-inverted
        ></v-select>
        <v-divider vertical class="mx-4"></v-divider>
        <v-text-field
          class="mt-2"
          placeholder="Pencarian"
          v-model="searchRegistrar"
          @keypress.enter="fetchDataRegistrars()"
          solo-inverted
          flat
          clearable
          append-icon="search"
          ></v-text-field>
      </v-toolbar>
      <v-data-table
        :items="registrarItems"
        class="elevation-1"
        :loading="loadingRegistrar"
        :headers="headers"
        disable-initial-sort
      >
        <v-progress-linear slot="progress" color="info" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <!-- <td></td> -->
          <tr @click="props.expanded = !props.expanded" class="cursor-pointer">
            <td>{{ props.item.fullname }}</td>
            <td class="text-xs-left">{{ props.item.roomFirst }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
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
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card color="cloud">
            <v-card-text>
              <p>
                mendaftar pada : {{ props.item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
              </p>
              <v-btn color="info" :to="'/essay/' + props.item.id">Ke Penilaian</v-btn>
            </v-card-text>
          </v-card>
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
        { text: 'Nama', value: 'fullname' },
        { text: 'Room', value: 'roomFirst' },
        { text: 'Email', value: 'email' },
        { text: 'Prestasi', value: 'scoreAuto.achievement' },
        { text: 'Organisasi', value: 'scoreAuto.organization' },
        { text: 'Sosial', value: 'scoreAuto.socialActivity' },
        { text: 'Jumlah', value: 'scoreAuto.total' },
        { text: 'Essay', value: 'scoreEssay' },
        { text: 'Jumlah Semua', value: 'scoreTotal' },
      ],
      roomLists: [
        { text: 'All', value: '' },
        { text: 'Human Capital', value: 'Human Capital' },
        { text: 'Education', value: 'Education' },
        { text: 'Digital', value: 'Digital' },
        { text: 'Urban Planning', value: 'Urban Planning' },
        { text: 'Entrepreneurship', value: 'Entrepreneurship' },
        { text: 'Poverty', value: 'Poverty' },
      ],
      filter: {
        room: ''
      },
      searchRegistrar: '',
      registrarItems: [],
      loadingRegistrar: false,
      scored: false
    }
  },
  watch: {
    filter: {
      handler (val) { this.fetchDataRegistrars() },
      deep: true
    }
  },
  methods: {
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      this.$axios.$get('/registrars', {
        params: {
          filter: {
            where: {
              and: [
                { roomFirst: { like: this.filter.room } },
                { fullname: { like: (this.searchRegistrar || '') + '.*', options: 'i' } },
              ]
            }
          }
        }
      }).then(response => {
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
