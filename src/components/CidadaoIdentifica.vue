<template>
    <v-container fluid style="height: 100vmax;" class="pa-2">
        <!-- <v-subheader class="justify-center px-0">
            <v-col cols="1" ><v-row justify="start"><v-btn icon color="teal lighten-2" @click="$router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn></v-row></v-col>
            <v-col class="px-1 teal--text" cols="10"><v-row justify="center"><h4 class="teal--text ">CONSULTA PARA CADASTRO DE CIDADÃO</h4></v-row></v-col>                    
            <v-col cols="1"><v-row justify="end"><v-btn icon color="teal lighten-2" @click="novo()"><v-icon disabled="somenteConsulta">mdi-account-plus-outline</v-icon></v-btn></v-row></v-col> 
        </v-subheader> -->
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE CIDADÃO" @cbAnterior="$router.back()" :iconBotao="(somenteConsulta) ? '' : 'mdi-account-plus-outline'" @cbBotao="novo()"/>
        <PesquisaPorNome  :aberto="statusPainel==1" :cidadeId="cidadePadrao.id" :habilitaPesquisa="!isLoadingGrid" tituloData="" 
                          @cbAbriu="abrePanelNome" @cbBusca="cbBuscaPorPaciente"/>

        <PesquisaPorOutros  :aberto="statusPainel==2" :habilitaPesquisa="!isLoadingGrid"  
                          @cbAbriu="abrePanelOutros" @cbBusca="cbBuscaPorOutros"/>

        <v-card flat class="pt-0 mt-1" tile v-if="pesquisaPronta" >
            <v-list three-line>
                <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn :disabled="somenteConsulta" icon color="primary" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                            <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="pacienteIdSelecionado" color="primary" >
                    <v-flex v-for="(item) in resultadoPesquisa" :key="item.id">
                    <v-list-item class="px-1">
                        <v-list-item-content>
                             <v-row>
                                <v-col cols="10">
                                    <v-list-item-title v-html="item.nome || ''"></v-list-item-title>
                                    <v-list-item-subtitle v-html="item.nomeMae || ''"></v-list-item-subtitle>
                                    <v-list-item-subtitle v-html="linha(2, item.dataNascimento || '')"></v-list-item-subtitle>
                                    <v-list-item-subtitle v-html="linha(3, item.cartaoSUS || '')"></v-list-item-subtitle>
                                    <v-list-item-subtitle v-html="linha(4, item.cpf || '')"></v-list-item-subtitle>
                                    <v-list-item-subtitle v-html="item.nomeEstadoSaude || '' "></v-list-item-subtitle>
                                </v-col>
                                 <v-col cols="2" >
                                    <v-container class="fill-height" fluid>
                                        <v-row justify="center" align="center">
                                            <v-btn icon color="primary" @click="edita(item.id)"><v-icon>mdi-account-arrow-right-outline</v-icon></v-btn>
                                        </v-row>
                                    </v-container>
                                </v-col>
                             </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import PesquisaPorNome from '../components/PesquisaCidadaoPorNome'
    import PesquisaPorOutros from '../components/PesquisaCidadaoPorDadosCadastrais'
    import TituloPagina from '../components/TituloPagina'

  export default {
    props: {
      mostra: Boolean, somenteConsulta: Boolean
    },
    components: {PesquisaPorNome, PesquisaPorOutros, TituloPagina},
    data() {
          return {

            // Novas
            statusPainel: 1, //0-fechados; 

            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            resultadoPesquisa: [],

            cidadePadrao: null,

            // funcoes
            pesquisaPronta: false,
            isLoadingGrid: false,
            pacienteIdSelecionado: 0,

            infoPaciente: {
                id: 0,
                cpf: '',
                dataNascimento: '',
                cartaoSUS: ''
            },
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
            this.statusPainel = 1
        },
        mounted() {
            this.statusPainel = 1
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
                const _numeroRegistros = this.resultadoPesquisa.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
            },
        },
        methods: {
            abrePanelNome(v) {
                if (v) {
                    this.statusPainel = 1
                }
            },
            abrePanelOutros(v) {
                if (v) {
                    this.statusPainel = 2
                }
            },
            cbBuscaPorPaciente (param) {
                this.infoPaciente.id = param.pacienteId
                this.listaById(this.infoPaciente.id)
            },
            cbBuscaPorOutros(v) {
                this.infoPaciente.dataNascimento = v.dataNascimento
                this.infoPaciente.cpf = v.cpf
                this.infoPaciente.cartaoSUS = v.cartaoSUS

                 this.listaByParams()
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            novo() {
                this.$emit('cbNovoCidadao')
            },
            edita(id) {
                this.infoPaciente.id = id
                this.$emit('cbEditaCidadao', id)
            },
            refresh() {
                if ((this.infoPaciente.id == 0) || (this.infoPaciente.id == null))
                    this.listaByParams()
                else 
                    this.listaById(this.infoPaciente.id)
            },
            linha(tipo, value){
                if (tipo == 2) {
                    const _dataNascimento = this.isEmpty(value) ? '' : value.replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$3-$2-$1') // eslint-disable-line
                    return `<b>Nascimento:</b><span class="nota_botao">&nbsp;${_dataNascimento}</span></span> `
                } else if (tipo == 3) {
                    const _cartaoSUS = this.isEmpty(value) ? '' : value.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4') // eslint-disable-line 
                    return `<b>Cartão SUS:</b><span class="nota_botao">&nbsp;${_cartaoSUS}</span>`
                } else if (tipo == 4) {
                    const _cpf = this.isEmpty(value) ? '' : value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // eslint-disable-line
                    return `<b>CPF:</b><span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
            fechaPainel () {
                this.statusPainel = 0
            },
            async listaById(pacienteId) {
                this.isLoadingGrid = true
                this.mensagemAguarde =  'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPaciente(pacienteId)
                .then((resp) => {
                    this.isLoadingGrid = false
                    this.mensagemAguarde =  ''
                    if (resp.status == 200) {
                        this.resultadoPesquisa = []
                        this.resultadoPesquisa.push(resp.data)
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro =  resp.message
                    }
                })
                .catch((resp) => {
                    this.mensagemAguarde =  ''
                    this.isLoadingGrid = false 
                    this.mensagemErro =  mainService.catchPadrao(resp)
                })
            },
            async listaByParams() {
                let param = {}
                param.cidadeId = this.cidadePadrao.id
                param.cartaoSUS = (this.infoPaciente.cartaoSUS == null) ? '' : this.infoPaciente.cartaoSUS.replace(/\s/g, '')
                param.cpf = (this.infoPaciente.cpf == null) ? '' : this.infoPaciente.cpf.replace(/\.|\-/g, '') // eslint-disable-line
                param.dataNascimento = (this.infoPaciente.dataNascimento == null) ? '' : this.infoPaciente.dataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1') // eslint-disable-line

                this.isLoadingGrid = true
                this.mensagemAguarde =  'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPacientesCompleta(param)
                .then((resp) => {
                    this.isLoadingGrid = false
                    this.mensagemAguarde = ''
                    if (resp.status == 200) {
                        this.resultadoPesquisa = resp.data
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro =  resp.message
                    }
                })
                .catch((resp) => {
                    this.mensagemAguarde =  ''
                    this.isLoadingGrid = false; 
                    this.mensagemErro =  mainService.catchPadrao(resp)
                })
            },
        }
    }
</script>
<style scoped lang="scss">
    .paragrafo1 {
        padding: 0px;
        margin: 0px;
    }
</style>