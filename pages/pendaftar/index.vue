<template>
  <v-card>
    <v-card-title class="headline pb-0">
      Pendaftar
    </v-card-title>
    <v-card-text>
      <v-toolbar flat dark tabs color="primary">
       <v-select
          class="mt-2"
          v-model="filterRoom"
          :items="roomLists"
          item-text="text"
          item-value="value"
          label="Solo field"
          solo-inverted
        ></v-select>
        <v-tabs
          slot="extension"
          v-model="tabs"
          show-arrows
          color="transparent"
          slider-color="white">
          <v-tab
            v-for="menu in ['Belum dinilai', 'Waiting List', 'Diterima', 'Semua']"
            :key="menu">
            {{ menu }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
      <v-data-table
        :items="registrarItems"
        class="elevation-1"
        :loading="loadingRegistrar"
        :headers="headers"
        :pagination.sync="pagination">
        <v-progress-linear slot="progress" color="info" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <!-- <td></td> -->
          <tr @click="props.expanded = !props.expanded" class="cursor-pointer">
            <td>{{ props.item.fullname }}</td>
            <td class="text-xs-left">{{ props.item.roomFirst }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.scoreEssay }}</td>
            <td class="text-xs-left">
              <strong>{{ props.item.scoreTotal }}</strong>
            </td>
            <td class="text-xs-left">
              <v-icon v-if="props.item.scoredBy" color="success">check_circle</v-icon>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card color="cloud">
            <v-card-text>
              <template v-if="props.item.scoredBy">
                dinilai oleh :
                <v-chip color="info" outline>
                  {{ props.item.scoredBy.username }}
                </v-chip>
                <v-btn outline round color="success" :to="'' + props.item.id" append>
                  <v-icon left="">edit</v-icon>
                  Edit
                </v-btn>
                <v-btn outline round color="success">
                  <v-icon left="">add_to_queue</v-icon>
                  Jadikan Waiting List
                </v-btn>
                <v-btn outline round color="success">
                  <v-icon left="">check</v-icon>
                  Terima Jadi Delegates
                </v-btn>
              </template>
              <template v-else>
                <p>
                  mendaftar pada : {{ props.item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
                </p>
                <v-btn color="info" :to="'' + props.item.id" append>Ke Penilaian</v-btn>
              </template>
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
import { mapState} from 'vuex'

export default {
  data () {
    return {
      headers: [
        { text: 'Nama', value: 'fullname' },
        { text: 'Room', value: 'roomFirst' },
        { text: 'Email', value: 'email' },
        { text: 'Essay', value: 'scoreEssay' },
        { text: 'Nilai Total', value: 'scoreTotal' },
        { text: 'Dinilai', value: 'scored' },
      ],
      roomLists: [
        { text: 'All Room', value: '' },
        { text: 'Human Capital', value: 'Human Capital' },
        { text: 'Education', value: 'Education' },
        { text: 'Digital', value: 'Digital' },
        { text: 'Urban Planning', value: 'Urban Planning' },
        { text: 'Entrepreneurship', value: 'Entrepreneurship' },
        { text: 'Poverty', value: 'Poverty' },
      ],
      pagination: {},
      searchRegistrar: '',
      registrarItems: [],
      loadingRegistrar: false,
      scored: false,
      tabs: 0
    }
  },
  computed: {
    filterRoom: {
      get () { return this.$store.state.roomSelected },
      set (val) { this.$store.dispatch('setRoomSelected', val) }
    }
  },
  watch: {
    filterRoom: {
      handler (val) { this.fetchDataRegistrars() },
      deep: true
    },
    tabs () {
      this.fetchDataRegistrars()
    }
  },
  methods: {
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      let scoreEssay = { scoreEssay: { lt: 1 } }
      if (this.tabs > 0) scoreEssay = {}

      let acceptanceStatus = { acceptanceStatus: this.tabs }
      if (this.tabs > 2) acceptanceStatus = {}

      this.$axios.$get('/registrars', {
        params: {
          filter: {
            include: 'scoredBy',
            where: {
              and: [
                scoreEssay,
                acceptanceStatus,
                { roomFirst: { like: this.filterRoom } },
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
    this.pagination.sortBy = 'scoreTotal'
    this.pagination.descending = true
  }
}
</script>
