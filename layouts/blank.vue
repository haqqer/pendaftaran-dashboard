<template>
  <v-app>
    <nuxt />

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

export default {
  computed: {
    ...mapState(['notification']),
    snackbarMessage: {
      get() {
        return this.notification.active;
      },
      set(val) {
        this.notificationToggle();
      }
    }
  },
  methods: {
    ...mapActions(['notify']),
    notificationToggle() {
      this.notify({ type: 'error', message: '' });
    },
  }
}
</script>
