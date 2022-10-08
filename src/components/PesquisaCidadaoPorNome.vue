<template>
    <v-expansion-panels focusable class="pt-0 mt-0" v-model="abrePainel">
        <v-expansion-panel class="mt-2" >
            <v-expansion-panel-header class="blue-grey lighten-5 teal--text px-3">
                <v-row no-gutters>
                    <v-col cols="12">PESQUISA POR NOME</v-col>
                    <v-col cols="1" class="text--secondary">
                        <v-fade-transition leave-absolute>
                            <span key="0" ></span>
                        </v-fade-transition>
                    </v-col>
                </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="">
                <v-form v-model="formValido">
                    <v-row><v-col cols="12" class="px-1 pb-0 pt-4"><p class="subtitle-2">Escolha um cidadão e clique no botão <span class="red--text">BUSCAR</span>.</p></v-col></v-row>
                    <v-flex v-if="tituloData != ''">
                        <v-row><v-col cols="12" class="px-1 pb-0 pt-0"><small>{{tituloData}}</small></v-col></v-row>
                        <v-row> 
                            <v-col cols="6" class="px-1 pb-0 pt-2">
                                <v-text-field dense required clearable 
                                label="Início"
                                v-model="dataInicio"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                            ></v-text-field>
                            </v-col>
                            <v-col cols="6" class="px-1 pb-0 pt-2">
                                <v-text-field dense required clearable
                                label="Fim"
                                v-model="dataFim"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                            ></v-text-field>
                            </v-col>

                        </v-row>
                    </v-flex>
                    <v-row> 
                        <v-col cols="12" class="px-1 pb-0 pt-2">
                            <v-autocomplete class="pt-1"
                                dense autofocus
                                placeholder="Nome do Cidadão"
                                clearable
                                :items="pacientes"
                                :search-input.sync="sincronizaPaciente"
                                item-value="id"
                                item-text="nome"
                                hide-no-data
                                :loading="isLoading"
                                v-model="pacienteId"
                                :rules="[regraCidadao()]"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-actions class="pt-2 pb-0">
                    <v-spacer></v-spacer>
                    <v-btn text small color="red" :disabled="!formValido || !habilitaPesquisa || isLoading" @click="busca"> Buscar </v-btn>
                </v-card-actions>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script>
    import mainService from '../services/mainService'
    import {data2String} from '../bibliotecas/formataValores'
    import regrasCampos from '../bibliotecas/regrasCampos'

  export default {
        props: {
            aberto: Boolean,
            tituloData: String,
            habilitaPesquisa: Boolean
        },
        data() {
            return {
                regras: regrasCampos,

                pacienteId: null,
                abrePainel: 0,
                isLoading: false,
                formValido: false,

                pacientes: [],

                cidadePadrao: {
                    id: 0,
                    nome: ''
                },
                dataInicio: '',
                dataFim: '',
                

                tipoMensagem: 0,
                mensagem: '',
                mensagemAguarde: '',
            }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
            if (this.tituloData) {
                this.dataFim = data2String(new Date(), 'BR')
                this.dataInicio = data2String(new Date(new Date()-(30*24*60*60*1000)), 'BR')
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
            }
        },
        computed: {
            sincronizaPaciente: {
                get () {
                    return ''
                },
                set (searchInput) {
                    if ((searchInput) && (searchInput.length >= 3)) {
                        this.listaPacientePorNome(this.cidadePadrao.id, searchInput)
                    } else 
                        this.pacientes = []
                }
            },
        },
        methods: {
            busca() {
                const _param = {
                    pacienteId: this.pacienteId,
                    dataInicio: this.dataInicio,
                    dataFim: this.dataFim,
                    ordenacao: 0
                }
                this.$emit('cbBusca', _param, 'Nome do Paciente')
            },
            async listaPacientePorNome(cidadeId, parteNome) {
                const param = {cidadeId: cidadeId, nome: parteNome}
                const resp = await mainService.listaPacientes(param)
                this.isLoading = true
                if (resp.status == 200) 
                    this.pacientes = resp.data
                else 
                    this.pacientes = []
                this.isLoading = false
            },
            regraCidadao: function(){
                return !!this.pacienteId || 'Campo obrigatório'
            },
        }
    }
</script>
