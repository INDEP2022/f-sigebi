import { DatePipe } from '@angular/common';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const REFUND_CONTROL_COLUMNS = {
  ctlDevPagId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  cveCtlDevPag: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  idEstatus: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  direccion: {
    title: 'Dis.',
    type: 'string',
    sort: false,
  },
  idTipoDisp: {
    title: 'Tipo Dispersión',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        if (value == '1') {
          return 'Por Cliente';
        } else {
          return 'Por Lote';
        }
      } else {
        return '';
      }
    },
  },
  idOrigen: {
    title: 'Origen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        if (value == '1') {
          return 'No Ganadores';
        } else {
          return 'Ganadores';
        }
      } else {
        return '';
      }
    },
  },
  fecCreacion: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  fecTermino: {
    title: 'Fecha Término',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
};

export const RELATED_EVENT_COLUMNS = {
  eventId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Cve. Proceso',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.event) {
        if (row.event.processKey) {
          return row.event.processKey;
        } else {
          return 'Clave NO Encontrada';
        }
      } else {
        return 'Clave NO Encontrada';
      }
    },
  },
  numPayments: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  paymentsAmount: {
    title: 'Monto',
    type: 'number',
    sort: false,
    filter: false,
  },
};

export const BANK_ACCOUNTS_COLUMNS = {
  // status: {
  //   title: 'Estatus',
  //   type: 'string',
  //   sort: false,
  // },
  cveBank: {
    title: 'Cve. Banco',
    type: 'string',
    sort: false,
  },
  account: {
    title: 'Cuenta',
    type: 'string',
    sort: false,
  },
  countPayments: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  amountPayments: {
    title: 'Monto',
    type: 'number',
    sort: false,
    filter: false,
  },
  idwaste: {
    title: 'Id Gasto',
    type: 'number',
    sort: false,
  },
  idCtldevpag: {
    title: 'Id Pago',
    type: 'number',
    sort: false,
  },
  numberInvoicePay: {
    title: 'Folio Pag.',
    type: 'number',
    sort: false,
  },
  datePay: {
    title: 'Fecha Pago',
    type: 'number',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  numberCheck: {
    title: 'No. de Cheque',
    type: 'number',
    sort: false,
  },
  obscanc: {
    title: 'Observaciones de Cancelación',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  _fis: {
    title: 'FIS',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
  },
  _cnt: {
    title: 'CNT',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
  },
  _pto: {
    title: 'PTO',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
  },
  _tsr: {
    title: 'TSR',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        console.log(data);
      });
    },
  },
};

export const PAYMENT_COLUMNS = {
  paymentId: {
    title: 'Id Pago',
    type: 'string',
    sort: false,
  },
  paymentDate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
  },
  id: {
    title: 'Referencia',
    type: 'number',
    sort: false,
  },
  date: {
    title: 'Monto',
    type: 'string',
    sort: false,
  },
  _reference: {
    title: 'Lote',
    type: 'string',
    sort: false,
  },
  _clientId: {
    title: 'Id Cliente',
    type: 'number',
    sort: false,
  },
  name: {
    title: 'Nombre / Denominación',
    type: 'string',
    sort: false,
  },
  crossBankKey: {
    title: 'Clabe Interbancaria',
    type: 'string',
    sort: false,
  },
  keyAuthorization: {
    title: 'Autoriza Cambio Clabe',
    type: 'string',
    sort: false,
  },
  keyChangeObservations: {
    title: 'Observaciones de Cambio Clabe',
    type: 'string',
    sort: false,
  },
  transferDateObservations: {
    title: 'Observaciones de Fecha de Transferencia',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Clabe Válida',
    type: 'custom',
    sort: false,
  },
  dateTransfer: {
    title: 'Fecha Transf.',
    type: 'string',
    sort: false,
  },
};
