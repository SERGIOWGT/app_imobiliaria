<template>
    <v-bottom-sheet persistent inset scrollable v-model="showTela" max-width="500px">
        <v-sheet class="text-center">
            <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">ESQUECI MINHA SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-text class="text-start"> Informe o seu email clique no botão <span class="red--text">SOLICITA CÓDIGO DE ACESSO</span>. Será enviado um código de acesso para o seu e-mail que será válido por 5 minutos.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formChaveValido">
                    <v-text-field 
                    autofocus
                    @focus="$event.target.select()"
                    :disabled="isLoading"
                    v-model="email"
                    :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
                    :label="nomeChave"
                    required
                    clearable
                    prepend-icon="mdi-account-circle"
                ></v-text-field>
                </v-form>
                <v-row class="justify-center pt-5">
                <v-btn :disabled="!formChaveValido || isLoading" class="white--text teal lighten-2 botao-arredondado" v-on:click="geraCodigo()">Solicita código de Acesso</v-btn>
                </v-row>
                <v-row class="justify-center py-5">
                {{mensagemCodigoAcesso}}
                </v-row>
                <v-form ref="myForm" class="pt-0 mx-3" v-model="formCodigoValido">
                    <v-text-field 
                        type="number"
                        v-model="codigoAcesso"
                        :disabled="isLoading || !codigoEnviado"
                        :rules="[rotinasLogin.CodigoAcessoRules.valido(codigoEnviado)]"
                        label="Código de Acesso"
                        required
                        clearable
                        prepend-icon="mdi-account-key"
                    ></v-text-field>
                    <v-text-field class="pt-2" clearable 
                        label="Nova Senha"
                        v-model="senhaNova"
                        :disabled="isLoading || !codigoEnviado"
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
                        :disabled="isLoading || !codigoEnviado"
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
                <v-btn text small color="primary" :disabled="!codigoEnviado || !formCodigoValido || isLoading" v-on:click="trocaSenha()">Troca Senha</v-btn>
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
        formatoChave: String,
        tamanhoMinimoSenha: Number,
        tamanhoMaximoSenha: Number,
        formatoSenha: String, 
        mensagemErroFormatoSenha: String,
    },
    data() {
      return {
        rotinasLogin: RotinasLogin,
       
        formChaveValido: false, 
        formCodigoValido: false, 
        isLoading: false,
        codigoEnviado: false,

        senhaNovaNaoVisivel: false,
        senhaRepetidaNaoVisivel: false,
        senhaNova: '',
        senhaRepetida: '',

        email: '',
        codigoAcesso: '',
        tipoMensagem: 0,

        mensagemSucesso: '',
        mensagemErro: '',
        mensagemAguarde: '',

        showTela: true,

        contador: 600,
        intervalMensagem: '',
        mensagemCodigoAcesso: ''

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
    mounted() {
        this.email = this.chave;
        this.showTela = true;
    },
    unmounted() {
        clearInterval(this.intervalMensagem);
    },
    methods: {
        montaMensagem() {
            this.contador--;
            if (this.contador == 0) {
                this.mensagemCodigoAcesso = `Código enviado, verifique seu email...`;
                clearInterval(this.intervalMensagem);
            } else 
                this.mensagemCodigoAcesso = `Código enviado, verifique seu email... ${this.contador} segundo(s)` ;
                
        },
        mostraMensagem() {
            this.contador = 600;
            let self = this;
            this.intervalMensagem = setInterval(() => { self.montaMensagem()}, 1000);
        },
        async geraCodigo() {
            this.isLoading =true;
            this.mensagemAguarde =  'Solicitando código de acesso! Aguarde...'
            await sso.esqueceuSenha(this.tokenSistema, this.email)
            .then (resp => {
                this.mensagemAguarde =  ''
                this.isLoading =false;
                if (resp.status == 204){
                    this.mostraMensagem();                    
                    this.codigoEnviado = true;
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
        async trocaSenha() {
            this.isLoading =true;
            this.mensagemAguarde =  'Trocando a Senha! Aguarde...'
            await sso.trocaSenhaPorCodigo(this.tokenSistema, this.email, this.codigoAcesso, this.senhaNova)
            .then (resp => {
                this.mensagemAguarde =  ''
                this.isLoading =false;
                if (resp.status == 204){
                    this.fecha(true)
                    const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time))}
                    delay(1000).then(() => this.fecha(true));
                } else {
                    this.mensagemErro =  resp.message
                } 
            })
            .catch (err => {
                this.mensagemAguarde =  '';
                this.isLoading =false; 
                this.mensagemErro =  sso.catchPadrao(err);
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
    width: 60%;
    border-radius:10px!important;
  } 
  .arredondado{
    width: 90%;
    border-bottom-left-radius: 50px 50px; 
    border-bottom-right-radius: 50px 50px;
  }
</style>
