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

export const DOCUMENTS_RECEPTION_SELECT_SUBJECT_COLUMNS = {
  numDelegation: {
    title: 'Del.',
    type: 'string',
    sort: false,
  },
  descDelegation: {
    title: 'Nombre Delegación',
    type: 'string',
    sort: false,
  },
  numSubDelegation: {
    title: 'SubDel.',
    type: 'string',
    sort: false,
  },
  descSubDelegation: {
    title: 'Nombre Subdelegación',
    type: 'string',
    sort: false,
  },
  idArea: {
    title: 'Área',
    type: 'string',
    sort: false,
  },
  dsArea: {
    title: 'Siglas Área',
    type: 'string',
    sort: false,
  },
  descArea: {
    title: 'Nombre Área',
    type: 'string',
    sort: false,
  },
};
