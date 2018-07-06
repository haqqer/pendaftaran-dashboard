<template>
  <v-card v-if="registrar" class="mb-4">
    <v-card-title class="pb-1">
      <v-avatar
        tile
        size="48px"
        color="grey"
        class="mr-3">
        <img :src="'https://img.devidentify.com/' + registrar.email" alt="">
      </v-avatar>
      <div>
        <h3 class="title mb-0">
          {{ registrar.fullname }}
          <v-avatar
            tile
            size="38px"
            color="grey"
            class="mx-3">
            <img :src="getRoomImageUrl(registrar.roomFirst)" alt="">
          </v-avatar>
        </h3>
        <div style="text-transform: capitalize;">{{ registrar.institution.toLowerCase() }}</div>
        <v-btn v-if="registrar.socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.socmed.instagram" target="_blank">
          <v-icon>fab fa-instagram</v-icon>
        </v-btn>
        <v-btn v-if="registrar.socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.socmed.line" target="_blank">
          <v-icon>fab fa-line</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-tabs
        slot="extension"
        v-model="tabs"
        centered
        dark
        class="mb-4"
        icons-and-text
        show-arrows
        color="primary"
        slider-color="white">
        <v-tab
          v-for="menu in tabMenu"
          :key="menu.name">
          {{ menu.name }}
          <v-icon>{{menu.icon}}</v-icon>
        </v-tab>
        <v-tab-item>
          <strong>Motivasi Ikut FLS</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayMotivationJoin) }} kata )</small>
          <p>{{ registrar.essayMotivationJoin }}</p>

          <strong>Alasan memilih room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayRoomSelected) }} kata )</small>
          <p>{{ registrar.essayRoomSelected }}</p>

          <strong>Studi kasus room {{ registrar.roomFirst }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.essayCaseStudy) }} kata )</small>
          <p>{{ registrar.essayCaseStudy }}</p>
        </v-tab-item>
        <v-tab-item>
          <strong>Nama</strong>
          <p>{{ registrar.fullname }} , dipanggil {{registrar.nickname}}</p>
          <strong>Tempat Tanggal Lahir</strong>
          <p>{{ registrar.placeOfBirth }} , {{ registrar.dateOfBirth | moment('D MMMM YYYY') }}</p>
          <strong>Jenis Kelamin</strong>
          <p>
            {{ registrar.gender == 'male' ? 'Laki-laki' : 'Perempuan' }}
            <v-icon :color="registrar.gender == 'male' ? 'info' : 'pink'">{{ iconGender(registrar.gender) }}</v-icon>
          </p>
          <strong>Alamat</strong>
          <p>
            {{ registrar.domicileAddress }}
            <br> {{ registrar.city }}
            <br> {{ registrar.province }}
          </p>
          <strong>Institusi</strong>
          <p>{{ registrar.institution }}</p>
          <strong>Kontak</strong>
          <p>
            {{ registrar.email }}
            <br> {{ registrar.phone }}
          </p>
          <strong>Sosmed</strong>
          <p>
            <v-btn v-if="registrar.socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.socmed.instagram" target="_blank">
              <v-icon>fab fa-instagram</v-icon>
            </v-btn>
            {{ registrar.socmed.instagram }}
            <br>
            <v-btn v-if="registrar.socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.socmed.line" target="_blank">
              <v-icon>fab fa-line</v-icon>
            </v-btn>
            {{ registrar.socmed.line }}
          </p>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(achievement, i) in registrar.achievements" :key="i">
            <strong>{{ achievement.name }}</strong>
            <p>
              {{ achievement.rank }}
              <br> Tingkat {{ achievement.level }}
              <br> {{ achievement.year }}
            </p>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(organization, i) in registrar.organizations" :key="i">
            <strong>{{ organization.name }}</strong>
            <p>
              {{ organization.position }}
              <br> Tingkat {{ organization.level }}
              <br> {{ organization.period }}
            </p>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(socialActivity, i) in registrar.socialActivities" :key="i">
            <strong>{{ socialActivity.name }}</strong>
            <p>
              Tingkat {{ socialActivity.level }}
              <br> {{ socialActivity.year }}
            </p>
          </div>
        </v-tab-item>
      </v-tabs>


      <v-divider></v-divider>

      <h4 class="subheading">Nilai - </h4>
      <div><strong>Prestasi</strong> {{ registrar.scoreAuto.achievement }}</div>
      <div><strong>Organisasi</strong> {{ registrar.scoreAuto.organization }}</div>
      <div><strong>Sosial</strong> {{ registrar.scoreAuto.socialActivity }}</div>
      <div><strong>Essay</strong> {{ registrar.scoreEssay }}</div>
      <div><strong>Total</strong> {{ registrar.scoreTotal }}</div>
    </v-card-text>
    <v-card-actions class="">

    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    registrar: Object
  },
  data () {
    return {
      tabs: 0,
      tabMenu: [
        { icon: 'assignment', name: 'Essay' },
        { icon: 'person', name: 'Bio' },
        { icon: 'account_box', name: 'Prestasi' },
        { icon: 'account_box', name: 'Organisasi' },
        { icon: 'account_box', name: 'Aktifitas Sosial' },
      ]
    }
  },
  methods: {
    iconGender (gender) {
      switch (gender) {
        case 'male':
          return 'fas fa-mars'
        case 'female':
          return 'fas fa-venus'
        default:
          return 'fas fa-genderless'
      }
    },
    wordCount (str) {
      return str.split(' ')
                .filter(function(n) { return n != '' })
                .length;
    },
    getRoomImageUrl (room) {
      switch (room) {
        case 'Education':
          return 'https://user-images.githubusercontent.com/21119252/41973205-85ec42bc-7a3e-11e8-9a29-e3f296080e21.png'
        case 'Digital':
          return 'https://user-images.githubusercontent.com/21119252/41973182-71436b92-7a3e-11e8-9d7e-8f039c0e67e3.png'
        case 'Poverty':
          return 'https://user-images.githubusercontent.com/21119252/41973269-aa219768-7a3e-11e8-8e77-6023aef4d135.png'
        case 'Human Capital':
          return 'https://user-images.githubusercontent.com/21119252/41973250-a087b4e4-7a3e-11e8-845b-ec4c8c38d34f.png'
        case 'Entrepreneurship':
          return 'https://user-images.githubusercontent.com/21119252/41973233-91527996-7a3e-11e8-9b1c-34e2b8ee0118.png'
        case 'Urban Planning':
          return 'https://user-images.githubusercontent.com/21119252/41973340-e2cc96bc-7a3e-11e8-8a25-a079c0b6e279.png'
        default:
          return 'https://user-images.githubusercontent.com/21119252/41821836-c2787e10-7810-11e8-8d2a-cc829bea4ae3.png'
      }
    }
  }
}
</script>
