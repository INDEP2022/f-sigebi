import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';

export const DETAIL_DELEGATION_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  numberDelegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  area: {
    title: 'Área',
    type: 'string',
    sort: false,
  },
  location: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },
  numP1: {
    title: 'Teléfonos',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string, row: IDetailDelegation) => {
      return `${row.tel1 != null ? row.tel1 : ''}<br>${
        row.tel2 != null ? row.tel2 : ''
      }<br>${row.tel3 != null ? row.tel3 : ''}`;
    },
  },
};
