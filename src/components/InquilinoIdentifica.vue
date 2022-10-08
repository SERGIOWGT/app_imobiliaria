<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CONSULTA PARA CADASTRO DE INQUILINO" @cbAnterior="$router.back()" iconBotao=""/>
         <v-card flat class="pt-0 mt-1" tile>
            <v-data-table
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
                        label="Pesquisa por Nome"
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
                    <v-list-item-group v-model="inquilinoIdSelecionado">
                        <v-flex v-for="(item) in items" :key="item.id">
                            <v-list-item class="px-1 py-0">
                                <v-list-item-content>
                                    <v-row>
                                        <v-col cols="10">
                                            <v-list-item-title v-html="item.nome || ''"></v-list-item-title>
                                            <v-list-item-subtitle v-html="linha(2, item.dataNascimento || '')"></v-list-item-subtitle>
                                            <v-list-item-subtitle v-html="linha(3, item.celular || '') "></v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="2" >
                                            <v-container class="fill-height py-0" fluid>
                                                <v-row justify="center" align="center">
                                                    <v-btn icon color="primary" @click="edita(item.id)"><v-icon>mdi-account-settings-outline</v-icon></v-btn>
                                                    <v-btn v-if="item.status == 1" icon color="red" @click="inativa(item.id)"><v-icon>mdi-account-minus-outline</v-icon></v-btn>
                                                    <v-btn v-else icon color="blue" @click="ativa(item.id)"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                                                </v-row>
                                            </v-container>
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
            permiteInclusao: Boolean, 
            permiteAlteracao: Boolean, 
            permiteExclusao: Boolean,
            executaRefresh: Boolean
        },
        components: {TituloPagina},
        data() {
            return {
                search: '',
                filtro: '',
                headers: [
                    {
                        text: 'Nome do Imovel',
                        align: 'start',
                        sortable: false,
                        value: 'nome',
                    }
                ],

                paginaAtual: 1,
                totalPaginas: 0,
                itensPorPagina: 0,
                
                inquilinos: [],
                resultadoTela: [],

                enumFiltro: {
                    todos: 0,
                    ativos: 1,
                    inativos: 2
                },

                // funcoes
                inquilinoIdSelecionado: 0
            }
        },
        mounted() {
            this.refresh();
            this.itensPorPagina = parseInt(process.env.VUE_APP_PAGE_LENGHT, 10)
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
                const _totalRegistros = this.inquilinos.length

                return (_totalRegistros == 0) ? 'Nenhum inquilino retornado' : (_totalRegistros == 1) ? ` Um inquilino retornado` : ` ${_totalRegistros} inquilinos`
            },
        },
        methods: {
            novo() {
                this.$emit('cbNovo')
            },
            edita(id) {
                this.$emit('cbEdita', id)
            },
            ativa(id) {
                this.$emit('cbAtiva', id)
            },
            inativa(id) {
                this.$emit('cbInativa', id)
            },
            async refresh() {
                //this.inquilinos = this.$store.getters.Inquilinos;
                let _retorno = ''

                this.mensagemAguarde =  'Buscando inquilinos! Aguarde...'
                let resp = await mainService.listaInquilinos()
                    .catch(
                        err => {
                            _retorno =  'ERR:3320-' + mainService.catchPadrao(err)
                    });

                this.mensagemAguarde =  '';
                if (_retorno) {
                    this.mensagemErro = _retorno;
                    return;
                }
                this.inquilinos = resp.data;
                console.log(this.inquilinos)
                this.filtra();
            },
            linha(tipo, value){
                if (tipo == 2) {
                    const _dataNascimento = strDateTime2StrDateBr(value, 'yyyy-mm-dd', '-')
                    return `<span class="nota_botao">Nascido em ${_dataNascimento}</span></span> `
                }
                else if (tipo == 3) {
                    const _cpf = (value) ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') : '' // eslint-disable-line
                    return `Celulares:<span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
            filtra() {
                if (this.filtro == this.enumFiltro.todos) {
                    this.resultadoTela = this.inquilinos;
                    return;
                }

                if (this.filtro == this.enumFiltro.ativos) {
                    this.resultadoTela = this.inquilinos.filter((p) => p.status === 1);
                    return;
                }
                if (this.filtro == this.enumFiltro.inativos) {
                    this.resultadoTela = this.inquilinos.filter((p) => p.status === 0);
                    return;
                }
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