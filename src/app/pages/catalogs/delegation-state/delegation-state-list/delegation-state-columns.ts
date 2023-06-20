import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';

export const DELEGATION_STATE_COLUMNS = {
  regionalDelegationId: {
    title: 'Clave Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.id : '';
    },
  },
  regionalDelegation: {
    title: 'Delegación regional',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
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
    valuePrepareFunction: (value: IStateOfRepublic) => {
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
    type: 'number',
    sort: false,
  },
  // editionUser: {
  //   title: 'Modificado por',
  //   type: 'string',
  //   sort: false,
  // },
};
