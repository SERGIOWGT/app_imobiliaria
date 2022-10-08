<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>  
        <ProgressBar :mensagem="mensagemAguarde"/>          
        <Pergunta v-if="infoPergunta.abre" :titulo="infoPergunta.titulo" :pergunta="infoPergunta.texto" @cbRespostaSim="cbRespostaSim()" @cbRespostaNao="cbRespostaNao()"/>        
        <Identificacao 
            v-show="etapaAtual != enumEtapa.emCadastro"
            :permiteInclusao='permiteInclusao'
            :permiteAlteracao='permiteAlteracao'
            :permiteExclusao='permiteExclusao'
            :executaRefresh='executaRefresh'
            @cbMensagemAguarde="cbMensagemAguarde" 
            @cbMensagemErro="cbMensagemErro"
            @cbOperacao="cbOperacao"
        /> 

        <v-flex v-if="mostraTelaOperacao">
            <OperacaoContrato
                :idOperacao="idSelecionado"
                :tipoOperacao="tipoOperacao" 
                :apelidoImovel="apelidoImovel"
                @cbMensagemAguarde="cbMensagemAguarde" 
                @cbMensagemErro="cbMensagemErro"
                @cbFechaOperacao="cbFechaOperacao"
        />  
        </v-flex>

    </v-container>
</template>
<script>
    import Pergunta from '../../../components/AppDialog.vue'
    import MessageBox from '../../../lastec.components/lastec-messagebox'
    import OperacaoContrato from '../componentes/abc-teste.vue'
    import ProgressBar from '../../../lastec.components/lastec-progressbar'
    import Identificacao from '../componentes/identificaContratoAluguel.vue'
    import mainService from '../../../services/mainService'
        
    export default {
        name: 'contratoAluguel',
        components: {Identificacao, MessageBox, OperacaoContrato, Pergunta, ProgressBar},
        data() {
            return {
                // dados
                tipoMensagem: 0,
                mensagem: '',
                mensagemAguarde: '',
                
                enumEtapa: {
                    emPesquisa: 0,
                    emCadastro: 1,
                    emAssinatura: 2,
                    emReajuste: 3,
                    emEncerramento: 4,
                    emPostergacao: 5
                },
                executaRefresh: false,
                etapaAtual: 0,
                idSelecionado: 0,
                mostraTelaOperacao: false,
                apelidoImovel: '',

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
            this.$store.commit('habilitaUserbar', false)
        },
        computed: {
            tipoOperacao() {
                return this.etapaAtual == this.enumEtapa.emReajuste ? 'RE'
                        : this.etapaAtual == this.enumEtapa.emEncerramento ? 'EN'
                        : this.etapaAtual == this.enumEtapa.emPostergacao ? 'PO'
                        : '';

            },
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
            cbMensagemAguarde(v) {
                this.mensagemAguarde = v
            },
            cbMensagemErro(v) {
                this.mensagemErro = v
            },
            cbMensagemSucesso(v) {
                this.mensagemSucesso = v
            },
            cbOperacao(o, i, apelidoImovel) {
                this.apelidoImovel = apelidoImovel
                this.idSelecionado = i;
                this.mostraTelaOperacao = true;
                switch (o) {
                    case "RE":
                        this.etapaAtual = this.enumEtapa.emReajuste;
                        break;
                    case "EN":
                        this.etapaAtual = this.enumEtapa.emEncerramento;
                        break;
                }
            },
            cbFechaOperacao(msgSucesso) {
                this.mostraTelaOperacao = false;
                this.mensagemAguarde = '';
                if (msgSucesso)
                    this.mensagemSucesso = msgSucesso
            },
            assina(id) {
                this.infoPergunta.titulo = 'Assinatura do Contrato';
                this.infoPergunta.texto = 'Confirma a Assinatura do Contrato?'
                this.infoPergunta.abre = true
                this.infoPergunta.operacao = this.enumOperacao.assina
                this.infoPergunta.id = id
            },
            async executaAssinatura(id) {
                this.mensagemAguarde =  'Assinando contrato. Aguarde...'
                await mainService.assinaContrato(id)
                .then(resp => {
                    this.mensagemAguarde =  ''
                    if (resp.status == 204) {
                        this.mensagemSucesso = 'Contrato assinado com sucesso.'
                        this.refresh()
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
            },
            cbRespostaSim() {
                this.infoPergunta.abre = false
                switch (this.infoPergunta.operacao) {
                    case this.enumOperacao.assina:
                        this.executaAssinatura(this.infoPergunta.id)
                        break;
                }
            },
            cbRespostaNao() {
                this.infoPergunta.abre = false
            },
        }
    }
</script>
