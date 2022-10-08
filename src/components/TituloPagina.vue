<template>
    <v-subheader class="px-0">
        <v-col cols="1" class="pl-1 pr-1"><v-row><v-btn icon color="teal lighten-2" @click="cmdAnterior()"><v-icon>mdi-arrow-left</v-icon></v-btn></v-row></v-col>
        <v-col cols="10" class="pl-0"><h4 class="teal--text ">{{titulo}}</h4></v-col>
        <v-col cols="1"><v-row :v-show="true" justify="end"><v-btn icon color="primary" @click="cmdBotao()"><v-icon>{{iconBotao}}</v-icon></v-btn></v-row></v-col> 
    </v-subheader>
</template>
<script>
    export default {
        props: {
          titulo: String,
          iconBotao: String
        },
        data() {
            return {
            }
        },
        methods: {
            cmdAnterior: function() {
                this.$emit('cbAnterior')
            },
            cmdBotao: function() {
                this.$emit('cbBotao')
            }
        }
    }
</script>