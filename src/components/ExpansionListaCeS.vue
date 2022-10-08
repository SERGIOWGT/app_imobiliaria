<template>
    <v-expansion-panel class="mt-2">
        <v-expansion-panel-header v-if="lista.length == 0" hide-actions disabled class="blue-grey lighten-5 red--text text--lighten-1">{{titulo}}</v-expansion-panel-header >
        <v-expansion-panel-header v-else class="blue-grey lighten-5 teal--text text--lighten-2">{{titulo}}</v-expansion-panel-header >
        <v-expansion-panel-content >
            <v-flex class="px-0 pt-2" v-for="(item) in lista" :key="item.id" >
                <v-chip> {{item.nome}} </v-chip>
            </v-flex>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script>
    export default {
        props: {
            tipo: String, 
            posTitulo: String,
            lista: Array 
        },
        data() {return {}},
        computed: {
            titulo() {
                return (this.lista.length == 0) ? 'Cidadão sem ' + (this.tipo == 'C' ? ' comorbidades' : 'sintomas') : 'Consulte aqui ' + (this.tipo == 'C' ? 'as comorbidades' : 'os sintomas') + ' ' + (this.posTitulo ? this.posTitulo : '')
            }
        }
    }
</script>