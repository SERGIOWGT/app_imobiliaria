<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>  
        <ProgressBar :mensagem="mensagemAguarde"/>          
        <IdentificacaoImovel 
          v-show="etapaAtual == enumEtapa.emPesquisa"
          :somenteConsulta='somenteConsulta'
          :executaRefresh='executaRefresh'
          @cbMensagemAguarde='cbMensagemAguarde'
          @cbMensagemErro='cbMensagemErro'
          @cbMensagemSucesso='cbMensagemSucesso'
        /> 
    </v-container>
</template>
<script>
  import IdentificacaoImovel from '../components/ImovelIdentifica';
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  import {temAcesso} from '../rotinasProjeto/rotinasProjeto'
    
  export default {
    name: 'identificacaoImovel',
    components: {IdentificacaoImovel, MessageBox, ProgressBar},
    data() {
      return {
        perms: [
            {id:3, tipoId:1, acao:'I'},
            {id:3, tipoId:1, acao:'C'}
        ],
        somenteConsulta: false,
        executaRefresh: false,

        enumEtapa: {
          emPesquisa: 0,
          emCadastro: 1,
          emConsulta: 2
        },
        etapaAtual: 0,

        // dados
        tipoMensagem: 0,
        mensagem: '',
        mensagemAguarde: '',

      }
    },
    mounted() {
      this.$store.commit('habilitaUserbar', false)
      this.somenteConsulta = temAcesso(this.$store.getters.permissionamento, 3, 1, 'I') ? false : true;
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
      cbMensagemAguarde(msg) {
        this.mensagemAguarde = msg
      },
      cbMensagemErro(msg) {
        this.tipoMensagem = 1
        this.mensagem = msg
      },
      cbMensagemSucesso(msg) {
        this.tipoMensagem = 0
        this.mensagem = msg
      },
    }
  }
</script>

