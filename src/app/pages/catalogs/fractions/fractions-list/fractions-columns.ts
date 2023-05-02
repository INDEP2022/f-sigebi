import { INorm } from 'src/app/core/models/catalogs/norm.model';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';

export const FRACTIONS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },

  code: {
    title: 'Codigo',
    type: 'string',
    sort: false,
  },

  level: {
    title: 'Nivel',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  norms: {
    title: 'Norma',
    type: 'string',
    valuePrepareFunction: (nom: INorm) => {
      return nom?.norm;
    },
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      //TODO:Validate FILTER
      let column = cell.norm;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },

  clasificationId: {
    title: 'Clasificación',
    type: 'string',
    valuePrepareFunction: (clasification: ISiabClasification) => {
      return clasification?.sssubtypeDescription;
    },
    sort: false,
  },

  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },

  version: {
    title: 'Version',
    type: 'string',
    sort: false,
  },

  codeErp1: {
    title: 'Codigo Erp 1',
    type: 'string',
    sort: false,
  },
  codeErp2: {
    title: 'Codigo Erp 2',
    type: 'string',
    sort: false,
  },

  codeErp3: {
    title: 'Codigo Erp 3',
    type: 'string',
    sort: false,
  },

  decimalAmount: {
    title: 'Cantidad en decimal',
    type: 'string',
    sort: false,
  },

  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },

  fractionCode: {
    title: 'Codigo de fracción',
    type: 'string',
    sort: false,
  },
};
