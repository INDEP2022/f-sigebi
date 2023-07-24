import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';

export const WAREHOUSE_COLUMNS = {
  idWarehouse: {
    title: 'No. Almacen',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  ubication: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  // DetManager: {
  //   title: 'Responsable',
  //   type: 'string',
  //   sort: false,
  // },
  // detType: {
  //   title: 'Tipo',
  //   type: 'string',
  //   sort: false,
  // },
  // registerNumber: {
  //   title: 'No. de registro',
  //   type: 'string',
  //   sort: false,
  // },
  stateCode: {
    title: 'Estado',

    valuePrepareFunction: (value: IStateOfRepublic) => {
      return value?.descCondition;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
    type: 'string',
    sort: false,
  },
  cityCode: {
    title: 'Ciudad',
    valuePrepareFunction: (value: ICity) => {
      return value?.nameCity;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
    type: 'string',
    sort: false,
  },
  municipalityCode: {
    title: 'Municipio',
    valuePrepareFunction: (value: IMunicipality) => {
      return value?.nameMunicipality;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
    type: 'string',
    sort: false,
  },
  localityCode: {
    title: 'Localidad',
    valuePrepareFunction: (value: ILocality) => {
      return value?.nameLocation;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
    type: 'string',
    sort: false,
  },
  indActive: {
    title: 'Activo',
    type: 'string',
    sort: false,
  },
};
