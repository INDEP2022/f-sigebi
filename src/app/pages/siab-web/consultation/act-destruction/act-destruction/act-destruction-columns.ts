import { DatePipe } from '@angular/common';

export const ACT_DESTRUCTION_COLUMNS = {
  /*no: {
    title: 'No.',
    sort: false,
  },*/
  caseNumber: {
    title: 'Expediente',
    sort: false,
  },
  document: {
    title: 'Acta',
    sort: false,
  },
  noDocument: {
    title: 'No.Acta',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  status: {
    title: 'Estatus',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'CERRADA')
        return '<strong><span class="badge badge-pill badge-soft-info">CERRADA</span></strong>';
      if (value == 'ABIERTA')
        return '<strong><span class="badge badge-pill badge-soft-info">ABIERTA</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'CERRADA', title: 'CERRADA' },
          { value: 'ABIERTA', title: 'ABIERTA' },
        ],
      },
    },
  },
};

export const ACT_DESTRUCTION_DETAIL_COLUMNS = {
  good: {
    title: 'Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  receive: {
    title: 'Recibido',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-soft-info">SI</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-soft-info">NO</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'SI' },
          { value: '0', title: 'NO' },
        ],
      },
    },
  },
};
