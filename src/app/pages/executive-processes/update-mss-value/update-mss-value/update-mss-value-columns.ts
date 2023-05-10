export const UPDATE_MASS_VALUE_COLUMNS = {
  SOLICITANTE: {
    title: 'Solicitante',
    width: '25px',
    type: 'string',
    sort: false,
  },
  FECAVALUO: {
    title: 'Fecha de Avalúo',
    type: 'string',
    sort: false,
    /*valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      console.log(typeof value)
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },*/
  },
  INSTITUCION: {
    title: 'Institución',
    type: 'string',
    sort: false,
  },
  PERITO: {
    title: 'Perito',
    type: 'string',
    sort: false,
  },
  OBSERV: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
  NOBIEN: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  VALORAVALUO: {
    title: 'Valor avalúo',
    type: 'string',
    sort: false,
  },
  MONEDA: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
};
