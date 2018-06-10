import Vue from "vue";

export default function ({ store, route, redirect }) {
  console.log('[middleware] check-auth');

  function startSession () {
    let time = store.state.tokenExpire - Vue.moment().unix()
    console.log('session waktu ', time, ' second')
    setTimeout(() => {
      store.dispatch('notify', { type: 'error', message: 'Token expired, silakan login kembali' });
      store.dispatch('logout')
      redirect('/login')
    }, time * 1000)
  }

  if(!store.getters.isLogedIn) {
    redirect('/login')
    store.dispatch('notify', { type: 'warning', message: 'Silakan login terlebih dahulu' });
  } else {
    startSession()
  }
}
