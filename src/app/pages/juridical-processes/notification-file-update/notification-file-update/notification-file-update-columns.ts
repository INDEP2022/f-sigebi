import { DatePipe } from '@angular/common';
export const NOTIFICATION_COLUMNS = {
  wheelNumber: {
    title: 'No Volante',
    type: 'number',
    sort: false,
  },
  affairKey: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    type: 'date',
    valuePrepareFunction: (date: any) => {
      if (date) {
        return new DatePipe('en-US').transform(date, 'dd-MM-yyyy');
      }
      return '';
    },
  },
  protectionKey: {
    title: 'Clave Amparo',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  expedientNumber: {
    title: 'No Expediente',
    type: 'number',
    sort: false,
  },
};
