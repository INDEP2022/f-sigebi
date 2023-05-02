import { format } from 'date-fns';

export const NOTIFICATIONS_FILE_LOAD_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  captureDate: {
    title: 'Fecha de Captura',
    type: 'string',
    valuePrepareFunction: (captureDate: Date) => {
      return captureDate ? format(new Date(captureDate), 'dd/MM/yyyy') : '';
    },
    sort: false,
  },
  receiptDate: {
    title: 'Fecha de Recepción',
    type: 'string',
    valuePrepareFunction: (captureDate: Date) => {
      return captureDate ? format(new Date(captureDate), 'dd/MM/yyyy') : '';
    },
    sort: false,
  },
  officeNumber: {
    title: 'No. Oficio',
    type: 'number',
    sort: false,
  },
  affairDescription: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
  protectionKey: {
    title: 'Cve. Amparo',
    type: 'string',
    sort: false,
  },
  departmentDescription: {
    title: 'Área Destino',
    type: 'string',
    sort: false,
  },
};
