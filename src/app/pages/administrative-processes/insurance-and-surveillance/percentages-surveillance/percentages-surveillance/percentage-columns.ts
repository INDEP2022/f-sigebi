export const PERCENTAGE_COLUMNS = {
  cveProcess: {
    title: 'Proceso',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccione un proceso',
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
  delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return `${row.delegationNumber} ${
        '-  ' + row?.delegationView?.description
      }`;
    },
  },
  delegationType: {
    title: 'Tipo',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccione un tipo',
        list: [
          { value: '1', title: 'Ferronal' },
          { value: '2', title: 'Sae' },
        ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const type = row.delegationType;
      if (type == 1) {
        return 'Ferronal';
      } else {
        return 'Sae';
      }
    },
  },
  percentage: {
    title: 'Porcentaje',
    type: 'number',
    sort: false,
  },
};
