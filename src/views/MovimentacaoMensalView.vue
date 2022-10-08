// eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]
<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>
        <ProgressBar :mensagem="mensagemAguarde" />
        <TituloPagina titulo="MOVIMENTAÇÕES MENSAIS" @cbAnterior="$router.back()" iconBotao=""/>

        <v-bottom-sheet v-model="infoParcela.mostraDialog" inset max-width="500px">
            <v-sheet class="text-center ">
                <v-card tile class="pa-0 ma-0 ">
                    <v-card-title class="pa-2 teal lighten-2" >
                        <span class="white--text subtitle-1">{{infoParcela.titulo}}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0">
                        <v-form ref="myForm" class="mx-3" v-model="infoParcela.formularioValido">
                            <v-text-field class="mt-5 pt-2"
                                dense disabled
                                label="Vencimento da Parcela"
                                v-model="infoParcela.dataVencimento"
                            />
                            <v-text-field class="pt-2"
                                dense disabled
                                label="Valor da Parcela"
                                v-model="infoParcela.strValorParcela"
                            />
                            <v-text-field class="pt-2" v-if="infoParcela.exclusao == false" dense disabled label="Taxa de Administração" v-model="infoParcela.strValorTaxaAdm" />
                            <v-text-field class="pt-2" v-if="infoParcela.exclusao == false" dense disabled label="Valor Liquido" v-model="infoParcela.strValorLiquido" />
                            <v-text-field class="pt-2"
                                dense autofocus required clearable
                                label="Data de Pagamento*"
                                v-model="infoParcela.dataPagamento"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                                :disabled="infoParcela.exclusao == true"
                            />
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-1 px-5 ma-0">
                        <v-spacer></v-spacer>
                        <v-btn text small 
                            :disabled="infoParcela.saving == true"
                            color="secundary" 
                            @click="infoParcela.mostraDialog = false"
                        >Fechar </v-btn>
                        <v-btn text small 
                            :disabled="infoParcela.saving == true"
                            color="error" 
                            v-if="infoParcela.exclusao == true" 
                            @click="excluiPagamento()"
                        >Excluir</v-btn>
                        <v-btn text small
                            :disabled="infoParcela.formularioValido == false || infoParcela.saving == true"
                            color="primary"
                            v-if="infoParcela.exclusao == false"
                            @click="salvaPagamento()"
                        >Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-sheet>
        </v-bottom-sheet>

        <v-bottom-sheet v-model="infoRecebimento.mostraDialog" inset max-width="500px">
            <v-sheet class="text-center ">
                <v-card tile class="pa-0 ma-0 ">
                    <v-card-title class="pa-2 teal lighten-2" >
                        <span class="white--text subtitle-1">{{infoRecebimento.titulo}}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0">
                        <v-form ref="myForm" class="mx-3" v-model="infoRecebimento.formularioValido">
                            <v-text-field class="mt-5 pt-2"
                                dense disabled
                                label="Valor Pago"
                                v-model="infoRecebimento.valorPago"
                            />
                            <v-text-field class="pt-2" v-if="infoRecebimento.exclusao == false"
                                dense disabled
                                label="Taxa de Administração"
                                v-model="infoRecebimento.valorTaxaAdm"
                            />
                            <v-text-field class="pt-2" v-if="infoRecebimento.exclusao == false"
                                dense disabled
                                label="Valor Liquido"
                                v-model="infoRecebimento.valorLiquido"
                            />
                            <v-text-field class="pt-2" v-if="infoRecebimento.exclusao == false"
                                dense autofocus required clearable
                                label="Data do Recebimento"
                                v-model="infoRecebimento.dataRecebimento"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                                :disabled="infoRecebimento.exclusao == true"
                            />
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-1 px-5 ma-0">
                        <v-spacer></v-spacer>
                        <v-btn text small 
                            color="secundary" 
                            :disabled="infoRecebimento.saving == true"
                            @click="infoRecebimento.mostraDialog = false"
                        >Fechar </v-btn>
                        <v-btn text small 
                            color="error" 
                            :disabled="infoRecebimento.saving == true"
                            v-if="infoRecebimento.exclusao == true" 
                            @click="cancelaQuitacaoRecebimento()"
                        >Excluir</v-btn>
                        <v-btn text small
                            :disabled="infoRecebimento.formularioValido == false || infoRecebimento.saving == true"
                            color="primary"
                            v-if="infoRecebimento.exclusao == false"
                            @click="quitaRecebimento()"
                        >Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-sheet>
        </v-bottom-sheet>

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
                <v-flex class="pl-1 pr-2 pt-2">
                    <v-row dense class="justify-center white--text teal lighten-2">
                        <v-col class="d-flex justify-start" cols="1">
                            <v-btn dark :disabled="dataAtual <= menorData" icon v-on:click="subMonth()"><v-icon>mdi-chevron-left</v-icon></v-btn>
                        </v-col>
                        <v-col class="d-flex justify-center align-center" cols="10"><h4>{{mesAtual}}</h4></v-col>
                        <v-col class="d-flex justify-end" cols="1">
                            <v-btn dark icon v-on:click="addMonth()"><v-icon>mdi-chevron-right</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-flex>
                <v-text-field
                    append-icon="mdi-magnify"
                    v-model="search"
                    label="Pesquisa por Imóvel"
                    class="mx-2"
                ></v-text-field>
                <v-row class="d-flex justify-center pt-1 pb-5 pl-4 pr-1">
                    <v-chip-group column v-model="filtro" mandatory>
                        <v-chip filter outlined>Todos</v-chip>
                        <v-chip filter outlined>Desocupados</v-chip>
                        <v-chip filter outlined>Não Pagos</v-chip>
                        <v-chip filter outlined>Pagos</v-chip>
                        <v-chip filter outlined>Recebido pelo Proprietário</v-chip>
                    </v-chip-group>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1 my-1">
                    <v-col class="px-1" cols="9">{{numeroRegistros()}}</v-col>
                    <v-col cols="3" >
                        <v-row justify="end"><v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn></v-row>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
            </template>
            <template v-slot:body="{ items }">
                <v-flex v-for="(item) in items" :key="item.id">
                    <v-list-item class="px-1 py-0">
                        <v-list-item-content>
                            <v-row>
                                <v-col>
                                    <v-list-item-title v-html="item.nomeImovel || ''"></v-list-item-title>
                                    <v-flex v-if="item.alugado == false">
                                        <v-list-item-subtitle class="pa-1 black--text">Imóvel livre</v-list-item-subtitle>
                                    </v-flex>
                                    <v-flex v-else>
                                        <v-list-item-subtitle class="pa-1 black--text">{{item.nomeInquilino || ''}}</v-list-item-subtitle>
                                        <v-divider></v-divider>
                                        <v-list-item-subtitle class="pa-1">
                                            <v-row>
                                                <v-col class="py-3" cols="5">Inicio do contrato: </v-col>
                                                <v-col class="py-3" >{{linhaInicioContrato(item.dataInicioContrato)}}</v-col>
                                            </v-row>
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle class="pa-1">
                                            <v-row>
                                                <v-col class="py-2" cols="5">Último aumento: </v-col>
                                                <v-col class="py-2" >{{linhaInicioContrato(item.dataUltimoAumento)}}</v-col>
                                            </v-row>
                                        </v-list-item-subtitle>
                                        
                                        <v-list-item-subtitle class="pa-1">
                                            <v-divider></v-divider>
                                            <v-row>
                                                <v-col class="py-3" cols="3">Parcela: </v-col>
                                                <v-col class="py-3">{{linhaParcela(item.dataParcela || '', item.valorParcela || '')}}</v-col>
                                            </v-row>
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle  class="pa-1" v-if="item.pago == true">
                                            <v-row> 
                                                <v-col cols="3">Pagamento: </v-col>
                                                <v-col>{{linhaParcela(item.dataPagamento || '', item.valorPago || '')}}</v-col>
                                            </v-row>
                                        </v-list-item-subtitle>
                                    </v-flex>
                                </v-col>
                                <v-col cols="2" v-if="infoSeguranca.somenteConsulta == false && item.alugado == true">
                                    <v-container  class="fill-height" fluid>
                                        <v-row justify="center" align="center">
                                            <v-btn icon color="primary" v-on:click="novoContrato()" v-if="item.alugado == false" ><v-icon>mdi-file-sign</v-icon></v-btn>

                                            <v-flex v-if="infoSeguranca.permiteQuitacaoInquilino == true">
                                                <v-btn icon color="primary" v-on:click="preparaNovoPagamento(item.parcelaContratoId, item.dataParcela || '', item.valorParcela || 0, item.percentualTaxaAdministracao || 0)" v-if="item.pago == false" ><v-icon>mdi-cash-plus</v-icon></v-btn>
                                                <v-btn icon color="red" v-on:click="preparaExclusaoPagamento(item.recebimentoParcelaId, item.dataParcela || '', item.valorParcela || '', item.dataPagamento || '')" else v-if="item.pago == true && item.recebidoPeloProprietario == false" ><v-icon>mdi-cash-minus</v-icon></v-btn>
                                            </v-flex>
                                            <v-flex v-if="infoSeguranca.permiteQuitacaoImobiliaria == true ">
                                                <v-btn icon color="primary" v-on:click="preparaNovoRecebimento(item.recebimentoParcelaId, item.valorParcela || 0, item.valorTaxaAdm || 0, item.valorLiquido || 0)" v-if="item.pago == true && item.recebidoPeloProprietario == false" ><v-icon>mdi-plus</v-icon></v-btn>
                                                <v-btn icon color="red" v-on:click="preparaExclusaoRecebimento(item.recebimentoParcelaId, item.valorPago || 0)" else v-if="item.pago == true && item.recebidoPeloProprietario == true" ><v-icon>mdi-minus</v-icon></v-btn>
                                            </v-flex>

                                        </v-row>
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-flex>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import TituloPagina from '../components/TituloPagina'
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'
    import {strDateTime2StrDateBr, stringDataBr2Sql, data2String} from '../bibliotecas/formataValores'
    import regrasCampos from '../bibliotecas/regrasCampos'
    //import {temAcesso} from '../rotinasProjeto/rotinasProjeto'

    export default {
        components: {TituloPagina, ProgressBar, MessageBox},
        data() {
            return {
                search: '',
                headers: [
                    {
                        text: 'Nome do Imóvel',
                        align: 'start',
                        sortable: false,
                        value: 'nomeImovel',
                    }
                ],
                paginaAtual: 1,
                totalPaginas: 0,
                itensPorPagina: 100,
                
                regras: regrasCampos,

                menorData: '',

                enumFiltro: {
                    todos: 0,
                    imovelLivre: 1,
                    somenteNaoPagos: 2,
                    somentePagos: 3,
                    recebidoPeloProprietario: 4
                },

                dataAtual: '',
                mesAtual: '',
                filtro: 2,
                resultado: [],
                resultadoTela: [],

                tipoMensagem: 0,
                mensagem: '',
                mensagemAguarde: '',

                dataBrUltimoPgto: '',

                infoParcela: {
                    titulo: '',
                    exclusao: false,
                    mostraDialog: false,
                    formularioValido: false,
                    id: 0,
                    recebimentoParcelaId: 0,
                    dataVencimento: '',
                    strValorParcela: '',
                    strValorTaxaAdm: '',
                    strValorLiquido: '',
                    dataPagamento: '',
                    saving: false
                },

                infoRecebimento: {
                    titulo: '',
                    exclusao: false,
                    mostraDialog: false,
                    formularioValido: false,
                    recebimentoParcelaId: 0,
                    valorPago: 0,
                    valorTaxaAdm: 0,
                    valorLiquido: 0,
                    dataRecebimento: '',
                    strValorPago: '',
                    saving: false
                },

                infoSeguranca: {
                    somenteConsulta: true,
                    permiteQuitacaoInquilino: false,
                    permiteQuitacaoImobiliaria: false
                }
            }
        },
        created() {
            const _hoje = new Date();
            this.dataAtual = new Date(_hoje.getFullYear(), _hoje.getMonth(), 1);
            this.menorData = new Date(2021, 10, 1);
        },
        mounted() {
            //const _permissionamentos = this.$store.getters.permissionamento;
            this.infoSeguranca.permiteQuitacaoInquilino = true; //temAcesso(_permissionamentos, 8, 2, '');
            this.infoSeguranca.permiteQuitacaoImobiliaria = true; //temAcesso(_permissionamentos, 9, 2, '');
            this.infoSeguranca.somenteConsulta = !this.infoSeguranca.permiteQuitacaoInquilino && !this.infoSeguranca.permiteQuitacaoImobiliaria;

            this.refresh();
        },
        computed: {
            mensagemErro: {
                get: function() { return this.mensagem},
                set: function(val) {
                    this.tipoMensagem = 1
                    this.mensagem = val
                }
            },
            mensagemSucesso: {
                get: function() { return this.mensagem},
                set: function(val) {
                    this.tipoMensagem = 0
                    this.mensagem = val
                }
            },
        },
        watch: {
            dataAtual(val) {
                const _meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                this.mesAtual = `${_meses[val.getMonth()]} de ${val.getFullYear()}`
            },
            filtro() {
                this.filtra();
            }
        },
        methods: {
            addMonth() {
                this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 1);
                this.refresh()
            },
            async cancelaQuitacaoRecebimento() {
                this.infoRecebimento.saving = true
                this.mensagemAguarde='Cancelando quitação. Aguarde...'
                let _erro = false;
                const _resp = await mainService.excluiQuitacaoRecebimento(this.infoRecebimento.id)
                .catch(response => {
                this.mensagemAguarde = '';
                    _erro = true;
                    this.mensagemErro = mainService.catchPadrao(response);
                })
                this.infoRecebimento.saving = false
                if (_erro) {
                    return;
                }
                this.mensagemAguarde = '';
                console.log(_resp)
                if (_resp.status != 204) {
                    this.mensagemErro = _resp.message;
                    return
                }
                this.mensagemSucesso = 'Cancelamento efetuado com sucesso';
                this.infoRecebimento.mostraDialog = false;
                this.refresh();
            },
            async excluiPagamento() {
                this.infoParcela.saving = true
                this.mensagemAguarde='Excluindo pagamento. Aguarde...'
                let _erro = false;
                const _resp = await mainService.excluiPagamentoParcela(this.infoParcela.recebimentoParcelaId)
                .catch(response => {
                this.mensagemAguarde = '';
                    _erro = true;
                    this.mensagemErro = mainService.catchPadrao(response);
                })
                this.infoParcela.saving = false
                if (_erro) {
                    return;
                }
                this.mensagemAguarde = '';
                console.log(_resp)
                if (_resp.status != 204) {
                    this.mensagemErro = _resp.message;
                    return
                }
                this.mensagemSucesso = 'Parcela paga com sucesso';
                this.infoParcela.mostraDialog = false;
                this.refresh();
            },
            filtra() {
                if (this.filtro == this.enumFiltro.todos) {
                    this.resultadoTela = this.resultado;
                    return;
                }

                if (this.filtro == this.enumFiltro.imovelLivre) {
                    this.resultadoTela = this.resultado.filter((p) => p.alugado === false);
                    return;
                }
                if (this.filtro == this.enumFiltro.somenteNaoPagos) {
                    this.resultadoTela = this.resultado.filter((p) => p.alugado === true && p.pago === false && p.recebidoPeloProprietario == false) ;
                    return;
                }
                if (this.filtro == this.enumFiltro.somentePagos) {
                    this.resultadoTela = this.resultado.filter((p) => p.alugado === true && p.pago === true &&  p.recebidoPeloProprietario == false) ;
                    return;
                }

                if (this.filtro == this.enumFiltro.recebidoPeloProprietario) {
                    this.resultadoTela = this.resultado.filter((p) => p.recebidoPeloProprietario == true);
                    return;
                }
            },
            linha(tipo, val1){
                if (tipo == 2) {
                    const _vencimento = strDateTime2StrDateBr(val1, 'yyyy-mm-dd', '-')
                    return `<span class="nota_botao">Em ${_vencimento} </span></span> `
                }
                else if (tipo == 3) {
                    const _cpf = (val1) ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3') : '' // eslint-disable-line
                    return `Celulares:<span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
            linhaInicioContrato(data) {
                if (!data) {
                    return '';
                }
                return strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
            },
            linhaParcela(data, valor) {
                if (!data) {
                    return '';
                }

                const _vencimento = strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
                const _retorno = _vencimento + ' - ' + valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

                return `${_retorno}`
            },
            linhaPagamento(data, valorPagamento, valorTxAdm) {
                if (!data) {
                    return '';
                }

                const _vencimento = strDateTime2StrDateBr(data, 'yyyy-mm-dd', '-')
                const _retorno = _vencimento + ' - ' + valorPagamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
                    + ' - ' + valorTxAdm.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

                return `<span class=""><b>Pago: </b> ${_retorno} </span></span> `
            },
            novoContrato() {
                this.mensagemErro = 'Novo Contrato de Aluguel não implementada'
            },
            numeroRegistros: function() {
                const _totalRegistros = this.resultadoTela.length
                if (_totalRegistros == 0) {
                    return 'Nenhum imóvel'
                }
                var _valorTotal = 0;
                var _valorSecundario = 0

                
                switch (this.filtro) {
                    case this.enumFiltro.todos:
                        _valorTotal = this.resultadoTela.reduce((a, b) => +a + +b.valorParcela, 0);
                        _valorSecundario = this.resultadoTela.reduce((a, b) => +a + +b.valorPago, 0);
                        break;

                    case this.enumFiltro.imovelLivre:
                        _valorTotal = this.resultadoTela.reduce((a, b) => +a + +b.valorParcela, 0);
                        break;

                    default:
                        _valorTotal = this.resultadoTela.reduce((a, b) => +a + +b.valorParcela, 0);
                        _valorSecundario = this.resultadoTela.reduce((a, b) => +a + +b.valorLiquido, 0);

                }

                return  (_totalRegistros == 1) ? '1 imóvel ' : ` ${_totalRegistros} imóveis ` + 
                            (_valorTotal == 0 ? '' :  ` - ${_valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}` +
                            (_valorSecundario == 0 ? '0' :  ` - (${_valorSecundario.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})})`));
            },
            preparaExclusaoPagamento(recebimentoParcelaId, dataParcela, valorParcela, dataPagamento) {
                this.infoParcela.titulo = 'Exclui Pagamento';
                this.infoParcela.mostraDialog = true;
                this.infoParcela.exclusao = true;
                this.infoParcela.recebimentoParcelaId = recebimentoParcelaId;
                this.infoParcela.dataVencimento = strDateTime2StrDateBr(dataParcela, 'yyyy-mm-dd', '-');
                this.infoParcela.strValorParcela = valorParcela.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                this.infoParcela.dataPagamento = strDateTime2StrDateBr(dataPagamento, 'yyyy-mm-dd', '-');
            },
            preparaExclusaoRecebimento(recebimentoParcelaId, valorPago) {
                this.infoRecebimento.titulo = 'Exclui Quitação com Proprietário';
                this.infoRecebimento.mostraDialog = true;
                this.infoRecebimento.exclusao = true;
                this.infoRecebimento.id = recebimentoParcelaId;
                this.infoRecebimento.valorPago = valorPago.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            },
            preparaNovoPagamento(parcelaId, dataParcela, valorParcela, percentualTaxaAdministracao) {

                var _valorTxAdm = Math.ceil(valorParcela * (percentualTaxaAdministracao / 100.0), 2)
                var _valorLiquido = valorParcela - _valorTxAdm
                var _strPercTaxaAdm = (percentualTaxaAdministracao/100.0).toLocaleString('pt-br', { style: 'percent'});
                var _strvalorTaxaAdm = _valorTxAdm.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

                this.infoParcela.titulo = 'Quitação de Parcela';
                this.infoParcela.mostraDialog = true;
                this.infoParcela.exclusao = false;
                this.infoParcela.id = parcelaId;
                this.infoParcela.dataVencimento = strDateTime2StrDateBr(dataParcela, 'yyyy-mm-dd', '-');
                this.infoParcela.valorParcela = valorParcela;
                this.infoParcela.strValorParcela = valorParcela.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                this.infoParcela.strValorTaxaAdm = `${_strvalorTaxaAdm} (${_strPercTaxaAdm})`
                this.infoParcela.strValorLiquido = _valorLiquido.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                this.infoParcela.dataPagamento = (this.dataBrUltimoPgto) ? this.dataBrUltimoPgto : data2String(new Date(), 'BR');
            },
            preparaNovoRecebimento(recebimentoParcelaId, valorPago, valorTaxaAdm, valorLiquido) {
                this.infoRecebimento.titulo = 'Quitação com Proprietário';
                this.infoRecebimento.mostraDialog = true;
                this.infoRecebimento.exclusao = false;
                this.infoRecebimento.id = recebimentoParcelaId;
                this.infoRecebimento.dataRecebimento = data2String(new Date(), 'BR');
                this.infoRecebimento.valorPago = valorPago.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
                this.infoRecebimento.valorTaxaAdm = valorTaxaAdm.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
                this.infoRecebimento.valorLiquido = valorLiquido.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            },
            async refresh() {
                const _ano = this.dataAtual.getFullYear();
                const _mes = this.dataAtual.getMonth()+1;
                let _retorno = ''

                this.mensagemAguarde =  'Buscando movimentação do mês! Aguarde...'
                let resp = await mainService.listaMovimentacaoMensal(_ano, _mes)
                    .catch(
                        err => {
                            _retorno =  'ERR:3320-' + mainService.catchPadrao(err)
                    });

                console.log(resp.data)

                this.mensagemAguarde =  '';
                if (_retorno) {
                    this.mensagemErro = _retorno;
                    return;
                }
                this.resultado = resp.data

                this.filtra();
            },

            async quitaRecebimento() {
                this.infoRecebimento.saving= true
                this.mensagemAguarde='Salvando os dados. Aguarde...'
                let _erro = ''
                const _data = stringDataBr2Sql(this.infoRecebimento.dataRecebimento);
                const _param = {
                    recebimentoParcelaId: this.infoRecebimento.id,
                    data: _data
                }

                const _resp = await mainService.salvaQuitacaoRecebimento(_param)
                .catch(response => {
                    _erro = mainService.catchPadrao(response)
                })
                this.infoRecebimento.saving = false

                this.mensagemAguarde = '';
                if (_erro) {
                    this.mensagemErro = _erro;
                    return;
                }
                console.log(_resp)
                if (_resp.status != 204) {
                    this.mensagemErro = _resp.message;
                    return
                }
                this.dataBrUltimoPgto = this.infoRecebimento.dataPagamento;
                this.mensagemSucesso = 'Parcela recebida pelo proprietário com sucesso';
                this.infoRecebimento.mostraDialog = false;
                this.refresh();
            },

            async salvaPagamento() {
                this.infoParcela.saving = true
                this.mensagemAguarde='Salvando o pagamento. Aguarde...'
                let _erro = ''
                const _data = stringDataBr2Sql(this.infoParcela.dataPagamento);
                const _param = {
                    parcelaContratoId: this.infoParcela.id,
                    valor: this.infoParcela.valorParcela,
                    data: _data
                }

                const _resp = await mainService.salvaPagamentoParcela(_param)
                .catch(response => {
                    _erro = mainService.catchPadrao(response)
                })
                this.infoParcela.saving = false
                this.mensagemAguarde = '';
                if (_erro) {
                    this.mensagemErro = _erro;
                    return;
                }
                console.log(_resp)
                if (_resp.status != 204) {
                    this.mensagemErro = _resp.message;
                    return
                }
                this.dataBrUltimoPgto = this.infoParcela.dataPagamento;
                this.mensagemSucesso = 'Parcela paga com sucesso';
                this.infoParcela.mostraDialog = false;
                this.refresh();
            },
            subMonth() {
                this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() - 1, 1);
                this.refresh()
            },
        }
    }
</script>
<style scoped>
  .linha{
    justify-items: center;
    width: 90%;
  }

  .botao-arredondado{
    width: 90%;
    border-radius:10px!important;
  }
</style>