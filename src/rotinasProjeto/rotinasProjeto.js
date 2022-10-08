import mainService from '../services/mainService'
import store from '../store.js'

export function temAcesso (array, funcionalidadeId, tipoFuncionalidadeId, acao) {
    let achou = -1
    for (let i= 0; (i < array.length) && (achou == -1); ++i) {
        if ((funcionalidadeId == array[i].funcionalidadeId) && (array[i].tipoFuncionalidadeId === tipoFuncionalidadeId)) {
            if (tipoFuncionalidadeId == 1)
            { 
                switch (acao)
                {
                    case 'C':
                        achou = (array[i].consulta === 'S' ? i : achou);
                        break;
                    case 'A':
                        achou = (array[i].alteracao === 'S' ? i : achou);
                        break;
                    case 'I':
                        achou = (array[i].inclusao === 'S' ? i : achou);
                        break;
                    case 'E':
                        achou = (array[i].exclusao === 'S' ? i : achou);
                        break;
                    default:
                        achou = -1;
                }
            } else {
                achou = (array[i].consulta === 'S' ? i : achou);
            }
        }
    }
    return (achou !== -1) 
}
export function hoje() {
    const _dataAux = new Date()
    return new Date(_dataAux.getFullYear(),_dataAux.getMonth(),_dataAux.getDate())
}
export async function carregaDadosPersistentes() {
    let params = {
        //inquilinos: [],
        imoveis: []
    }
    
    let retorno = '';
    /*
    console.log('2')
    let respInquilino = await mainService.listaInquilinos()
        .catch(
            err => {
                retorno =  'ERR:3320-' + mainService.catchPadrao(err)
        });

    if (retorno) 
        return retorno;
    */
    
    let respImovel = await mainService.listaImoveis()
        .catch(
            err => {
                retorno =  'ERR:3321-' + mainService.catchPadrao(err)
        });
    
    if (retorno) 
        return retorno;
        
    //params.inquilinos = respInquilino.status == 200 ? respInquilino.data : [];
    params.imoveis = respImovel.status == 200 ? respImovel.data : [];
    
    store.commit('limpaDadosPersistentes');
    store.commit('salvaDadosPersistentes', params)

    return retorno;
}