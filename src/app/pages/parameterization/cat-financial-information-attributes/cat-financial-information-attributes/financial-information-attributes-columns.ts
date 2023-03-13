export const FINANCIAL_INFO_ATTR_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
    filter: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
    filter: true,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: true,
  },
  type: {
    title: 'Tipo',
    sort: false,
    filter: true,
    valuePrepareFunction: (value: string) => {
      if (value == 'ACT') return 'Activo';
      if (value == 'PAS') return 'Pasivo';
      if (value == 'CAP') return 'Resultados';
      if (value == 'RES') return 'Adeudos';
      if (value == 'ADE') return 'Principales Cuentas';
      if (value == 'PRI') return 'Principales Cuentas';

      return value;
    },
  },
  subType: {
    title: 'Sub Tipo',
    sort: false,
    filter: true,
    valuePrepareFunction: (value: string) => {
      if (value == 'GEN') return 'Genérico';
      if (value == 'UTB') return 'Utilidad bruta';
      if (value == 'UTO') return 'Utilidad de operación';
      if (value == 'UTN') return 'Utilidad neta';

      return value;
    },
  },
};
