export const COLUMNS = {
  solnumId: {
    title: 'Id. Proceso',
    sort: false,
  },
  solnumDate: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value ? value.split('-').reverse().join('-') : '';
    },
  },
  solnumStatus: {
    title: 'Estatus Solicitud',
    sort: false,
    valuePrepareFunction: (value: string) => {
      const status: any = {
        S: () => 'SOLICITADA',
        P: () => 'PROCESADA',
        C: () => 'CANCELADA',
      };
      return ['S', 'P', 'C'].includes(value) ? status[value]() : '';
    },
  },
  description: {
    title: 'Concepto',
    sort: false,
  },
};
