export const SERVICES_COLUMS = {
  code: {
    title: 'Código',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  unaffordabilityCriterion: {
    title: 'Criterio de Incosteabilidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'Y') return 'SI';
      if (value == 'N') return 'NO';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'Y', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
  },
  subaccount: {
    title: 'Subcuenta del Servicio',
    type: 'number',
    sort: false,
  },
  cost: {
    title: 'Costo o Gasto',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'GASTO', title: 'GASTO' },
          { value: 'COSTO', title: 'COSTO' },
        ],
      },
    },
  },
};
