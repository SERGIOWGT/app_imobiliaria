<template>
    <v-container fluid style="height: 100vmax;" class="px-2 py-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
         <v-bottom-sheet v-model="infoNovo.mostraDialog" inset persistent max-width="500px">
            <v-sheet class="text-center ">
                <v-card tile class="pa-0 ma-0 ">
                    <v-card-title class="pa-2 teal lighten-2" >
                        <span class="white--text subtitle-1">{{infoNovo.titulo}}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0">
                        <v-form ref="myForm" class="mx-3" v-model="formularioValido">
                            <v-text-field class="mt-5 pt-2" v-if="infoNovo.labelPai != ''"
                            dense disabled 
                            :label="infoNovo.labelPai"
                            v-model="infoNovo.nomePai"
                            ></v-text-field>
                            <v-text-field class="mt-5 pt-2 mb-5" 
                            dense required clearable counter
                            :label="infoNovo.label"
                            :disabled="infoNovo.exclusao == true"
                            v-model="infoNovo.nome"
                            :rules="[regras.Basicas.obrigatorio()]"
                            maxlength="50"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="pa-0 ma-0">
                        <v-spacer></v-spacer>
                        <v-btn text small color="secundary" @click="infoNovo.mostraDialog = false">Fechar </v-btn>
                        <v-btn text small color="error" v-if="infoNovo.exclusao == true" @click="exclui()">Excluir</v-btn>
                        <v-btn text small color="primary" v-if="infoNovo.exclusao == false" @click="salva()">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-sheet>
        </v-bottom-sheet>
        <v-card class="pt-0 mt-0" v-if="opcaoAtual == enumCadastro.microArea">
            <v-card-text class="">
                <v-row no-gutters>
                    <v-col cols="12"> <b>Escolha uma unidade de saúde para acessar Cadastro de Micro Áreas</b> </v-col>
                </v-row>
                <v-autocomplete class="pt-2"  @input="setaUnidadeSaude"
                    dense hide-no-data
                    v-model="infoSelecionadaComboPesquisa.unidadeSaude"
                    :items="listas.unidadesSaude"
                    item-value="id"
                    item-text="nome"
                    return-object
                ></v-autocomplete> 
            </v-card-text>
        </v-card>
        <v-card class="pt-0 mt-0" v-if="opcaoAtual == enumCadastro.logradouro">
            <v-card-text class="">
                <v-row no-gutters>
                    <v-col cols="12"><b>Escolha um Bairro para acessar Cadastro de Logradouros</b> </v-col>
                </v-row>
                <v-autocomplete class="pt-2"  @input="setaBairro"
                    dense hide-no-data
                    v-model="infoSelecionadaComboPesquisa.bairro"
                    :items="listas.bairros"
                    item-value="id"
                    item-text="nome"
                    return-object
                ></v-autocomplete> 
            </v-card-text>
        </v-card>
        <v-card flat class="pt-0 mt-3" tile v-if="telaPronta" >
            <TituloPagina :titulo="tituloTelaPrincipal" @cbAnterior="$router.back()"/>
            <v-list>
                <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn :disabled="desabilitaNovo" icon color="teal lighten-2" @click="novo()"><v-icon>mdi-plus-circle</v-icon></v-btn>
                            <v-btn icon color="teal lighten-2" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                    <v-flex v-for="(item) in listas.tela" :key="item.id">
                    <v-list-item >
                        <v-list-item-content>
                            <v-list-item-title class="text-wrap" v-html="item.nome"></v-list-item-title>
                        </v-list-item-content>
                        <v-btn  icon color="primary" @click="configAlteracao(item.id, item.nome, false)"
                                :disabled="permissionamento[opcaoAtual].altera == false" >
                                <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                        <v-btn  icon color="error" @click="configAlteracao(item.id, item.nome, true)"
                                :disabled="permissionamento[opcaoAtual].exclui == false" >
                                <v-icon>mdi-minus-circle</v-icon>
                        </v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
        <v-bottom-navigation color="teal" grow fixed >
            <v-btn @click="cmdBotao(enumCadastro.unidadeSaude)">
                <v-icon>{{opcoes[enumCadastro.unidadeSaude].icone}}</v-icon>
            </v-btn>
            <v-btn  @click="cmdBotao(enumCadastro.microArea)" >
                <v-icon>{{opcoes[enumCadastro.microArea].icone}}</v-icon>
            </v-btn>
            <v-btn @click="cmdBotao(enumCadastro.bairro)" >
                <v-icon>{{opcoes[enumCadastro.bairro].icone}}</v-icon>
            </v-btn>
            <v-btn  @click="cmdBotao(enumCadastro.logradouro)" >
                <v-icon>{{opcoes[enumCadastro.logradouro].icone}}</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-container>    
