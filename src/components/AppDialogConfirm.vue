<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="pa-2 teal lighten-2"> <span class="white--text subtitle-1">{{titulo}}</span></v-card-title>
        <v-card-text class="pt-3">{{pergunta}}</v-card-text>
        <v-divider/>
        <v-card-actions class="py-1">
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="fecha(false)" >Não</v-btn>
          <v-btn color="red darken-1" text @click="fecha(true)"> Sim </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
  export default {
    props: {
      titulo: String,
      pergunta: String,
    },
    data() {
      return {
        dialog: true
      }
    },
    methods: {
      fecha(v) {
          if (v) 
            this.$emit('cbRespostaSim')
          else
            this.$emit('cbRespostaNao')
          this.dialog = false
      }
    }
  }
</script>