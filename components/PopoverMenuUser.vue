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
            src="https://randomuser.me/api/portraits/men/85.jpg"
            alt="user"
          >
        </v-avatar>
        <span class="ml-1">
          {{ username }}
        </span>
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="John">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ username }}</v-list-tile-title>
              <v-list-tile-sub-title>Ranger Ninja Srorm</v-list-tile-sub-title>
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
    username: 'Gasing Mangunkarsa',
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
      this.$router.push('/login')
      this.menu = false
    }
  }
}
</script>
