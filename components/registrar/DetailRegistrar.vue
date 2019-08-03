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
          {{ registrar.fullName }}
          <v-avatar
            tile
            size="38px"
            color="grey"
            class="mx-3">
            <img :src="getRoomImageUrl(registrar.Room.firstRoom)" alt="">
          </v-avatar>
        </h3>
        <div style="text-transform: capitalize;">{{ registrar.institution }}</div>
        <v-btn v-if="registrar.Socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.Socmed.instagram" target="_blank">
          <v-icon>fab fa-instagram</v-icon>
        </v-btn>
        <v-btn v-if="registrar.Socmed.facebook" small icon color="primary" :href="'https://www.facebook.com/search/top/?q=' + registrar.Socmed.facebook" target="_blank">
          <v-icon>fab fa-facebook-f</v-icon>
        </v-btn>
        <v-btn v-if="registrar.Socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.Socmed.line" target="_blank">
          <v-icon>fab fa-line</v-icon>
        </v-btn>
        <v-btn v-if="registrar.phone" small icon color="success" :href="'https://api.whatsapp.com/send?phone=+62' +registrar.phone.substring(1)" target="_blank">
          <v-icon>fab fa-whatsapp</v-icon>
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
          <small class="ml-2">( {{ wordCount(registrar.Essay.essayMotivationJoin) }} kata )</small>
          <p>{{ registrar.Essay.essayMotivationJoin }}</p>

          <strong>Alasan memilih room {{ registrar.Room.firstRoom }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.Essay.essayRoomSelected) }} kata )</small>
          <p>{{ registrar.Essay.essayRoomSelected }}</p>

          <strong>Studi kasus room {{ registrar.Room.firstRoom }}</strong>
          <small class="ml-2">( {{ wordCount(registrar.Essay.essayCaseStudy) }} kata )</small>
          <p>{{ registrar.Essay.essayCaseStudy }}</p>
        </v-tab-item>
        <v-tab-item>
          <strong>Nama</strong>
          <p>{{ registrar.fullName }} , dipanggil {{registrar.nickName}}</p>
          <strong>Tempat Tanggal Lahir</strong>
          <p>{{ registrar.placeOfBirth }} , {{ registrar.dateOfBirth | moment('D MMMM YYYY') }}</p>
          <strong>Jenis Kelamin</strong>
          <p>
            {{ registrar.gender == false ? 'Laki-laki' : 'Perempuan' }}
            <v-icon :color="registrar.gender == false ? 'info' : 'pink'">{{ iconGender(registrar.gender) }}</v-icon>
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
            <v-btn v-if="registrar.Socmed.instagram" small icon color="primary" :href="'https://instagram.com/' + registrar.Socmed.instagram" target="_blank">
              <v-icon>fab fa-instagram</v-icon>
            </v-btn>
            {{ registrar.Socmed.instagram }}
            <br>
            <v-btn v-if="registrar.Socmed.facebook" small icon color="primary" :href="'https://www.facebook.com/search/top/?q=' + registrar.Socmed.facebook" target="_blank">
              <v-icon>fab fa-facebook-f</v-icon>
            </v-btn>
            {{ registrar.Socmed.facebook }}
            <br>
            <v-btn v-if="registrar.Socmed.line" small icon color="success" :href="'http://line.me/ti/p/~' + registrar.Socmed.line" target="_blank">
              <v-icon>fab fa-line</v-icon>
            </v-btn>
            {{ registrar.Socmed.line }}
          </p>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(achievement, i) in registrar.Achievements" :key="i">
            <strong>{{ achievement.name }}</strong>
            <p>
              Juara {{ achievement.rank }}
              <br> Tingkat {{ getLevel(achievement.level) }}
              <br> {{ achievement.year }}
            </p>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(organization, i) in registrar.Organizations" :key="i">
            <strong>{{ organization.name }}</strong>
            <p>
              Jabatan {{ organization.position }}
              <br> Tingkat {{ getLevel(organization.level) }}
              <br> {{ organization.period }}
            </p>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="(socialActivity, i) in registrar.SocialActivities" :key="i">
            <strong>{{ socialActivity.name }}</strong>
            <p>
              Tingkat {{ getLevel(socialActivity.level) }}
              <br> {{ socialActivity.period }}
            </p>
          </div>
        </v-tab-item>
      </v-tabs>


      <v-divider></v-divider>

      <h4 class="subheading">Nilai - </h4>
      <div><strong>Prestasi</strong> {{ registrar.Score.achievement }}</div>
      <div><strong>Organisasi</strong> {{ registrar.Score.organization }}</div>
      <div><strong>Sosial</strong> {{ registrar.Score.socialActivity }}</div>
      <div><strong>Essay Motivation Join</strong> {{ registrar.Score.essayMotivationJoin }}</div>
      <div><strong>Essay Room Selected</strong> {{ registrar.Score.essayRoomSelected }}</div>
      <div><strong>Essay Case Study</strong> {{ registrar.Score.essayCaseStudy }}</div>
      <div><strong>Total</strong> {{ registrar.Score.total }}</div>
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
      baseURL: 'https://api.futureleadersummit.org/data',
      tabs: 0,
      level: ['Internasional','Nasional', 'Daerah', 'Daerah', 'Universitas', 'Sekolah'],
      tabMenu: [
        { icon: 'assignment', name: 'Essay' },
        { icon: 'person', name: 'Bio' },
        { icon: 'account_box', name: 'Prestasi' },
        { icon: 'account_box', name: 'Organisasi' },
        { icon: 'account_box', name: 'Aktifitas Sosial' },
      ]
    }
  },
  async mounted() {
    console.log(this.$props);
    await this.getDataById();
  },
  methods: {
    iconGender (gender) {
      console.log('gender : ',gender)
      switch (gender) {
        case false:
          return 'fas fa-mars'
        case true:
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
    async getDataById() {
      const province = await this.$axios.get(this.baseURL+'/provinces/'+this.registrar.province)
      const city = await this.$axios.get(this.baseURL+'/regencies/'+this.registrar.city)
      this.registrar.province = province.data.data.name;
      this.registrar.city = city.data.data.name;
    },
    getLevel(value) {
      return this.level[value]
    },
    getRoomImageUrl (room) {
      switch (room) {
        case 1:
          return 'http://join.futureleadersummit.org/images/rooms/Digital.png'
        case 2:
          return 'http://join.futureleadersummit.org/images/rooms/Education.png'
        case 3:
          return 'http://join.futureleadersummit.org/images/rooms/Environment.png'
        case 4:
          return 'http://join.futureleadersummit.org/images/rooms/International Relation.png'
        case 5:
          return 'http://join.futureleadersummit.org/images/rooms/Technopreneur.png'
        case 6:
          return 'http://join.futureleadersummit.org/images/rooms/UrbanPlanning.png'
        default:
          return 'https://user-images.githubusercontent.com/21119252/41821836-c2787e10-7810-11e8-8d2a-cc829bea4ae3.png'
      }
    }
  }
}
</script>
