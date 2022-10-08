<template>
 <div class="text-center">
    <v-dialog
        v-model="visible"
        hide-overlay
        persistent
        width="400"
    >
        <v-card color="teal lighten-2" dark>
            <v-card-text class="pt-2">
            {{mensagem}}
            <v-progress-linear 
                indeterminate
                color="white"
                class="mb-0 mt-2"
            ></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      mensagem: String
    },
    data() {
      return {
        visible: false
      }
    },
    watch: {
      mensagem: function(val) {
        this.visible  = !(val == '')
      }
    }
  }
</script>