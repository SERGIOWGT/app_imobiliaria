<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina :titulo="titulo()" @cbAnterior="fim(true)" />
        <v-flex v-if="buscandoDados==false">
            <v-expansion-panels focused class="pt-0 mt-2" v-model="painel">
                <ExpansionVisitaCidadao :nome="infoCidadao.nome" :endereco="enderecoAtual" :nomeEstadoSaude="infoCidadao.nomeEstadoSaude" :nomeMicroArea="infoCidadao.nomeMicroArea"/>
                <br>
                <v-divider></v-divider>
                <ExpansionLista tipo="C" posTitulo="atuais" :lista="infoCidadao.comorbidades"  />
                <ExpansionLista tipo="S" posTitulo="atuais" :lista="infoCidadao.sintomas"  />
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui os dados da Visita</v-expansion-panel-header >
                    <v-expansion-panel-content>
                        <v-card flat tile>
                            <v-card-text class="pt-4 px-0">
                                <v-text-field dense disabled label="Data da Visita" v-model="infoVisita.dataVisita" />
                                <v-text-field dense disabled label="Motivo" v-model="infoVisita.tipoMotivo"/>
                                <v-text-field dense disabled hide-details label="Detalhamento do Motivo" v-model="infoVisita.tipoMotivoAnalitico"/>
                                <v-row class="mt-0">
                                    <v-col cols="6"><v-text-field dense disabled label="Peso em KG" v-model="infoVisita.peso"/></v-col>
                                    <v-col cols="6"><v-text-field dense disabled label="Altura em cm" v-model="infoVisita.altura"/></v-col>
                                </v-row>
                                <v-text-field dense disabled label="Tipo de Ação" v-model="infoVisita.tipoAcao"/>
                                <v-text-field dense disabled label="Desfecho" v-model="infoVisita.desfecho"/>
                                <v-textarea dense auto-grow disabled label="Resumo" v-model="infoVisita.resumo" row-height="10" ></v-textarea>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-flex :v-if="statusAtualVisita == enumStatusVisita.naoBaixada || statusAtualVisita == enumStatusVisita.baixada">
                    <v-expansion-panel class="mt-2">
                        <v-flex v-if="this.somenteConsulta">
                            <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui o registro da baixa da visita</v-expansion-panel-header>
                            <v-expansion-panel-content class="pt-2">
                                <v-text-field class="pt-2" dense disabled label="Data da baixa" v-model="infoVisita.dataSolucao"></v-text-field>
                                <v-text-field class="pt-2" dense disabled label="Tipo de Solução" v-model="infoVisita.tipoSolucao.nome"></v-text-field> 
                                <v-textarea auto-grow label="Descrição" disabled v-model="infoVisita.resumoSolucao"></v-textarea>
                            </v-expansion-panel-content>
                        </v-flex>
                        <v-flex v-else>
                            <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Faça aqui o registro da baixa da visita</v-expansion-panel-header>
                            <v-expansion-panel-content class="pt-2">
                                <v-form ref="form3" v-model="podeSalvar">
                                    <v-text-field class="pt-2"
                                        dense required clearable
                                        label="Data da baixa*"
                                        v-model="infoVisita.dataSolucao"
                                        v-mask="'##/##/####'"
                                        :rules="[lRegras.Data.valida(true)]"
                                    ></v-text-field>
                                    <v-autocomplete class="pt-2" @input="setaTipoSolucao"
                                        dense hide-no-data return-object
                                        label="Tipo de Solução*"
                                        v-model="infoVisita.tipoSolucao"
                                        :items="tiposSolucaoVisita"
                                        item-value="id"
                                        item-text="nome"
                                        :rules="[lRegras.Basicas.obrigatorio()]"
                                    ></v-autocomplete> 
                                    <v-textarea
                                        auto-grow counter clearable
                                        clear-icon="mdi-close-circle"
                                        label="Descrição*"
                                        v-model="infoVisita.resumoSolucao"
                                        maxlength="500"
                                        row-height="10"
                                        :rules="[lRegras.Basicas.obrigatorio(), lRegras.Basicas.min(5), lRegras.Basicas.max(500)]"
                                    ></v-textarea>
                                    <small>*campo obrigatório</small>
                                </v-form>
                            </v-expansion-panel-content>
                        </v-flex>
                    </v-expansion-panel>
                </v-flex>
            </v-expansion-panels>
            <v-flex class="pt-5">
            <BottomBar 
                :temBotaoAnterior="true"
                :temBotaoProximo= "false"
                :temBotaoCancela= "false"
                :temBotaoFinaliza= "false"
                :temBotaoSalva= "!somenteConsulta"
                :temBotaoVerifica= "false"
                :temBotaoNovo= "false"
                :podeVoltar="true"
                :podeContinuar= "false"
                :podeCancelar= "false"
                :podeVerificar= "false"
                :podeSalvar="podeSalvar"
                @funcaoRetorno= 'cmdBotao'
            />
            </v-flex>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import TituloPagina from '../components/TituloPagina'
    import ExpansionVisitaCidadao from '../components/ExpansionVisitaCidadao.vue'
    import ExpansionLista from '../components/ExpansionListaCeS.vue'
    import {stringDataSql2Br, data2String} from '../bibliotecas/formataValores'
    import BottomBar from '../components/StepBottomBar'
    import {statusVisita, enumStatusVisita as _enumStatusVisita} from '../rotinasProjeto/rotinasProjeto'

    export default {
        components: {
            BottomBar, ExpansionLista, TituloPagina, ExpansionVisitaCidadao
        },
        props: {
          visitaId: Number,
          pacienteId: Number,
          somenteConsulta: Boolean
        },
        data() {
          return {
            lRegras: regrasCampos,
            
            enumStatusVisita: _enumStatusVisita,
            cidadePadrao: null,
            painel: 0,
            infoCidadao: {
                id: 0,
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                comorbidades:[],
                sintomas:[]
            },
            infoVisita:  {
                dataVisita: '',
                tipoMotivo: '',
                tipoMotivoAnalitico: '',
                peso: '',
                altura: '',
                tipoAcao: '',
                desfecho: '',
                resumo: '',
                dataSolucao: '',
                tipoSolucao: {
                    id: 0,
                    nome: ''
                },
                resumoSolucao: ''
            },
            tiposSolucaoVisita: [],

            podeSalvar: false,

            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            buscandoDados: true,

            statusAtualVisita: 0
          }
        },
        created() {
            this.infoVisita.dataSolucao = data2String(new Date(), 'BR')
            this.cidadePadrao = this.$store.getters.cidadePadrao
        },
        async mounted() {
            this.buscandoDados = true
            await this.buscaDados(this.pacienteId, this.visitaId)
            this.buscandoDados = false
        },
        watch: {
            mensagemAguarde (val) {
                this.isLoading = (val == '') ? false : true
                this.$emit('cbMensagemAguarde', val)
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            }
        },
        computed: {
            enderecoAtual:  {
                get: function() { 
                    let _retorno = this.infoCidadao.nomeLogradouro + (this.infoCidadao.numeroEndereco ? ', ' + this.infoCidadao.numeroEndereco : '')
                    _retorno += (this.infoCidadao.complementoEndereco ? ' - ' + this.infoCidadao.complementoEndereco : '')
                    return _retorno
                },
                set: function() {
                }
            },
        },       
        methods: {
            titulo: function() {
                if ((this.somenteConsulta) || ((this.statusAtualVisita != this.enumStatusVisita.baixada) && (this.statusAtualVisita != this.enumStatusVisita.naoBaixada))) 
                    return 'CONSULTA BAIXA DA VISITA'
                
                return 'REGISTRA BAIXA DA VISITA'
            },
            cmdBotao: function (value) {
                if (value == 'VO') 
                    this.fim(true)
                else 
                    this.salvaVisita()
            },
            async buscaDados(pacienteId, visitaId) {
                let erroBusca = false
                this.mensagemErro =  ''
                this.mensagemAguarde = 'Buscando informações da visita. Aguarde...'
                await mainService.listaPacienteVisita(visitaId)
                .then((_visita) => {
                    this.mensagemAguarde = ''        
                     if (_visita.status == 200) {
                        this.statusAtualVisita = statusVisita(_visita.data.tipoDesfechoVisitaId, _visita.data.requerSolucao, _visita.data.dataSolucao)

                        this.infoVisita.dataVisita = stringDataSql2Br(_visita.data.dataVisita);
                        this.infoVisita.tipoMotivo = _visita.data.nomeTipoMotivoVisita;
                        this.infoVisita.tipoMotivoAnalitico = _visita.data.nomeTipoMotivoVisitaAnalitico
                        this.infoVisita.resumo = _visita.data.relatorioVisita;
                        this.infoVisita.peso = _visita.data.peso
                        this.infoVisita.altura = _visita.data.altura
                        this.infoVisita.tipoAcao = _visita.data.nomeAcaoVisita
                        this.infoVisita.desfecho = _visita.data.nomeDesfechoVisita
                        
                        if (_visita.data.dataSolucao != '0001-01-01') {
                            this.infoVisita.dataSolucao = stringDataSql2Br(_visita.data.dataSolucao);
                            this.infoVisita.tipoSolucao.id = _visita.data.tipoSolucaoVisitaId
                            this.infoVisita.tipoSolucao.nome = _visita.data.nomeTipoSolucaoVisita
                            this.infoVisita.resumoSolucao = _visita.data.relatorioSolucao;
                        } else {
                            this.infoVisita.tipoSolucao.id = 0
                            this.infoVisita.tipoSolucao.nome = ''
                            this.infoVisita.resumoSolucao = ''
                        }

                        this.infoCidadao.id = _visita.data.pacienteId
                        this.infoCidadao.nome = _visita.data.nomePaciente
                        this.infoCidadao.nomeLogradouro = _visita.data.nomeLogradouro
                        this.infoCidadao.numeroEndereco = _visita.data.numeroEndereco
                        this.infoCidadao.complementoEndereco = _visita.data.complementoEndereco
                        this.infoCidadao.nomeMicroArea = _visita.data.nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = _visita.data.nomeEstadoSaude
                    }
                    else {
                        erroBusca = true
                        this.mensagemErro=_visita.message  
                    }
                })
                .catch((response) => {
                     this.mensagemAguarde = ''
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                
                this.mensagemAguarde = 'Buscando comorbidades do cidadão. Aguarde...'
                await mainService.listaPacienteComorbidades(this.infoCidadao.id)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoCidadao.comorbidades = resp.status == 200 ? resp.data : []
                })
                .catch((response) => {
                    this.mensagemAguarde = ''
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                
                this.mensagemAguarde = 'Buscando sintomas do cidadão. Aguarde...'
                await mainService.listaPacienteSintomas(this.infoCidadao.id)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoCidadao.sintomas = resp.status == 200 ? resp.data : []
                })
                .catch((response) => {
                    this.mensagemAguarde = ''
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                
                this.mensagemAguarde = 'Buscando tipos de solução. Aguarde...'
                await mainService.listaTipoSolucaoVisita(this.cidadePadrao.id)
                .then((resp) => {
                    this.tiposSolucaoVisita = resp.status == 200 ? resp.data : []
                    this.mensagemAguarde = ''
                })
                .catch((response) => {
                    this.mensagemAguarde = ''
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                this.painel = (this.statusAtualVisita == this.enumStatusVisita.naoBaixada || this.statusAtualVisita == this.enumStatusVisita.baixada) ? 4 : 3 
            },
            fim (volta) {
                this.$emit('cbFimEncerraVisita', volta)
            },
            async setaTipoSolucao(value) {
                this.infoVisita.tipoSolucao.id = value.id;
                this.infoVisita.tipoSolucao.nome = value.nome;
            },
            async salvaVisita() {
                this.mensagemAguarde = 'Salvando a baixa da visita. Aguarde...'

                const strData = this.infoVisita.dataSolucao.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1')  // eslint-disable-line
                const params = {
                    id: this.visitaId,
                    dataSolucao: strData,
                    tipoSolucaoVisitaId: this.infoVisita.tipoSolucao.id,
                    relatorioSolucao: this.infoVisita.resumoSolucao,
                }
                await mainService.salvaVisitaBaixa(this.visitaId, params)
                .then(resp => {
                    if (resp.status != 200) {
                        this.mensagemErro = resp.message
                    } else {
                        this.mensagemAguarde = ''
                        this.fim(false)
                    }
                })
                .catch(err => {this.mensagemErro = mainService.catchPadrao(err); return;});
                this.mensagemAguarde = ''
            },
        }
    }
</script>
<style scoped>
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .v-btn {
      color: lightslategray;
  }
</style>
