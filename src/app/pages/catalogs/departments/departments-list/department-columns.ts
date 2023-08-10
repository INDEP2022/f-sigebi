import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';

export const DEPARTMENT_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },

  dsarea: {
    title: 'Ds. Area',
    type: 'string',
    sort: false,
  },
  delegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IDelegation) => {
      return value?.description;
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
  numSubDelegation: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: ISubdelegation) => {
      return value?.description;
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
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  numRegister: {
    title: 'No. Registro',
    type: 'number',
    sort: false,
  },
  lastOffice: {
    title: 'Oficio',
    type: 'number',
    sort: false,
  },
  level: {
    title: 'Nivel',
    type: 'number',
    sort: false,
  },
  phaseEdo: {
    title: 'Etapa EDO',
    type: 'number',
    sort: false,
  },
};