</template>

<script>
import mainService from '../services/mainService'
import regrasCampos from '../bibliotecas/regrasCampos'
import MessageBox from '../lastec.components/lastec-messagebox'
import ProgressBar from '../lastec.components/lastec-progressbar'
import TituloPagina from '../components/TituloPagina'
import {temAcesso} from '../rotinasProjeto/rotinasProjeto'

export default {
    components: {
      ProgressBar, MessageBox, TituloPagina
    },
    data() {
          return {
            regras: regrasCampos,

            formularioValido: false,

            enumCadastro : {
                unidadeSaude: 0,
                bairro: 1,
                logradouro: 2,
                microArea: 3
            },
            permissionamento: [],
            infoNovo: {
                exclusao: false,
                mostraDialog: false,
                labelPai: '',
                label: '',
                paiId: 0,
                nomePai: '',
                id: 0,
                nome: ''
            },
            vetCampos: [
                    {genero: 'F', titulo: 'Unidade de Saúde', posicaoPai: -1},
                    {genero: 'M', titulo: 'Bairro', posicaoPai: -1},
                    {genero: 'M', titulo: 'Logradouro', posicaoPai: 1},
                    {genero: 'F', titulo: 'Micro Área', posicaoPai: 0}
            ],
            itemSelecionadoGrid: 0,
            opcaoAtual: 0,
            opcoes: [
                {icone: 'mdi-plus-outline', titulo: 'Unidades de Saúde'},
                {icone: 'mdi-home-city-outline', titulo: 'Bairros'},
                {icone: 'mdi-map-marker-outline', titulo: 'Logradouros'},
                {icone: 'mdi-human-capacity-increase', titulo: 'Micro Áreas'}
            ],
            titulo: '',
            telaPronta: false,
            listas: {
                tela:[],
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: []
            },
            infoSelecionadaComboPesquisa: {
                unidadeSaude: {
                    id: 0,
                    nome: ''
                },
                bairro: {
                    id: 0,
                    nome: ''
                },
            },
            cidadePadrao: null,
            unidadeSaudePadrao: null,
            mnicroAreaPadrao: null,
            bairroPadrao: null,
            logradouroPadrao: null,

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
        }
    },
    created() {
        this.opcaoAtual = -1
        this.cidadePadrao = this.$store.getters.cidadePadrao
        this.unidadeSaudePadrao = this.$store.getters.unidadeSaudePadrao
        this.microAreaPadrao = this.$store.getters.microAreaPadrao
        this.bairroPadrao = this.$store.getters.bairroPadrao
        this.logradouroPadrao = this.$store.getters.logradouroPadrao
        this.$store.commit('habilitaUserbar', false)

        const _permissionamentos = this.$store.getters.permissionamento;
        console.log(_permissionamentos);

        // Permissão 
        this.permissionamento.push ({
            inclui: temAcesso(_permissionamentos, '107', 1, 'I'),
            altera: temAcesso(_permissionamentos, '107', 1, 'A'),
            exclui: temAcesso(_permissionamentos, '107', 1, 'E'),
        })

        this.permissionamento.push ({
            inclui: temAcesso(_permissionamentos, '101', 1, 'I'),
            altera: temAcesso(_permissionamentos, '101', 1, 'A'),
            exclui: temAcesso(_permissionamentos, '101', 1, 'E')
        })
    
        this.permissionamento.push ({
            inclui: temAcesso(_permissionamentos, '103', 1, 'I'),
            altera: temAcesso(_permissionamentos, '103', 1, 'A'),
            exclui: temAcesso(_permissionamentos, '103', 1, 'E')
        })

        this.permissionamento.push ({
            inclui: temAcesso(_permissionamentos, '105', 1, 'I'),
            altera: temAcesso(_permissionamentos, '105', 1, 'A'),
            exclui: temAcesso(_permissionamentos, '105', 1, 'E')
        })
    },
    mounted() {
        this.buscaDadosIniciais()
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
        tituloTelaPrincipal() {
            if (this.opcaoAtual == -1)
                return ''

            return ('CADASTRO DE ' + this.vetCampos[this.opcaoAtual].titulo).toUpperCase()
        },
        tituloLista: function() {
            let _retorno = ''
            let _numeroRegistros = this.listas.tela.length
            if (_numeroRegistros == 0) {
                switch (this.opcaoAtual) {
                    case this.enumCadastro.unidadeSaude: 
                        _retorno = (_numeroRegistros == 0) ? 'Não há Unidades de Saúde cadastradas no Município' : ''
                        break;
                    case this.enumCadastro.bairro: 
                        _retorno = (_numeroRegistros == 0) ? 'Não há Bairros cadastrados no Município' : ''
                        break;
                    case this.enumCadastro.logradouro: 
                        _retorno = (_numeroRegistros == 0) ? 'Não há Logradouros cadastrados no Bairro selecionado' : ''
                        break;
                    case this.enumCadastro.microArea: 
                        _retorno = (_numeroRegistros == 0) ? 'Não há Micro Áreas cadastradas na Unidade de Saúde selecionada' : ''
                        break;
                }
            } else {
                _retorno = ` ${this.opcoes[this.opcaoAtual].titulo} (${_numeroRegistros} `
                _retorno += (_numeroRegistros == 0) ? ' registro)' : ' registros)'
            }
            return _retorno
        },
        desabilitaNovo: function() {
            if (this.permissionamento[this.opcaoAtual].inclui == false)
                return true;

            let retorno = true;
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    retorno = (this.unidadeSaudePadrao.id != 0)
                    break;
                case this.enumCadastro.bairro: 
                    retorno = (this.bairroPadrao.id != 0)
                    break;
                case this.enumCadastro.logradouro: 
                    retorno = (this.logradouroPadrao.id != 0)
                    break;
                case this.enumCadastro.microArea: 
                    retorno = (this.microAreaPadrao.id != 0)
                    break;
                }
            return retorno
        }
    },
    methods: {
        tituloTelaCadastro(posicao) {
            let _retorno = 'Nome ' + (this.vetCampos[posicao].genero == 'F' ? ' da ': ' do ') + this.vetCampos[posicao].titulo
            return _retorno
        },
        async listaBairros(cidadeId) {
            this.mensagemAguarde = 'Buscando Bairros! Aguarde...'
            await mainService.listaBairros(cidadeId, this.bairroPadrao.id)
            .then(_resposta => {
                this.mensagemAguarde = ''
                this.listas.bairros = _resposta.status == 200  ? _resposta.data : []
             })
            .catch((response) => {
                this.mensagemAguarde = '';
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        async listaLogradouros(bairroId) {
            this.mensagemAguarde = 'Buscando Logradouros! Aguarde...'
            await mainService.listaLogradouros(bairroId, this.logradouroPadrao.id)
            .then(resposta => {
                this.mensagemAguarde = ''
                this.listas.logradouros = resposta.status == 200  ? resposta.data : []
            })
            .catch((response) => {
                this.mensagemAguarde = '';
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        async listaMicroAreas(unidadeSaudeId) {
            await mainService.listaMicroAreas(unidadeSaudeId, this.microAreaPadrao.id)
            .then(resposta => {
                this.mensagemAguarde = ''
                this.listas.microAreas = resposta.status == 200  ? resposta.data : []
            })
            .catch((response) => {
                this.mensagemAguarde = '';
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        async listaUnidadesSaude(cidadeId, id) {
            this.mensagemAguarde = 'Buscando Unidades de Saúde! Aguarde...'
            await mainService.listaUnidadesSaude(cidadeId, id)
            .then(_resposta => {
                this.mensagemAguarde = ''
                this.listas.unidadesSaude = (_resposta.status == 200)  ?  _resposta.data : []
             })
            .catch((response) => {
                this.mensagemAguarde = '';
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        novo() {
            this.infoNovo.id = 0
            this.infoNovo.nome = ''
            this.infoNovo.exclusao = false

            this.infoNovo.titulo = (this.vetCampos[this.opcaoAtual].genero == 'F' ? 'Nova ': 'Novo ')
                + this.vetCampos[this.opcaoAtual].titulo

            this.infoNovo.label = this.tituloTelaCadastro(this.opcaoAtual)
            this.infoNovo.placeholder = 'Informe ' + this.infoNovo.label

            const _posicaoPai = this.vetCampos[this.opcaoAtual].posicaoPai;
            if (_posicaoPai != -1) {
                this.infoNovo.labelPai = this.tituloTelaCadastro(_posicaoPai)
            } else {
                this.infoNovo.labelPai = ''
                this.infoNovo.paiId = 0
            }
            this.infoNovo.mostraDialog = true
            //this.$refs.myForm.reset()
        },
        configAlteracao(id, nome, exclusao) {
            this.infoNovo.exclusao = exclusao

            this.infoNovo.id = id
            this.infoNovo.nome = nome
            this.infoNovo.titulo = (exclusao ? 'Exclusão de ':'Alteração de ')  + this.vetCampos[this.opcaoAtual].titulo
            this.infoNovo.label = this.tituloTelaCadastro(this.opcaoAtual)
            const _posicaoPai = this.vetCampos[this.opcaoAtual].posicaoPai;
            if (_posicaoPai != -1) {
                this.infoNovo.labelPai = this.tituloTelaCadastro(_posicaoPai)
            } else {
                this.infoNovo.labelPai = ''
                this.infoNovo.paiId = 0
            }
            this.infoNovo.mostraDialog = true
        },
        async buscaDadosIniciais() {
            await this.listaUnidadesSaude(this.cidadePadrao.id, this.unidadeSaudePadrao.id)
            await this.listaBairros(this.cidadePadrao.id)

            this.listas.tela = this.listas.unidadesSaude
            this.cmdBotao(this.enumCadastro.unidadeSaude)
            this.telaPronta = true
        },
        cmdBotao(value) {
            if (value != this.opcaoAtual) {
                this.itemSelecionadoGrid = 0
                this.opcaoAtual = value
                this.mensagemAguarde = ''

                switch (value) {
                    case this.enumCadastro.logradouro:
                        this.telaPronta = (this.infoSelecionadaComboPesquisa.bairro.id != 0)
                        this.listas.tela = this.listas.logradouros
                        break
                    case this.enumCadastro.microArea:
                        this.telaPronta = (this.infoSelecionadaComboPesquisa.unidadeSaude.id != 0)
                        this.listas.tela = this.listas.microAreas
                        break
                    case this.enumCadastro.unidadeSaude:
                        this.telaPronta = true
                        this.listas.tela = this.listas.unidadesSaude
                        break
                    case this.enumCadastro.bairro:
                        this.telaPronta = true
                        this.listas.tela = this.listas.bairros
                        break
                }
            }
        },
        async setaBairro(value) {
            this.mensagemAguarde = 'Buscando alguns dados! Aguarde...'
            this.infoSelecionadaComboPesquisa.bairro.nome = this.infoNovo.nomePai = value.nome
            this.infoSelecionadaComboPesquisa.bairro.id = this.infoNovo.paiId = value.id

            await this.listaLogradouros(this.infoNovo.paiId)
            this.telaPronta = (this.infoSelecionadaComboPesquisa.bairro.id != 0)
            this.listas.tela = this.listas.logradouros
        },
        async setaUnidadeSaude(value) {
            this.mensagemAguarde = 'Buscando alguns dados! Aguarde...'
            this.infoSelecionadaComboPesquisa.unidadeSaude.nome = this.infoNovo.nomePai = value.nome
            this.infoSelecionadaComboPesquisa.unidadeSaude.id = this.infoNovo.paiId = value.id

            await this.listaMicroAreas(this.infoNovo.paiId)
            this.telaPronta = (this.infoSelecionadaComboPesquisa.unidadeSaude.id != 0)
            this.listas.tela = this.listas.microAreas
        },
        async salva() {
            if (this.$refs.myForm.validate()) {
                switch (this.opcaoAtual) {
                    case this.enumCadastro.unidadeSaude: 
                        this.mensagemAguarde='Salvando a Unidade de Saúde. Aguarde...'
                        await mainService.salvaUnidadeSaude(this.cidadePadrao.id, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            this.mensagemAguarde=''
                            if ((resposta.status == 201) || (resposta.status == 200))  {
                                this.mensagemSucesso = 'Unidade de Saude salva com sucesso'
                                this.infoNovo.mostraDialog = false
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            this.mensagemAguarde = '';
                            this.mensagemErro=mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.bairro: 
                        this.mensagemAguarde='Salvando o Bairro. Aguarde...'
                        await mainService.salvaBairro(this.cidadePadrao.id, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            this.mensagemAguarde=''
                            if (resposta.status == 200) {
                                this.mensagemSucesso = 'Bairro salvo com sucesso'
                                this.infoNovo.mostraDialog = false
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            this.mensagemAguarde = '';
                            this.mensagemErro=mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.logradouro: 
                        this.mensagemAguarde='Salvando o Logradouro. Aguarde...'
                        await mainService.salvaLogradouro(this.infoSelecionadaComboPesquisa.bairro.id, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            this.mensagemAguarde=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.mensagemSucesso = 'Logradouro salvo com sucesso'
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            this.mensagemAguarde = '';
                            this.mensagemErro=mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.microArea: 
                        this.mensagemAguarde='Salvando a Micro Area. Aguarde...'
                        await mainService.salvaMicroArea(this.infoSelecionadaComboPesquisa.unidadeSaude.id, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            this.mensagemAguarde=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.mensagemSucesso = 'Micro área salva com sucesso'
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            this.mensagemAguarde = '';
                            this.mensagemErro=mainService.catchPadrao(response)
                        })
                        break;
                }   
                this.refresh()
            }
        },
        async refresh() {
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    await this.listaUnidadesSaude(this.cidadePadrao.id)
                    this.listas.tela = this.listas.unidadesSaude
                    break;
                case this.enumCadastro.bairro: 
                    await this.listaBairros(this.cidadePadrao.id)
                    this.listas.tela = this.listas.bairros
                    break;
                case this.enumCadastro.logradouro: 
                    await this.listaLogradouros(this.infoNovo.paiId)
                    this.listas.tela = this.listas.logradouros
                    break;
                case this.enumCadastro.microArea: 
                    await this.listaMicroAreas(this.infoNovo.paiId)
                    this.listas.tela = this.listas.microAreas
                    break;
            }
        },
        async exclui() {
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    this.mensagemAguarde='Apagando a Unidade de Saúde. Aguarde...'
                    await mainService.excluiUnidadeSaude(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemAguarde=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        this.mensagemAguarde = '';
                        this.mensagemErro=mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.bairro: 
                    this.mensagemAguarde='Apagando o Bairro. Aguarde...'
                    await mainService.excluiBairro(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemAguarde=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaBairros(this.cidadePadrao.id)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        this.mensagemAguarde = '';
                        this.mensagemErro=mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.logradouro: 
                    this.mensagemAguarde='Apagando o Logradouro. Aguarde...'
                    await mainService.excluiLogradouro(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemAguarde=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaLogradouros(this.infoNovo.paiId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        this.mensagemAguarde = '';
                        this.mensagemErro=mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.microArea: 
                    this.mensagemAguarde='Apagando a Micro Area. Aguarde...'
                    await mainService.excluiMicroArea(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemAguarde=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaMicroAreas(this.infoNovo.paiId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        this.mensagemAguarde = '';
                        this.mensagemErro=mainService.catchPadrao(response)
                    })
                    break;
            }
            this.refresh()
        }
    }
}
</script>
