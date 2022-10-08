<template>
  <v-container  class="pa-1 mt-0"> 
    <v-container fluid style="height: 100vmax;" class="pa-0">
      <TituloPagina titulo="CONSULTA DE DADOS DO CIDADÃO" @cbAnterior="fimCadastro()" />
      <v-flex  v-show="buscandoDados==false">
        <v-flex class="py-0 my-0 pt-0 px-1" v-if="etapaCadastro == enumEtapaCadastro.dadosCidadao">
          <v-expansion-panels focusable class="pt-0 mt-0" v-model="areaPesquisaAberta">
            <v-expansion-panel>
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2" >Dados cadastrais</v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2" >
                <v-text-field dense disabled label="Nome Completo" v-model="infoPaciente.nome" />
                <v-text-field dense disabled label="Nome da Mãe" v-model="infoPaciente.nomeMae" />
                <v-text-field dense disabled label="Data de Nascimento" v-model="infoPaciente.dataNascimento" />
                <v-text-field dense disabled label="CPF" v-model="infoPaciente.cpf" v-mask="'###.###.###-##'" />
                <v-text-field dense disabled label="RG" v-model="infoPaciente.RG"/>
                <v-text-field dense disabled label="Sexo" v-model="infoPaciente.sexo"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui os dados para contato</v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                <v-text-field dense disabled label="Email" v-model="infoPaciente.eMail" />
                <v-text-field dense disabled label="Celular" v-model="infoPaciente.celular" />
                <v-text-field dense disabled label="Celular 2" v-model="infoPaciente.celular2" />
                <v-text-field dense disabled label="Telefone Contato" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui o endereço</v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                <v-text-field dense disabled label="Bairro" v-model="infoPaciente.nomeBairro" />
                <v-text-field dense disabled label="Nome da rua" v-model="infoPaciente.nomeLogradouro" />
                <v-text-field dense disabled label="Número do sua residência" v-model="infoPaciente.numeroEndereco"/>
                <v-text-field dense disabled label="Complemento" v-model="infoPaciente.complemento" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
              <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui a Unidade de Saúde</v-expansion-panel-header>
              <v-expansion-panel-content class="pt-2">
                <v-text-field dense disabled label="Número do Sus" v-mask="'### #### #### ####'" v-model="infoPaciente.cartaoSUS" />
                <v-text-field dense disabled label="Unidade de Saúde" v-model="infoPaciente.nomeUnidadeSaude" />
                <v-text-field dense disabled label="Micro Área" v-model="infoPaciente.nomeMicroArea" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <ExpansionLista tipo="C" posTitulo="atuais" :lista="infoPaciente.comorbidades"  />
            <ExpansionLista tipo="S" posTitulo="atuais" :lista="infoPaciente.sintomas"  />
          </v-expansion-panels>
        </v-flex>
      </v-flex>  
    </v-container>
    <BottomBar 
        :temBotaoAnterior="true"
        :temBotaoProximo= "false"
        :temBotaoCancela= "false"
        :temBotaoFinaliza= "false"
        :temBotaoSalva= "false"
        :temBotaoVerifica= "false"
        :temBotaoNovo= "false"
        :podeVoltar="true"
        :podeContinuar= "false"
        :podeCancelar= "false"
        :podeVerificar= "false"
        :podeSalvar= "false"
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
    import TituloPagina from '../components/TituloPagina'
    import ExpansionLista from '../components/ExpansionListaCeS.vue'

    export default {
        name: 'SuspeitaCovid',
        components: {BottomBar, TituloPagina, ExpansionLista},
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
            cidadePadrao: null,

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
              nomeUnidadeSaude: '',
              nomeBairro: '',
              nomeLogradouro: '',
              nomeMicroArea: '',
              sintomas: [],
              comorbidades: []
            },
            salvandoDadosPaciente: false,
          
            listasCarregadas: false,

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
          this.listasCarregadas = false
        },
        mounted() {
            this.buscaPaciente(this.pacienteId)
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
        computed: {},
        methods: {
          async buscaPaciente(pacienteId) {
            this.buscandoDados = true

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
            })
            .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
            }

            if (!erro) {
            this.mensagemAguarde =  'Buscando os sintomas do Paciente! Aguarde...'
            await mainService.listaPacienteSintomas(pacienteId)
            .then (resp => {
                this.infoPaciente.sintomas = resp.status == 200 ? resp.data : []
            })
            .catch(err => {erro=true; this.mensagemErro =  mainService.catchPadrao(err); });
            }
            this.buscandoDados = false
            this.listasCarregadas = true
            this.mensagemAguarde =  ''
          },
          cbClickBotao(val) {
            switch (val) {
              case 'VO':
                this.fimCadastro()
                break;
            }
          },
          fimCadastro () {
            this.$emit('cbFimCadastro', true)
          },
          setaInfoPaciente (dadosPaciente) {
            this.infoPaciente.id = dadosPaciente.id
            this.infoPaciente.RG = dadosPaciente.rg
            this.infoPaciente.nome = dadosPaciente.nome
            this.infoPaciente.nomeMae = dadosPaciente.nomeMae
            this.infoPaciente.cartaoSUS = dadosPaciente.cartaoSUS
            this.infoPaciente.eMail = dadosPaciente.eMail 

            this.infoPaciente.numeroEndereco = dadosPaciente.numeroEndereco
            this.infoPaciente.complemento = dadosPaciente.complementoEndereco
            this.infoPaciente.sexo = dadosPaciente.sexo == 'M' ? 'Masculino' : dadosPaciente.sexo == 'F' ? 'Feminino' : 'Outros / Não Informado'

            this.infoPaciente.nomeUnidadeSaude = dadosPaciente.nomeUnidadeSaude
            this.infoPaciente.nomeBairro = dadosPaciente.nomeBairro
            this.infoPaciente.nomeLogradouro = dadosPaciente.nomeLogradouro
            this.infoPaciente.nomeMicroArea = dadosPaciente.nomeMicroArea

            const _dataNascimento = dadosPaciente.dataNascimento.substring(0, 10)
            this.infoPaciente.dataNascimento = _dataNascimento.substring(8, 10) + '/' + _dataNascimento.substring(5, 7) + '/' + _dataNascimento.substring(0, 4)

            this.infoPaciente.telefoneContato = (dadosPaciente.telefoneContato) ? formataCelular(dadosPaciente.telefoneContato) : ''
            this.infoPaciente.celular = (dadosPaciente.celular) ? formataCelular(dadosPaciente.celular) : '' 
            this.infoPaciente.celular2 = (dadosPaciente.celular2) ? formataCelular(dadosPaciente.celular2) : '' 
              
            this.infoPaciente.cpf = formataCpf(dadosPaciente.cpf)
          }
        }
    }
</script>
<style scoped>
  .input__label {
    color: blue;
  }
  .nota_botao {
    color:green;
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
  .v-expansion-panel__header {
    background-color: aqua;
  }

  

</style>
