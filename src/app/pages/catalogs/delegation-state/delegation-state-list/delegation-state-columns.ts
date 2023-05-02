export const DELEGATION_STATE_COLUMNS = {
  regionalDelegation: {
    title: 'Registro',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  stateCode: {
    title: 'Código de estado',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.codeCondition;
    },
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  keyState: {
    title: 'Clave de estado',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  editionUser: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
};
