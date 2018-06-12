<template>
  <v-card>
    <v-card-title class="headline">Users</v-card-title>
    <v-card-text>
      <v-data-table
        :items="userItems"
        class="elevation-1"
        :loading="loadingUser"
        hide-actions
        hide-headers
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.index + 1 }}</td>
          <td class="text-xs-left">{{ props.item.username }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">
            <v-edit-dialog
              lazy
            >
              <div>
                {{ props.item.roles.length > 0 ? props.item.roles[0].name : 'BELUM PUNYA ROLE' }}
                <v-icon small color="info">edit</v-icon>
              </div>
              <div slot="input" class="mt-3 subheading">update role <strong>{{ props.item.username }}</strong></div>
              <v-select
                slot="input"
                :items="roleItems"
                v-model="roleSelected"
                item-text="name"
                item-value="id"
                label="Pilih peran"
                data-vv-name="role"
                :error-messages="errors.collect('role')"
                v-validate="'required'"
              ></v-select>
              <v-layout slot="input">
                <v-spacer></v-spacer>
                <v-btn color="primary" :loading="loadingUser" @click.stop="updateRole(props.item.id)">OK</v-btn>
              </v-layout>
            </v-edit-dialog>
          </td>
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
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      test: '',
      userItems: [],
      loadingUser: false,
      roleItems: [],
      roleSelected: ''
    }
  },
  methods: {
    ...mapActions(['notify']),
    fetchDataUsers () {
      this.loadingUser = true
      this.$axios.$get('/users', {
        params: {
          filter: { include: 'roles' }
        }
      }).then(response => {
        this.userItems = response
        console.log('registrar ', response)
        this.loadingUser = false
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
    fetchListRoles () {
      this.$axios.$get('/roles').then(response => {
        this.roleItems = response
      }).catch(error => {
        this.notify({ type: 'error', message: error.message })
      })
    },
    updateRole (userId) {
      this.loadingUser = true
      this.$axios.$post('/RoleMappings/upsertWithWhere?where[principalId]=' + userId, {
        principalType: "USER",
        principalId: userId,
        roleId: this.roleSelected
      }).then(response => {
        console.log('update ucel ', response)
        this.fetchDataUsers()
        this.notify({ type: 'success', message: 'Berhasil update role' });
        this.loadingUser = false
      }).catch(error => {
        this.loadingUser = false
        this.notify({ type: 'error', message: error.message });
      })
    }
  },
  mounted () {
    this.fetchListRoles()
    this.fetchDataUsers()
  }
}
</script>
