export const SURVEILLANCE_LOG_COLUMNS: any = {
  binnacleId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  requestDate: {
    title: 'Fecha Solicitud',
    sort: false,
  },
  attentionDate: {
    title: 'Fecha Atención',
    type: 'number',
    sort: false,
  },
  processMnto: {
    title: 'Tipo de Mantenimiento',
    type: 'number',
    sort: false,
  },
  reasonMnto: {
    title: 'Motivo de Cambio',
    type: 'number',
    sort: false,
  },
  usrRequest: {
    title: 'Solicita',
    type: 'number',
    sort: false,
  },
  usrRun: {
    title: 'Ejecuta',
    type: 'number',
    sort: false,
  },
  usrAuthorize: {
    title: 'Autoriza',
    type: 'number',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    type: 'number',
    sort: false,
    filter: {
      type: 'text',
      config: {},
    },
    valuePrepareFunction: (cell: any, row: any) => {
      return `${row.delegationNumber} - ${row.delegation.description}`;
    },
  },
};
