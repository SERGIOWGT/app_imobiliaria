import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const enumNomeTabela = {
    config: 'dbg__config',
    inquilino: 'dbg__inquilinos',
    imovel: 'dbg__imoveis',
}

const store = new Vuex.Store({
    state: {
        estaOnline: false,
        estaLogado: false,
        loginFinalizado: false,
        userBarAtivo: false,
        infosSistema: {
            nome: '',
            id: '',
            nomePlataforma: '',
            plataformaId: '',
            urlImagem: '',
            tamanhoMaximoSenha: 0,
            tamanhoMinimoSenha: 0,
            formatoSenha: '',
            mensagemErroFormatoSenha: ''
        },
        infosUsuario: {
            email: '',
            ssoToken: '',
            nomeUsuario: '',
            usuarioId: '',
            usuarioGuid: '',
            apiToken: '',
            autenticado: false,
        },
        permissionamento: '',
        db: {
            tbConfig: {
              dataCarga: '',
              versao: ''
            },
            tbInquilinos: [],
            tbImoveis: [],
        },
    },
    mutations: {
        autenticadoApi (state, obj) {
            state.infosUsuario.autenticado = obj.autenticado
            state.infosUsuario.apiToken = obj.token
        },
        autenticadoSso (state, obj) {
            state.estaLogado = true
            state.infosUsuario.email = obj.email
            state.infosUsuario.ssoToken = obj.token
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = obj.nomeUsuario
            state.infosUsuario.usuarioId = obj.usuarioId
            state.infosUsuario.usuarioGuid = obj.usuarioGuid
            state.permissionamento = obj.permissionamento
        },
        carregaDadosPersistentes(state) {
            //state.db.tbInquilinos = JSON.parse(localStorage.getItem(enumNomeTabela.inquilino) ||'[]');
            state.db.tbImoveis = JSON.parse(localStorage.getItem(enumNomeTabela.imovel) ||'[]');
        },
        finalizaLogin (state, obj) {
            state.loginFinalizado = obj
        },
        habilitaUserbar (state, obj) {
            state.userBarAtivo = obj
        },
        init(state) {
            if (localStorage.getItem(enumNomeTabela.config)){
                state.db.tbConfig = JSON.parse(localStorage.getItem(enumNomeTabela.config));
            }
            else {
                state.db.tbConfig.dataCarga = '';
                state.db.tbConfig.versao = '';
            }
        },
        limpaDadosPersistentes(state) {
            state.db.tbConfig.dataCarga = '';
            state.db.tbConfig.versao = '';
            //state.db.tbInquilinos = [];
            state.db.tbImoveis = [];

            localStorage.removeItem(enumNomeTabela.config);
            //localStorage.removeItem(enumNomeTabela.inquilino);
            localStorage.removeItem(enumNomeTabela.imovel);
        },
        logout(state) {
            state.loginFinalizado = false
            state.estaLogado = false
            state.infosUsuario.autenticado = false
            state.infosUsuario.email = ''
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = ''
            state.infosUsuario.usuarioId = ''
            state.permissionamento = ''
        }, 
        salvaDadosPersistentes(state, dados) {
            //state.db.tbInquilinos = dados.inquilinos;
            state.db.tbImoveis = dados.imoveis;
    
            state.db.tbConfig.dataCarga = new Date();
            state.db.tbConfig.versao = 'v1.0'

            localStorage.setItem(enumNomeTabela.config, JSON.stringify(state.db.tbConfig));
            localStorage.setItem(enumNomeTabela.imovel, JSON.stringify(dados.imoveis));
            //localStorage.setItem(enumNomeTabela.inquilino, JSON.stringify(dados.inquilinos));
        },
        setaPermissao (state, obj) {
            state.permissionamento = obj
        },
        setaConfiguracaoSistema (state,  obj) {
            state.infosSistema.nome = obj.nomeSistema
            state.infosSistema.nomePlataforma = obj.nomePlataforma
            state.infosSistema.plataformaId = obj.plataformaId
            state.infosSistema.id = obj.sistemaId
            state.infosSistema.urlImagem = obj.urlImagem
            state.infosSistema.tamanhoMaximoSenha = obj.tamanhoMaximoSenha,
            state.infosSistema.tamanhoMinimoSenha = obj.tamanhoMinimoSenha,
            state.infosSistema.formatoSenha = obj.formatoSenha
            state.infosSistema.mensagemErroFormatoSenha = obj.mensagemErroFormatoSenha
        }, 
        setaStatusRede (state, status) {
          state.estaOnline = status
        },
    },
    getters: {
        estaOnLine: state => state.estaOnline,
        //configuracaoSistema: state => state.configuracaoSistema,

        loginFinalizado: state => state.loginFinalizado,
        estaLogado: state => state.estaLogado,
        userBarAtivo: state => state.userBarAtivo && state.loginFinalizado,

        estaAutenticadoApi: state => state.infosUsuario.autenticado,
        email: state => state.infosUsuario.email,
        ssoToken: state => state.infosUsuario.ssoToken,
        apiToken: state => state.infosUsuario.apiToken,
        usuarioId: state => state.infosUsuario.usuarioId,
        usuarioGuid: state => state.infosUsuario.usuarioGuid,
        nomeUsuario: state => state.infosUsuario.nomeUsuario,
        autenticadoApi: state => state.infosUsuario.apiToken != '',

        permissionamento: state => state.permissionamento,

        tamanhoMinimoSenha: state => state.infosSistema.tamanhoMinimoSenha,
        tamanhoMaximoSenha: state => state.infosSistema.tamanhoMaximoSenha,
        formatoSenha: state => state.infosSistema.formatoSenha,
        mensagemErroFormatoSenha: state => state.infosSistema.mensagemErroFormatoSenha,
        sistemaId: state => state.infosSistema.id,
        nomeSistema: state => state.infosSistema.nome,
        plataformaId: state => state.infosSistema.plataformaId,
        nomePlataforma: state => state.infosSistema.nomePlataforma,
        
        // db
        dbDataCarga (state) {
            if (state.db.tbConfig)
                if (state.db.tbConfig.dataCarga)
                    return state.db.tbConfig.dataCarga
                    
            return null;
        },
        Inquilinos: state => state.db.tbInquilinos,
        InquilinoById: (state) => (id) => {return state.db.tbInquilinos.find((x) => {return x.id === id});},

        Imoveis: state => state.db.tbImoveis,
        ImovelById: (state) => (id) => {return state.db.tbImoveis.find((x) => {return x.id === id});},
    }
  })
  export default store