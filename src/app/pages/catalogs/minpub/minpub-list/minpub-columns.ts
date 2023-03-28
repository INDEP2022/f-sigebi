import { ICity } from '../../../../core/models/catalogs/city.model';
export const MINIPUB_COLUMNS = {
  id: {
    title: 'ID',
    type: 'number',
    sort: false,
    //filter:false
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    filter: {
      config: {},
    },
  },
  manager: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
  city: {
    title: 'Ciudad',
    type: 'string',
    valuePrepareFunction: (value: ICity) => {
      return value?.nameCity;
    },
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameCity;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  street: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },
  insideNumber: {
    title: 'Número interior',
    type: 'string',
    sort: false,
  },
  outNumber: {
    title: 'Número exterior',
    type: 'string',
    sort: false,
  },
  colony: {
    title: 'Colonia',
    type: 'string',
    sort: false,
  },
  zipCode: {
    title: 'Código Postal',
    type: 'number',
    sort: false,
  },
  delegNunic: {
    title: 'Delegación Municipal',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'number',
    sort: false,
  },
};
