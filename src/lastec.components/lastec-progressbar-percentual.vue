<template>
 <v-flex class="text-center">
    <v-dialog color="teal lighten-2"
        v-model="visible"
        hide-overlay
        persistent
        width="400"
    >
        <v-card color="teal lighten-2" dark flat class="text-xs-center">
    <v-row class="justify-center pt-15 pb-15 px-3">
            
                <v-progress-circular
                    :rotate="-90"
                    :size="100"
                    :width="15"
                    :value="percentual"
                    color="primary"
                >
                {{ percentual }}%
                </v-progress-circular>
    </v-row>
        </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
  export default {
    props: {
      percentual: Number
    },
    data() {
      return {
        visible: false
      }
    },
    watch: {
      percentual: function(val) {
        this.visible  = !(val == 0)
      }
    }
  }
</script>