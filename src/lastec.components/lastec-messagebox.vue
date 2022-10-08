<template>
    <v-snackbar
        v-model="visible"
        :color="tipo == 0 ? 'success': 'error' "
        outlined
        :timeout=" timeout==0 ? 2000: timeout" centered 
    >
      {{ mensagem }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="visible = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
  export default {
     props: {
      tipo: Number, 
      mensagem: String,
      timeout: Number
    },
    data: () => ({
      visible: false,
    }),
    watch: {
      mensagem: function(val) {
        this.visible  = !(val == '')
      },
      visible: function(val) {
        if (val === false) {
          this.$emit('cb')
        }
      }
    },
  }
</script>