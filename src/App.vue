<template>
   <v-app>
      <AppBar v-if="$store.getters.loginFinalizado" 
            :estaOnline="$store.getters.estaOnLine"
            :titulo="$store.getters.nomeSistema" 
            :urlLogo="urlLogo"
            :temBotaoMenu="true" :temBotaoSair="true"/>
      <v-main>
          <v-container grid-list-md class="pa-0" style="max-width: 600px;">
            <UserBar v-if="$store.getters.userBarAtivo"/>
            <transition appear name="slide" mode="out-in">
              <Router-view/>
            </transition>
          </v-container>
      </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import UserBar from './components/UserBar';

export default {
  name: 'App', 
  components: { AppBar, UserBar}, 
  data(){
    return {
      titulo: 'Painel Saúde',
      urlLogo: './assets/logo.png'
    }
  },
  created() {
    window.addEventListener('offline', this.setaRedeOffLine);
    window.addEventListener('online', this.setaRedeOnline);
  },
  destroyed() {
    window.removeEventListener('online', this.setaRedeOnline);
    window.removeEventListener('offline', this.setaRedeOffLine);
  },
  mounted() {
    const onLine = window.navigator.onLine
    this.$store.commit('setaStatusRede', onLine)
  },
  methods: {
    setaRedeOnline() {
      console.log('Online');
      this.$store.commit('setaStatusRede', true)
    }, 
    setaRedeOffLine() {
      console.log('Offline');
      this.mostraAlerta = true;
      this.$store.commit('setaStatusRede', false)
    }
  }
};
</script>
<style scoped>
  .slide-leave-active{
    transition: 0s;
  }
  .slide-enter-active {
    transition: 0.3s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(-100%, 0);
  }
  .v-app {
    max-width:600px;
    margin: 0 auto;
  }
</style>
