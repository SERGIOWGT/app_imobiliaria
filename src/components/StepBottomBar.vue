<template>
    <v-bottom-navigation
        grow
        fixed
    >
        <v-btn v-if="temBotaoAnterior" @click="btnFuncao('VO')" :disabled="podeVoltar === false"  >
            <span :class="podeVoltar?'teal--text':''">Voltar</span>
            <v-icon color="teal lighten-2">mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoCancela" @click="btnFuncao('CA')" :disabled="podeCancelar===false"  >
            <span :class="podeCancelar?'teal--text':''">Cancela</span>
            <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn exact v-if="temBotaoProximo" @click="btnFuncao('PX')" :disabled="podeContinuar===false"  >
            <span :class="podeContinuar?'teal--text':''">Continuar</span>
            <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn  v-if="temBotaoSalva" @click="btnFuncao('SV')"  :disabled="podeSalvar===false"   >
            <span :class="podeSalvar?'teal--text':''">Salvar</span>
            <v-icon color="teal lighten-2">mdi-cloud-upload</v-icon>
        </v-btn>
        <v-btn v-if="temBotaoVerifica" @click="btnFuncao('VF')" :disabled="podeVerificar===false"  >
            <span :class="podeVerificar?'teal--text':''">Consultar</span>
            <v-icon>mdi-account-search</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>
<script>
  export default {
    name: 'ButtonBar',
    props: {
        temBotaoAnterior: Boolean,
        temBotaoProximo:  Boolean,
        temBotaoCancela: Boolean,
        temBotaoFinaliza: Boolean,
        temBotaoSalva: Boolean,
        temBotaoVerifica: Boolean,
        temBotaoNovo: Boolean,
        podeVoltar: Boolean,
        podeContinuar:  Boolean,
        podeCancelar: Boolean,
        podeVerificar: Boolean,
        podeSalvar: Boolean
    },
    data() {
        return {
        }
    },
    created() {
        this.visivel = false;
    },
    methods: {
        btnFuncao(val) {
            this.$emit('funcaoRetorno', val)
        } 
    }
  }
</script>