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
        <v-divider vertical class="ml-4"></v-divider>
        <v-menu bottom left>
          <v-btn
            slot="activator"
            dark
            icon
          >
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile @click="exportCsv()">
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
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
        :total-items="totalRegistrar"
        :rows-per-page-items="[50]"
        :pagination.sync="pagination">
        <v-progress-linear slot="progress" color="info" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <!-- <td></td> -->
          <tr @click="props.expanded = !props.expanded" class="cursor-pointer">
            <td>{{ props.index + 1 }}</td>
            <td style="min-width: 250px;">
              <v-avatar
                size="48px"
                color="grey"
                class="mr-2 my-1">
                <img :src="'https://img.devidentify.com/' + props.item.email" alt="">
              </v-avatar>
              <v-icon :color="props.item.gender == 'male' ? 'info' : 'pink'">{{ iconGender(props.item.gender) }}</v-icon>
              {{ props.item.fullname }}
            </td>
            <td class="">
              <v-avatar
                tile
                size="38px"
                color="grey"
                class="mx-3">
                <img :src="getRoomImageUrl(props.item.roomFirst)" alt="">
              </v-avatar>
            </td>
            <!-- <td class="text-xs-left">{{ props.item.roomFirst }}</td> -->
            <td class="text-xs-left">{{ props.item.email }}</td>
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
                <v-chip v-if="props.item.acceptanceStatus == 1" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Waiting List</strong>
                </v-chip>
                <v-chip v-if="props.item.acceptanceStatus == 2" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Diterima Delegates</strong>
                </v-chip>
                <v-chip label color="info" outline>
                  <span class="mr-1">dinilai oleh: </span> <strong> {{ props.item.scoredBy.username }}</strong>
                </v-chip>
                <v-btn outline color="success" :to="'' + props.item.id" append>
                  <v-icon left="">edit</v-icon>
                  Edit Nilai
                </v-btn>
                <br>
                <v-btn v-if="props.item.acceptanceStatus != 1"  round color="success" @click="addToWaitingList(props.item)" :loading="loadingBtnWaiting">
                  <v-icon left="">add_to_queue</v-icon>
                  Masukkan Waiting List
                </v-btn>
                <v-btn v-if="props.item.acceptanceStatus != 2"  round color="success" @click="addToDelegates(props.item)" :loading="loadingBtnDelegates">
                  <v-icon left="">check</v-icon>
                  Terima Jadi Delegates
                </v-btn>
                <v-btn v-if="props.item.acceptanceStatus == 1 || props.item.acceptanceStatus == 2"  round color="error" @click="removeFromList(props.item)" :loading="loadingBtnRemoveList">
                  <v-icon left="">close</v-icon>
                  Keluarkan
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
import { mapActions } from 'vuex'
import _debounce from 'lodash/debounce'
import Papa from 'papaparse'

