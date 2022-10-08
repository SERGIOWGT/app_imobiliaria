<template>
    <v-container class="pa-0">
     <v-alert 
        class="ma-0"
        color="teal lighten-2"
        flat dark tile
        icon="mdi-account"
      >
        Olá, {{nomeUsuario}} <br>
      </v-alert>
    </v-container>
</template>
<script>
  import store from '../store'
  export default {
    name: 'UserBar',
    data() {
      return {
        nomeUsuario: ''
      }
    },
    created() {
      this.nomeUsuario = store.getters.nomeUsuario
    }
  }
</script>