<template>
    <v-bottom-navigation
        color="teal"
        grow
        fixed
    >
        <v-btn @click="btnVolta('BR')">
            <span>Bairro</span>
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn  @click="btnVolta('LO')">
            <span>Logradouro</span>
            <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn  @click="btnVolta('MA')">
            <span>Micro Área</span>
            <v-icon>mdi-account-minus</v-icon>
        </v-btn>
        <v-btn  @click="btnVolta('US')">
            <span>Unidade de Saúde</span>
            <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>
<script>
  export default {
    name: 'ButtonBar',
    data() {
        return {
        }
    },
    created() {
        this.visivel = false;
    },
    methods: {
        btnVolta(value) {
            this.$emit('funcaoRetorno', value)
        }, 
    }
  }
</script>