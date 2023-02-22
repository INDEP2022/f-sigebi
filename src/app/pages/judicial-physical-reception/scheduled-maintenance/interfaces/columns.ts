export const ACTAS_BY_GOOD_COLUMNS = {
  acta: {
    title: 'Programa de Recepción/Entrega',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  typeActa: {
    title: 'Tipo Programación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
};

export const COORDINATIONS_COLUMNS = {
  id: {
    title: 'ID',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};
