<template>
  <v-container  class="pa-1 mt-0"> 
    <v-container fluid style="height: 100vmax;" class="pa-0">
      <TituloPagina :titulo="tituloTela" @cbAnterior="fimCadastro(true)" />
      <v-flex  v-show="buscandoDados==false">
        <v-flex class="py-0 my-0 pt-0" v-if="etapaCadastro == enumEtapaCadastro.dadosCidadao">
          <v-expansion-panels focusable class="pt-0 mt-0" v-model="areaPesquisaAberta">
            <v-expansion-panel :disabled="this.infoPesquisa.listasCarregadas == false" >
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2" >
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.dadosCadastrais)">{{iconePainel(enumPaineis.dadosCadastrais)}}</v-icon><span class="ml-2 "> <b>{{textoPanel}} aqui os dados cadastrais</b></span>
                  </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2" >
                  <v-form ref="form1" v-model="painelValido[enumPaineis.dadosCadastrais]">
                      <v-text-field 
                          dense required clearable
                          label="Nome Completo*"
                          v-model="infoPaciente.nome"
                          :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(100)]"
                          counter
                          maxlength="100"
                      ></v-text-field>
                      <v-text-field 
                          dense required clearable
                          label="Nome da Mãe*"
                          v-model="infoPaciente.nomeMae"
                          :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(100)]"
                          counter
                          maxlength="100"
                      ></v-text-field>
                      <v-text-field 
                          dense required clearable
                          label="Data de Nascimento*"
                          v-model="infoPaciente.dataNascimento"
                          v-mask="'##/##/####'"
                          :rules="[regras.Data.valida(true)]"
                      ></v-text-field>
                      <v-text-field 
                          dense required clearable
                          label="CPF*"
                          v-model="infoPaciente.cpf"
                          v-mask="'###.###.###-##'" 
                          :rules="[regras.Cpf.valido(true)]"
                      ></v-text-field>
                      <v-text-field 
                          dense required clearable
                          label="RG"
                          v-model="infoPaciente.RG"
                          counter
                          maxlength="30"
                      ></v-text-field>
                      <small>Sexo*</small>
                      <v-radio-group  class="py-0 my-0" dense v-model="infoPaciente.sexo" row :rules="[regras.Basicas.obrigatorio()]">
                          <v-col cols="4" class="py-1 my-1 pl-0"><v-radio value="F" label="Femin."></v-radio></v-col>
                          <v-col cols="4" class="py-1 my-1"><v-radio value="M" label="Masc."></v-radio></v-col>
                          <v-col cols="3" class="py-1 my-1"><v-radio value="O" label="Outros"></v-radio></v-col>
                      </v-radio-group>
                      <small>*campo obrigatório</small>
                  </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.dadosContato)">{{iconePainel(enumPaineis.dadosContato)}}</v-icon><span class="ml-2 "> <b>{{textoPanel}} aqui os dados para contato</b></span>
                  </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                  <v-form ref="form2" v-model="painelValido[enumPaineis.dadosContato]">
                  <v-text-field dense required clearable
                      label="Email"
                      v-model="infoPaciente.eMail"
                      :rules="[regras.Email.valido(false)]"
                      counter
                      maxlength="100"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                      dense required clearable
                      label="Celular"
                      v-model="infoPaciente.celular"
                      :rules="[regras.Celular.valido(false)]"
                      maxlength="13"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                      dense required clearable
                      label="Celular 2"
                      v-model="infoPaciente.celular2"
                      :rules="[regras.Celular.valido(false)]"
                      maxlength="13"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                      dense required clearable
                      label="Telefone Contato"
                      v-model="infoPaciente.telefoneContato"
                      :rules="[regras.Celular.valido(false)]"
                      maxlength="13"
                    ></v-text-field>
                  </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2" >
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.endereco)">{{iconePainel(enumPaineis.endereco)}}</v-icon><span class="ml-2 "> <b>{{textoPanel}} aqui o endereço</b></span>
                  </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                <v-form ref="form3" v-model="painelValido[enumPaineis.endereco]">
                  <v-autocomplete  @input="setaBairro"
                    dense hide-no-data
                    label="Bairro*"
                    v-model="infoPaciente.bairro"
                    :items="infoPesquisa.allBairros"
                    item-value="id"
                    item-text="nome"
                    return-object
                    :rules="[required]"
                  ></v-autocomplete> 
                  <v-autocomplete
                    dense hide-no-data
                    label="Nome da rua*"
                    :disabled="infoPaciente.bairro.id === 0 || infoPesquisa.allBairros.length === 0 "
                    v-model="infoPaciente.logradouro"
                    :items="infoPesquisa.logradouros"
                    item-value="id"
                    item-text="nome"
                    return-object
                    :rules="[required]"
                  ></v-autocomplete>
                  <v-text-field class="mt-3" dense clearable counter
                    label="Número do sua residência"
                    v-model="infoPaciente.numeroEndereco"
                    maxlength="10"
                  ></v-text-field>
                  <v-text-field class="mt-1" dense clearable counter
                    label="Complemento"
                    v-model="infoPaciente.complemento"
                    maxlength="50"
                  ></v-text-field>
                  <small class="pt-2">*campo obrigatório</small>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.unidadeSaude)">{{iconePainel(enumPaineis.unidadeSaude)}}</v-icon><span class="ml-2 "> <b>{{textoPanel}} aqui a Unidade de Saúde</b></span>
                  </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                  <v-form ref="form4" v-model="painelValido[enumPaineis.unidadeSaude]">
                      <v-text-field 
                          dense persistent-hint clearable
                          label="Número do Sus*"
                          v-mask="'### #### #### ####'"
                          v-model="infoPaciente.cartaoSUS"
                          :rules="[regras.NumeroSus.valido(true)]"
                          maxlength="18"
                      ></v-text-field>
                      <v-autocomplete @input="setaUnidadeSaude"
                          dense hide-no-data
                          label="Unidade de Saúde*"
                          :items="infoPesquisa.allUnidadesSaude"
                          v-model="infoPaciente.unidadeSaude"
                          item-value="id"
                          item-text="nome"
                          return-object
                          :rules="[required]"
                      ></v-autocomplete> 
                      <v-autocomplete 
                          dense hide-no-data
                          label="Micro Área*"
                          :disabled="infoPaciente.unidadeSaude.id === 0 || infoPesquisa.allUnidadesSaude.length === 0 "
                          v-model="infoPaciente.microArea"
                          :items="infoPesquisa.microAreas"
                          item-value="id"
                          item-text="nome"
                          return-object
                          :rules="[required]"
                      ></v-autocomplete>
                      <small>*campo obrigatório</small>
                  </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2"> 
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.comorbidades)">{{iconePainel(enumPaineis.comorbidades)}}</v-icon><span class="ml-2 "> <b>Comorbidades</b></span>
                  </div>
              </v-expansion-panel-header >
              <v-expansion-panel-content class="pt-2">
                  <v-flex class= "justify-center pa-0 ma-0" v-for="(item, index) in infoPesquisa.comorbidadesTela" :key="item.id" >
                    <v-checkbox  class="py-0" v-model="infoPesquisa.comorbidadesTela[index].selecionado" :label="item.nome"></v-checkbox>
                    <v-divider></v-divider>
                    <!-- 
                      <v-switch class="py-1 ma-0"  v-model="infoPesquisa.comorbidadesTela[index].selecionado"> 
                              <template v-slot:label  >
                              <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                              </template>
                      </v-switch> -->
                  </v-flex>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">
                  <div class="d-flex align-center">
                      <v-icon :color="corIconePainel(enumPaineis.sintomas)">{{iconePainel(enumPaineis.sintomas)}}</v-icon><span class="ml-2 "> <b>Sintomas</b></span>
                  </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                  <v-flex class="px-0 pt-0 pb-5" v-for="(item, index) in infoPesquisa.sintomasTela" :key="item.id" >
                    <v-row class="pa-1"> 
                      <v-col cols="9" class="pa-0"> 
                          <v-checkbox  class="py-0" v-model="infoPesquisa.sintomasTela[index].selecionado" :label="item.nome"></v-checkbox>
  <!--                               <v-switch class=""  v-model="infoPesquisa.sintomasTela[index].selecionado" >
                              <template v-slot:label>
                              <span v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                              </template>
                          </v-switch> -->
                      </v-col>
                      <v-col cols="3">
                          <v-text-field  class="py-0"  @focus="$event.target.select()" 
                              dense hide-details
                              type="number"
                              label="dias"
                              v-model="infoPesquisa.sintomasTela[index].dias"
                              v-show="infoPesquisa.sintomasTela[index].selecionado == true"
                              min=0
                          ></v-text-field> 
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                  </v-flex>
                  <p>.</p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-flex>
      </v-flex>  
      <!-- <v-flex v-if="etapaCadastro == enumEtapaCadastro.proximoCidadao" >
        <p>
          Os dados do cidadão foram salvos com sucesso!!!! 
        </p>
        <p>
          Caso ainda tenha mais alguém para cadastrar, clique no <span class="nota_botao">botão Novo Cidadão</span> logo abaixo. 
        </p>
      </v-flex> -->
    </v-container>
    <BottomBar 
        :temBotaoAnterior="infoBotoes.temBotaoAnterior"
        :temBotaoProximo= "infoBotoes.temBotaoProximo"
        :temBotaoCancela= "infoBotoes.temBotaoCancela"
        :temBotaoFinaliza= "infoBotoes.temBotaoFinaliza"
        :temBotaoSalva= "infoBotoes.temBotaoSalva"
        :temBotaoVerifica= "infoBotoes.temBotaoVerifica"
        :temBotaoNovo= "infoBotoes.temBotaoNovo"
        :podeVoltar="infoBotoes.podeVoltar"
        :podeContinuar= "false"
        :podeCancelar= "infoBotoes.podeCancelar"
        :podeVerificar= "false"
        :podeSalvar= "podeSalvar"
        @funcaoRetorno= 'cbClickBotao'
    />
  </v-container>
