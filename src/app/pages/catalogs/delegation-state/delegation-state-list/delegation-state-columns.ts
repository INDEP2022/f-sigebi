import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';

export const DELEGATION_STATE_COLUMNS = {
  regionalDelegation: {
    title: 'Clave Delegación',
    type: 'string',
    sort: false,
  },
  regionalDelegationDetails: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  keyState: {
    title: 'Clave de Estado',
    type: 'number',
    sort: false,
  },
  stateCodeDetail: {
    title: 'Estado',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IStateOfRepublic) => {
      return value != null ? value.descCondition : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.descCondition;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  status: {
    title: 'Número de Contrato',
    type: 'number',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  // editionUser: {
  //   title: 'Modificado por',
  //   type: 'string',
  //   sort: false,
  // },
};
