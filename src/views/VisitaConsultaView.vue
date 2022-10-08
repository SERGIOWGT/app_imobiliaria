<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>

        <ConsultaVisitaIdentifica
            v-show="etapaAtual == enumEtapa.emPesquisa"
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
            @cbEscolheuVisita='cbEscolheuVisita'
        />
        
        <ConsultaVisita
            v-if="etapaAtual == enumEtapa.emCadastro"
            :pacienteId='pacienteId'
            :visitaId='visitaId'
            @cbFimCadastro='fimConsultaVisita'
            @cbMensagemAguarde='cbMensagemAguarde'
            @cbMensagemErro='cbMensagemErro'
            @cbMensagemSucesso='cbMensagemSucesso'
        />
    </v-container>
</template>
<script>
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'
    import ConsultaVisita from '../components/VisitaConsulta.vue'
    import ConsultaVisitaIdentifica from '../components/VisitaConsultaIdentifica.vue'

    export default {
        components: {
            ProgressBar, MessageBox, ConsultaVisitaIdentifica, ConsultaVisita
        },
        data() {
          return {
                       
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            enumEtapa: {
                emPesquisa: 0,
                emCadastro: 1
            },

            etapaAtual: 0
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
        },
        created() {
            this.$store.commit('habilitaUserbar', false)
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
            cbEscolheuVisita(visitaId, pacienteId) {
                this.pacienteId = pacienteId
                this.visitaId = visitaId
                this.etapaAtual = this.enumEtapa.emCadastro;
            },
            fimConsultaVisita() {
                this.mensagemAguarde = ''
                this.etapaAtual = this.enumEtapa.emPesquisa;
            }
        }
    }
</script>
