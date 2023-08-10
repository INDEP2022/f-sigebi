export const FRACTIONS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },

  code: {
    title: 'Código',
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
    valuePrepareFunction: (value: any) => {
      return value != null ? value.norm : '';
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

  /*clasificationName: {
    title: 'Clasificación',
    type: 'string',
    sort: false,
  },*/

  siabClasification: {
    title: 'Clasificación',
    type: 'string',
    valuePrepareFunction: (value: any) => {
      return value != null ? value.sssubtypeDescription : '';
    },
    sort: false,
    filterFunction(cell?: any, search?: string): boolean {
      //TODO:Validate FILTER
      let column = cell.sssubtypeDescription;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },

  version: {
    title: 'Versión',
    type: 'string',
    sort: false,
  },

  codeErp1: {
    title: 'Código  Erp 1',
    type: 'string',
    sort: false,
  },
  codeErp2: {
    title: 'Código  Erp 2',
    type: 'string',
    sort: false,
  },

  codeErp3: {
    title: 'Código  Erp 3',
    type: 'string',
    sort: false,
  },

  decimalAmount: {
    title: 'Cantidad en Decimal',
    type: 'string',
    sort: false,
  },

  status: {
    title: 'Estado',
    type: 'string',
    sort: false,

    filter: {
      type: 'list',
      config: {
        selectText: 'Estado',
        list: [
          { value: '2', title: 'Activo' },
          { value: '1', title: 'Inactivo' },
        ],
      },
    },
  },

  fractionCode: {
    title: 'Código de Fracción',
    type: 'number',
    sort: false,
  },
};
