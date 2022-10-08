<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA DE VISITA" @cbAnterior="fimCadastro(true)" />
        <v-flex v-if="buscandoDados==false">
            <v-expansion-panels focused class="pt-0 mt-2" v-model="painel">
                <ExpansionVisitaCidadao :nome="infoCidadao.nome" :endereco="enderecoAtual" :nomeEstadoSaude="infoCidadao.nomeEstadoSaude" :nomeMicroArea="infoCidadao.nomeMicroArea"/>
                <br>
                <v-divider></v-divider>
                <ExpansionLista tipo="C" posTitulo="atuais" :lista="infoCidadao.comorbidades"  />
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
            </v-expansion-panels>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import TituloPagina from '../components/TituloPagina'
    import ExpansionVisitaCidadao from '../components/ExpansionVisitaCidadao.vue'
    import ExpansionLista from '../components/ExpansionListaCeS.vue'
    import {stringDataSql2Br} from '../bibliotecas/formataValores'

    export default {
        components: {
            ExpansionLista, TituloPagina, ExpansionVisitaCidadao
        },
        props: {
          visitaId: Number,
          pacienteId: Number,
        },
        data() {
          return {
            painel: 0,
            infoCidadao: {
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                comorbidades:[]
            },
            infoVisita:  {
                dataVisita: '',
                tipoMotivo: '',
                tipoMotivoAnalitico: '',
                peso: '',
                altura: '',
                tipoAcao: '',
                desfecho: '',
                resumo: ''
            },

            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            buscandoDados: true
          }
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
            async buscaDados(pacienteId, visitaId) {
                let erroBusca = false
                this.mensagemAguarde = 'Buscando informações da visita. Aguarde...'
                await mainService.listaPacienteVisita(visitaId)
                .then((_visita) => {
                    this.mensagemAguarde = ''        
                     if (_visita.status == 200) {
                        this.infoVisita.dataVisita = stringDataSql2Br(_visita.data.dataVisita);
                        this.infoVisita.tipoMotivo = _visita.data.nomeTipoMotivoVisita;
                        this.infoVisita.tipoMotivoAnalitico = _visita.data.nomeTipoMotivoVisitaAnalitico
                        this.infoVisita.resumo = _visita.data.relatorioVisita;
                        this.infoVisita.peso = _visita.data.peso
                        this.infoVisita.altura = _visita.data.altura
                        this.infoVisita.tipoAcao = _visita.data.nomeAcaoVisita
                        this.infoVisita.desfecho = _visita.data.nomeDesfechoVisita                        

                        this.infoCidadao.nome = _visita.data.nomePaciente
                        this.infoCidadao.nomeLogradouro = _visita.data.nomeLogradouro
                        this.infoCidadao.numeroEndereco = _visita.data.numeroEndereco
                        this.infoCidadao.complementoEndereco = _visita.data.complementoEndereco
                        this.infoCidadao.nomeMicroArea = _visita.data.nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = _visita.data.nomeTipoEstadoSaude
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
                await mainService.listaPacienteComorbidades(pacienteId)
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
                this.painel = 2
            },
            fimCadastro (volta) {
                this.$emit('cbFimCadastro', volta)
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
