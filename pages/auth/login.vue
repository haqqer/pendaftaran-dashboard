<template>
  <v-content>
    <v-container>
      <v-layout justify-center>
        <v-flex md6 justify-center>
          <v-layout row>
            <v-flex xs12>
              <v-alert type="error" v-model="alert.show" dismissible>
                {{ alert.message }}
              </v-alert>
            </v-flex>
          </v-layout>
          <v-card>
            <v-card-title primary-title>
              <img :src="appInfo.appLogo" alt="" width="100px"/>
              <br>
              <h3 class="headline ml-3 mb-0">Masuk dulu</h3>
              </v-card-title>
            <v-card-text>
              <v-container grid-list-md fluid>
                <form @submit.prevent="signIn">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        name="email"
                        label="Username"
                        id="email"
                        v-model="email"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        v-model="password"
                        type="password"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn type="submit" :disabled="loading" :loading="loading" color="primary">
                        Login
                          <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                          </span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-container>
            </v-card-text>
          </v-card>
          <div class="text-xs-center title py-4">
            <nuxt-link to="/auth/register">Bikin akun</nuxt-link>
            kalau belum punya
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  layout: 'blank',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      alert: {
        show: false,
        message: ''
      }
    }
  },
  mounted() {
    // check is need to login again ?
    this.isNeedToSignIn()
  },
  computed: {
    ...mapState(['appInfo']),
    ...mapGetters(['isLogedIn'])
  },
  methods: {
    ...mapActions(['saveToken', 'saveTokenExp','notify', 'saveUserInfo', 'logout']),
    signIn() {
      this.loading = true

      this.$axios({
        method: 'POST',
        url: '/auth/login',
        data: {
          email: this.email,
          password: this.password
        }
      }).then(result => {
        const response = result.data;
        // console.log(result);
        console.log(result.data);
        this.saveToken(response.data.token)
        let exp = response.data.exp;
        this.saveTokenExp(exp)
        console.log('login ', response.data, exp, this.$moment().unix())

        // return this.$axios.$get('/users/' + response.data.user.id)
        console.log('userdetail ', response.data.user);
        if (response.data.user == null) {
          this.notify({ type: 'error', message: 'Maaf, akun ' + response.data.user.name + ' belum bisa digunakan. Hubungi admin' })
          this.logout()
        } else {
          this.saveUserInfo(response.data.user)
          this.$router.push('/')
          this.notify({ type: 'success', message: 'Selamat Datang ' + response.data.user.name })
        }
        this.loading = false        
      }).catch(error => {
        console.log('login error ', error)
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        this.alert.show = true
        this.alert.message = error.message
        this.loading = false
      })
    },
    isNeedToSignIn() {
      // is this user need to re-login ?
      if (this.isLogedIn) {
        this.$router.push({
          path: '/'
        })
      }
    }
  }
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
