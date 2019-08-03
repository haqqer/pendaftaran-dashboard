<template>
  <v-content>
    <v-container>
      <v-layout>
        <v-flex md6 offset-md3>
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
              <h3 class="headline ml-3 mb-0">Bikin akun</h3>
              </v-card-title>
            <v-card-text v-if="registerSuccess">
              <div class="body-2">
                Akun <strong>{{ name }}</strong> berhasil dibuat. Silakan hubungi admin agar bisa dipakai login
                <v-btn block outline round color="primary" class="mt-4" to="/auth/login">ke halaman Login</v-btn>
              </div>
            </v-card-text>
            <v-card-text v-else>
              <v-container grid-list-md fluid>
                <form @submit.prevent="register">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        name="name"
                        label="name"
                        id="name"
                        v-model="name"
                        data-vv-name="name"
                        :error-messages="errors.collect('name')"
                        v-validate="'required'"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field
                        name="email"
                        label="Email"
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
                        daftar
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
            Kalau sudah punya akun bisa
            <nuxt-link to="/auth/login">Login</nuxt-link>
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
      name: '',
      password: '',
      loading: false,
      registerSuccess: false,
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
    ...mapActions(['saveToken', 'saveTokenExp','notify', 'saveUserInfo']),
    register() {
      this.loading = true

      this.$axios({
        method: 'post',
        url: '/users',
        params: {
          key: 'orausahiko2'
        },
        data: {
          name: this.name,
          email: this.email,
          password: this.password,
          roleId: 'ranger'
        }
      }).then(response => {
        console.log('login ', response.data)
        this.registerSuccess = true
      }).catch(error => {
        console.log('login error ', error)
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          let messages = error.response.data.error.details.messages
          this.alert.message = messages[Object.keys(messages)[0]][0]
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          this.alert.message = error.message
        }
        this.alert.show = true
        this.loading = false
        console.log(error.config);
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
