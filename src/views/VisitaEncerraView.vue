<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>   
        <ProgressBar :mensagem="mensagemAguarde"/>     
        <v-flex>
            <IdentificaEncerraVisita
                v-show="operacaoAtual == enumOperacao.pesquisa"
                :somenteConsulta='somentePermissaoConsulta'
                @cbEncerraVisita= 'cbEncerraVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            /> 
            <EncerraVisita
                v-if="operacaoAtual != enumOperacao.pesquisa"
                :visitaId='visitaId'
                :somenteConsulta='somentePermissaoConsulta || operacaoAtual == enumOperacao.consultaVisita'
                @cbFimEncerraVisita='cbFimEncerraVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
        </v-flex>
    </v-container>
</template>
<script>
    import IdentificaEncerraVisita from '../components/VisitaEncerraIdentifica';
    import EncerraVisita from '../components/VisitaEncerra';
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'
    import {temAcesso} from '../rotinasProjeto/rotinasProjeto'

    export default {
        components: {
            EncerraVisita, IdentificaEncerraVisita,  MessageBox, ProgressBar
        },
        data() {
          return {
            enumOperacao: {
                pesquisa: 0,
                encerraVisita: 1,
                consultaVisita: 2
            },
            operacaoAtual: 0,
            visitaId: 0,

            somentePermissaoConsulta: true,

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
          }
        },
        created() {
            this.$store.commit('habilitaUserbar', false)
        },
        mounted() {
            this.somentePermissaoConsulta = temAcesso(this.$store.getters.permissionamento, 115, 1, 'I') ? false : true;
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
            cbEncerraVisita(visitaId, permiteAlteracao) {
                this.visitaId = visitaId
                this.operacaoAtual = permiteAlteracao ? this.enumOperacao.encerraVisita : this.enumOperacao.consultaVisita
            },
            cbFimEncerraVisita(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Visita baixada com sucesso!' 
            }
        }
    }
</script>