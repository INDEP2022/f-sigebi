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
  delegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return `${row.delegationNumber} ${'-  ' + row?.delegation?.description}`;
    },
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
