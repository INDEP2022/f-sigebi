export const DELEGATION_STATE_COLUMNS = {
  keyDelegation: {
    title: 'Clave Delegacion',
    type: 'string',
    sort: false,
  },
  regionalDelegation: {
    title: 'Delegación reginal',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  keyState: {
    title: 'Clave de estado',
    type: 'number',
    sort: false,
  },
  stateCode: {
    title: 'Estado',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.descCondition : '';
    },
  },
  // version: {
  //   title: 'Versión',
  //   type: 'number',
  //   sort: false,
  // },

  status: {
    title: 'Número de contrato',
    type: 'string',
    sort: false,
  },
  // editionUser: {
  //   title: 'Modificado por',
  //   type: 'string',
  //   sort: false,
  // },
};
