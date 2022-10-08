export function regraDataValida(obr) {
      // eslint-disable-next-line no-useless-escape
      if (obr)
        return v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Data inválida'  // eslint-disable-line
      else
        return v => !v || /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Data inválida'  // eslint-disable-line
}