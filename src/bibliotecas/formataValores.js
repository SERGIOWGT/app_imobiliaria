export function formataCpf(v) {return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} ; // eslint-disable-line
export function formataCnpj(v) {return (v.length == 11) ? v.toString().replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3') : v.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')}
export function formataCelular(v) {return ((v.length == 11) ? v.toString().replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3') : v.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3'))} 
export function stringDataSql2Br(v) {
    if (!v) return null;

    if (v.length > 10)
        v = v.substring(0,10);

    const [year, month, day] = v.split('-')
    return `${day}/${month}/${year}`
}
export function stringDataBr2Sql(v) {
    if (!v) return null;

    if (v.length > 10)
        v = v.substring(0,10);

    const [day, month, year] = v.split('/')
    return `${year}-${month}-${day}`
}
export function data2String(data, padrao) {
    if (!data)
        return ''
    padrao = (padrao == null) ? 'SQL' : padrao.toUpperCase();

    const _dia = data.getDate().toString().padStart(2, "0")
    const _mes = (data.getMonth() + 1).toString().padStart(2, "0")
    
    return (padrao == 'BR') ? 
        `${_dia}/${_mes}/${data.getFullYear()}` : `${data.getFullYear()}-${_mes}-${_dia}`
}
export function string2Data(data, formato, delimitador) {
    const _formato = formato.toLowerCase();
    const _itens = _formato.split(delimitador)
    const _itensData = data.split(delimitador)

    const _iMes =_itens.indexOf("mm");
    const _iDia =_itens.indexOf("dd");
    const _iAno=_itens.indexOf("yyyy");

    let _mes =parseInt(_itensData[_iMes]);
    _mes--;
        
    return new Date(_itensData[_iAno], _mes,_itensData[_iDia]);
}
export function strDateTime2StrDateBr(dateTime, formato, delimitador) {

    if (!dateTime) {
        return '';
    }
    const _dataSplit = dateTime.split('T');
    if (_dataSplit.length == 0)
        return '';

    const _data = _dataSplit[0];
    const _formato = formato.toLowerCase();
    const _itens = _formato.split(delimitador)
    const _itensData = _data.split(delimitador)

    const _iMes =_itens.indexOf("mm");
    const _iDia =_itens.indexOf("dd");
    const _iAno=_itens.indexOf("yyyy");
        
    return `${_itensData[_iDia]}/${_itensData[_iMes]}/${_itensData[_iAno]}`;
}

/*

export default {
    data(val) {
        if (!val) return null;

        const [year, month, day] = val.split('-')
        return `${day}/${month}/${year}`

        //return val.toString().replace(/(\d{4})\-(\d{2})\-(\d{2})/,'$3/$2/$1'); // eslint-disable-line
    },
    strDataSqlToBr(val) {
        if (!val) return null;

        if (val.length > 10)
            val = val.substring(0,10);

        const [year, month, day] = val.split('-')
        return `${day}/${month}/${year}`

        //return val.toString().replace(/(\d{4})\-(\d{2})\-(\d{2})/,'$3/$2/$1'); // eslint-disable-line
    },
    dataYYYYMMDD(val) {
        var mm = val.getMonth() + 1; // getMonth() is zero-based
        var dd = val.getDate();
      
        return [val.getFullYear(),'-',
                (mm>9 ? '' : '0') + mm,'-',
                (dd>9 ? '' : '0') + dd
               ].join('');
    },
    dataDDMMYYYY(val, sep) {
        var mm = val.getMonth() + 1; // getMonth() is zero-based
        var dd = val.getDate();
      
        return [(dd>9 ? '' : '0') + dd, sep, 
                (mm>9 ? '' : '0') + mm, sep,
                val.getFullYear()
               ].join('');
    }

*/