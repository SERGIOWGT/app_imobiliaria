<template>
  <v-container fill-height>
    <v-flex>
      <v-flex v-if="showFormTrocaSenha">
          <TrocaSenha
            :tokenSistema="tokenSistema" 
            :chave= "email" 
            :senhaAtual= "senha" 
            :nomeChave= "nomeChave"
            :formatoChave="formatoChave"
            :tamanhoMinimoSenha="tamanhoMinimoSenha"
            :tamanhoMaximoSenha="tamanhoMaximoSenha"
            :formatoSenha="formatoSenha" 
            :mensagemErroFormatoSenha="mensagemErroFormatoSenha"
            :mensagemMotivoTroca="mensagemDialog"
            @cbMensagem='cbMensagem'
            @cbFim='cbFimTrocaSenha'
          />  
      </v-flex>
      <v-flex v-if="showFormEsqueciSenha">
          <EsqueciSenha
            :tokenSistema="tokenSistema" 
            :chave= "email" 
            :nomeChave= "nomeChave"
            :formatoChave="formatoChave"
            :tamanhoMinimoSenha="tamanhoMinimoSenha"
            :tamanhoMaximoSenha="tamanhoMaximoSenha"
            :formatoSenha="formatoSenha" 
            :mensagemErroFormatoSenha="mensagemErroFormatoSenha"
            @cbMensagem='cbMensagem'
            @cbFim='cbFimEsqueciSenha'
          />  
      </v-flex>
    </v-flex>
    <v-container >
      <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
      <ProgressBar :mensagem="mensagemAguarde"/>
      <v-row class="justify-center pt-15 pb-15 px-3">
        <transition name="roll">
          <v-img v-if="bounce" class="shrink mr-2" contain src="../assets/logoTelaAbertura.png"/>
        </transition>
      </v-row>
      <v-flex v-if="telaPronta" >
        <v-form class="my-2 px-2 " v-model="formValido" >
          <v-text-field 
            :disabled="isLoading"
            v-model="email"
            :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
            :label="nomeChave"
            autofocus
            @focus="$event.target.select()"
            required
            clearable
            prepend-icon="mdi-account"
          ></v-text-field>
          <v-text-field 
            :disabled="isLoading"
            label="Senha"
            clearable
            v-model="senha"
            :counter="tamanhoMaximoSenha"
            :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
            :type="!senhaVisivel ? 'password' : 'text'"
            prepend-icon="mdi-lock"
            :append-icon="senhaVisivel ? 'mdi-eye' : 'mdi-eye-off'"
            :append-icon-cb="() => (senhaVisivel = !senhaVisivel)"
            @click:append="senhaVisivel = !senhaVisivel"
          />
          <v-row class="justify-center pt-5 mt-5">
              <v-btn :disabled="isLoading || !formValido" class="white--text teal lighten-2 botao-arredondado" v-on:click="autentica()">Acessar</v-btn>
          </v-row>
          <v-row dense class="justify-center pt-8" >
              <v-btn text :disabled="isLoading"  v-on:click="mostraformEsqueciSenha()"><span class="teal--text text--lighten-2 text-caption">Esqueceu sua senha?&nbsp; Clique aqui</span></v-btn>
          </v-row>
          <v-row class="justify-center pt-3" v-if="permiteRegistroUsuario">
            <v-btn text :disabled="isLoading"><span class="texto text-caption"> Sua primeira vez?&nbsp; Crie aqui seu usuário</span></v-btn>
          </v-row>
        </v-form>
      </v-flex>
    </v-container>
  </v-container>
</template>
<script>
import MessageBox from '../lastec.components/lastec-messagebox'
import ProgressBar from '../lastec.components/lastec-progressbar'
import EsqueciSenha from '../lastec.components/lastec-login-esquecisenha'
import TrocaSenha from '../lastec.components/lastec-login-trocasenha'
import sso from '../services/ssoService'
import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'

