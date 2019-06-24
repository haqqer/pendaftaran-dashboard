<template>
  <v-layout justify-center>
    <v-flex>
      <v-progress-circular
        v-if="loading"
        :size="70"
        :width="7"
        indeterminate
        style=""
        color="primary"></v-progress-circular>
      <v-card v-for="(item, index) in feedbacks" :key="index" class="mb-2">
        <v-card-title class="pb-0">
          <v-avatar
            tile
            size="48px"
            color="grey"
            class="mr-3">
            <img :src="'https://img.devidentify.com/' + item.email" alt="">
          </v-avatar>
          <div>
            <div class="title">{{ item.fullName }} ({{ item.nickName }})</div>
            <v-chip label outline small color="info">{{ item.topic }}</v-chip>
          </div>
        </v-card-title>
        <v-card-text>
          <p>
            <span v-html="item.nickName"></span>
            &mdash;
            <span v-html="item.email" class="primary--text"></span>
            &mdash;
            {{ item.message }}
          </p>
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
      feedbacks: [],
      loading: false
    }
  },
  methods: {
    ...mapActions(['notify']),
    fetchFeedback () {
      this.loading = true
      this.$axios.$get('http://128.199.72.101:3001/api/Messages', {
        params: {
          filter: {
            where: { topic: 'pendaftaran 2018' }
          }
        }
      }).then(response => {
        this.feedbacks = response
        this.loading = false
      }).catch(error => {
        this.notify({ type: 'error', message: '' });
        this.loading = false
      })
    }
  },
  mounted () {
    this.fetchFeedback()
  }
}
</script>