export default {
  data () {
    return {
      headers: [
        { text: 'No', value: 'fullname', sortable: false },
        { text: 'Nama', value: 'fullname' },
        { text: 'Room', value: 'roomFirst' },
        { text: 'Email', value: 'email' },
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
      registrarItems: [],
      totalRegistrar: 0,
      loadingRegistrar: false,
      loadingBtnWaiting: false,
      loadingBtnDelegates: false,
      loadingBtnRemoveList: false,
      loadingSend: false,
      scored: false,
      tabs: 0
    }
  },
  computed: {
    filterRoom: {
      get () { return this.$store.state.roomSelected },
      set (val) { this.$store.dispatch('setRoomSelected', val) }
    },
    itemExports () {
      return this.registrarItems.map(element => {
        return {
          status: this.getAcceptanceStatus(element.acceptanceStatus),
          room: element.roomFirst,
          nama: element.fullname,
          email: element.email,
          ttl: element.placeOfBirth + ', ' + this.$moment(element.dateOfBirth).format('DD MMMM YYYY'),
          gender: element.gender,
          alamat: element.domicileAddress,
          kota: element.city,
          provinsi: element.province,
          universitas: element.institution,
          instagram: element.socmed.instagram,
          line: element.socmed.line,
          hp: element.phone,
          'skor prestasi': element.scoreAuto.achievement,
          'skor organisasi': element.scoreAuto.organization,
          'skor sosial': element.scoreAuto.socialActivity,
          'skor essay': element.scoreEssay,
          'skor total': element.scoreTotal,
          'dinilai oleh': element.scoredBy.username
        }
      })
    },
    search () {
      return this.$store.state.searchField
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.totalRegistrar / this.pagination.rowsPerPage)
    },
    skip () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage
    },
    orderBy () {
      if (!this.pagination.sortBy) return ''
      return this.pagination.sortBy + (this.pagination.descending ? ' DESC' : ' ASC')
    }
  },
  watch: {
    filterRoom: {
      handler (val) { this.fetchDataRegistrars() },
      deep: true
    },
    search: _debounce(function() {
      this.fetchDataRegistrars()
    }, 700),
    tabs () {
      this.fetchDataRegistrars()
    },
    pagination: {
      handler () {
        this.fetchDataRegistrars()
      },
      deep: true
    },
  },
  methods: {
    ...mapActions(['notify']),
    fetchDataRegistrars () {
      this.loadingRegistrar = true
      let scoreEssay = { scoreEssay: { lt: 1 } }
      if (this.tabs > 0) scoreEssay = {}

      let acceptanceStatus = { acceptanceStatus: this.tabs }
      if (this.tabs > 2) acceptanceStatus = {}

      let filterWhere = {
        and: [
          scoreEssay,
          acceptanceStatus,
          { roomFirst: { like: this.filterRoom } },
          { or: [
            { fullname: { like: (this.search || '') + '.*', options: 'i' } },
            { email: { like: (this.search || '') + '.*', options: 'i' } }
          ]}
        ]
      }

      this.$axios.$get('/registrars', {
        params: {
          filter: {
            include: 'scoredBy',
            order: this.orderBy,
            skip: this.skip,
            limit: this.pagination.rowsPerPage,
            where: filterWhere
          }
        }
      }).then(response => {
        this.registrarItems = response
        this.loadingRegistrar = false
        this.getTotalRegistrars(filterWhere)
        console.log('registrar ', response)
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
    },
    getTotalRegistrars (filter) {
      this.loadingRegistrar = true
      this.$axios.$get('/registrars/count', {
        params: {
          where: filter
        }
      }).then(response => {
        this.totalRegistrar = response.count
        this.loadingRegistrar = false
      }).catch(error => {
        this.loadingRegistrar = false
        this.notify({ type: 'error', message: error.message })
      })
    },
    resendEmail (data) {
      let result = confirm('Kirim ulang email ' + data.email + '?');
      if (!result) return
      this.loadingSend = true
      this.$axios.post('http://pinguin.dinus.ac.id:3000/send/fls-registration', {
        secret: 'h3s0y4m',
        email: data.email,
        fullname: data.fullname,
        roomFirst: data.roomFirst,
        nickname: data.nickname,
      }).then(response => {
        this.notify({ type: 'success', message: 'berhasil kirim email ' + data.email })
        this.loadingSend = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingSend = false
      })
    },
    async exportCsv () {
      console.log('proses export...');
      let result = await Papa.unparse(this.itemExports, { download: true })
      let uriContent = "data:text/csv;charset=utf-8," + encodeURIComponent(result);
      let link = document.createElement("a");
      link.setAttribute("href", uriContent);
      let filename = '' + this.filterRoom + ' ' + this.getAcceptanceStatus(this.tabs) + '.csv'
      link.setAttribute("download", filename);
      document.body.appendChild(link); // Required for FF
      link.click();
    },
    addToWaitingList (data) {
      this.loadingBtnWaiting = true

      let registrar = {...data}
      registrar.acceptanceStatus = 1
      delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/Registrars/' + data.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: response.data.fullname + ' ditambahkan ke waiting list' })
        this.fetchDataRegistrars()
        this.loadingBtnWaiting = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingBtnWaiting = false
      })
    },
    addToDelegates (data) {
      this.loadingBtnDelegates = true

      let registrar = {...data}
      registrar.acceptanceStatus = 2
      delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/Registrars/' + data.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: response.data.fullname + ' diterima jadi Delegates' })
        this.fetchDataRegistrars()
        this.loadingBtnDelegates = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingBtnDelegates = false
      })
    },
    removeFromList (data) {
      this.loadingBtnRemoveList = true

      let registrar = {...data}
      registrar.acceptanceStatus = 0
      delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/Registrars/' + data.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: response.data.fullname + ' dikeluarkan dari list' })
        this.fetchDataRegistrars()
        this.loadingBtnRemoveList = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingBtnRemoveList = false
      })
    },
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
    },
    getAcceptanceStatus (status) {
      switch (status) {
        case 0:
          return 'Belum Dinilai'
        case 1:
          return 'Waiting List'
        case 2:
          return 'Diterima Delegates'
        default:
          return 'Pendaftar'
      }
    }
  },
  mounted () {
    // this.fetchDataRegistrars()
    this.pagination.sortBy = 'scoreTotal'
    this.pagination.descending = true
  }
}
</script>
