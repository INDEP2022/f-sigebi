import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IState } from 'src/app/core/models/catalogs/state-model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

export const CITY_COLUMNS = {
  idCity: {
    title: 'No. Ciudad',
    type: 'number',
    sort: false,
  },
  nameCity: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  stateDetail: {
    title: 'Entidad Federativa',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IState) => {
      return value?.descCondition;
    },
    filterFunction(cell: any, search: string): boolean {
      let column = cell.descCondition;
      if (
        column?.toUpperCase().includes(search.toUpperCase()) ||
        search === ''
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  delegationDetail: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IDelegation) => {
      return value?.description;
    },
    filterFunction(cell: any, search: string): boolean {
      let column = cell.description;
      if (
        column?.toUpperCase().includes(search.toUpperCase()) ||
        search === ''
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  legendOffice: {
    title: 'Leyenda Oficio',
    type: 'string',
    sort: false,
  },
  SubDelegationDetail: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: ISubdelegation) => {
      return value?.description;
    },
    filterFunction(cell: any, search: string): boolean {
      let column = cell.description;
      if (
        column?.toUpperCase().includes(search.toUpperCase()) ||
        search === ''
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
