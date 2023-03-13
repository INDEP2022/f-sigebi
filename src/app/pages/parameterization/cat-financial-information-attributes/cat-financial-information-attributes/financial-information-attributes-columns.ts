export const FINANCIAL_INFO_ATTR_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
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
        selectText: 'Seleccionar',
        list: [
          { value: 'ACT', title: 'Activo' },
          { value: 'PAS', title: 'Pasivo' },
          { value: 'CAP', title: 'Capital Contable' },
          { value: 'RES', title: 'Resultados' },
          { value: 'ADE', title: 'Adeudos' },
          { value: 'PRI', title: 'Principales Cuentas' },
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
