export const DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS = {
  numDelegation: {
    title: 'Nombre Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  numSubDelegation: {
    title: 'Nombre Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  id: {
    title: 'Área',
    type: 'string',
    sort: false,
  },
  dsarea: {
    title: 'Siglas Área',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Nombre Área',
    type: 'string',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_AFFAIR_COLUMNS = {
  id: {
    title: 'Número',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Tipo de Asunto',
    type: 'string',
    sort: false,
  },
  clv: {
    title: 'Relación Bienes.',
    type: 'string',
    sort: false,
  },
};
