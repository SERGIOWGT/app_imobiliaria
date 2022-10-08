<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE CONTRATOS" @cbAnterior="$router.back()" iconBotao=""/>
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
                                        <v-btn :disabled="permiteInclusao == false" icon color="primary" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                                        <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                                    </v-row>
                                </v-col> 
                        </v-row>
                    <v-divider></v-divider>
                    <v-text-field
                        append-icon="mdi-magnify"
                        v-model="search"
                        label="Pesquisa por Imóvel"
                        class="mx-4"
                    ></v-text-field>
                    <v-row class="d-flex justify-center pt-1 pb-5 pl-4 pr-1">
                    <v-chip-group column v-model="filtro" mandatory>
                        <v-chip filter outlined>Todos</v-chip>
                        <v-chip filter outlined>Ativos</v-chip>
                        <v-chip filter outlined>Inativos</v-chip>
                    </v-chip-group>
                </v-row>
                <v-divider></v-divider>
                </template>
                <template v-slot:body="{ items }">
                    <v-list-item-group v-model="idSelecionado">
                        <v-flex v-for="(item) in items" :key="item.id">
                            <v-list-item class="px-1 py-0">
                                <v-list-item-content>
                                    <v-row>
                                        <v-col>
                                            <v-list-item-title v-html="item.apelidoImovel || ''"></v-list-item-title>
                                            <v-list-item-subtitle class="pa-1 black--text">{{item.nomeInquilino || ''}}</v-list-item-subtitle>
                                            <v-divider></v-divider>
                                            <v-list-item-subtitle class="pa-1">
                                                <v-row v-if="item.dataEncerramento == null">
                                                    <v-col class="py-3" cols="3">Inicio: </v-col>
                                                    <v-col class="py-3" >{{linhaInicioContrato(item.dataInicio || '', item.dataEncerramento || '')}}</v-col>
                                                </v-row>
                                                <v-row v-else>
                                                    <v-col class="py-3" cols="3">Periodo: </v-col>
                                                    <v-col class="py-3" >{{linhaInicioContrato(item.dataInicio || '', item.dataEncerramento || '')}}</v-col>
                                                </v-row>
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle class="pa-1">
                                                <v-row>
                                                    <v-col class="py-3" cols="3">Aluguel: </v-col>
                                                    <v-col class="py-3" >{{linhaAluguel(item.diaPagamento || '', item.valorAluguel || '')}}</v-col>
                                                </v-row>
                                            </v-list-item-subtitle>
                                            <v-divider v-if="item.dataEncerramento == null"></v-divider>
                                            <v-card-actions class="pt-3 pb-0" v-if="item.dataEncerramento == null">
                                                <v-row v-if="item.dataAssinatura == null">
                                                    <v-col class="d-flex justify-center"><v-btn text small color="primary"> Altera </v-btn></v-col>
                                                    <v-col class="d-flex justify-center"><v-btn text small color="success" @click="operacao('AS', item.id, item.apelidoImovel || '')"> Assina </v-btn></v-col>
                                                </v-row>
                                                <v-row v-else >
                                                    <v-col class="d-flex justify-center"><v-btn text small color="primary" @click="operacao('RE', item.id, item.apelidoImovel || '')"> Reajusta </v-btn></v-col>
                                                    <v-col class="d-flex justify-center"><v-btn text small color="warning" @click="operacao('PO', item.id, item.apelidoImovel || '')"> Posterga </v-btn></v-col>
                                                    <v-col class="d-flex justify-center"><v-btn text small color="error" @click="operacao('EN', item.id, item.apelidoImovel || '')"> Encerra </v-btn></v-col>
                                                </v-row>
                                            </v-card-actions>
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
    import mainService from '../../../services/mainService'
    import TituloPagina from '../../../components/TituloPagina'
    import {strDateTime2StrDateBr} from '../../../bibliotecas/formataValores'
   
    export default {
        props: {
            mostra: Boolean, 
            permiteInclusao: Boolean, 
            permiteAlteracao: Boolean, 
            permiteExclusao: Boolean,
            executaRefresh: Boolean
        },
        components: {TituloPagina},
        data() {
            return {
                search: '',
                headers: [
                    {
                        text: 'Nome do Imovel',
                        align: 'start',
                        sortable: false,
                        value: 'nomeImovel',
                    }
                ],

                paginaAtual: 1,
                totalPaginas: 0,
                itensPorPagina: 0,
                
                resultado: [],
                resultadoTela: [],

                enumFiltro: {
                    todos: 0,
                    ativos: 1,
                    inativos: 2
                },
                filtro: 1,
                
                enumOperacao: {
                    assina: 0,
                    ativos: 1,
                    inativos: 2
                },

                // funcoes
                idSelecionado: 0,

                infoPergunta: {
                    titulo: '',
                    texto: '',
                    abre: false,
                    operacao: '',
                    id: 0
                },
            }
        },
        mounted() {
            this.refresh();
            this.itensPorPagina = 100
        },
        watch: {
            executaRefresh: function(newVal) {
                if (newVal == true)
                    this.refresh();
            },
            filtro() {
                this.filtra();
            }
        },
        computed: {
            tituloLista: function() {
                const _totalRegistros = this.resultadoTela.length

                return (_totalRegistros == 0) ? 'Nenhum contrato retornado' : (_totalRegistros == 1) ? ` Um contrato retornado` : ` ${_totalRegistros} contratos`
            },
            mensagemAguarde: {
                get () {
                    return ''
                },
                set (v) {
                    this.$emit('cbMensagemAguarde', v)
                }
            },
            mensagemErro: {
                get () {
                    return ''
                },
                set (v) {
                    this.$emit('cbMensagemErro', v)
                }
            },
        },
        methods: {
            ativa(id) {
                this.$emit('cbAtiva', id)
            },
            edita(id) {
                this.$emit('cbEdita', id)
            },
            inativa(id) {
                this.$emit('cbInativa', id)
            },
            filtra() {
                if (this.filtro == this.enumFiltro.todos) {
                    this.resultadoTela = this.resultado;
                    return;
                }

                if (this.filtro == this.enumFiltro.ativos) {
                    this.resultadoTela = this.resultado.filter((p) => p.status === 1 && p.dataEncerramento == null);
                    return;
                }
                if (this.filtro == this.enumFiltro.inativos) {
                    this.resultadoTela = this.resultado.filter((p) => p.status === 0 || p.dataEncerramento != null);
                    return;
                }
            },
            novo() {
                this.$emit('cbNovo')
            },
            operacao(op, id, apelidoImovel) {
                this.$emit('cbOperacao', op, id, apelidoImovel)
            },
            linhaInicioContrato(dataInicio, dataEncerramento) {
                if (!dataInicio) {
                    return '';
                }
                if (!dataEncerramento)
                    return strDateTime2StrDateBr(dataInicio, 'yyyy-mm-dd', '-')

                return strDateTime2StrDateBr(dataInicio, 'yyyy-mm-dd', '-') + ' até ' + strDateTime2StrDateBr(dataEncerramento, 'yyyy-mm-dd', '-')
            },
            linhaAluguel(dia, valor) {
                if ((!dia) || (!valor)) {
                    return '';
                }
                return valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) + ` até dia ${dia}`
            },
            async refresh() {
                let _retorno = ''

                this.mensagemAguarde =  'Buscando contratos! Aguarde...'
                let resp = await mainService.listaContratos()
                    .catch(
                        err => {
                            _retorno =  'ERR:3320-' + mainService.catchPadrao(err)
                    });

                this.mensagemAguarde =  '';
                if (_retorno) {
                    this.mensagemErro = _retorno;
                    return;
                }
                this.resultado = resp.data;
                this.filtra();
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