</template>
<script>
    import BottomBar from '../components/StepBottomBar'
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import {formataCelular, formataCpf} from '../bibliotecas/formataValores'
    import entradaText from '../bibliotecas/entradaText'
    import {ordenaComorbidades, ordenaSintomas, hoje, preparaSintomas2Save } from '../rotinasProjeto/rotinasProjeto'
    import TituloPagina from '../components/TituloPagina'

    export default {
        name: 'SuspeitaCovid',
        components: {BottomBar, TituloPagina},
        props: {
          pacienteId: Number
        },
        data() {
          return {

            // funcoes
            entradaCelular: entradaText.celular,
            regras: regrasCampos,

            // dados
            enumEtapaCadastro: {
              dadosCidadao: 0,
              proximoCidadao: 1
            },
            etapaCadastro: 0,
            enumPaineis: {
                dadosCadastrais: 0,
                dadosContato: 1,
                endereco: 2,
                unidadeSaude: 3,
                comorbidades: 4,
                sintomas: 5
            },
            painelValido: [false, false, false, false, false, false],
            cidadePadrao: null,
            unidadeSaudeId: 0,

            infoPaciente: {
              id: 0,
              nome: '',
              nomeMae: '',
              cpf: '',
              RG: '',
              dataNascimento: '',
              cartaoSUS: '',              
              eMail: '',
              celular: '',
              celular2: '',
              telefoneContato: '',
              sexo: '',
              numeroEndereco: null,
              semNumeroEndereco: null,
              complemento: null,
              semComplemento: null,
              assintomatico: true,
              unidadeSaude: {
                id: 0,
                nome: ''
              },
              bairro: {
                id: 0,
                nome: ''
              },
              logradouro: {
                id: 0,
                nome: ''
              },
              microArea: {
                id: 0,
                nome: ''
              },
              sintomas: [],
              comorbidades: []
            },
            salvandoDadosPaciente: false,
          
            infoPesquisa: {
              listasCarregadas: false,
              allBairros: [],
              allUnidadesSaude: [],
              microAreas: [],
              logradouros: [],

              sintomasTela: [],
              comorbidadesTela: []
            },       

            infoBotoes: {
              carregandoDados: false,

              temBotaoAnterior: false,
              temBotaoProximo: false,
              temBotaoCancela: false,
              temBotaoFinaliza: false,
              temBotaoSalva: false,
              temBotaoVerifica: false,
              temBotaoNovo: false,

              podeVoltar: false,
              podeCancelar: false,
            },

            // dados
            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            buscandoDados: true,
            areaPesquisaAberta: null
          }        
        },
        created() {
          this.cidadePadrao = this.$store.getters.cidadePadrao
          this.unidadeSaudePadrao = this.$store.getters.unidadeSaudePadrao
          this.infoPesquisa.listasCarregadas = false
        },
        mounted() {
          this.infoPaciente.id = this.pacienteId = (this.pacienteId == null) ? 0 : this.pacienteId
          if (this.infoPesquisa.listasCarregadas == false) {
            this.buscaDadosIniciais(this.pacienteId)
          } 
        },
        watch: {
            mensagemAguarde (val) {
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
          iconePainel() {
            return  pos => (pos >= this.enumPaineis.comorbidades) ? 'mdi-alert-outline' : this.painelValido[pos] ? 'mdi-check' :  'mdi-alert-circle-outline'
          },
          corIconePainel() {
            return  pos => (pos >= this.enumPaineis.comorbidades) ? 'orange darken-2' : this.painelValido[pos] ? 'teal' : 'red'
          },
          podeVoltar() {
            return true
          },
          podeSalvar() {
            return this.painelValido[0] && this.painelValido[1] && this.painelValido[2] && this.painelValido[3];
          },
          tituloTela() {
            return (this.infoPaciente.id == 0) ? 'NOVO CIDADÃO' : 'ALTERAÇÃO DE DADOS DO CIDADÃO'
          },
          textoPanel() {
            return (this.infoPaciente.id == 0) ? 'Informe' : 'Altere'
          },
        },
        methods: {
          async buscaDadosIniciais(pacienteId) {
            this.buscandoDados = true
            this.limpaDadosPaciente()

            this.mensagemAguarde =  'Buscando unidades de saude! Aguarde...'
            await mainService.listaUnidadesSaude(this.unidadeSaudePadrao.id, this.cidadePadrao.id, '')
            .then (resp => {this.infoPesquisa.allUnidadesSaude = resp.status == 200 ? resp.data : []})
            .catch (err => {this.mensagemErro =  mainService.catchPadrao(err); });

            this.mensagemAguarde =  'Buscando bairros! Aguarde...'
            await mainService.listaBairros(this.cidadePadrao.id)
            .then (resp => {this.infoPesquisa.allBairros = resp.status == 200 ? resp.data : []})
            .catch (err => {this.mensagemErro =  mainService.catchPadrao(err); });

            const todosSintomas = this.$store.getters.dbSintomas
            const todasComorbidades = this.$store.getters.dbComorbidades
            if (pacienteId != 0) {
              let erro = false

              this.mensagemAguarde =  'Buscando dados do paciente! Aguarde...'
              await mainService.listaPaciente(pacienteId)
              .then(resp => {
                if (resp.status == 200) {
                  const dadosPaciente = resp.data
                  this.setaInfoPaciente (dadosPaciente)
                }
              })
              .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
  
              if (!erro) {
                this.mensagemAguarde =  'Buscando as comorbidades do Paciente! Aguarde...'
                await mainService.listaPacienteComorbidades(pacienteId)
                .then (resp => {
                  this.infoPaciente.comorbidades = resp.status == 200 ? resp.data : []
                  this.infoPesquisa.comorbidadesTela = ordenaComorbidades(todasComorbidades, this.infoPaciente.comorbidades)
                })
                .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
              }

              if (!erro) {
                this.mensagemAguarde =  'Buscando os sintomas do Paciente! Aguarde...'
                await mainService.listaPacienteSintomas(pacienteId)
                .then (resp => {
                  this.infoPaciente.sintomas = resp.status == 200 ? resp.data : []
                  this.infoPesquisa.sintomasTela = ordenaSintomas(todosSintomas, this.infoPaciente.sintomas)
                })
                .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
              }

              if (!erro) {
                this.mensagemAguarde =  'Buscando logradouros! Aguarde...'
                await mainService.listaLogradouros(this.infoPaciente.bairro.id)
                .then (resp => {this.infoPesquisa.logradouros = resp.status == 200 ? resp.data : []})
                .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
              }

              if (!erro) {
                this.mensagemAguarde =  'Buscando logradouros! Aguarde...'
                await mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id)
                .then (resp => {
                  this.infoPesquisa.microAreas = resp.status == 200 ? resp.data : []
                  })
                .catch(err => {this.mensagemErro =  mainService.catchPadrao(err); });

                for (var i = 0; i <= 4; ++i) {
                  this.setDelay(i);
                }
                this.infoBotoes.temBotaoSalva = true
              }
              else {
                this.infoBotoes.temBotaoSalva = false
              }

            } else {
              this.infoPesquisa.comorbidadesTela = ordenaComorbidades(todasComorbidades, null)
              this.infoPesquisa.sintomasTela = ordenaSintomas(todosSintomas, null)
              this.infoBotoes.temBotaoSalva = true
            }

            this.buscandoDados = false
            this.infoPesquisa.listasCarregadas = true
            this.mensagemAguarde =  ''
            this.vaPara(this.etapaCadastro)
          },
          cbClickBotao(val) {
            switch (val) {
              case 'VO':
                this.fimCadastro(true)
                break;
              case 'SV':
                if (this.etapaCadastro == this.enumEtapaCadastro.dadosCidadao )
                  this.salva()
                else
                  this.salvaOutros()
                break;
              case 'FM':
                this.fimCadastro(true)
                break;
              case 'NP':
                this.novoCidadao()
                break;
            }
          },
          fimCadastro (volta) {
            this.$emit('cbFimCadastro', volta)
          },
          limpaDadosPaciente() {
            this.infoPaciente.nome = ''
            this.infoPaciente.RG = ''
            this.infoPaciente.cartaoSUS= ''
            this.infoPaciente.eMail= ''
            this.infoPaciente.celular= ''
            this.infoPaciente.celular2= ''
            this.infoPaciente.telefoneContato= ''
            this.infoPaciente.sexo= ''
            this.infoPaciente.semComorbidade= false
            this.infoPaciente.assintomatico= false
            this.infoPaciente.sintomas= []
            this.infoPaciente.comorbidades= []
            this.infoPaciente.unidadeSaude.id = 0
            this.infoPaciente.unidadeSaude.nome = ''
            this.infoPaciente.microArea.id = 0
            this.infoPaciente.microArea.nome = ''
            this.infoPaciente.bairro.id = 0
            this.infoPaciente.bairro.nome = ''
            this.infoPaciente.logradouro.id = 0
            this.infoPaciente.bairro.nome = ''
            this.infoPaciente.numeroEndereco = ''
            this.infoPaciente.semNumeroEndereco = false
            this.infoPaciente.complemento = ''
            this.infoPaciente.semComplemento = false
          },
          novoCidadao() {
            this.limpaDadosPaciente()
            this.infoPesquisa.comorbidadesTela = ordenaComorbidades(this.$store.getters.dbSintomas, null)
            this.infoPesquisa.sintomasTela = ordenaSintomas(this.$store.getters.dbComorbidades, null)
          },
          required(value) {
            if (value instanceof Array && value.length == 0) 
              return 'Required.'

            if (('id' in value) == false)
              return 'Required.'

            if (value.id == 0) 
              return 'Required.'

            return !!value || 'Required.';
          },
          liberaSemNumero() {
            this.formularioValido = this.infoPaciente.semNumeroEndereco === true
          },
          liberaSemComplemento() {
            this.formularioValido = this.infoPaciente.semComplemento === true
          },
          async salva() {
            this.mensagemAguarde =  'Salvando dados do paciente. Aguarde...'
            this.mensagemErro = ''

            let erro = false;
            await mainService.salvaPaciente(this.infoPaciente)
            .then(resp => {
              this.mensagemAguarde =  ''
              if ((resp.status == 200) || (resp.status == 201)) {
                if (this.infoPaciente.id == 0) {
                  this.infoPaciente.id = resp.data.id
                }
              } else {
                  this.mensagemErro =  resp.message
                  erro = true
              } 
            })
            .catch(err => {
              this.mensagemAguarde =  ''
              erro = true
              this.mensagemErro =  mainService.catchPadrao(err)
            });

            if (!erro) {
              this.mensagemAguarde =  'Salvando as Comorbidades. Aguarde...'
              let _comorbidades = []
              for (let i = 0;  i < this.infoPesquisa.comorbidadesTela.length; i++) {
                if (this.infoPesquisa.comorbidadesTela[i].selecionado) {
                  const item = {
                    id: this.infoPesquisa.comorbidadesTela[i].id
                  }
                  _comorbidades.push (item)
                }
              }
              await mainService.salvaPacienteComorbidades(this.infoPaciente.id, _comorbidades)
              .then(resp => {
                this.mensagemAguarde =  ''
                if (resp.status != 200) {
                  this.mensagemErro =  resp.message
                  erro = true
                }
              })
              .catch(err => {
                this.mensagemAguarde =  ''
                  erro = true
                  this.mensagemErro =  mainService.catchPadrao(err)}
              );
            }

            if (!erro) {
              this.mensagemAguarde =  'Salvando os Sintomas. Aguarde...'

              const _dataHoje = hoje()
              const _sintomas = preparaSintomas2Save(_dataHoje, this.infoPesquisa.sintomasTela)
              await mainService.salvaPacienteSintomas(this.infoPaciente.id, _sintomas)
              .then(resp => {
                this.mensagemAguarde =  ''
                if (resp.status != 200) {
                  erro = true
                  this.mensagemErro =  resp.message
                }
              })
              .catch(err => {
                  this.mensagemAguarde =  ''
                  erro = true
                  this.mensagemErro =  mainService.catchPadrao(err)}
              );
            }
            
            if (!erro) {
              //this.etapaCadastro = this.enumEtapaCadastro.proximoCidadao
              //this.vaPara(this.etapaCadastro)
              this.mensagemAguarde =  ''
              this.fimCadastro(false);
            } 
          },
          async setaBairro(value) {
            this.infoPaciente.bairro.id = value.id;
            this.infoPaciente.logradouro.id = 0;
            this.infoPaciente.logradouro.nome = ''

            this.mensagemAguarde =  'Aguarde... Buscando Logradouros'
            await mainService.listaLogradouros(this.infoPaciente.bairro.id)
            .then(resp => {
              this.mensagemAguarde =  ''
              if (resp.status == 200) {
                this.infoPesquisa.logradouros = resp.data;
              } else {
                this.mensagemErro =  resp.message
              }
            })
            .catch(err => {this.mensagemErro =  mainService.catchPadrao(err)})
          },
          setaInfoPaciente (dadosPaciente) {
            this.infoPaciente.id = dadosPaciente.id
            this.infoPaciente.RG = dadosPaciente.rg
            this.infoPaciente.nome = dadosPaciente.nome
            this.infoPaciente.nomeMae = dadosPaciente.nomeMae
            this.infoPaciente.cartaoSUS = dadosPaciente.cartaoSUS
            this.infoPaciente.eMail = dadosPaciente.eMail 

            this.infoPaciente.unidadeSaude.id = dadosPaciente.unidadeSaudeId

            this.infoPaciente.semNumeroEndereco = (dadosPaciente.numeroEndereco == '') 
            this.infoPaciente.semComplemento = (dadosPaciente.complementoEndereco == '')
            this.infoPaciente.numeroEndereco = dadosPaciente.numeroEndereco
            this.infoPaciente.complemento = dadosPaciente.complementoEndereco
            this.infoPaciente.sexo = dadosPaciente.sexo

            this.infoPaciente.nomeunidadeSaude = ''

            this.infoPaciente.bairro.id = dadosPaciente.bairroId
            this.infoPaciente.bairro.nome = dadosPaciente.nomeBairro

            this.infoPaciente.logradouro.id = dadosPaciente.logradouroId
            this.infoPaciente.logradouro.nome = dadosPaciente.nomeLogradouro

            this.infoPaciente.microArea.id = dadosPaciente.microAreaId
            this.infoPaciente.microArea.nome = dadosPaciente.nomeMicroArea

            const _dataNascimento = dadosPaciente.dataNascimento.substring(0, 10)
            this.infoPaciente.dataNascimento = _dataNascimento.substring(8, 10) + '/' + _dataNascimento.substring(5, 7) + '/' + _dataNascimento.substring(0, 4)

            this.infoPaciente.telefoneContato = (dadosPaciente.telefoneContato) ? formataCelular(dadosPaciente.telefoneContato) : ''
            this.infoPaciente.celular = (dadosPaciente.celular) ? formataCelular(dadosPaciente.celular) : '' 
            this.infoPaciente.celular2 = (dadosPaciente.celular2) ? formataCelular(dadosPaciente.celular2) : '' 
              
            this.infoPaciente.cpf = formataCpf(dadosPaciente.cpf)

            // Guarda a unidade de saude selecionadea
            this.infoPesquisa.allUnidadesSaude.forEach ((elemento) => {
              if (elemento.id == this.infoPaciente.unidadeSaude.id)
                this.infoPaciente.unidadeSaude.nome = elemento.nome
              }
            )
          },
          setaLogradouro(value) {
            this.infoPaciente.logradouro.id = value.id;
          },
          async setaUnidadeSaude(value) {
            this.infoPaciente.unidadeSaude.id = value.id;
            this.infoPaciente.microArea.id = 0;
            this.infoPaciente.microArea.nome = ''

            this.mensagemAguarde =  'Aguarde... Buscando Micro Áreas'
            await mainService.listaMicroAreas(this.infoPaciente.unidadeSaude.id)
            .then(resp => {
              this.mensagemAguarde =  ''
              if (resp.status == 200) {
                this.infoPesquisa.microAreas = resp.data;
              } else {
                this.mensagemErro =  resp.message
              }            
            })
            .catch(err => {this.mensagemErro =  mainService.catchPadrao(err)})
          },
          setDelay(i) {
              setTimeout(()=> {
                  this.areaPesquisaAberta = (i == 4) ? null : i
              }, 200)
          },
          vaPara(posicaoCadastro) {
            this.infoBotoes.temBotaoAnterior = false
            this.infoBotoes.temBotaoProximo = false
            this.infoBotoes.temBotaoCancela = false
            this.infoBotoes.temBotaoFinaliza = false
            //this.infoBotoes.temBotaoSalva = false
            this.infoBotoes.temBotaoVerifica = false
            this.infoBotoes.temBotaoNovo = false

            switch (posicaoCadastro) {
              case this.enumEtapaCadastro.dadosCidadao:
                this.infoBotoes.podeVoltar = true
                this.infoBotoes.temBotaoAnterior = true
                //this.infoBotoes.temBotaoSalva = true
                break

              case this.enumEtapaCadastro.proximoCidadao:
                this.infoBotoes.temBotaoFinaliza = this.infoBotoes.temBotaoNovo = true
                break

              case this.enumEtapaCadastro.outros:
                this.infoBotoes.podeVoltar = false
                this.infoBotoes.temBotaoAnterior = true
                this.infoBotoes.temBotaoSalva = true
                break
            } 
            this.etapaCadastro = posicaoCadastro;
          }
        }
    }
</script>
<style scoped>
  .paragrafo1 {
    padding: 0px;
    margin: 0px;
  }
  .input__label {
    color: blue;
  }
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .nota_botao {
    color:green;
    font-weight: bold;
  }
  .obs_campo {
    margin-top: 20px;
    color:green;
    font-size: 0.6rem;
    font-weight: bold;
  }
  
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-text-field input {
      font-size: 5.2em;
    }
    .v-combobox-field {
     font-size: 2.2em;
    }
  }
  .right-input input {
    text-align: right
  }
  .v-text-field {
    padding-top: 4px;
    margin-top: 8px
  }
  .v-autocomplete {
    padding-top: 4px;
    margin-top: 8px
  }
  .v-expansion-panel__header {
    background-color: aqua;
  }

  

</style>
