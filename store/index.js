import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      appInfo: {
        appName: 'FLS 2018 - beta',
        appLogo: '/images/fls-logo-mini.png'
      },
      roomSelected: '',
      searchField: '',
      userInfo: null,
      token: null,
      tokenExpire: null,
      notification: {
        color: 'error',
        active: false,
        message: ''
      }
    },
    mutations: {
      SET_NOTIFICATION(state, payload) {
        state.notification.active = !state.notification.active
        state.notification.message = payload.message
        state.notification.color = payload.type
      },
      SET_TOKEN (state, token) { state.token = token },
      SET_TOKEN_EXP (state, data) { state.tokenExpire = data },
      CLEAR_TOKEN (state) { state.token = null },
      SET_USER_INFO (state, data) { state.userInfo = data },
      SET_ROOM_SELECTED (state, data) { state.roomSelected = data },
      SET_SEARCH_FIELD (state, data) { state.searchField = data }
    },
    actions: {
      initApp (vuexCtx) {
        console.log('iki init app')
        vuexCtx.dispatch('initAuth')
      },
      saveToken (vuexCtx, token) {
        vuexCtx.commit('SET_TOKEN', token)
        localStorage.setItem('token', token)
      },
      saveTokenExp (vuexCtx, tokenExpire) {
        vuexCtx.commit('SET_TOKEN_EXP', tokenExpire)
        localStorage.setItem('tokenExpire', tokenExpire)
      },
      saveUserInfo(vuexCtx, data) {
        vuexCtx.commit('SET_USER_INFO', data)
        localStorage.setItem('userInfo', JSON.stringify(data))
      },
      initAuth (vuexCtx) {
        console.log('init auth');

        let token = localStorage.getItem('token')
        vuexCtx.commit('SET_TOKEN', token)

        let tokenExpire = localStorage.getItem('tokenExpire')
        vuexCtx.commit('SET_TOKEN_EXP', tokenExpire)

        let dataUser = localStorage.getItem('userInfo')
        vuexCtx.commit('SET_USER_INFO', JSON.parse(dataUser))
      },
      notify(vuexCtx, payload) {
        vuexCtx.commit('SET_NOTIFICATION', payload)
      },
      logout(vuexCtx) {
        vuexCtx.commit('CLEAR_TOKEN')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      },
      setRoomSelected (vuexCtx, payload) {
        vuexCtx.commit('SET_ROOM_SELECTED', payload)
      },
      setSearchField (vuexCtx, payload) {
        vuexCtx.commit('SET_SEARCH_FIELD',  payload)
      }
    },
    getters: {
      isLogedIn (state) {
        return state.token !== null ? true : false;
      }
    }
  })
}

export default createStore
