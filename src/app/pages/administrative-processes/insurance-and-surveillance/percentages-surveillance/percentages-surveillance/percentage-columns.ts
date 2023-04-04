export const PERCENTAGE_COLUMNS = {
  cveProcess: {
    title: 'Proceso',
    type: 'number',
    sort: false,

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
  },
  delegationType: {
    title: 'Tipo',
    type: 'number',
    sort: false,
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
