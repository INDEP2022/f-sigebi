export const FINANCIAL_INFO_ATTR_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
    filter: true,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: {
      config: {},
    },
  },
  type: {
    title: 'Tipo',
    sort: false,
    /*  filter: true, */
    valuePrepareFunction: (value: string) => {
      if (value == 'ACT') return 'Activo';
      if (value == 'PAS') return 'Pasivo';
      if (value == 'CAP') return 'Capital Contable';
      if (value == 'RES') return 'Resultados';
      if (value == 'ADE') return 'Adeudos';
      if (value == 'PRI') return 'Principales Cuentas';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Tipo',
        list: [
          { value: 'ACT', title: 'ACT' },
          { value: 'PAS', title: 'PAS' },
          { value: 'CAP', title: 'CAP' },
          { value: 'RES', title: 'RES' },
          { value: 'ADE', title: 'ADE' },
          { value: 'PRI', title: 'PRI' },
        ],
      },
    },
  },
  subType: {
    title: 'Sub Tipo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'GEN') return 'Genérico';
      if (value == 'UTB') return 'Utilidad bruta';
      if (value == 'UTO') return 'Utilidad de operación';
      if (value == 'UTN') return 'Utilidad neta';

      return value;
    },
  },
};
