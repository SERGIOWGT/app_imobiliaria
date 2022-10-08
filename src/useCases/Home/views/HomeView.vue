<template>
  <v-layout class="pa-0 ma-0" align-content-start justify-end row fill-height>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <ProgressBar :mensagem="mensagemAguarde"/>
    <v-container class="pa-0 ma-0 ">
      <v-layout justify-center class="mt-2 px-0" v-show="mostraTela" v-for="item in funcionalidades" :key="item.id" >
        <v-layout justify-center class="px-6 py-2" v-show="item.ativo==true">
          <v-expansion-panels focused>
            <v-expansion-panel class="py-1 blue-grey lighten-5">
              <v-expansion-panel-header disable-icon-rotate v-on:click="executaFuncao(item.id)">    
                <div class="d-flex align-center">
                    <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}</span>
                </div>
                <template v-slot:actions>
                  <v-icon v-on:click="executaFuncao(item.id)" :color="item.iconColor">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
    </v-container>
  </v-layout>
</template>
<script>
  import MessageBox from '@/lastec.components/lastec-messagebox'
  import ProgressBar from '@/lastec.components/lastec-progressbar'
  import {temAcesso} from '@/rotinasProjeto/rotinasProjeto'

  export default {
    components: {
      ProgressBar, MessageBox
    },
    data() {
      return {
        // Dados
        tipoMensagem: 0,
        mensagem: '',
        mensagemAguarde: '',

        /*
          new Funcionalidade { Id = 1, SistemaId = 2, Nome = "Movimentação", TipoFuncionalidadeId = 2, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },
          new Funcionalidade { Id = 2, SistemaId = 2, Nome = "Proprietário - Cadastro", TipoFuncionalidadeId = 1, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },
          new Funcionalidade { Id = 3, SistemaId = 2, Nome = "Inquilino - Cadastra", TipoFuncionalidadeId = 1, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },
          new Funcionalidade { Id = 4, SistemaId = 2, Nome = "Contrato Aluguel - Cadastra", TipoFuncionalidadeId = 1, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },
          new Funcionalidade { Id = 5, SistemaId = 2, Nome = "Despesas - Cadastra", TipoFuncionalidadeId = 1, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },
          new Funcionalidade { Id = 6, SistemaId = 2, Nome = "Imóvel - Cadastra", TipoFuncionalidadeId = 1, Status = StatusEnum.Ativo, UsuarioIdInclusao = 1, DataInclusao = dataCriacao },

        */

        token: '',
        mostraTela:false,
        semAcesso: true,
        funcionalidades: [
          {   
              id: 1, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Verifique o resumo dos meses', 
              icon: 'mdi-gesture-double-tap', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(2)',
              perms: [{id:3, tipoId:1, acao:'C'}, {id:3, tipoId:1, acao:'I'}, {id:3, tipoId:1, acao:'E'}]
          },
          {   
              id: 5, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Cadastre aqui os Despesas', 
              icon: 'mdi-home-map-marker', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'naoImplementada()',
              perms: [{id:5, tipoId:1, acao:'C'}, {id:5, tipoId:1, acao:'I'}, {id:5, tipoId:1, acao:'A'}, {id:5, tipoId:1, acao:'E'}]
          },
          {   
              id: 2, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Gerencie os Contratos de Aluguel', 
              icon: 'mdi-home-map-marker', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'naoImplementada()',
              perms: [{id:4, tipoId:1, acao:'C'}, {id:4, tipoId:1, acao:'I'}, {id:4, tipoId:1, acao:'A'}, {id:4, tipoId:1, acao:'E'}]
          },
          {   
              id: 3, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Cadastre aqui os Inquilinos', 
              icon: 'mdi-home-map-marker', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'naoImplementada()',
              perms: [{id:3, tipoId:1, acao:'C'}, {id:3, tipoId:1, acao:'I'}, {id:3, tipoId:1, acao:'A'}, {id:3, tipoId:1, acao:'E'}]
          },
          {   
              id: 4, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Verifique os Imóveis', 
              icon: 'mdi-gesture-double-tap', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(2)',
              perms: [{id:6, tipoId:1, acao:'C'}]
          }
        ]
      }
    },
    created() {
      this.preparaTela()
      this.$store.commit('habilitaUserbar', true)
    },
    computed: {
      mensagemErro: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 1
          this.mensagem = val
        }
      },
      mensagemSucesso: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 0
          this.mensagem = val
        }
      },
    },
    methods: {
      executaFuncao(id) {
        switch (id) {
          case 1:
            this.$router.push('movimentacaoMensal') 
            break;
          case 2:
            this.$router.push('contratoAluguel') 
            break;
          case 3:
            this.$router.push('inquilino');
            break
          case 4:
            this.$router.push('imovel') 
            break;
          default:
            this.mensagemErro = `funcionalidade não implementada [id=${id}]`
        }
      },
      preparaTela() {
        const _permissionamentos = this.$store.getters.permissionamento;
        let _temAcesso = false
        for (var i=0; i < this.funcionalidades.length; ++i) {
          _temAcesso = false
          for (var j=0; j < this.funcionalidades[i].perms.length; ++j) {
            const _item = this.funcionalidades[i].perms[j];
            if (temAcesso(_permissionamentos, _item.id, _item.tipoId, _item.acao)) {
              _temAcesso = true
              j = this.funcionalidades[i].perms.length
            }
          }
          if (_temAcesso) {
            this.semAcesso = false
            this.funcionalidades[i].ativo = true
          }
        }
        this.mostraTela = true
      }
    }
  }
</script>

