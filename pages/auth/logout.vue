<template>
  <div>Logout</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['logout']),
    onLogout () {
      console.log('logout yok cuy');

      this.logout()
      this.$router.push('/auth/login')
    }
  },
  created () {
    this.onLogout()
  }
}
</script>
