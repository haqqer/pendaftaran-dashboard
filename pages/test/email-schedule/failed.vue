<template>
  <v-layout>
    <v-flex>
      <v-btn @click="sendAllFailedEmail()" color="error" :loading="loadingSend">Kirim Ulang Semua</v-btn>
      <v-card>
        <v-card-title>
          <h4 class="title">Gagal: {{ listAgenda.length }}</h4>
          <v-spacer></v-spacer>
          <h4 class="subheading">{{ new Date() | moment("dddd, MMMM Do YYYY, h:mm:ss a") }} </h4>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="listAgenda"
            class="elevation-1"
            :loading="loading"
            :headers="headers"
            disable-initial-sort
            hide-actions
          >
            <v-progress-linear slot="progress" color="info" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td><v-btn @click="resendEmail(props.item.data)" color="error" small>failed</v-btn></td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.data.email }}</td>
              <td class="text-xs-left">{{ props.item.failedAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</td>
              <td class="text-xs-left">{{ props.item.failReason }}</td>
            </template>
          </v-data-table>
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
       headers: [
        { text: 'Status', value: '', sortable: false },
        { text: 'Proses', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Pada', value: 'failedAt' },
        { text: 'Reason', value: 'failReason' },
      ],
      loading: false,
      loadingSend: false,
      listAgenda: []
    }
  },
  computed: {
    emailList () {
      return this.listAgenda.map(item => {
        return item.data
      })
    }
  },
  methods: {
    ...mapActions(['notify']),
    getListAgenda () {
      this.loading = true
      this.$axios.$get('http://pinguin.dinus.ac.id:3000/dash/h3s0y4m/api', {
        params: {
          state: 'failed'
        }
      }).then(response => {
        this.listAgenda = response.jobs.map(item => {
          item.job.id = item.job._id
          return item.job
        })
        console.log('total ', response)
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    sendAllFailedEmail () {
      let result = confirm('Yakin kirim ulang SEMUA ?');
      if (!result) return
      this.loadingSend = true
      this.$axios.post('http://pinguin.dinus.ac.id:3000/send/fls-registration', {
        secret: 'h3s0y4m',
        emailList: JSON.stringify(this.emailList)
      }).then(response => {
        this.notify({ type: 'success', message: 'berhasil kirim email' })
        this.loadingSend = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
        this.loadingSend = false
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
    }
  },
  mounted () {
    this.getListAgenda()
  }
}
</script>
