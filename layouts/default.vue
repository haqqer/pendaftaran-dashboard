<template>
  <v-app :dark="darkTheme">
    <v-navigation-drawer
      :mini-variant="miniVariant"
      v-model="drawer"
      width="256"
      fixed
      app>
      <v-toolbar flat class="transparent">
        <v-list dark class="primary">
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="~/static/images/fls-logo-mini.png" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>FLS 2018</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-text-field
        @focus="onSearchFocus()"
        @blur="inputSearchClass = ''"
        class="elevation-0 my-2"
        :class="inputSearchClass"
        placeholder="Pencarian"
        solo
        prepend-icon="search"
        ></v-text-field>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider class="mt-4"></v-divider>
      <v-list>
        <v-list-tile router to="/auth/logout">
          <v-list-tile-action>
            <v-icon color="error" v-html="'exit_to_app'"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Logout'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white" class="elevation-1" dense fixed app >
      <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        class="hidden-md-and-down"
        icon
        @click.stop="miniVariant = !miniVariant">
        <v-icon>menu</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <popover-menu-user></popover-menu-user>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer class="justify-center">
      &copy; {{ new Date().getUTCFullYear() }} — <a href="https://github.com/creativefls/"><strong>CreativeFLS</strong></a>
    </v-footer>
    <v-snackbar
      :color="notification.color"
      multi-line
      top
      v-model="snackbarMessage">{{ notification.message }}
      <v-btn dark flat @click="notificationToggle">OK</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PopoverMenuUser from '@/components/PopoverMenuUser'

export default {
  middleware: ['check-auth'],
  data() {
    return {
      title: 'Vuetify.js',
      darkTheme: false,
      drawer: true,
      userItems: [
        { icon: 'show_chart', title: 'Dashboard', to: '/' },
        { icon: 'assignment', title: 'Penilaian', to: '/essay' },
        { icon: 'table_chart', title: 'Seleksi', to: '/tabel' },
        // { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ],
      adminItems: [
        { icon: 'person', title: 'User', to: '/users' }
      ],
      miniVariant: false,
      inputSearchClass: ''
    }
  },
  computed: {
    ...mapState(['notification', 'userInfo']),
    snackbarMessage: {
      get() {
        return this.notification.active;
      },
      set(val) {
        this.notificationToggle();
      }
    },
    items () {
      if (this.userInfo.roles[0].name == 'admin') {
        return [ ...this.userItems, ...this.adminItems ]
      }
      return this.userItems
    }
  },
  methods: {
    ...mapActions(['notify']),
    notificationToggle() {
      this.notify({ type: 'error', message: '' });
    },
    onSearchFocus () {
      this.inputSearchClass = 'elevation-3'
      this.miniVariant = false
    }
  },
  mounted () {
    console.log(this.$vuetify.breakpoint.name);
    this.$nextTick(() => {
      if (this.$vuetify.breakpoint.name == 'xs') this.drawer = false
    });
  },
  components: { PopoverMenuUser }
}
</script>
