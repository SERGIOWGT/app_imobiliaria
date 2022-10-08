export default {
    Basicas: {
      obrigatorio() {
          return v => !!v || 'Campo obrigatório'
      },
      obrigatorioCondicional(val) {
        if (val == false)
          return v => !v || 'xxx'
        else
          return v => !!v || 'Campo obrigatório'
      },
      max(tamanhoMaximo){
        return v => (v || '').length <= tamanhoMaximo || `Até ${tamanhoMaximo} caracteres`;
      },
      min(tamanhoMinimo){
        return v => (v || '').length >= tamanhoMinimo || `Pelo menos ${tamanhoMinimo} caracteres`;
      },
    },
    Data: {
      valida(obrigatorio) {
        const _dataValida = function(v, obrigatorio) {
          if (obrigatorio == false) {
            if (!v) {
              return true;
            }
          } else {
            if (!v) {
              return 'Data obrigatória';
            }
          }
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(v) == false) // eslint-disable-line
            return 'Data inválida';

          var _partes = v.split('/');
          var _dia = parseInt(_partes[0]);
          var _mes = parseInt(_partes[1]);
          var _ano = parseInt(_partes[2]);
          var _dataAux = new Date(_ano, _mes-1, _dia);
          if ((_dataAux && (_dataAux.getMonth() + 1) == _mes && _dataAux.getDate() == _dia && _dataAux.getFullYear() == _ano) == false)
            return 'Data inválida';

          return true;
        }

      return v => _dataValida(v, obrigatorio);
      }
    },
    Cpf: {
      valido(obrigatorio) {
        //return v => /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/.test(v) || 'Use o formato (xxx.xxx.xxx-xx)'  // eslint-disable-line
        if (obrigatorio)
          return v => /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[\-]?[0-9]{2}$/.test(v) || 'Cpf é obrigatório'  // eslint-disable-line
        else
          return v => !v || /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[\-]?[0-9]{2}$/.test(v) || 'Cpf inválido'  // eslint-disable-line
      }
    }, 
    NumeroSus: {
      valido(obrigatorio) {
        if (obrigatorio)
            return v =>  /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Campo com 18 números (999 9999 9999 9999)'  // eslint-disable-line
        else 
            return v =>  !v || /^[0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/.test(v) || 'Nùmero do Cartão do SUS inválido'  // eslint-disable-line
      }
    }, 
    Celular: {
        valido(obrigatorio) {
            if (obrigatorio)
                //return v =>  /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
            else 
                //return v =>  !v || /^[1-9]{2} (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(v) || 'Campo com 12 ou 13 números (99 ?9999-9999)'  // eslint-disable-line
                return v =>  !v || /^[1-9]{2}[ ]?(?:[2-8]|9[1-9])[0-9]{3}[\-]?[0-9]{4}$/.test(v) || 'Celular inválido (99 ?9999-9999)'  // eslint-disable-line
        }
    },  
    Email: {
      valido(obrigatorio) {
        if (obrigatorio)
          return v =>  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email inválido'  // eslint-disable-line
        else 
          return v =>  !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email inválido'  // eslint-disable-line
      },
    },
    vetorObrigatorio: [
        v => !!v || 'Campo obrigatório',
    ]
}