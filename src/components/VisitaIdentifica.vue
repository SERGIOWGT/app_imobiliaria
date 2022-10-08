<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE VISITA" @cbAnterior="$router.back()"/>
        
        <v-flex v-show="buscandoDados==false">
            <PesquisaPorNome  :aberto="statusPainel==1" :cidadeId="cidadePadrao.id" :habilitaPesquisa="!isLoadingGrid" tituloData="" 
                              @cbAbriu="cbAbrePainelNome"  @cbBusca="cbBuscaPorPacienteId" 
            />
            
            <PesquisaPorLocalidadeSintomas  :aberto="statusPainel==2" :habilitaPesquisa="!isLoadingGrid"  
                                            :habilitaBairro="true" :habilitaNomeRua="true" :habilitaNumeroResidencia= "true" :habilitaComplementoEndereco= "true"
                                            :habilitaCorteVisita="true" tituloData="" 
                                            @cbAbriu="abrePanelOutros" @cbBusca="cbBuscaPorOutros" @cbFimBuscaDados="cbFimBuscaDados"  @cbMensagemAguarde="cbMensagemAguarde" @cbMensagemErro="cbMensagemErro"/>

            <v-card flat class="pt-0 mt-0" tile v-if="gridPronto" >
                <v-list three-line>
                    <v-subheader class="justify-center px-0">
                        <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                        <v-col cols="3" ><v-row justify="end"><v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn></v-row></v-col> 
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group color="primary" >
                        <v-flex v-for="(item) in infoPesquisa.lista" :key="item.id">
                            <v-list-item class="px-1">
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-content>
                                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                                            <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-html="item.nomeMicroArea"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-container class="fill-height" fluid>
                                            <v-row justify="center" align="center">
                                                <v-btn icon color="primary" @click="incluiVisita(item.id)"><v-icon>mdi-thermometer-plus</v-icon></v-btn>
                                            </v-row>
                                            <v-row justify="center" align="center">
                                                <v-btn icon color="primary" @click="editaCidadao(item.id)"><v-icon>mdi-account-arrow-right-outline</v-icon></v-btn>
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

    export default {
        components: {
            PesquisaPorNome, PesquisaPorLocalidadeSintomas, TituloPagina
        },
        data() {
          return {
            statusPainel: 1, //0-fechados; 


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
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: [],
                lista: [],
                sintomas: [],
                comorbidades: [],
                doencas: [],
                dataInicioVisita: '',
                dataFimVisita: '',
                ordenacao: 0
            },
                        
            
            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
        },
        watch: {
            model (val) {
                if (val.length > 5) {
                    this.$nextTick(() => this.model.pop())
                }
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
            }
        },
        computed: {
            tituloLista: function() {
                const _numeroRegistros = this.infoPesquisa.lista.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
            },
        },       
        methods: {
            cbFimBuscaDados() {
                this.buscandoDados = false
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
            abrePanelOutros(v) {
                if (v) {
                    this.statusPainel = 2
                }
            },
            cbBuscaPorPacienteId (param) {
                this.infoPesquisa.pacienteId = param.pacienteId
                this.infoPesquisa.ordenacao = 0
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
                this.infoPesquisa.dataInicioVisita = null
                this.infoPesquisa.dataFimVisita = v.dataMaiorVisita
                this.infoPesquisa.ordenacao = v.ordenacao

                this.listaPesquisa(this.enumTipoPesquisa.porLocalidade)
            },
            editaCidadao(pacienteId) {
                this.$emit('cbEditaCidadao', pacienteId)
            },
            enderecoCidadaoConcatena (nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            fechaPainel () {
                this.statusPainel = 0
            },
            async incluiVisita(pacienteId) {
                this.$emit('cbNovaVisita', pacienteId)
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            refresh() {
                if ((this.infoPesquisa.pacienteId == 0) || (this.infoPesquisa.pacienteId == null))
                    this.listaPesquisa(this.enumTipoPesquisa.porLocalidade)
                else 
                    this.listaPesquisa(this.enumTipoPesquisa.porNome)
            },

            async listaPesquisa(tipoPesquisa) {
                let _param = {cidadeId: this.cidadePadrao.id}

                if (tipoPesquisa == this.enumTipoPesquisa.porNome) {
                    _param.id= this.infoPesquisa.pacienteId
                    _param.ordenacao = 0
                } else {
                    _param.unidadeSaudeId= this.infoPesquisa.unidadeSaudeId
                    _param.microAreaId= this.infoPesquisa.microAreaId
                    _param.bairroId= this.infoPesquisa.bairroId
                    _param.logradouroId= this.infoPesquisa.logradouroId
                    _param.numeroEndereco= this.infoPesquisa.numeroEndereco
                    _param.complementoEndereco= this.infoPesquisa.complementoEndereco
                    _param.dataInicioVisita= this.infoPesquisa.dataInicioVisita
                    _param.dataFimVisita= this.infoPesquisa.dataFimVisita
                    _param.ordenacao = this.infoPesquisa.ordenacao

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
                this.mensagemAguarde = 'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPacientesCompleta(_param)
                .then(_resposta => {
                    this.mensagemAguarde = ''
                    if (_resposta.status == 200) {
                        this.infoPesquisa.lista = _resposta.data
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