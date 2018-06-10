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
      <v-divider></v-divider>
      <v-list dense>
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
    </v-navigation-drawer>
    <v-toolbar color="white" class="elevation-1" dense fixed app >
      <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        class="hidden-md-and-down"
        icon
        @click.stop="miniVariant = !miniVariant">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-text-field
        @focus="inputSearchClass = 'elevation-3'"
        @blur="inputSearchClass = ''"
        class="elevation-0"
        :class="inputSearchClass"
        placeholder="Pencarian"
        solo
        prepend-icon="search"
        ></v-text-field>
      <v-spacer></v-spacer>
      <popover-menu-user></popover-menu-user>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app class="justify-center">
      &copy; {{ new Date().getUTCFullYear() }} — <a href="https://github.com/creativefls/"><strong>CreativeFLS</strong></a>
    </v-footer>
  </v-app>
</template>

<script>
  import PopoverMenuUser from '@/components/PopoverMenuUser'
  export default {
    middleware: ['check-auth'],
    data() {
      return {
        title: 'Vuetify.js',
        darkTheme: false,
        drawer: true,
        items: [
          { icon: 'show_chart', title: 'Dashboard', to: '/' },
          { icon: 'assignment', title: 'Essay', to: '/essay' },
          { icon: 'table_chart', title: 'Tabel', to: '/tabel' },
          { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
        ],
        miniVariant: false,
        inputSearchClass: ''
      }
    },
    components: { PopoverMenuUser }
  }
</script>
