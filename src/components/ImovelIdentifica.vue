<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="RELAÇÂO DE IMÓVEIS" @cbAnterior="$router.back()" iconBotao=""/>
         <v-card flat class="pt-0 mt-1" tile>
            <v-data-table
                hide-default-footer
                hide-default-header

                :headers="headers"
                :items="resultadoTela"
                item-key="nome"
                class="elevation-0"
                :search="search"
                
                :page.sync="paginaAtual"
                :items-per-page="itensPorPagina"
                @page-count="totalPaginas = $event"
            >
                <template v-slot:top> 
                    <v-row class="ma-1 my-3">
                        <v-col class="px-1" cols="9">{{tituloLista}}</v-col>                    
                                <v-col cols="3" >
                                    <v-row justify="end">
                                        <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                                    </v-row>
                                </v-col> 
                        </v-row>
                    <v-divider></v-divider>
                    <v-text-field
                        append-icon="mdi-magnify"
                        v-model="search"
                        label="Pesquisa por Imóvel e Proprietário"
                        class="mx-4"
                    ></v-text-field>
                    <v-row class="d-flex justify-center pt-2 pb-5">
                        <v-chip-group column v-model="filtro">
                            <v-chip filter outlined>Todos</v-chip>
                            <v-chip filter outlined>Alugados</v-chip>
                            <v-chip filter outlined>Livres</v-chip>
                        </v-chip-group>
                    </v-row>
                    <v-divider></v-divider>
                   </template>
                <template v-slot:body="{ items }">
                    <v-list-item-group>
                        <v-flex v-for="(item) in items" :key="item.id">
                            <v-list-item class="px-1 py-0">
                                <v-list-item-content>
                                    <v-row>
                                        <v-col>
                                            <v-list-item-title class="pa-1" v-html="item.apelido || ''"></v-list-item-title>
                                            <v-list-item-title class="pa-1" v-html="item.nomeProprietario || ''"></v-list-item-title> 
                                            <v-list-item-subtitle class="pa-1" v-html="linhaAlugado(item.alugado || '', item.nomeTipoImovel || '')"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-if="item.alugado == true" class="px-1 pt-5">
                                                <v-row>
                                                    <v-col cols="4">Ultimo Aumento</v-col>
                                                    <v-col cols="4">Último Contrato</v-col>
                                                    <v-col cols="4">Último Aluguel </v-col>
                                                </v-row>
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle v-if="item.alugado == true" class="pa-1">
                                                <v-divider></v-divider>
                                                <v-row class="pt-1">
                                                    <v-col cols="4">{{formataData(item.dataUltimoAumento || '')}} </v-col>
                                                    <v-col cols="4">{{formataData(item.dataUltimoContrato || '')}} </v-col>
                                                    <v-col cols="4">{{formataData(item.dataUltimoAluguel || '')}} </v-col>
                                                </v-row>

                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-flex>
                    </v-list-item-group>
                </template>
            </v-data-table> 
            <v-pagination class="mt-5" v-show="totalPaginas > 1" v-model="paginaAtual" :length="totalPaginas" total-visible="6"></v-pagination>
        </v-card>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import TituloPagina from '../components/TituloPagina'
    import {strDateTime2StrDateBr} from '../bibliotecas/formataValores'
   
    export default {
        props: {
            mostra: Boolean, 
            somenteConsulta: Boolean,
            executaRefresh: Boolean
        },
        components: {TituloPagina},
        data() {
            return {
                search: '',
                headers: [
                    {
                        align: 'start',
                        sortable: false,
                        value: 'apelido',
                    },
                    
                    {
                        sortable: false,
                        value: 'nomeProprietario',
                    }
                ],

                enumFiltro: {
                    todos: 0,
                    alugado: 1,
                    livre: 2
                },

                filtro: 0,
                paginaAtual: 1,
                totalPaginas: 0,
                itensPorPagina: process.env.VUE_APP_PAGE_LENGHT,
                
                resultado: [],
                resultadoTela: [],

                mensagemAguarde: '',
                mensagemErro: '',
                mensagemSucesso: '',
            }
        },
        created() {
            const _tamanhoPagina = parseInt(process.env.VUE_APP_PAGE_LENGHT);
            this.itensPorPagina = isNaN(_tamanhoPagina) ? 10 : _tamanhoPagina;
        },
        mounted() {
            this.refresh();
        },
        watch: {
            executaRefresh: function(newVal) {
                if (newVal == true)
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
            filtro(val) {
                console.log(val)
                if (typeof(val) == 'undefined')
                    this.filtro = 0;

                this.filtra();
            }
        },
        computed: {
            tituloLista: function() {
                const _totalRegistros = this.resultadoTela.length

                return (_totalRegistros == 0) ? 'Nenhum imóvel retornado' : (_totalRegistros == 1) ? ` Um imóvel retornado` : ` ${_totalRegistros} imóveis`
            },
        },
        methods: {
            formataData(data) {
                if (!data) {
                    return ''
                }
				return strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
            },
            filtra() {
                if (this.filtro == this.enumFiltro.todos) {
                    this.resultadoTela = this.resultado;
                    return;
                }
                const _alugado = (this.filtro == this.enumFiltro.alugado);
                this.resultadoTela = this.resultado.filter((p) => p.alugado === _alugado);
            },
            async refresh() {
                let _retorno = '';

                this.mensagemAguarde =  'Consultando imóveis! Aguarde...'
                const resp=  await mainService.listaImoveisCompleta()
                .catch((resp) => {
                    _retorno = mainService.catchPadrao(resp)
                })

                this.mensagemAguarde =  '';
                this.mensagemErro =  '';
                if (_retorno) {
                    this.mensagemErro = _retorno;
                    return;
                }
                this.resultado = resp.data

                this.filtra();
            },
            linhaAlugado(alugado, tipoImovel){
                const _linha = (tipoImovel ? tipoImovel + ' - ' : '') + (alugado ? 'Alugado' : 'Vago') 
                const _retorno = '<span class="' + ((alugado) ? '">' : 'red--text">') + _linha + '</span>'
                return _retorno
            },
            linhaInfoAluguel(data, valor){
                if ((!data) || (!valor))
                    return '';

                let _retorno = 'Ultimo Aluguel: ' + strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-');
                _retorno += ' - ' + valor.toString();

                return `<span class="nota_botao">${_retorno}</span></span> `

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