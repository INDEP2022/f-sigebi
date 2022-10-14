import { ICity } from '../../../../core/models/catalogs/city.model';
export const MINIPUB_COLUMNS = {
  id: {
    title: 'ID',
    type: 'number',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  responsable: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
  no_ciudad: {
    title: 'Ciudad',
    type: 'string',
    valuePrepareFunction: (value: ICity) => {
      return value?.nameCity;
    },
    sort: false,
  },
  calle: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },
  no_interior: {
    title: 'Número interior',
    type: 'string',
    sort: false,
  },
  no_exterior: {
    title: 'Número exterior',
    type: 'string',
    sort: false,
  },
  colonia: {
    title: 'Colonia',
    type: 'string',
    sort: false,
  },
  codigo_postal: {
    title: 'Código Postal',
    type: 'number',
    sort: false,
  },
  deleg_munic: {
    title: 'Delegación Municipal',
    type: 'string',
    sort: false,
  },
  telefono: {
    title: 'Teléfono',
    type: 'number',
    sort: false,
  },
  no_registro: {
    title: 'Número registro',
    type: 'number',
    sort: false,
  },
};
