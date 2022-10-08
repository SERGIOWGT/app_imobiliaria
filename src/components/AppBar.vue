<template>
    <v-app-bar app flat dark  :color="background" class="pr-2">
      <v-row class="linha">
        <v-col  class="d-flex justify-center" cols="2">
          <v-btn icon v-on:click="goHome()" v-show="temBotaoMenu == true">
            <img color="white" src="../assets/logo.png">
          </v-btn>
        </v-col>
        <v-col  class="d-flex justify-center" cols="8">
          <h4>{{titulo}}</h4>
        </v-col>
        <v-col  class="d-flex justify-center" cols="1">
          <v-icon v-if="!estaOnline" color="warning">mdi-wifi-strength-alert-outline</v-icon>
        </v-col>
         <v-col  class="d-flex justify-center" cols="1" >
          <v-btn  icon v-on:click="logout()" v-show="temBotaoSair == true"><v-icon>mdi-logout</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
</template>
<script>
    export default {
    name: 'AppBar',
    props: {
      estaOnline: Boolean, 
      titulo: String, 
      urlLogo: String,
      temBotaoMenu: Boolean,
      temBotaoSair: Boolean
    },
    data() {
      return {
        background: 'teal darken-4'
      }
    },
    created() {
    },
    methods: { 
      goHome() {
        this.$router.push('/home').catch(()=>{})
      },
      logout() {
        this.$store.commit('logout')
        const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
        delay(1000).then(() => {
          this.$router.push('/home').catch(()=>{})
        });
      }
    }
  }
</script>
<style scoped>
  .v-btn::before {
    background-color: transparent;
  }
  .linha {
    background-color: transparent;
    padding: 0px 0px 0px 0px;
    justify-items: center;
    align-items: center;
  }
</style>