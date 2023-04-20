export const ATT_REG_LOG_TAB_COLUMNS = {
  // idNmTable: {
  //   title: 'No. Tabla',
  //   sort: false,
  // },
  keyAtrib: {
    title: 'No. Atributo',
    sort: false,
  },
  descriptionAtrib: {
    title: 'Descripción',
    sort: false,
  },
  swFormat: {
    title: 'Formato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'N') return 'Numérico';
      if (value == 'V') return 'Alfanumérico';
      if (value == 'D') return 'Fecha';
      if (value == 'F') return 'Flotante';

      return value;
    },
  },
  longMax: {
    title: 'Longitud Máxima',
    sort: false,
  },
  longMin: {
    title: 'Longitud Mínima',
    sort: false,
  },
};

export const LOG_TAB_COLUMNS = {
  // table: {
  //   title: 'Id',
  //   sort: false,
  //   width: '1%',
  // },
  description: {
    title: 'Descripcion',
    sort: false,
  },
  tableType: {
    title: 'Tipo de tabla',
    sort: false,
  },
};
