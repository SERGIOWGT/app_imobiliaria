<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <TituloPagina titulo="CADASTRO DE VISITA" @cbAnterior="fimCadastro(true)" />
        <v-flex v-if="buscandoDados==false">
            <v-expansion-panels focused class="pt-0 mt-2" v-model="painel">
                <ExpansionVisitaCidadao :nome="infoCidadao.nome" :endereco="enderecoAtual" :nomeEstadoSaude="infoCidadao.nomeEstadoSaude" :nomeMicroArea="infoCidadao.nomeMicroArea"/>
                <br>
                <v-divider></v-divider>
                <ExpansionLista tipo="C" posTitulo="" :lista="infoCidadao.comorbidades" />
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header v-if="infoUltimaVisita.id == 0" hide-actions disabled class="blue-grey lighten-5 red--text text--lighten-1">Essa é a primeira visita do cidadão</v-expansion-panel-header >
                    <v-expansion-panel-header v-else class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui a última visita</v-expansion-panel-header >
                    <v-expansion-panel-content>
                        <v-card flat tile>
                            <v-card-text class="pt-4 px-0">
                                <v-text-field dense disabled label="Data da Visita" v-model="infoUltimaVisita.data" />
                                <v-text-field dense disabled label="Motivo" v-model="infoUltimaVisita.nomeTipoMotivo"/>
                                <v-text-field dense disabled hide-details label="Detalhamento do Motivo" v-model="infoUltimaVisita.nomeTipoMotivoAnalitico"/>
                                <v-row class="mt-0">
                                    <v-col cols="6"><v-text-field dense disabled label="Peso em KG" v-model="infoUltimaVisita.peso"/></v-col>
                                    <v-col cols="6"><v-text-field dense disabled label="Altura em cm" v-model="infoUltimaVisita.altura"/></v-col>
                                </v-row>
                                <v-text-field dense disabled label="Desfecho" v-model="infoUltimaVisita.nomeDesfecho"/>
                                <v-text-field dense disabled label="Tipo de Ação" v-model="infoUltimaVisita.nomeAcao"/>
                                <v-textarea dense auto-grow disabled label="Resumo" v-model="infoUltimaVisita.resumo" row-height="10" ></v-textarea>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Atualize aqui os Sintomas</v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-2">
                        <v-flex class="px-0 pt-0 pb-5" v-for="(item, index) in infoVisita.sintomas" :key="item.id" >
                        <v-row class="pa-1"> 
                            <v-col cols="9" class="pa-0"> 
                                <v-checkbox  class="py-0" v-model="infoVisita.sintomas[index].selecionado" :label="item.nome"></v-checkbox>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field  class="py-0"  @focus="$event.target.select()" 
                                    dense hide-details
                                    type="number"
                                    label="dias"
                                    v-model="infoVisita.sintomas[index].dias"
                                    v-show="infoVisita.sintomas[index].selecionado == true"
                                    min=0
                                ></v-text-field> 
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        </v-flex>
                        <p>.</p>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Faça aqui o registro da sua visita</v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-2">
                        <v-form ref="form3" v-model="podeSalvar">
                            <v-text-field class="pt-2"
                                dense required clearable
                                label="Data da Visita*"
                                v-model="infoVisita.data"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                            ></v-text-field>
                            <v-autocomplete class="pt-2" @input="setaTipoMotivo"
                                dense hide-no-data return-object
                                label="Motivo*"
                                v-model="infoVisita.tipoMotivo"
                                :items="tiposMotivoVisita"
                                item-value="id"
                                item-text="nome"
                                :rules="[regras.Basicas.obrigatorio()]"
                            ></v-autocomplete> 
                            <v-autocomplete class="pt-2"
                                dense hide-no-data return-object
                                :disabled="infoVisita.tipoMotivo.id === 0 || tiposMotivoVisita.length === 0 "
                                label="Detalhamento do Motivo*"
                                v-model="infoVisita.tipoMotivoAnalitico"
                                :items="tiposMotivoAnaliticoVisita"
                                item-value="id"
                                item-text="nome"
                                :rules="[regras.Basicas.obrigatorio()]"
                            ></v-autocomplete> 
                            <v-row class="mt-0">
                                <v-col cols="6"> 
                                    <v-text-field @focus="$event.target.select()" 
                                        dense 
                                        type="number"
                                        label="Peso em KG"
                                        v-model="infoVisita.peso"
                                        min=3
                                        max=450
                                    />
                                </v-col>
                                <v-col cols="6"> 
                                    <v-text-field @focus="$event.target.select()" 
                                        dense 
                                        type="number"
                                        label="Altura em cm"
                                        v-model="infoVisita.altura"
                                        min=0
                                        max=250
                                    />
                                </v-col>
                            </v-row>
                            <small>Desfecho da Visita</small>
                            <v-radio-group  class="py-0 my-0" required dense row hide-details v-model="infoVisita.tipoDesfechoVisitaId">
                                <v-col cols="4" class="py-1 my-1 pl-0"><v-radio value="1" label="Realizada"></v-radio></v-col>
                                <v-col cols="4" class="py-1 my-1"><v-radio value="2" label="Ausente"></v-radio></v-col>
                                <v-col cols="3" class="py-1 my-1"><v-radio value="3" label="Recusado"></v-radio></v-col>
                            </v-radio-group>
                            <v-autocomplete class="pt-2" :disabled="infoVisita.tipoDesfechoVisitaId > 1 "
                                dense hide-no-data required
                                label="Tipo de Ação*"
                                v-model="infoVisita.tipoAcao"
                                :items="tiposAcaoVisita"
                                item-value="id"
                                item-text="nome"
                                return-object
                                :rules="[regras.Basicas.obrigatorio()]"
                            ></v-autocomplete> 
                            <v-textarea
                                auto-grow counter clearable
                                clear-icon="mdi-close-circle"
                                label="Relatório da visita*"
                                v-model="infoVisita.resumo"
                                maxlength="500"
                                row-height="10"
                                :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(500)]"
                            ></v-textarea>
                            <small>*campo obrigatório</small>
                        </v-form>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-flex class="pt-5">
            <BottomBar 
                    :temBotaoAnterior="true"
                    :temBotaoProximo= "false"
                    :temBotaoCancela= "false"
                    :temBotaoFinaliza= "false"
                    :temBotaoSalva= "true"
                    :temBotaoVerifica= "false"
                    :temBotaoNovo= "false"
                    :podeVoltar="true"
                    :podeContinuar= "false"
                    :podeCancelar= "false"
                    :podeVerificar= "false"
                    :podeSalvar="podeSalvar"
                    @funcaoRetorno= 'cmdBotao'
            />
            </v-flex>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import BottomBar from '../components/StepBottomBar'
    import {preparaSintomas2Save, ordenaSintomas} from '../rotinasProjeto/rotinasProjeto'
    import {data2String, stringDataSql2Br, string2Data} from '../bibliotecas/formataValores'
    import TituloPagina from '../components/TituloPagina'
    import ExpansionVisitaCidadao from '../components/ExpansionVisitaCidadao.vue'
    import ExpansionLista from '../components/ExpansionListaCeS.vue'

    export default {
        components: {BottomBar, TituloPagina, ExpansionVisitaCidadao, ExpansionLista},
        props: {
          pacienteId: Number,
        },
        data() {
          return {
            regras: regrasCampos,

            enumTipoPesquisa: {
              porNome: 0,
              porLocalidade: 1,
            },
            areaPesquisaAberta: 0,
            formularioValido: false,
            podeSalvar: false,
            painel: 0,

            infoCidadao: {
                id: 0,
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                sintomas: [],
                comorbidades:[]
            },
            tiposMotivoVisita: [],
            tiposMotivoAnaliticoVisita: [],
            tiposAcaoVisita: [],

            infoVisita:  {
                id: 0,
                data: '',
                altura: 0,
                peso: 0,
                tipoMotivo: {
                    id: 0,
                    nome: ''
                },
                tipoMotivoAnalitico: {
                    id: 0,
                    nome: ''
                },
                tipoAcao: {
                    id: 0,
                    nome: ''
                },
                tipoDesfechoVisitaId: '1',
                resumo: '',
                sintomas:[]
            },
            infoUltimaVisita:  {
                id: 0,
                data: '',
                altura: 0,
                peso: 0,
                nomeTipoMotivo: '',
                nomeTipoMotivoAnalitico: '',
                nomeAcao: '',
                nomeDesfecho: 0,
                resumo: ''
            },

            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAguarde: '',

            buscandoDados: true
          }
        },
        async mounted() {
            this.infoVisita.data = data2String(new Date(), 'BR')
            this.buscandoDados = true
            await this.listaPaciente(this.pacienteId)
            this.buscandoDados = false
        },
        watch: {
            mensagemAguarde (val) {
                this.isLoading = (val == '') ? false : true
                this.$emit('cbMensagemAguarde', val)
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            }
        },
        computed: {
            enderecoAtual:  {
                get: function() { 
                    let _retorno = this.infoCidadao.nomeLogradouro + (this.infoCidadao.numeroEndereco ? ', ' + this.infoCidadao.numeroEndereco : '')
                    _retorno += (this.infoCidadao.complementoEndereco ? ' - ' + this.infoCidadao.complementoEndereco : '')
                    return _retorno
                },
                set: function() {
                }
            },
            tipoDataVisita() {
                if (this.infoUltimaVisita.id == 0)
                    return ''
                    
                const str = stringDataSql2Br(this.infoUltimaVisita.data)
                return `${this.infoUltimaVisita.nomeTipoMotivo} em ${str}`
            },
        },       
        methods: {
            cmdBotao: function (value) {
                if (value == 'VO') {
                    this.fimCadastro(true)
                } else 
                    this.salvaVisita()
            },
            async setaTipoMotivo(value) {
                this.infoVisita.tipoMotivo.id = value.id;
                this.infoVisita.tipoMotivoAnalitico.id = 0;
                this.infoVisita.tipoMotivoAnalitico.nome = ''

                this.mensagemAguarde =  'Aguarde... Buscando Detalhamento do Motivo'
                await mainService.listaTipoMotivoAnaliticoVisita(this.infoVisita.tipoMotivo.id)
                .then(resp => {
                    this.mensagemAguarde =  ''
                    if (resp.status == 200) {
                        this.tiposMotivoAnaliticoVisita = resp.data;
                    } else {
                        this.mensagemErro =  resp.message
                    }
                })
                .catch(err => {this.mensagemErro =  mainService.catchPadrao(err)})
            },

            async listaPaciente(pacienteId) {
                let erroBusca = false

                this.mensagemAguarde = 'Buscando Motivos da Visita! Aguarde...'
                await mainService.listaTipoMotivoVisita()
                .then (resp => {this.tiposMotivoVisita = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                this.mensagemAguarde = 'Buscando Tipo de Acão Visita! Aguarde...'
                await mainService.listaTipoAcaoVisita()
                .then (resp => {this.tiposAcaoVisita = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                this.mensagemAguarde = 'Buscando informações do cidadão. Aguarde...'
                await mainService.listaPaciente(pacienteId)
                .then((_paciente) => {
                    this.mensagemAguarde = ''
                    if (_paciente.status == 200) {
                        this.infoCidadao.nome = _paciente.data.nome
                        this.infoCidadao.nomeLogradouro = _paciente.data.nomeLogradouro
                        this.infoCidadao.numeroEndereco = _paciente.data.nomeEndereco
                        this.infoCidadao.complementoEndereco = _paciente.data.complementoEndereco
                        this.infoCidadao.nomeMicroArea = _paciente.data.nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = _paciente.data.nomeEstadoSaude
                    }
                    else {
                        erroBusca = true
                        this.mensagemErro=_paciente.message  
                    }
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })

                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }

                this.mensagemAguarde = 'Buscando comorbidades do cidadão. Aguarde...'
                await mainService.listaPacienteComorbidades(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoCidadao.comorbidades = resp.status == 200 ? resp.data : []
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }

                this.mensagemAguarde = 'Buscando sintomas do cidadão. Aguarde...'
                await mainService.listaPacienteSintomas(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoCidadao.sintomas = resp.status == 200 ? resp.data : []
                    
                    const _todosSintomas = this.$store.getters.dbSintomas
                    this.infoVisita.sintomas = ordenaSintomas(_todosSintomas, this.infoCidadao.sintomas)
                })
                .catch((err) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(err)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                
                this.mensagemAguarde = 'Buscando ultima visita. Aguarde...'
                await mainService.listaPacienteUltimaVisita(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    if (resp.status == 200)  {
                        const data = resp.data
                        this.infoUltimaVisita.id = data.id
                        this.infoUltimaVisita.data = stringDataSql2Br(data.dataVisita)
                        this.infoUltimaVisita.nomeTipoMotivo = data.nomeTipoMotivoVisita
                        this.infoUltimaVisita.resumo = data.relatorioVisita
                        this.infoUltimaVisita.altura = data.altura
                        this.infoUltimaVisita.peso= data.peso
                        this.infoUltimaVisita.nomeTipoMotivoAnalitico = data.nomeTipoMotivoVisitaAnalitico
                        this.infoUltimaVisita.nomeAcao = data.nomeAcaoVisita
                        this.infoUltimaVisita.nomeDesfecho= data.nomeDesfechoVisita
                    } else {
                        this.infoUltimaVisita.data = ''
                        this.infoUltimaVisita.id = 0
                        this.infoUltimaVisita.nomeTipoMotivo = ''
                        this.infoUltimaVisita.resumo = ''
                        this.infoUltimaVisita.altura = ''
                        this.infoUltimaVisita.peso= ''
                        this.infoUltimaVisita.nomeTipoMotivoAnalitico = ''
                        this.infoUltimaVisita.nomeTipoAcao = ''
                        this.infoUltimaVisita.nomeDesfecho= ''
                    }
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                this.painel = 4
            },
            async salvaVisita() {
                this.mensagemAguarde = 'Salvando a visita. Aguarde...'

                const strDataVisita = this.infoVisita.data.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1')  // eslint-disable-line
                const dataVisita = string2Data(this.infoVisita.data, 'dd/mm/yyyy','/');
                const sintomas = preparaSintomas2Save(dataVisita, this.infoVisita.sintomas);

                let altura = parseFloat(this.infoVisita.altura);
                if (isNaN(altura))
                    altura = 0;

                let peso = parseFloat(this.infoVisita.peso);
                if (isNaN(peso))
                    peso = 0;
                                
                const params = {
                    pacienteId: this.pacienteId,
                    dataVisita: strDataVisita,
                    tipoMotivoVisitaAnaliticoId: this.infoVisita.tipoMotivoAnalitico.id,
                    altura: altura,
                    peso: peso,
                    tipoDesfechoVisitaId: this.infoVisita.tipoDesfechoVisitaId,
                    tipoAcaoVisitaId: this.infoVisita.tipoAcao.id,
                    relatorioVisita: this.infoVisita.resumo,
                    tipoSintomas: sintomas
                }
                await mainService.salvaVisita(this.infoVisita.id, params)
                .then(resp => {
                    if (resp.status != 200) {
                        this.mensagemErro = resp.message
                    } else {
                        this.mensagemAguarde = ''
                        this.fimCadastro(false)
                    }
                })
                .catch(err => {this.mensagemErro = mainService.catchPadrao(err); return;});
                this.mensagemAguarde = ''
            },
            fimCadastro (volta) {
                this.$emit('cbFimCadastro', volta)
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
