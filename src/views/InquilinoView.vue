<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>  
        <ProgressBar :mensagem="mensagemAguarde"/>          
        <Pergunta v-if="infoPergunta.abre" :titulo="infoPergunta.titulo" :pergunta="infoPergunta.texto" @cbRespostaSim="cbRespostaSim()" @cbRespostaNao="cbRespostaNao()"/>        
        <IdentificacaoInquilino 
            v-show="etapaAtual == enumEtapa.emPesquisa"
            :permiteInclusao='permiteInclusao'
            :permiteAlteracao='permiteAlteracao'
            :permiteExclusao='permiteExclusao'
            :executaRefresh='executaRefresh'
            @cbNovo= 'novo'
            @cbEdita='edita'
            @cbAtiva='ativa'
            @cbInativa='inativa'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        /> 

        <CadastraInquilino 
            v-if="etapaAtual == enumEtapa.emCadastro"
            :inquilinoId='inquilinoId'
            @cbNovoCadastro='novo'
            @cbFimCadastro='fimCadastro'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        />

<!--                 
        <ConsultaCidadao 
            v-if="etapaAtual == enumEtapa.emConsulta"
            :pacienteId='0'
            @cbFimCadastro='fimCadastro'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        /> -->
    </v-container>
</template>
<script>
  import {carregaDadosPersistentes} from '../rotinasProjeto/rotinasProjeto'
  import IdentificacaoInquilino from '../components/InquilinoIdentifica';
  import CadastraInquilino from '../components/InquilinoCadastra';
  import Pergunta from '../components/AppDialogConfirm'
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  import {temAcesso} from '../rotinasProjeto/rotinasProjeto'
  import mainService from '../services/mainService'
    
  export default {
      name: 'identificacaoInquilino',
      //components: {IdentificacaoInquilino, CadastraCidadao, MessageBox, ProgressBar, ConsultaCidadao},
      components: {CadastraInquilino, IdentificacaoInquilino, MessageBox, Pergunta, ProgressBar},
      data() {
        return {
          perms: [
              {id:3, tipoId:1, acao:'I'},
              {id:3, tipoId:1, acao:'C'}
          ],
          executaRefresh: false,

          inquilinoId: 0,

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

          // seguranca
          funcionalidadeId: 3,
          permiteInclusao: false,
          permiteExclusao: false,
          permiteAlteracao: false,
          somenteConsulta: false,

          infoPergunta: {
            titulo: '',
            texto: '',
            abre: false,
            operacao: '',
            id: 0
          }
        }
      },
      mounted() {
        const _permissionamentos = this.$store.getters.permissionamento;
       
        this.permiteInclusao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'I');
        this.permiteAlteracao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'A');
        this.permiteExclusao = temAcesso(_permissionamentos, this.funcionalidadeId, 1, 'E');
        this.somenteConsulta = !(this.permiteInclusao || this.permiteAlteracao || this.permiteExclusao);

        this.$store.commit('habilitaUserbar', false)
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
        novo() {
          this.executaRefresh = false;
          this.inquilinoId = 0
          this.etapaAtual = this.enumEtapa.emCadastro
        },
        edita(id) {
          this.executaRefresh = false;
          this.etapaAtual = this.somenteConsulta ? this.enumEtapa.emConsulta : this.enumEtapa.emCadastro
          this.inquilinoId = id
        },
        ativa(id) {
          this.executaRefresh = false;
          this.infoPergunta.titulo = 'Ativação de Inquilino';
          this.infoPergunta.texto = 'Confirma a Ativação do Inquilino?'
          this.infoPergunta.abre = true
          this.infoPergunta.operacao = 'A'
          this.infoPergunta.id = id
        },
        inativa(id) {
          this.executaRefresh = false;
          this.infoPergunta.titulo = 'Inativação de Inquilino';
          this.infoPergunta.texto = 'Confirma a inativação do Inquilino?'
          this.infoPergunta.abre = true
          this.infoPergunta.operacao = 'I'
          this.infoPergunta.id = id
        },
        cbRespostaSim() {
          this.infoPergunta.abre = false
          if (this.infoPergunta.operacao == 'A')
              this.executaAtiva(this.infoPergunta.id)
          else
              this.executaInativa(this.infoPergunta.id)
        },
        cbRespostaNao() {
            this.infoPergunta.abre = false
        },
        async executaAtiva(id) {
          this.salvando = true;
          this.mensagemAguarde =  'Ativando inquilino. Aguarde...'
          await mainService.ativaInquilino(id)
          .then(resp => {
            this.mensagemAguarde =  ''
            if (resp.status == 204) {
                this.mensagemSucesso = 'Inquilino ativado com sucesso.'
                this.executaRefresh = true
            }
            else {
                this.mensagemErro =  resp.message
            } 
          })
          .catch(err => {
            this.mensagemAguarde =  ''
            this.mensagemErro =  mainService.catchPadrao(err)
          });
          this.mensagemAguarde =  ''
          this.salvando = false;  
        },
        async executaInativa(id) {
          this.salvando = true;
          this.mensagemAguarde =  'Inativando inquilino. Aguarde...'
          await mainService.inativaInquilino(id)
          .then(resp => {
            this.mensagemAguarde =  ''
            if (resp.status == 204) {
                this.mensagemSucesso = 'Inquilino inativado com sucesso.'
                this.executaRefresh = true
            }
            else {
                this.mensagemErro =  resp.message
            } 
          })
          .catch(err => {
            this.mensagemAguarde =  ''
            this.mensagemErro =  mainService.catchPadrao(err)
          });
          this.mensagemAguarde =  ''
          this.salvando = false;  
        },
        async fimCadastro(volta) {
          if (volta == false) {
            await carregaDadosPersistentes();
            this.executaRefresh = true;
            this.mensagemSucesso = 'Inquilino ' + (this.inquilinoId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' ;
          } 
            
          this.etapaAtual = this.enumEtapa.emPesquisa
        }
      }
  }
</script>
<style scoped>
  .input__label {
    color: blue;
  }
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-text-field input {
      font-size: 5.2em;
    }
    .v-combobox-field {
     font-size: 2.2em;
    }
  }
  .right-input input {
    text-align: right
  }
</style>

