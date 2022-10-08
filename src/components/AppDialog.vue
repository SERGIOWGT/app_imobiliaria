<template>
 <div class="text-center">
    <v-container v-show="infosDialog.tipo=='ERR'">
        <v-alert
            v-model="visible"
            dismissible
            color="cyan"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-twitter"
        >
        {{infosDialog.mensagem}}
        </v-alert>
    </v-container>
    <v-card v-show="infosDialog.tipo=='OK'">
        <v-card-text class="pt-2">
        <p class="pa-2"><span class="texto1">{{infosDialog.mensagem}}</span></p>
        <v-divider></v-divider>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn
            color="primary"
            text
            @click="fecha()"
            >Fecha</v-btn>
        </v-card-actions>
    </v-card>
  </div>
</template>
<script>
  export default {
    props: {
      infosDialog: Object 
    },
    data() {
      return {
        visible: true
      }
    },
    watch: {
      infosDialog: function(val) {
        this.visible  = !(val.tipo == '')
      }
    },
    methods: {
      fecha() {
        this.visible = false
      }
    }
  }
</script>
<style scoped>
  .texto1 {
    color: red;
    font-weight: bold;
  }
</style>