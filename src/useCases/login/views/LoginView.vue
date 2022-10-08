<template>
  <v-container fill-height>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <ProgressBar :mensagem="mensagemAguarde" />
    <Login :tokenSistema="tokenSistema" :usuarioPadrao="usuarioPadrao" :senhaPadrao="senhaPadrao" @cbAutenticado= "cbAutenticado"/>
  </v-container>
</template>
<script>
  import {carregaDadosPersistentes} from '@/rotinasProjeto/rotinasProjeto';
  import MessageBox from '@/lastec.components/lastec-messagebox';
  import ProgressBar from '@/lastec.components/lastec-progressbar';
  import Login from '@/lastec.components/lastec-login.vue';
  
  export default {inject: {
      theme: {
        default: { isDark: false },
      },
    },
    components:{
      ProgressBar, MessageBox, Login
    },
    data() {
      return {
        tokenSistema: process.env.VUE_APP_TOKEN_SISTEMA,
        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: '',

        usuarioPadrao: process.env.VUE_APP_DEFAULT_USER,
        senhaPadrao: process.env.VUE_APP_DEFAULT_USER_PASSW
      }
    },
    computed: {
      mensagemErro: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 1
          this.mensagem = val
        }
      },
      mensagemSucesso: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 0
          this.mensagem = val
        }
      },
    },
    methods: {
      async cbAutenticado(param) {
        this.$store.commit('autenticadoSso', param)
        let _carregaDados = true
        if (_carregaDados) {

          this.mensagemAguarde = 'Carregando mais alguns dado. Aguarde...'
          const _retorno = await carregaDadosPersistentes();
          this.mensagemAguarde = '';

          if (_retorno != '') {
            this.mensagemErro = _retorno;
            return;
          }

        } else {
          this.$store.commit('carregaDadosPersistentes')
        }
        this.$store.commit('finalizaLogin', true)
        this.$router.push('/Home')
      }
    }
  }
</script>