export const NOTIFICATIONS_COLUMNS = {
  wheelNumber: { title: 'No. Volante' },
  captureDate: {
    title: 'Fec. Captura',
    valuePrepareFunction: (value: string) => {
      return value ? new Date(value).toLocaleDateString() : '';
    },
  },
  officeExternalKey: { title: 'Cve. Oficio Externo' },
  externalOfficeDate: {
    title: 'Fec. Oficio Externo',
    valuePrepareFunction: (value: string) => {
      return value ? new Date(value).toLocaleDateString() : '';
    },
  },
  externalRemitter: { title: 'Remitente externo' },
  protectionKey: { title: 'Cve. Amparo' },
  touchPenaltyKey: { title: 'Cve. Toca Penal' },
  circumstantialRecord: { title: 'Acta Circunstanciada' },
  preliminaryInquiry: { title: 'Averiguación Previa' },
  criminalCase: { title: 'Causa Penal' },
};

export const GOODS_COLUMNS = {
  id: { title: 'No. Bien' },
  status: {
    title: 'Estatus',
  },
  description: { title: 'Descripción' },
};
