export const COLUMNS = {
  expedientNumber: {
    title: 'No. Expediente',
    sort: false,
  },
  wheelNumber: {
    title: 'No. volante',
    sort: false,
  },
  receiptDate: {
    title: 'Fecha Recepción Volante',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value ? value.split('T')[0].split('-').reverse().join('-') : value;
    },
  },
  preliminaryInquiry: {
    title: 'Averiguación Prevía',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal',
    sort: false,
  },
  circumstantialRecord: {
    title: 'Acta Circustanciada',
    sort: false,
  },
  protectionKey: {
    title: 'Amparo',
    sort: false,
  },
};
