import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ITransferente } from '../../../../core/models/catalogs/transferente.model';
export const ISSUING_INSTITUTION_COLUMNS = {
  id: {
    title: 'No.',
    type: 'number',
    sort: false,
  },
  numClasif: {
    title: 'N° clasificación',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  manager: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
  street: {
    title: 'Calle',
    type: 'string',
    sort: false,
  },
  numInside: {
    title: 'N° interior',
    type: 'string',
    sort: false,
  },
  numExterior: {
    title: 'N° exterior',
    type: 'string',
    sort: false,
  },
  cologne: {
    title: 'Colonia',
    type: 'string',
    sort: false,
  },
  zipCode: {
    title: 'Código postal',
    type: 'number',
    sort: false,
  },
  delegMunic: {
    title: 'Delegación munic.',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'string',
    sort: false,
  },

  numCity: {
    title: 'Ciudad',
    type: 'string',
    valuePrepareFunction: (value: ICity) => {
      return value?.nameCity || '';
    },
    sort: false,
  },
  numTransference: {
    title: 'N° transferencia',
    type: 'string',
    valuePrepareFunction: (value: ITransferente) => {
      return value?.nameTransferent || '';
    },
    sort: false,
  },
};

export const INSTITUTION_COLUMNS = {
  id: {
    title: 'ID',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
};
