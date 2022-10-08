<template>
    <v-expansion-panel>
        <v-expansion-panel-header  class="blue-grey lighten-5 teal--text">
            <v-row no-gutters>
                <v-col cols="12">
                <b>{{nome}}</b>
                </v-col>
                <v-col
                cols="1"
                class="text--secondary"
                >
                <v-fade-transition leave-absolute>
                    <span
                    key="0"
                    >
                    </span>
                </v-fade-transition>
                </v-col>
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-text-field 
                disabled hide-details
                label="Endereço"
                v-model="endereco"
            ></v-text-field >
            <v-text-field 
                disabled hide-details
                label="Micro Área"
                v-model="nomeMicroArea"
            ></v-text-field>
            <v-text-field 
                disabled hide-details
                label="Estado de Saúde"
                v-model="nomeEstadoSaude"
            ></v-text-field>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script>
    export default {
        props: {
          nome: String,
          endereco: String,
          nomeMicroArea: String,
          nomeEstadoSaude: String,
        },
        data() {return {}}
    }
</script>