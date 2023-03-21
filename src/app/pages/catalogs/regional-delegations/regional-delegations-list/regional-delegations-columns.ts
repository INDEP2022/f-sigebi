import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';

export const REGIONAL_DELEGATIONS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  registerNumber: {
    title: 'Número de registro',
    type: 'number',
    sort: false,
  },
  zoneGeographic: {
    title: 'Zona geográfica',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IZoneGeographic) => {
      return value.description;
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
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  regionalDelegate: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  officeAddress: {
    title: 'Domicilio oficina',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  keyZone: {
    title: 'Clave Zona Delegacional',
    type: 'string',
    sort: false,
  },
  iva: {
    title: 'IVA',
    type: 'string',
    sort: false,
  },
  city: {
    title: 'Ciudad',
    type: 'string',
    sort: false,
  },
  keyState: {
    title: 'Clave de Estado de la Zona',
    type: 'string',
    sort: false,
  },
};
