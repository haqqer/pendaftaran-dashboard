<template>
  <v-card>
    <v-card-title class="headline pb-0">
      Pendaftar
    </v-card-title>
    <v-card-text>
      <v-toolbar flat dark tabs color="primary">
       <v-select
          class="mt-2"
          v-model="filterRoom"
          :items="roomLists"
          item-text="text"
          item-value="value"
          label="Solo field"
          solo-inverted
        ></v-select>
        <v-divider vertical class="ml-4"></v-divider>
        <v-menu bottom left>
          <v-btn
            slot="activator"
            dark
            icon
          >
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile @click="exportCsv()">
              <v-list-tile-title>Download</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-tabs
          slot="extension"
          v-model="tabs"
          show-arrows
          color="transparent"
          slider-color="white">
          <v-tab
            v-for="menu in ['Belum dinilai', 'Waiting List', 'Diterima', 'Semua']"
            :key="menu">
            {{ menu }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
      <v-data-table
        :items="registrarItems"
        class="elevation-1"
        :loading="loadingRegistrar"
        :headers="headers"
        :total-items="totalRegistrar"
        :rows-per-page-items="[5, 10, 25, 50]"
>
        <v-progress-linear slot="progress" color="info" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <!-- <td></td> -->
          <tr @click="props.expanded = !props.expanded" class="cursor-pointer">
            <td>{{ props.index + 1 }}</td>
            <td style="min-width: 250px;">
              <v-avatar
                size="48px"
                color="grey"
                class="mr-2 my-1">
                <img :src="'https://img.devidentify.com/' + props.item.email" alt="">
              </v-avatar>
              <v-icon :color="props.item.gender == true ? 'info' : 'pink'">{{ iconGender(props.item.gender) }}</v-icon>
              {{ props.item.fullName }}
            </td>
            <td class="">
              <v-avatar
                tile
                size="38px"
                color="grey"
                class="mx-3">
                <img :src="getRoomImageUrl(props.item.Room.firstRoom)" alt="">
              </v-avatar>
            </td>
            <!-- <td class="text-xs-left">{{ props.item.roomFirst }}</td> -->
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">
              <strong>{{ props.item.Score.total }}</strong>
            </td>
            <td class="text-xs-left">
              <v-icon v-if="props.item.userId" color="success">check_circle</v-icon>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card color="cloud">
            <v-card-text>
              <template v-if="props.item.userId">
                <v-chip v-if="props.item.status == 1" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Waiting List</strong>
                </v-chip>
                <v-chip v-if="props.item.status == 2" label color="info" outline>
                  <span class="mr-1">status: </span> <strong> Diterima Delegates</strong>
                </v-chip>
                <v-chip label color="info" outline>
                  <span class="mr-1">dinilai oleh: </span> <strong> {{ props.item.User.name }}</strong>
                </v-chip>
                <v-btn outline color="success" :to="'' + props.item.id" append>
                  <v-icon left="">edit</v-icon>
                  Edit Nilai
                </v-btn>
                <br>
                <v-btn v-if="props.item.status != 1"  round color="success" @click="addToWaitingList(props.item)" :loading="loadingBtnWaiting">
                  <v-icon left="">add_to_queue</v-icon>
                  Masukkan Waiting List
                </v-btn>
                <v-btn v-if="props.item.status != 2"  round color="success" @click="addToDelegates(props.item)" :loading="loadingBtnDelegates">
                  <v-icon left="">check</v-icon>
                  Terima Jadi Delegates
                </v-btn>
                <v-btn v-if="props.item.status == 1 || props.item.status == 2"  round color="error" @click="removeFromList(props.item)" :loading="loadingBtnRemoveList">
                  <v-icon left="">close</v-icon>
                  Keluarkan
                </v-btn>
              </template>
              <template v-else>
                <p>
                  mendaftar pada : {{ props.item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
                </p>
                <v-btn color="info" :to="'' + props.item.id" append>Ke Penilaian</v-btn>
              </template>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
const avatars = [
  'https://avataaars.io/?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
  'https://avataaars.io/?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
  'https://avataaars.io/?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
  'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
  'https://avataaars.io/?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
  'https://avataaars.io/?'
];

export default {
  data() {
    return {
      showResult: false,
      result: '',
      confirm: false,
      deleteId: null,
      users: [],
      totalRegistrar: 0,
      registrarItems: [],
      loadingRegistrar: true,
      headers: [
        { text: 'No', value: 'fullName', sortable: false },
        { text: 'Nama', value: 'fullName' },
        { text: 'Room', value: 'roomFirst' },
        { text: 'Email', value: 'email' },
        { text: 'Nilai Total', value: 'scoreTotal' },
        { text: 'Dinilai', value: 'scored' },
      ],
      roomLists: [
        { text: 'All Room', value: '' },
        { text: 'Human Capital', value: 'Human Capital' },
        { text: 'Education', value: 'Education' },
        { text: 'Digital', value: 'Digital' },
        { text: 'Urban Planning', value: 'Urban Planning' },
        { text: 'Entrepreneurship', value: 'Entrepreneurship' },
        { text: 'Poverty', value: 'Poverty' },
      ],      
    }
  },
  mounted() {
    this.getDelegates()
  },
  methods: {
    ...mapActions(['notify']),
    getDelegates() {
    //   const token = localStorage.getItem('token')
    console.log('loading delegates')
      this.loadingRegistrar = true
    //   console.log(token)
      this.$axios.$get('/delegates').then((response) => {
          const result = response.data;
          console.log(result)
          this.registrarItems = result
          this.loadingRegistrar = false
          console.log(this.registrarItems)
      }).catch((err) => {
          const errResult = err.response.data
          console.log(errResult )
          alert(errResult.data.message)
      })      
    },
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
    },        
    getstatus (status) {
      switch (status) {
        case 0:
          return 'Belum Dinilai'
        case 1:
          return 'Waiting List'
        case 2:
          return 'Diterima Delegates'
        default:
          return 'Pendaftar'
      }
    }
  
//     deleteDelegates(id) {
//       const token = localStorage.getItem('token')
//       this.axios({
//         method: 'DELETE',
//         url: this.$url + 'members/' + id,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       }).then((response) => {
//           const result = response.data;
//           this.getDelegates()
//           this.showResult = true
//           this.result = 'Data deleted!'  
//       }).catch((err) => {
//           const errResult = err.response.data
//           console.log(errResult )
//           alert(errResult.data.message)
//       })      
//     },
//     getStatus(status) {
//         const icons = ["close","verified_user"]
//         return icons[status]
//     },
//     updateStatus(id, data) {
//       const token = localStorage.getItem('token')
//       const userId = localStorage.getItem('userId')
//       this.axios({
//           method: 'PUT',
//           url: this.$url + 'members/'+id,
//           headers: {
//               'Authorization': `Bearer ${token}`
//           },
//           data: {
//               status: data,
//               userId: userId
//           }
//       }).then((response) => {
//           const result = response.data;
//           this.getDelegates()
//           this.showResult = true
//           this.result = 'Status updated!'
//           console.log(this.members)
//       }).catch((err) => {
//           const errResult = err.response.data
//           console.log(errResult )
//           this.showResult = true
//           this.result = errResult.data.message          
//           // alert(errResult.data.message)
//       })        
//     },
//     getUser(user) {
//       if(user !== null) {
//         return user;
//       } else {
//         return "<v-icon>warning</v-icon>" 
//       }
//     },
    // randomAvatar () {

    //   return avatars[Math.floor(Math.random() * avatars.length)];
    // },
  },
  created() {
    const vm = this;

    // this.axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
    //   var result = response && response.data;

    //   vm.users = result;
    // });
  }
}
</script>

<style>
  .table {
    border-radius: 3px;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.21);
    background-color: transparent;
  }
</style>
