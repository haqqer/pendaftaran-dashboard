<template>
  <div class="text-xs-center">
    <v-menu
      offset-y
      left
      bottom
      :close-on-content-click="false"
      v-model="menu"
    >
      <v-btn slot="activator" flat>
        <v-avatar size="32px">
          <img
            :src="avatar"
            alt="user"
          >
        </v-avatar>
        <span class="ml-1">
          {{ userInfo.username }}
        </span>
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="avatar" alt="John">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ userInfo.roles[0].description }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ userInfo.roles[0].name }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            outline
            color="error"
            @click="onLogout()">
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    avatar: '/images/default-profile.png',
    menu: false
  }),
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['logout']),
    onLogout () {
      console.log('logout yok cuy');

      this.logout()
      this.$router.push('/auth/login')
      this.menu = false
    }
  }
}
</script>
