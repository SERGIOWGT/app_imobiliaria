export default {
    ChaveRules: {
      obrigatorio() {
        return v => !!v || 'Campo obrigatório'
      },
      valido(formato) {
        var strongRegex = new RegExp(formato); 
        return v => strongRegex.test(v) || 'Campo inválido'
      }
    },
    SenhaRules: {
      max(tamanhoMaximo){
        return v => (v || '').length <= tamanhoMaximo || `Senha com até ${tamanhoMaximo} caracteres`;
      },
      min(tamanhoMinimo){
        return v => (v || '').length >= tamanhoMinimo || `Senha com pelo menos  ${tamanhoMinimo} caracteres`;
      },
      valido(formato, mensagem) {
        const valida = function(v, formato) {
          const strongRegex = new RegExp(formato); 
          return strongRegex.test(v)
        }
        return v => valida(v, formato) || mensagem
      },
      mesmaSenha(senha) {
        return v => (v == senha) || 'Senhas são diferentes'
      }
    }, 
    EmailRules: {
      valido(obrigatorio) {
        const valida = function(v) {
          const strongRegex = new RegExp('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/'); // eslint-disable-line 
          return strongRegex.test(v)
        }
        return v => {
          if ((obrigatorio) || (v))
            valida(v) || 'Email é obrigatório'
        }
      },
    },
    CodigoAcessoRules: {
      valido(obrigatorio) {
        return v => !obrigatorio || (v && v.length == 6) || 'Campo com 6 números'
      }
    },
  }