export default {
    props: {
        tokenSistema: String,
        usuarioPadrao: String,
        senhaPadrao: String
    },
    components:{
      ProgressBar, MessageBox, EsqueciSenha, TrocaSenha
    },
    data() {
      return {
        contador: 0,
        rotinasLogin: RotinasLogin,
       
        emAbertura: true,
        nomeSistema: ''  ,
        bounce: false,

        telaPronta: false,
        
        showFormTrocaSenha: false,
        showFormEsqueciSenha: false,
                
        formValido: false, 
        isLoading: true,
        senhaVisivel: false,

        email: '',
        senha: '',
        
        urlImagemLogin: '',
        tamanhoMinimoSenha: 0,
        tamanhoMaximoSenha: 0,
        nomeChave:  '',
        formatoChave:  '',
        formatoSenha:  '',
        mensagemErroFormatoSenha: '',
        permiteRegistroUsuario: false,

        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: '',
      }
    },
    mounted() {
      this.bounce = true
      const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
      delay(1000).then(() => this.listaConfiguracao())

      if (this.usuarioPadrao) {
        this.email=this.usuarioPadrao;
        this.senha=this.senhaPadrao;
      } else {
        if (this.tokenSistema) {
          this.email = localStorage.getItem(`${this.tokenSistema}_us`) || ''
        }
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
        cbMensagem(tipo, msg) {
          switch (tipo) {
            case 'E':
              this.mensagemErro = msg
              break;
            case 'S':
              this.mensagemSucesso = msg
              break;
            case 'A':
              this.mensagemAguarde = msg
              break;
          }
        },
        cbFimEsqueciSenha(p) {
          this.showFormEsqueciSenha = false;
          this.mensagemAguarde = '';
          this.senhaVisivel = false
          if (p.trocouSenha) {
            this.mensagemSucesso = 'Senha trocada com sucesso. A partir de agora, use a senha nova'
            this.senha = p.senha
          }
        },
        cbFimTrocaSenha(p) {
          this.showFormTrocaSenha = false;
          this.mensagemAguarde = '';
          this.senhaVisivel = false
          if (p.trocouSenha) {
            this.mensagemSucesso = 'Senha trocada com sucesso. A partir de agora, use a senha nova'  
            this.senha = p.senha
          }
        },
        async autentica() {
            this.isLoading =true;
            this.mensagemAguarde =  'Autenticando usuário! Aguarde...'
            let _erro = false;
            const _resp = await sso.autentica(this.tokenSistema, this.email, this.senha) 
                                .catch (err => {
                                    _erro = true;
                                    this.mensagemAguarde =  '';
                                    this.isLoading =false; 
                                    this.mensagemErro =  'Autenticando usuário: ' + sso.catchPadrao(err)});

            if (_erro) {
              this.isLoading = false;
              return;
            }

            const _data = _resp.data;
            if (_data.primeiroAcesso) {
              this.isLoading = false;
              this.mensagemAguarde = ''
              this.showFormTrocaSenha = true
              this.mensagemDialog = 'Você precisa de trocar de senha pois é seu primeiro acesso.'
              return
            }
            if (_data.senhaExpirada) {
              this.isLoading = false;
              this.mensagemAguarde = ''
              this.showFormTrocaSenha = true
              this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está expirada.'
              return
            }
            if (_data.bloqueado) {
              this.isLoading = false;
              this.mensagemAguarde = ''
              this.showFormTrocaSenha = true
              this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está bloqueada'
              return
            }
            if (!_data.usuarioGuid) {
              this.isLoading = false;
              this.mensagemAguarde = ''
              this.mensagemErro = 'Chave do usuário não encontrada!'
              return
            }
            this.mensagemAguarde = ''
            const param = {
                email: this.email,
                usuarioId: _data.usuarioId,
                token: _data.token,
                nomeUsuario: _data.nomeUsuario,
                permissionamento: _data.permissionamento,
                usuarioGuid: _data.usuarioGuid,
                sistemaId: _data.sistemaId
            }
            localStorage.setItem(`${this.tokenSistema}_us`, this.email);
            this.$emit('cbAutenticado', param);
        },
        async listaConfiguracao() {
            let _erro = false;
            this.isLoading = true
            this.mensagemAguarde = "Preparando ambiente. Aguarde..."
            let _resp = await sso.listaConfiguracao(this.tokenSistema)            
                .catch (err => {
                    _erro = true;
                    this.mensagemAguarde = ''; 
                    this.mensagemErro= sso.catchPadrao(err); 
                });

            if (_erro) return;
            
            this.isLoading = false
            this.mensagemAguarde = ''
            this.sistemaId =  _resp.data.sistemaId;
            this.permiteRegistroUsuario = _resp.data.permiteRegistroUsuario;
            this.urlImagemLogin = _resp.data.urlImagemLogin;
            this.nomeChave = _resp.data.nomeChave;
            this.formatoChave = _resp.data.formatoChave;
            this.tamanhoMaximoSenha =  _resp.data.tamanhoMaximoSenha;
            this.tamanhoMinimoSenha = _resp.data.tamanhoMinimoSenha;
            this.formatoSenha = _resp.data.formatoSenha;
            this.mensagemErroFormatoSenha = _resp.data.mensagemErroFormatoSenha;

            let param = {
                sistemaId: this.sistemaId,
                nomeSistema: _resp.data.nomeSistema,
                plataformaId: _resp.data.plataformaId,
                nomePlataforma: _resp.data.nomePlataforma,
                urlImagemLogin: this.urlImagemLogin,
                tamanhoMaximoSenha: this.tamanhoMaximoSenha,
                tamanhoMinimoSenha: this.tamanhoMinimoSenha,
                formatoSenha: this.formatoSenha,
                mensagemErroFormatoSenha: this.mensagemErroFormatoSenha
            }
            this.$store.commit('setaConfiguracaoSistema', param)
            this.telaPronta= true
        },
        mostraformEsqueciSenha() {
            this.showFormEsqueciSenha =true
        },
        soma() {
          this.contador++;
        }

        /*
          <v-img v-if="bounce" class="shrink mr-2" contain src="https://drive.google.com/thumbnail?id=1D2Oc29KB5cG4IK-iMGZRjagCvDq1gPcX"/>
          <v-img v-if="bounce" class="shrink mr-2" contain src="https://drive.google.com/thumbnail?id=1D2Oc29KB5cG4IK-iMGZRjagCvDq1gPcX"/>
        */

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

