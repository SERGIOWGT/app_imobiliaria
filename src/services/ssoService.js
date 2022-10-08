import axios from 'axios'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const http = axios.create({
    baseURL: process.env.VUE_APP_SSO_SERVICE_URL
})
http.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    var _erros = ''
    if (error.response) {
        if (error.response.status == 400) {
            _erros = error.response.data
        } else if (error.response.status == 401) {
             _erros = {erros: [{
                'chave': '000.0401',
                'mensagem': 'Url não autorizada'
            }]}
    
        } else if (error.response.status == 404) {
            _erros = {erros: [{
                'chave': '000.0404',
                'mensagem': 'Url não encontrada'
            }]}

        } else {
            _erros = {erros: [{
                'chave': '000.0000',
                'mensagem': error
            }]}
        }
    } else {
        _erros = {erros: [{
            'chave': '000.0000',
            'mensagem': error
        }]}
    }

    return Promise.reject(_erros)
})
export default {
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        const _url = `v1/Usuarios/${usuarioId}/ListaPermissionamento?sistemaId=${sistemaId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    async listaConfiguracao (sistemaToken) {
        const _url = `login/listaConfiguracao?tokenSistema=${sistemaToken}`;
        return http.get(_url);
    },
    autentica: (sistemaId, email, senha) => {
        const params = {
            'tokenSistema': sistemaId,
            'chave': email,
            'senha': senha,
            'comPermissoes': true
        }
        return http.put('login/autentica', params)
    },
    trocaSenha: (signKey, chave, senha, novaSenha) => {
        const params = {
            'tokenSistema': signKey,
            'chave': chave,
            'senhaAtual': senha,
            'senhaNova': novaSenha
        }
        return http.put('login/TrocaSenhaV2', params)
    },
    esqueceuSenha: (signKey, chave) => {
        const params = {
            'tokenSistema': signKey,
            'chave': chave
        }
        return http.put('login/EsqueciSenha', params)
    },
    trocaSenhaPorCodigo: (signKey, chave, codigoAcesso, senhaNova) => {
        const params = {
            'tokenSistema': signKey,
            'chave': chave,
            'codigoAcesso': codigoAcesso,
            'senhaNova': senhaNova
        }
        return http.put('login/TrocaSenhaPorCodigo', params)
    },
    catchPadrao: (response) => {
        let mensagemErro = ''
        if (response) {
            if (response.erros) {
                let _mensagem = ""
                response.erros.forEach(el => {
                    _mensagem += el.mensagem
                });
                mensagemErro=_mensagem
            }
            else
                mensagemErro=response.message

        } else {
            mensagemErro=response.message
        }
        return mensagemErro;
    }
}