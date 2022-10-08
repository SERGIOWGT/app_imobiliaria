<template>
    <v-container fluid style="height: 100vmax;" class="pa-2">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE INQUILINO" @cbAnterior="$router.back()" :iconBotao="(somenteConsulta) ? '' : 'mdi-account-plus-outline'" @cbBotao="novo()"/>
        <v-card flat class="pt-0 mt-1 px-2" tile >
             <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn :disabled="somenteConsulta" icon color="primary" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                            <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>
            <v-card-title class="px-0">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                />
            </v-card-title>

            <v-data-table
                hide-default-header
                hide-no-data
                :headers="headers"
                :items="resultadoPesquisa"
                :search="search"
            > 
            <template
                v-slot:body="{ items }"
            >
                <v-flex v-for="(item) in items" :key="item.id">
                    <v-list-item class="px-1">
                        <v-list-item-content>
                             <v-row>
                                <v-col cols="10">
                                    <v-list-item-title v-html="item.nome || ''"></v-list-item-title>
                                </v-col>
                             </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
            </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>
<script>
    import TituloPagina from '../components/TituloPagina'
    import {strDateTime2StrDateBr} from '../bibliotecas/formataValores'
   
    export default {
        props: {
            mostra: Boolean, somenteConsulta: Boolean
        },
        components: {TituloPagina},
        data() {
            return {

            search: '',
            headers: [{sortable: false, value: 'nome'}],
                            // Novas
                statusPainel: 1, //0-fechados; 

                mensagemAguarde: '',
                mensagemErro: '',
                mensagemSucesso: '',

                resultadoPesquisa: [],

                // funcoes
                pesquisaPronta: false,
                isLoadingGrid: false,
                inquilinoIdSelecionado: 0,

                inquilinoId: 0
                }
        },
        mounted() {
            this.statusPainel = 1
            this.resultadoPesquisa = this.$store.getters.Inquilinos;
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
                return (_numeroRegistros == 0) ? 'Não há inquilinos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um inquilino retornado na pesquisa  ` : ` ${_numeroRegistros} inquilinos retornados`
            },
        },
        methods: {
            abrePanelNome(v) {
                if (v) {
                    this.statusPainel = 1
                }
            },
            cbBusca (id) {
                this.inquilinoId = id;
                const _inquilino = this.$store.getters.InquilinoById(id);
                this.resultadoPesquisa = [];
                this.resultadoPesquisa.push(_inquilino);
                this.pesquisaPronta = true
                this.fechaPainel()
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            novo() {
                this.$emit('cbNovo')
            },
            edita(id) {
                console.log('this.infoInquilino.id', id)
                this.$emit('cbEdita', id)
            },
            refresh() {
                this.cbBusca(this.inquilinoId)
            },
            linha(tipo, value){
                if (tipo == 2) {
                    return `<b>Mãe:</b><span class="nota_botao">&nbsp;${value}</span></span> `
                } else if (tipo == 3) {
                    const _dataNascimento = strDateTime2StrDateBr(value, 'yyyy-mm-dd', '-')
                    return `<span class="nota_botao">&nbsp;Nascido em ${_dataNascimento}</span></span> `
                }
                else if (tipo == 4) {
                    const _cpf = this.isEmpty(value) ? '' : value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // eslint-disable-line
                    return `<b>Sob CPF</b><span class="nota_botao">&nbsp;${_cpf}</span> `
                }
                else if (tipo == 5) {
                    const _cpf = this.isEmpty(value) ? '' : value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') // eslint-disable-line
                    return `<b>Celulares:</b><span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
            fechaPainel () {
                this.statusPainel = 0
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