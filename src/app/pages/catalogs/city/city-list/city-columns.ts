import { IState } from 'src/app/core/models/catalogs/state-model';

export const CITY_COLUMNS = {
  idCity: {
    title: 'No. Ciudad',
    type: 'string',
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
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.descCondition;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
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
    valuePrepareFunction: (value: any) => {
      return value?.description;
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
    valuePrepareFunction: (value: any) => {
      return value?.description;
    },
  },
};
