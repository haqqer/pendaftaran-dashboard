<template>
  <v-layout>
    <v-flex>
      <v-btn color="error" outline to="failed" append>Lihat gagal kirim</v-btn>
      <v-card>
        <v-card-title>
          <h4 class="title">antrian: {{ listAgenda.length }}</h4>
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
              <!-- <td></td> -->
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.data.email }}</td>
              <td class="text-xs-left">{{ props.item.nextRunAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</td>
              <td class="text-xs-left">{{ props.item.lockedAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</td>
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
        { text: 'Proses', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Masuk', value: 'nextRunAt' },
        { text: 'Akan dikirim', value: 'lockedAt' },
      ],
      loading: false,
      listAgenda: []
    }
  },
  methods: {
    ...mapActions(['notify']),
    getListAgenda () {
      this.loading = true
      this.$axios.$get('/agendaJobs', {
        params: {
          filter: {
            where: { nextRunAt: { neq: null } }
          }
        }
      }).then(response => {
        this.listAgenda = response
        console.log('total ', response)
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
  },
  mounted () {
    this.getListAgenda()
  }
}
</script>
