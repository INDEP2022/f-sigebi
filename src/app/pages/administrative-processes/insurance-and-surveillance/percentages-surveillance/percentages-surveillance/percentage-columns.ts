export const PERCENTAGE_COLUMNS = {
  cveProcess: {
    title: 'Proceso',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Supervisión' },
          { value: '2', title: 'Validación' },
        ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const process = row.cveProcess;
      if (process == 1) {
        return 'Supervisión';
      } else {
        return 'Validación';
      }
    },
  },
  delegation_: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (_cell: any, row: any) => {
    //   return `${row?.delegation?.id} ${'-  ' + row?.delegation?.description}`;
    // },
    // filterFunction: (cell?: any, search?: string) => {
    //   return search != null ? search : '';
    // },
  },
  delegationType: {
    title: 'Tipo',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Ferronal' },
          { value: '2', title: 'INDEP' },
        ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const type = row.delegationType;
      if (type == 1) {
        return 'Ferronal';
      } else {
        return 'INDEP';
      }
    },
  },
  percentage: {
    title: 'Porcentaje %',
    type: 'number',
    sort: false,
  },
};
