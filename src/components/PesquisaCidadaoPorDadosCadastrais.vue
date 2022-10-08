<template>
    <v-expansion-panels focusable class="pt-0 mt-0 " v-model="abrePainel">
        <v-expansion-panel class="mt-2">
            <v-expansion-panel-header class="blue-grey lighten-5 teal--text px-3">
                <v-row no-gutters>
                    <v-col cols="12">PESQUISA POR DADOS CADASTRAIS </v-col>
                    <v-col cols="1" class="text--secondary">
                        <v-fade-transition leave-absolute>
                            <span key="0"> </span>
                        </v-fade-transition>
                    </v-col>
                </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-row>
                    <v-col cols="12" class="px-1 pb-0 pt-4">
                        <p class="subtitle-2">Preencha pelo menos um dos campos abaixo e clique no botão <span class="red--text">BUSCAR</span>.</p>
                        <v-form ref="form" class="mx-0" v-model="formularioValido">
                            <v-text-field class="pt-3" 
                                dense clearable
                                label="Número do SUS"
                                v-model="cartaoSUS"
                                v-mask="'### #### #### ####'"
                                :rules="[regras.NumeroSus.valido(false)]"
                            ></v-text-field>
                            <v-text-field class="pt-3"
                                dense clearable
                                label="CPF"
                                v-model="cpf"
                                v-mask="'###.###.###-##'" 
                                :rules="[regras.Cpf.valido(false)]"
                            ></v-text-field>
                            <v-text-field class="pt-3" 
                                dense clearable 
                                label="Data de Nascimento"
                                v-model="dataNascimento"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(false)]"
                            ></v-text-field>
                        </v-form>
                    </v-col>
                </v-row>
                <v-card-actions class="pt-5 pb-0">
                    <v-spacer></v-spacer>
                    <v-btn text small color="primary" @click="$refs.form.reset()"> Limpar </v-btn>
                    <v-btn text small color="red" :disabled="!pesquisaLiberada || !habilitaPesquisa" @click="busca()"> Buscar </v-btn>
                </v-card-actions>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script>
    import regrasCampos from '../bibliotecas/regrasCampos'
    import entradaText from '../bibliotecas/entradaText'

    export default {
        props: {
            aberto: Boolean,
            habilitaPesquisa: Boolean
        },
        data() {
            return {
                entradaCpf: entradaText.cpf,
                regras: regrasCampos,

                abrePainel: null,
                formularioValido: false,

                cpf: '',
                dataNascimento: '',
                cartaoSUS: ''

            }
        },
        watch: {
            aberto(v) {
                 if (v) {
                    if (this.abrePainel == null) {
                        this.abrePainel = 0
                    }
                } else {
                    if (this.abrePainel == 0){
                        this.abrePainel = null
                    }
                }
            },
            abrePainel(v) {
                this.$emit('cbAbriu', v == null ? false : true)
            },
        },
        computed: {            
            pesquisaLiberada () {
                return this.formularioValido && (!this.isEmpty(this.cpf) || !this.isEmpty(this.cartaoSUS) || !this.isEmpty(this.dataNascimento))
            },
        },
        methods: {
            busca() {
                const param = {
                    cpf: this.cpf,
                    dataNascimento: this.dataNascimento,
                    cartaoSUS: this.cartaoSUS
                }

                this.$emit('cbBusca', param)
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
        }
        
    }
</script>