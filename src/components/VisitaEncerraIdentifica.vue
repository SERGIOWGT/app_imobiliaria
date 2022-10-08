<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA VISITAS" @cbAnterior="$router.back()"/>
        
        <v-flex v-show="buscandoDados==false">
            <PesquisaPorNome  :aberto="statusPainel==1" :cidadeId="cidadePadrao.id" :habilitaPesquisa="!isLoadingGrid"  tituloData="Período de visitação" 
                              @cbAbriu="cbAbrePainelNome"  @cbBusca="cbBuscaPorPaciente"
            />
            <PesquisaPorLocalidadeSintomas  :aberto="statusPainel==2" :habilitaPesquisa="!isLoadingGrid"  
                                            :habilitaBairro="false" :habilitaNomeRua="false" :habilitaNumeroResidencia= "false" :habilitaComplementoEndereco= "false"
                                            :habilitaCorteVisita="false" tituloData="Período de visitação" 
                                            @cbAbriu="abrePanelOutros" @cbBusca="cbBuscaPorOutros" @cbFimBuscaDados="cbFimBuscaDados"  @cbMensagemAguarde="cbMensagemAguarde" @cbMensagemErro="cbMensagemErro"/>

            <v-card flat class="pt-0 mt-0" tile v-if="gridPronto">
                <v-list subheaderthree-line>
                    <v-chip-group v-model="filtro" column>
                        <v-chip filter outlined>Todas</v-chip>
                        <v-chip filter outlined>Não Baixadas</v-chip>
                        <v-chip filter outlined>Não Realizadas</v-chip>
                    </v-chip-group>
                    <v-divider></v-divider>
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
                            <v-list-item class="text-wrap  px-1 py-1">
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-title>{{_stringDataSql2Br(item.dataVisita)}}</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap font-weight-bold">{{linhaMotivo(item.tipoMotivoVisitaId, item.nomeTipoMotivoVisita, item.nomeTipoMotivoVisitaAnalitico)}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-html="item.nomePaciente"></v-list-item-subtitle>
                                        <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                        <v-flex v-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.baixada">
                                            <v-list-item-subtitle class="font-weight-medium">Ação: {{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                            <v-list-item-subtitle class="font-weight-medium">Baixada em: {{_stringDataSql2Br(item.dataSolucao)}}</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.naoBaixada">
                                            <v-list-item-subtitle class="yellow--text font-weight-medium">Ação: {{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.semPendencia">
                                            <v-list-item-subtitle>Ação: {{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.recusada">
                                            <v-list-item-subtitle class="red--text">Visita não realizada</v-list-item-subtitle>
                                        </v-flex>
                                        <v-flex v-else>
                                            <v-list-item-subtitle class="red--text">Cidadão estava ausente</v-list-item-subtitle>
                                        </v-flex>
                                    </v-col>
                                    <v-col cols="2" >
                                        <v-container class="fill-height" fluid>
                                            <v-row justify="center" align="center">
                                                <div  v-if="somenteConsulta">
                                                    <v-btn icon color="primary" @click="consultaVisita(item.id)"><v-icon>mdi-magnify-plus-outline</v-icon></v-btn>
                                                </div>
                                                <div  v-else-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.baixada">
                                                    <v-btn icon color="primary" @click="encerraVisita(item.id)"><v-icon>mdi-update</v-icon></v-btn>
                                                </div>
                                                <div v-else-if="lStatusVisita(item.tipoDesfechoVisitaId, item.requerSolucao, item.dataSolucao) == enumStatusVisita.naoBaixada">
                                                    <v-btn icon color="primary" @click="encerraVisita(item.id)"><v-icon>mdi-update</v-icon></v-btn>
                                                </div>
                                                <div v-else>
                                                    <v-btn icon color="primary" @click="consultaVisita(item.id)"><v-icon>mdi-magnify-plus-outline</v-icon></v-btn>
                                                </div>
                                            </v-row>
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
    import PesquisaPorLocalidadeSintomas from '../components/PesquisaCidadaoPorLocalidadeSintomas'
    import { stringDataSql2Br, stringDataBr2Sql } from '../bibliotecas/formataValores'
    import { statusVisita } from '../rotinasProjeto/rotinasProjeto'

export default {
        components: {
            PesquisaPorNome, PesquisaPorLocalidadeSintomas, TituloPagina
        },
        props: {
          somenteConsulta: Boolean
        },
        data() {
          return {
            lStatusVisita: statusVisita,
            
            enumStatusVisita: {
                recusada: 0,
                pacienteAusente: 1,
                semPendencia: 2,
                naoBaixada: 3,
                baixada: 4
            },

            statusPainel: 1, //0-fechados; 

            filtro: 0,

            enumTipoPesquisa: {
              porNome: 0,
              porLocalidade: 1,
            },

            buscandoDados: true,
            gridPronto: false,

            isLoading: false,
            isLoadingGrid: false,

            cidadePadrao: null,
            
            infoPesquisa: {
                tipo: -1,
                pacienteId: 0,
                bairroId: 0,
                logradouroId: 0,
                unidadeSaudeId: 0,
                microAreaId: 0,
                logradouros: [],
                unidadesSaude: [],
                microAreas: [],
                sintomas: [],
                comorbidades: [],
                doencas: [],
                dataInicioVisita: '',
                dataFimVisita: '',
            },

            resultado: [],                       
            
            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
        },
        watch: {
            filtro() {
                this.refresh();
            },
            mensagemAguarde (val) {
                this.$emit('cbMensagemAguarde', val)
                this.isLoading = (val == '') ? false : true
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            },
        },
        computed: {
            tituloLista: function() {
                const _numeroRegistros = this.resultado.length
                return (_numeroRegistros == 0) ? 'Não há visitas para essa pesquisa' : (_numeroRegistros == 1) ? ` Uma visita retornada na pesquisa  ` : ` ${_numeroRegistros} visitas retornadas`
            },
        },       
        methods: {
            _stringDataSql2Br(v) {
                return stringDataSql2Br(v)
            },
            cbAbrePainelNome(v) {
                if (v) {
                    this.statusPainel = 1
                }
            },
            cbFimBuscaDados() {
                this.buscandoDados = false
            },
            cbMensagemAguarde(v) {
                this.mensagemAguarde = v
            },
            cbMensagemErro(v) {
                this.mensagemErro = v
            },
            cbBuscaPorPaciente (param) {
                this.infoPesquisa.pacienteId = param.pacienteId;
                this.infoPesquisa.dataInicioVisita = stringDataBr2Sql(param.dataInicio);
                this.infoPesquisa.dataFimVisita = stringDataBr2Sql(param.dataFim);

                this.listaPesquisa(this.enumTipoPesquisa.porNome)
            },
            cbBuscaPorOutros (v) {
                
                this.infoPesquisa.unidadeSaudeId = v.unidadeSaudeId
                this.infoPesquisa.microAreaId = v.microAreaId
                this.infoPesquisa.bairroId = v.bairroId
                this.infoPesquisa.logradouroId = v.logradouroId
                this.infoPesquisa.numeroEndereco = v.numeroEndereco
                this.infoPesquisa.complementoEndereco = v.complementoEndereco
                this.infoPesquisa.sintomas = v.sintomas
                this.infoPesquisa.comorbidades = v.comorbidades
                this.infoPesquisa.doencas = v.doencas
                this.infoPesquisa.dataInicioVisita = stringDataBr2Sql(v.dataInicioVisita);
                this.infoPesquisa.dataFimVisita = stringDataBr2Sql(v.dataFimVisita);

                this.listaPesquisa(this.enumTipoPesquisa.porLocalidade)
            },
            abrePanelOutros(v) {
                if (v) {
                    this.statusPainel = 2
                }
            },
            linhaMotivo (motivoId, nomeMotivo, motivoDetalhe) {
                switch (motivoId) {
                    case 1:
                    case 2: 
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return motivoDetalhe;
                    case 4:
                        return 'ACOMP. - ' + motivoDetalhe
                    default:
                        return nomeMotivo + ' - ' + motivoDetalhe
                }
            },
            enderecoCidadaoConcatena (nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            async consultaVisita(id) {
                this.$emit('cbEncerraVisita', id, false)
            },
            async encerraVisita(id) {
                this.$emit('cbEncerraVisita', id, true)
            },
            fechaPainel () {
                this.statusPainel = 0
            },
            async listaPesquisa(tipoPesquisa) {
                let _param = {
                    cidadeId: this.cidadePadrao.id,
                    visitaBaixada: '', 
                    visitaRealizada: ''
                }
                if (this.filtro == 1) {
                    _param.visitaBaixada = 'N'
                } else if (this.filtro == 2){
                    _param.visitaRealizada = 'N'
                }

                if (tipoPesquisa == this.enumTipoPesquisa.porNome) {
                    _param.pacienteId= this.infoPesquisa.pacienteId
                    _param.dataInicioVisita= this.infoPesquisa.dataInicioVisita
                    _param.dataFimVisita= this.infoPesquisa.dataFimVisita
                } else {
                    _param.unidadeSaudeId= this.infoPesquisa.unidadeSaudeId
                    _param.microAreaId= this.infoPesquisa.microAreaId
                    _param.bairroId= this.infoPesquisa.bairroId
                    _param.logradouroId= this.infoPesquisa.logradouroId
                    _param.numeroEndereco= this.infoPesquisa.numeroEndereco
                    _param.complementoEndereco= this.infoPesquisa.complementoEndereco
                    _param.dataInicioVisita= this.infoPesquisa.dataInicioVisita
                    _param.dataFimVisita= this.infoPesquisa.dataFimVisita

                    _param.sintomas = []
                    this.infoPesquisa.sintomas.forEach((linha) => {
                        _param.sintomas.push(linha.id)
                    })

                    _param.comorbidades = []
                    this.infoPesquisa.comorbidades.forEach((linha) => {
                        _param.comorbidades.push(linha.id)
                    })
                    _param.doencas = []
                    this.infoPesquisa.doencas.forEach((linha) => {
                        _param.doencas.push(linha.id)
                    })
                }
                this.isLoadingGrid = true
                this.mensagemAguarde = 'Consultando as Visitas! Aguarde...'
                await mainService.listaPacienteVisitas(_param)
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
                this.isLoadingGrid = false
            },
            refresh() {
                if ((this.infoPesquisa.pacienteId == 0) || (this.infoPesquisa.pacienteId == null))
                    this.listaPesquisa(this.enumTipoPesquisa.porLocalidade)
                else 
                    this.listaPesquisa(this.enumTipoPesquisa.porNome)
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