<template>
    <v-bottom-sheet persistent inset v-model="showTela" max-width="500px">
        <v-sheet class="text-center">
          <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">TROCA DE SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-subtitle class="text-start text-subtitle-1">{{mensagemMotivoTroca}}</v-card-subtitle>
                <v-card-text class="text-start"> Informe seu nova senha e depois repita essa senha usando os campos abaixo.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formTrocaSenhaValido">
                  <v-text-field class="pt-2" clearable 
                    label="Nova Senha"
                    v-model="senhaNova"
                    prepend-icon="mdi-lock"
                    :counter="tamanhoMaximoSenha"
                    :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
                    :type="!senhaNovaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaNovaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaNovaNaoVisivel = !senhaNovaNaoVisivel)"
                    @click:append="senhaNovaNaoVisivel = !senhaNovaNaoVisivel"
                  />
                  <v-text-field class="pt-2 pb-3" dense clearable 
                    label="Repita a Senha"
                    prepend-icon="mdi-lock"
                    v-model="senhaRepetida"
                    counter
                    :type="!senhaRepetidaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaRepetidaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel)"
                    @click:append="senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel"
                    :rules="[rotinasLogin.SenhaRules.mesmaSenha(senhaNova)]"
                  />
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
              <v-spacer></v-spacer>
              <v-btn text small color="secundary" @click="fecha(false)" :disabled="isLoading">Fechar </v-btn>
              <v-btn text small color="primary" :disabled="!formTrocaSenhaValido || isLoading" v-on:click="trocaSenha()">Troca Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
</template>
<script>
import sso from '../services/ssoService'
import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'

export default {
    props: {
        tokenSistema: String,
        nomeChave: String,
        chave: String,
        senhaAtual: String,
        formatoChave: String,
        tamanhoMinimoSenha: Number,
        tamanhoMaximoSenha: Number,
        formatoSenha: String, 
        mensagemErroFormatoSenha: String,
        mensagemMotivoTroca: String
    },
    data() {
      return {
        rotinasLogin: RotinasLogin,
        
        formTrocaSenhaValido: false, 
        isLoading: false,

        senhaNovaNaoVisivel: false,
        senhaRepetidaNaoVisivel: false,

        formValido: false, 
        
        senhaNova: '',
        senhaRepetida: '',

        showTela: true,

        tipoMensagem: 0,
        mensagemDialog: '',

        mensagemSucesso: '',
        mensagemErro: '',
        mensagemAguarde: '',
      }
    },
    watch: {
        mensagemAguarde (val) {
            this.$emit('cbMensagem', 'A', val)
            this.isLoading = (val == '') ? false : true
        },
        mensagemErro (val) {
            this.$emit('cbMensagem', 'E', val)
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
        async trocaSenha() {
            this.isLoading =true;
            this.mensagemErro = ''
            this.mensagemAguarde =  'Trocando a senha! Aguarde...'
            await sso.trocaSenha(this.tokenSistema, this.chave, this.senhaAtual, this.senhaNova)
            .then (resp => {
                this.mensagemAguarde =  ''
                this.isLoading =false;
                if (resp.status == 204){                    
                    const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
                    delay(1000).then(() => this.fecha(true));
                } else {
                    this.mensagemErro =  resp.message
                } 
            })
            .catch (err => {
                this.mensagemAguarde =  '';
                this.isLoading =false; 
                this.mensagemErro =  sso.catchPadrao(err)
            });
        },
        fecha(p) {
            const param = {
                trocouSenha: p,
                senha: p ? this.senhaNova : ''
            }
            this.$emit('cbFim', param);
        }
    }
}
</script>

<style scoped>
  .container {
    background-color:#FFFFFF !important; /* light-blue darken-1*/
  }
  
  .botao-arredondado{
    width: 90%;
    border-radius:10px!important;
  } 
  .arredondado{
    width: 90%;
    border-bottom-left-radius: 50px 50px; 
    border-bottom-right-radius: 50px 50px;
  } 

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in 1s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .roll-enter-active {
    animation: roll-in .9s;
  }
  .roll-leave-active {
    animation: roll-in 9s reverse;
  }
  @keyframes roll-in {
    0% {
      transform: scale(0) rotateZ(0deg) translateX(-250px);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: scale(1) rotateZ(360deg) translateX(0px);
      opacity: 1;
    }
  }
</style>
