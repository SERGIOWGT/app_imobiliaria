<template>
  <v-container  class="pa-1 mt-0"> 
    <v-container fluid style="height: 100vmax;" class="pa-0">
      <TituloPagina :titulo="tituloTela" @cbAnterior="fimCadastro(true)" />
        <v-flex class="py-0 my-0 pt-0 mt-2 px-2">
                <v-form ref="form1" v-model="formValido" class="px-2">
                    <v-row><v-col cols="12" class="px-1 pb-0 pt-2"><p class="subtitle-2">{{textoPanel}} aqui os dados do Inquilino e clique no botão <span class="red--text">SALVAR</span>.</p></v-col></v-row>
                    <v-text-field class="pt-2"
                        dense required clearable
                        label="Nome Completo*"
                        v-model="infoInquilino.nome"
                        :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(100)]"
                        counter
                        maxlength="100"
                    ></v-text-field>
                    <v-text-field
                        dense required clearable
                        label="Nome da Mãe*"
                        v-model="infoInquilino.nomeMae"
                        :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(100)]"
                        counter
                        maxlength="100"
                    ></v-text-field>
                    <v-text-field 
                        dense required clearable
                        label="Data de Nascimento*"
                        v-model="infoInquilino.dataNascimento"
                        v-mask="'##/##/####'"
                        :rules="[regras.Data.valida(true)]"
                    ></v-text-field>
                    <v-text-field 
                        dense required clearable
                        label="CPF*"
                        v-model="infoInquilino.cpf"
                        v-mask="'###.###.###-##'" 
                        :rules="[regras.Cpf.valido(true)]"
                    ></v-text-field>
                    <v-text-field dense required clearable
                        label="Email"
                        v-model="infoInquilino.email"
                        :rules="[regras.Email.valido(false)]"
                        counter
                        maxlength="100"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                        dense required clearable
                        label="Celular*"
                        v-model="infoInquilino.celular"
                        :rules="[regras.Celular.valido(true)]"
                        maxlength="13"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                        dense required clearable
                        label="Celular 2"
                        v-model="infoInquilino.celular2"
                        :rules="[regras.Celular.valido(false)]"
                        maxlength="13"
                    ></v-text-field>
                    <v-text-field class="mt-4" @keypress="entradaCelular($event)"
                        dense required clearable
                        label="Telefone Contato"
                        v-model="infoInquilino.telefoneContato"
                        :rules="[regras.Celular.valido(false)]"
                        maxlength="13"
                    ></v-text-field>
                    <small>Sexo*</small>
                    <v-radio-group  class="py-0 my-0" dense v-model="infoInquilino.sexo" row :rules="[regras.Basicas.obrigatorio()]">
                        <v-col cols="4" class="py-1 my-1 pl-0"><v-radio value="F" label="Femin."></v-radio></v-col>
                        <v-col cols="4" class="py-1 my-1"><v-radio value="M" label="Masc."></v-radio></v-col>
                        <v-col cols="3" class="py-1 my-1"><v-radio value="O" label="Outros"></v-radio></v-col>
                    </v-radio-group>
                </v-form>
        </v-flex>
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
    //import {formataCelular, formataCpf} from '../bibliotecas/formataValores'
    import entradaText from '../bibliotecas/entradaText'
    import TituloPagina from '../components/TituloPagina'

    export default {
        name: 'SuspeitaCovid',
        components: {BottomBar, TituloPagina},
        props: {
          inquilinoId: Number
        },
        data() {
          return {

            // funcoes
            entradaCelular: entradaText.celular,
            regras: regrasCampos,

            formValido: false,
            infoInquilino: {
              id: 0,
              nome: '',
              nomeMae: '',
              cpf: '',
              dataNascimento: '',
              eMail: '',
              celular: '',
              celular2: '',
              telefoneContato: '',
              sexo: ''
            },
            salvandoDadosPaciente: false,
          
            infoBotoes: {
              carregandoDados: false,

              temBotaoAnterior: true,
              temBotaoProximo: false,
              temBotaoCancela: false,
              temBotaoFinaliza: false,
              temBotaoSalva: true,
              temBotaoVerifica: false,
              temBotaoNovo: false,

              podeVoltar: true,
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
        mounted() {
          this.infoInquilino.id = (this.inquilinoId == null) ? 0 : this.inquilinoId
          if (this.infoInquilino.id != 0) {
            this.buscaInquilino(this.infoInquilino.id)
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
          podeVoltar() {
            return true
          },
          podeSalvar() {
            return this.formValido;
          },
          tituloTela() {
            return (this.infoInquilino.id == 0) ? 'NOVO INQUILINO' : 'ALTERAÇÃO DE DADOS DO INQUILINO'
          },
          textoPanel() {
            return (this.infoInquilino.id == 0) ? 'Informe' : 'Altere'
          },
        },
        methods: {
          async buscaInquilino(id) {
            var local_erro = false
            this.mensagemAguarde = 'Buscando inquilino! Aguarde...'
            await mainService.listaInquilinoById(id)
              .then(resp => { this.infoInquilino = resp.status == 200 ? resp.data : null })
              .catch(err => { local_erro = true; this.mensagemErro = mainService.catchPadrao(err); });

            if (local_erro == false) {
              this.mensagemAguarde = ''
              this.infoInquilino.dataNascimento = '11/11/1971'
              const _data = this.infoInquilino.dataNascimento.split('T');
              console.log(_data[0])
              if (_data[0]) {
                //this.infoInquilino.dataNascimento = _data[0].replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$3/$2/$1'); // eslint-disable-line 
                console.log('2')
                console.log(this.infoInquilino.dataNascimento)
                this.infoInquilino.dataNascimento = '11/11/1971';
              } else {
                this.infoInquilino.dataNascimento = '';
              }
            } 
          },
          cbClickBotao(val) {
            switch (val) {
              case 'VO':
                this.fimCadastro(true)
                break;
              case 'SV':
                //if (this.etapaCadastro == this.enumEtapaCadastro.dadosCidadao )
                  this.salva()
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
          limpaDadosInquilino() {
            this.infoInquilino.nome = ''
            this.infoInquilino.nomeMae = ''
            this.infoInquilino.cpf= ''
            this.infoInquilino.eMail= ''
            this.infoInquilino.celular= ''
            this.infoInquilino.celular2= ''
            this.infoInquilino.telefoneContato= ''
            this.infoInquilino.sexo= ''
          },
          novoCidadao() {
            this.limpaDadosInquilino()
          },
          async salva() {
            this.mensagemAguarde =  'Salvando dados do inquilino. Aguarde...'
            this.mensagemErro = ''

            let erro = false;
            console.log('this.infoInquilino', this.infoInquilino)
            await mainService.salvaInquilino(this.infoInquilino.id, this.infoInquilino)
            .then(resp => {
              this.mensagemAguarde =  ''
              if ((resp.status == 200) || (resp.status == 201) || (resp.status == 204)) {
                if (this.infoInquilino.id == 0) {
                  this.infoInquilino.id = resp.data.id
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
              this.mensagemAguarde =  ''
              this.fimCadastro(false);
            } 
          },
/*           setainfoInquilino (dadosPaciente) {
            this.infoInquilino.id = dadosPaciente.id
            this.infoInquilino.nome = dadosPaciente.nome
            this.infoInquilino.nomeMae = dadosPaciente.nomeMae
            this.infoInquilino.eMail = dadosPaciente.eMail 
            this.infoInquilino.sexo = dadosPaciente.sexo
            const _dataNascimento = dadosPaciente.dataNascimento.substring(0, 10)
            this.infoInquilino.dataNascimento = _dataNascimento.substring(8, 10) + '/' + _dataNascimento.substring(5, 7) + '/' + _dataNascimento.substring(0, 4)
            this.infoInquilino.telefoneContato = (dadosPaciente.telefoneContato) ? formataCelular(dadosPaciente.telefoneContato) : ''
            this.infoInquilino.celular = (dadosPaciente.celular) ? formataCelular(dadosPaciente.celular) : '' 
            this.infoInquilino.celular2 = (dadosPaciente.celular2) ? formataCelular(dadosPaciente.celular2) : '' 
            this.infoInquilino.cpf = formataCpf(dadosPaciente.cpf)
          }, 
          */
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
