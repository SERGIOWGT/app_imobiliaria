<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA VISITAS DO CIDADÃO" @cbAnterior="$router.back()"/>
        
        <v-flex>
            <PesquisaPorNome  :aberto="statusPainel==1" :cidadeId="cidadePadrao.id" :habilitaPesquisa="!isLoadingGrid"  tituloData="Período de visitação" 
                              @cbAbriu="cbAbrePainelNome"  @cbBusca="cbBuscaPorPaciente"
            />
            
            <v-card flat class="pt-0 mt-0" tile v-if="gridPronto">
                    <v-list subheaderthree-line>
                        <v-subheader class="justify-center px-0">
                            <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                            <v-col cols="3" >
                                <v-row justify="end">
                                    <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                                </v-row>
                            </v-col> 
                        </v-subheader>

                        <v-divider></v-divider>
                        <v-list-item-group class="px-1">
                            <v-flex v-for="(item) in resultado" :key="item.id">
                                <v-list-item class="px-1 py-1">
                                    <v-row>
                                        <v-col cols="10">
                                            <v-list-item-title>{{cabecalho(item.dataVisita)}}</v-list-item-title>
                                            <v-list-item-subtitle class="font-weight-bold">{{item.nomeTipoMotivoVisita}} - {{item.nomeTipoMotivoVisitaAnalitico}}</v-list-item-subtitle>
                                            <v-list-item-subtitle class="font-weight-medium">Ação: {{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>{{item.nomeDesfechoVisita}}</v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="1">
                                            <v-container class="red fill-height" fluid>
                                                <v-btn icon color="primary" @click="visualizaVisita(item.id)"><v-icon>mdi-account-cog-outline</v-icon></v-btn>
                                            </v-container>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                                <v-divider></v-divider>
                            </v-flex>
                        </v-list-item-group>
                    </v-list>
                </v-card>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import PesquisaPorNome from '../components/PesquisaCidadaoPorNome'
    import TituloPagina from '../components/TituloPagina'
    import { stringDataSql2Br, stringDataBr2Sql } from '../bibliotecas/formataValores'

    export default {
        components: {PesquisaPorNome, TituloPagina},
        data() {
          return {
            statusPainel: 1, //0-fechados; 

            isLoadingGrid: false,
            gridPronto: false,

            cidadePadrao: null,

            infosPesquisa: {
                pacienteId: 0,
                dataInicioVisita: '',
                dataFimVisita: ''
            },
            
            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            resultado: []
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
        },
        watch: {
            mensagemAguarde (val) {
                this.$emit('cbMensagemAguarde', val)
                this.isLoading = (val == '') ? false : true
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            }
        },
        computed: {
            tituloLista: function() {
                const _numeroRegistros = this.resultado.length
                return (_numeroRegistros == 0) ? 'Não há visitas para esse cidadão' : (_numeroRegistros == 1) ? ` Uma visita retornada na pesquisa  ` : ` ${_numeroRegistros} visitas retornadas`
            },
        },       
        methods: {
            cabecalho(data) {
                return stringDataSql2Br(data);
            },
            cbMensagemAguarde(v) {
                this.mensagemAguarde = v
            },
            cbMensagemErro(v) {
                this.mensagemErro = v
            },
            cbAbrePainelNome(v) {
                if (v) {
                    this.statusPainel = 1
                }
            },
            cbBuscaPorPaciente (param) {
                this.infosPesquisa.pacienteId = param.pacienteId;
                this.infosPesquisa.dataInicioVisita = stringDataBr2Sql(param.dataInicio);
                this.infosPesquisa.dataFimVisita = stringDataBr2Sql(param.dataFim);
                this.nomePaciente = ''

                this.listaVisitas();
            },
            visualizaVisita(id) {
                this.$emit('cbEscolheuVisita', id, this.pacienteId)
            },
            async refresh() {
                await this.listaVisitas();
            },
            fechaPainel () {
                this.statusPainel = 0
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            async listaVisitas () {
                this.gridPronto = false
                this.mensagemAguarde = 'Consultando visitas do cidadão! Aguarde...'

                const param = {pacienteId: this.infosPesquisa.pacienteId, dataVisitaInicio: this.infosPesquisa.dataInicioVisita, dataVisitaFim: this.infosPesquisa.dataFimVisita}
                await mainService.listaPacienteVisitas(param)
                .then(_resposta => {
                    this.mensagemAguarde = ''
                    if (_resposta.status == 200) {
                        this.resultado = _resposta.data
                        this.gridPronto = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro = _resposta.message
                    }
                })
                .catch((response) => {
                    this.mensagemAguarde = '';
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
            },
        }
    }
</script>