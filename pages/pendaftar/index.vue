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
            v-for="menu in ['Belum dinilai', 'Sudah Dinilai', 'Waiting List', 'Diterima', 'Semua']"
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
        :rows-per-page-items="[5, 10, 25, 50, 10000]"
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
              <v-icon :color="props.item.gender == true ? 'pink' : 'info'">{{ iconGender(props.item.gender) }}</v-icon>
              {{ props.item.fullName }}
            </td>
            <td class="">
              <v-avatar
                tile
                size="38px"
                color="grey"
                class="mx-3">
                <img :src="getRoomImageUrl(props.item.Room.firstRoom)" alt="">
              </v-avatar>
            </td>
            <!-- <td class="text-xs-left">{{ props.item.roomFirst }}</td> -->
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">
              <strong>{{ props.item.Score.total }}</strong>
            </td>
            <td class="text-xs-left">
              <v-icon v-if="props.item.userId" color="success">check_circle</v-icon>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card color="cloud">
            <v-card-text>
              <template v-if="props.item.userId">
                <v-chip v-if="props.item.status == 1" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Sudah Dinilai</strong>
                </v-chip>
                <v-chip v-if="props.item.status == 2" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Waiting List</strong>
                </v-chip>
                <v-chip v-if="props.item.status == 3" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Diterima Delegates</strong>
                </v-chip>
                <v-chip label color="info" outline>
                  <span class="mr-1">dinilai oleh: </span> <strong> {{ props.item.User.name }}</strong>
                </v-chip>
                <v-btn outline color="success" :to="'' + props.item.id" append>
                  <v-icon left="">edit</v-icon>
                  Edit Nilai
                </v-btn>
                <br>
                <v-btn v-if="(props.item.status == 1 || props.item.status == 3  ) && props.item.Score.total"  round color="success" @click="addToWaitingList(props.item)" :loading="loadingBtnWaiting">
                  <v-icon left="">add_to_queue</v-icon>
                  Masukkan Waiting List
                </v-btn>
                <v-btn v-if="(props.item.status == 1 || props.item.status == 2) && props.item.Score.total"  round color="success" @click="addToDelegates(props.item)" :loading="loadingBtnDelegates">
                  <v-icon left="">check</v-icon>
                  Terima Jadi Delegates
                </v-btn>
                <v-btn v-if="props.item.status == 3 || props.item.status == 2"  round color="error" @click="removeFromList(props.item)" :loading="loadingBtnRemoveList">
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
        { text: 'No', value: 'fullName', sortable: false },
        { text: 'Nama', value: 'fullName' },
        { text: 'Room', value: 'roomFirst' },
        { text: 'Email', value: 'email' },
        { text: 'Nilai Total', value: 'scoreTotal' },
        { text: 'Dinilai', value: 'scored' },
      ],
      roomLists: [
        { text: 'All Room', value: '' },
        { text: 'Digital', value: 1 },
        { text: 'Education', value: 2 },
        { text: 'Environment', value: 3 },
        { text: 'International Relation', value: 4 },
        { text: 'Technopreneur', value: 5 },
        { text: 'Urban Planning', value: 6 },
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
      tabs: 0,
    }
  },
  computed: {
    filterRoom: {
      get () { return this.$store.state.roomSelected },
      set (val) { this.$store.dispatch('setRoomSelected', val) }
    },
    itemExports () {
      console.log('[registrar Items]', this.registrarItems)
      return this.registrarItems.map(element => {
        if(!element.User) {
          element.user = 'none'
        } else {
          element.user = element.User.name
        }
        console.log('[element user] '+element.user);
        return {
          status: this.getstatus(element.status),
          room: element.roomFirst,
          nama: element.fullName,
          email: element.email,
          ttl: element.placeOfBirth + ', ' + this.$moment(element.dateOfBirth).format('DD MMMM YYYY'),
          gender: element.gender,
          alamat: element.domicileAddress,
          kota: element.city,
          provinsi: element.province,
          universitas: element.institution,
          facebook: element.Socmed.facebook,
          instagram: element.Socmed.instagram,
          line: element.Socmed.line,
          hp: element.phone,
          'skor prestasi': element.Score.achievement,
          'skor organisasi': element.Score.organization,
          'skor sosial': element.Score.socialActivity,
          'skor essay Motivation Join': element.Score.essayMotivationJoin,
          'skor essay Motivation Join': element.Score.essayRoomSelected,
          'skor essay Motivation Join': element.Score.essayCaseStudy,
          'skor total': element.Score.total,
          'dinilai oleh': element.user
        }
      })
    },
    search () {
      console.log('[search] '+this.$store.state.searchField)
      return this.$store.state.searchField
    },
    pages () {
      console.log('[pagination] '+this.pagination)
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.totalRegistrar / this.pagination.rowsPerPage)
    },
    skip () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage
    },
    orderBy () {
      console.log('orderBy')
      console.log(this.pagination)
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
      // console.log(this.tabs);
      // let status = { status: this.tabs }
      let status = this.tabs
      // console.log('score total', this.registrarItems.Score);
      console.log('status : ',status);
      let filterWhere

      if(this.tabs === 0) {
        filterWhere = {
          filter: 1,
          limit: this.pagination.rowsPerPage,
          page: this.pagination.page,
          room: this.filterRoom,
          search: this.search || '',
          status: status,
          score: 1,
          sortby: this.pagination.sortBy,
          desc: this.pagination.descending
        }          
      } else if (this.tabs === 1 || this.tabs === 2 || this.tabs === 3) {
        filterWhere = {
          filter: 1,
          limit: this.pagination.rowsPerPage,
          room: this.filterRoom,
          page: this.pagination.page,
          status: status,
          search: this.search || '',
          sortby: this.pagination.sortBy,
          desc: this.pagination.descending                 
        }
      } else {
        console.log('filter all');
        filterWhere = {
          filter: 1,
          limit: this.pagination.rowsPerPage,
          room: this.filterRoom,
          page: this.pagination.page,
          search: this.search || '',
          sortby: this.pagination.sortBy,
          desc: this.pagination.descending                  
        }        
      }
      console.log(this.tabs)
      this.getTotalRegistrars()
      this.$axios.$get('/delegates', {
        params: filterWhere
      }).then(response => {
        console.log(response.data)
        this.registrarItems = response.data
        // console.log('hello :',this.registrarItems)
        // console.log('sebelum register : ',response.data)
        this.loadingRegistrar = false
        // this.getTotalRegistrars(filterWhere)
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
    getTotalRegistrars () {
      console.log(this.pagination)
      this.loadingRegistrar = true
      let filters;
      console.log('tabs : ', this.tabs);
      if(this.filterRoom) {
          filters = {
            room: this.filterRoom,
          }
      } else {
          filters = {
          }        
      }
      if(this.tabs !== 4) {
        filters = {
          status: this.tabs,
        }        
      }
      this.$axios.$get('/delegates/count', {
        params: filters
      }).then(response => {
        this.totalRegistrar = response.data.count
        console.log('[total register] '+response.data.count)
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
          this.$axios.post('https://api.futureleadersummit.org/delegates/send', {
            email: data.email,
            phone: data.phone,
            send: true
          }).then((response) => {
            const result = response.data
            // this.clearDelegate()
            // console.log(result)
            this.notify({ type: 'success', message: 'berhasil kirim email ' + data.email })
            this.loadingSend = false
          }).catch((error) => {
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
      let filename = '' + this.filterRoom + ' ' + this.getstatus(this.tabs) + '.csv'
      link.setAttribute("download", filename);
      document.body.appendChild(link); // Required for FF
      link.click();
    },
    addToWaitingList (data) {
      this.loadingBtnWaiting = true

      let registrar = {...data}
      registrar.status = 2
      delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/delegates/' + data.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: registrar.fullName + ' ditambahkan ke waiting list' })
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
      registrar.status = 3
      // delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/delegates/' + data.id,
        data: registrar
      }).then(response => {
        this.notify({ type: 'success', message: registrar.fullName + ' diterima jadi Delegates' })
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
      registrar.status = 1
      // delete registrar['id']

      this.$axios({
        method: 'PUT',
        url: '/delegates/' + data.id,
        data: registrar
      }).then(response => {
        console.log(response.data);
        this.notify({ type: 'success', message: response.data.fullName + ' dikeluarkan dari list' })
        this.fetchDataRegistrars()
        this.loadingBtnRemoveList = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingBtnRemoveList = false
      })
    },
    iconGender (gender) {
      // console.log('gender : ',gender)
      switch (gender) {
        case false:
          return 'fas fa-mars'
        case true:
          return 'fas fa-venus'
        default:
          return 'fas fa-genderless'
      }
    },
    getRoomImageUrl (room) {
      switch (room) {
        case 1:
          return 'http://join.futureleadersummit.org/images/rooms/Digital.png'
        case 2:
          return 'http://join.futureleadersummit.org/images/rooms/Education.png'
        case 3:
          return 'http://join.futureleadersummit.org/images/rooms/Environment.png'
        case 4:
          return 'http://join.futureleadersummit.org/images/rooms/International Relation.png'
        case 5:
          return 'http://join.futureleadersummit.org/images/rooms/Technopreneur.png'
        case 6:
          return 'http://join.futureleadersummit.org/images/rooms/UrbanPlanning.png'
        default:
          return 'https://user-images.githubusercontent.com/21119252/41821836-c2787e10-7810-11e8-8d2a-cc829bea4ae3.png'
      }
    },
    getstatus (status) {
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
    console.log(this.pagination);
    // this.fetchDataRegistrars()
    // this.pagination.sortBy = 'scoreTotal'
    // this.pagination.descending = true
    this.getTotalRegistrars()
  }
}
</script>
