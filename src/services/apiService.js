import axios from 'axios';
import {stringDataBr2Sql} from '../bibliotecas/formataValores';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    //baseURL: 'https://api.homolog.painelsaude.com.br/api/'
    //baseURL: 'https://api.painelsaude.com.br/api/'
    //baseURL: 'https://localhost:44308/api/'
    baseURL: process.env.VUE_APP_API_SERVICE_URL
    //baseURL: 'https://localhost:44328/api/'
})

http.interceptors.request.use(function (config) {
    const d = new Date().toUTCString();
    config.headers.dataEnvio =  d
    return config;
  });
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
    listaImoveis: (token) => {
        return http.get('Imoveis', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaImoveisCompleta: (token) => {
        return http.get('Imoveis/ListaCompleta', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaInquilinos: (token) => {
        return http.get('Inquilinos', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaInquilino: (token, id) => {
        const _url = `Inquilinos/${id}`;
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    listaContratos: (token) => {
        return http.get('ContratosAluguel/ListaCompleta', {headers: {'Authorization': `bearer ${token}`}})
    },
    listaMovimentacaoMensal: (token, ano, mes) => {
        const _url = `ContratosAluguel/ListaMovimentacaoMensal?ano=${ano}&mes=${mes}`
        console.log(_url)
        return http.get(_url, {headers: {'Authorization': `bearer ${token}`}})
    },
    // Ativa / Inativa
    ativaInquilino: (token, id) => {
        const _url = `Inquilinos/${id}/Ativa`;
        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },
    inativaInquilino: (token, id) => {
        const _url = `Inquilinos/${id}/Inativa`;
        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },

    // Exclui
    excluiPagamentoParcela: (token, id) => {
        const _url = `ContratosAluguel/CancelaQuitacaoParcela/${id}`;

        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },
    excluiQuitacaoRecebimento: (token, id) => {
        const _url = `ContratosAluguel/CancelaQuitacaoRecebimento/${id}`;

        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },
    
    // SALVA
    salvaInquilino: (token, id, param) => {
        let _url = (id == 0) ? 'Inquilinos' : `Inquilinos/${id}`

        const _cpf = param.cpf.toString().replace(/\.|-/gm,'');
        const _celular =  (param.celular) ? param.celular.toString().replace(/\s|-/gm,'') : '';
        const _celular2 =  (param.celular2) ? param.celular2.toString().replace(/\s|-/gm,'') : '';
        const _telefoneContato =  (param.telefoneContato) ? param.telefoneContato.toString().replace(/\s|-/gm,'') : '';
        const _dataNascimento = stringDataBr2Sql(param.dataNascimento);

        const _param= {
            id: param.id,
            nome: param.nome,
            nomeMae: param.nomeMae,
            sexo: param.sexo,
            email: param.email,
            cpf: _cpf,
            dataNascimento: _dataNascimento,
            celular: _celular,
            celular2: _celular2,
            telefoneContato: _telefoneContato
          }
        
        console.log(_url, _param);

        return (id == 0) ?
        http.post(_url, _param, { headers: { 'Authorization': `bearer ${token}`}}) 
            : http.put(_url, _param, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaPagamentoParcela: (token, param) => {
        const _url = 'ContratosAluguel/ParcelaQuita';
        console.log(_url, param);

        return http.put(_url, param, { headers: { 'Authorization': `bearer ${token}`}});
    },
    salvaQuitacaoRecebimento: (token, param) => {
        const _url = 'ContratosAluguel/RecebimentoQuita';
        return http.put(_url, param, { headers: { 'Authorization': `bearer ${token}`}});
    },
    // Outros Contrato
    assinaContrato: (token, id) => {
        const _url = `ContratosAluguel/${id}/Assina`;
        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },
    encerraContrato: (token, id, data) => {
        const _url = `ContratosAluguel/${id}/Encerra`;
        const _param= {data: data};
        return http.put(_url, _param, { headers: { 'Authorization': `bearer ${token}`}});
    },
    postergaContrato: (token, id) => {
        const _url = `ContratosAluguel/${id}/Posterga`;
        return http.put(_url, { headers: { 'Authorization': `bearer ${token}`}});
    },
    reajustaContrato: (token, id, data, valor) => {
        const _url = `ContratosAluguel/${id}/Reajusta`;
        const _param= {data: data, valorAluguel: valor};
        return http.put(_url, _param, { headers: { 'Authorization': `bearer ${token}`}});
    },
}