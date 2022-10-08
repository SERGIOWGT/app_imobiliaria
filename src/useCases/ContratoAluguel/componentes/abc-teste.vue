<template>
    <v-bottom-sheet persistent inset scrollable v-model="showTela" max-width="500px">
        <v-sheet class="text-center">
            <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">{{tituloOperacao}}</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-text class="text-start"> {{mensagemOperacao}}</v-card-text>
                <v-form ref="myForm" class="pt-0 mx-3" v-model="formValido">
                    <v-text-field 
                        v-model="nomeImovel"
                        disabled
                    ></v-text-field>
                    <v-text-field 
                        dense required clearable
                        :label="labelData"
                        v-model="dataOperacao"
                        v-mask="'##/##/####'"
                        :rules="[regras.Data.valida(true)]"                        
                    ></v-text-field>
                    <v-text-field v-if="temValor == true"
                        type="number"
                        dense required clearable
                        label="Valor do Reajuste"
                        v-model="valorOperacao"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-6 pb-10">
                <v-spacer></v-spacer>
                <v-btn text small color="secundary" @click="fecha(false)" :disabled="isLoading">Fecha</v-btn>
                <v-btn text small color="primary" :disabled=" !formValido || isLoading" v-on:click="salva()">Salva</v-btn>
            </v-card-actions>
            </v-card>
        </v-sheet>
      </v-bottom-sheet>
</template>
<script>
    import regrasCampos from '../../../bibliotecas/regrasCampos'
    import mainService from '../../../services/mainService'
    import {data2String, stringDataBr2Sql} from '../../../bibliotecas/formataValores'

    export default {
        props: {
            tipoOperacao: String,
            idOperacao: Number,
            apelidoImovel: String
        },
        data() {
            return {
                isLoading: false,
                regras: regrasCampos,

                formValido: '',

                mensagemErro: '',
                mensagemAguarde: '',

                tituloOperacao: '',
                mensagemOperacao: '',
                temValor: false,

                labelData: '',
                nomeImovel: '',
                dataOperacao: '',
                valorOperacao: 0,
                
                showTela: true,
            }
        },
        watch: {
            mensagemAguarde (val) {
                this.$emit('cbMensagemAguarde', val)
                this.isLoading = (val == '') ? false : true
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
        },
        mounted() {
            this.dataOperacao = data2String(new Date(), 'BR')
            this.showTela = true;
            this.nomeImovel = this.apelidoImovel

            switch (this.tipoOperacao) {
                case 'RE':
                    this.tituloOperacao = 'Reajuste';
                    this.mensagemOperacao = 'Informe o data do reajuste e o valor do novo aluguel nos campos abaixo.';
                    this.temValor = true;
                    this.labelData = 'Data do ' + this.tituloOperacao;
                    break;
                case 'EN':
                    this.tituloOperacao = 'Encerramento';
                    this.mensagemOperacao = 'Informe a data do encerramento abaixo.';
                    this.labelData = 'Data do ' + this.tituloOperacao;
                    break;
            }
            this.tituloOperacao += ' de Contrato'
        },
        methods: {
            async salva() {
                this.isLoading =true;
                this.mensagemErro = ''
                const _data = stringDataBr2Sql(this.dataOperacao);

                switch (this.tipoOperacao) {
                    case 'EN':
                        this.mensagemAguarde =  'Encerrando o contrato! Aguarde...'
                        await mainService.encerraContrato(this.idOperacao, _data).then (resp => {
                            this.mensagemAguarde =  ''
                            this.isLoading =false;
                            if (resp.status == 204){                    
                                this.fecha('Contrato encerrado com sucesso');
                            } else {
                                this.mensagemErro =  resp.message
                            } 
                        })
                        .catch (err => {
                            this.mensagemAguarde =  '';
                            this.isLoading =false; 
                            this.mensagemErro =  mainService.catchPadrao(err)
                        });
                        break;

                    case 'RE':
                        this.mensagemAguarde =  'Reajustando o contrato! Aguarde...'
                        await mainService.reajustaContrato(this.idOperacao, _data, this.valorOperacao).then (resp => {
                            this.mensagemAguarde =  ''
                            this.isLoading =false;
                            if (resp.status == 204){                    
                                this.fecha("Contrato reajustado com sucesso");
                            } else {
                                this.mensagemErro =  resp.message
                            } 
                        })
                        .catch (err => {
                            this.mensagemAguarde =  '';
                            this.isLoading =false; 
                            this.mensagemErro =  mainService.catchPadrao(err)
                        });
                        break;
                }
            },
            fecha(msgSucesso) {
                this.$emit('cbFechaOperacao', msgSucesso);
            }
        }
    }
</script>

<style scoped>
    .container {
        background-color:#FFFFFF !important; /* light-blue darken-1*/
    }
</style>
