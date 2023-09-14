import { DatePipe } from '@angular/common';

export const PAY_BANK_COLUMNS = {
  movementNumber: {
    title: 'No. Movimiento',
    sort: false,
    editable: false,
  },
  cve_bank: {
    title: 'Banco',
    sort: false,
    editable: false,
  },
  date: {
    title: 'Fecha',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  reference: {
    title: 'Referencia',
    sort: false,
    editable: false,
  },
  amount: {
    title: 'Depósito',
    sort: false,
    editable: false,
    class: 'bg-info text-light',
    valuePrepareFunction: (value: any) => {
      if (!isNaN(parseFloat(value))) {
        return new Intl.NumberFormat('es-MX').format(value);
      } else {
        return '0.00';
      }
    },
  },
  entryorderid: {
    title: 'No. Orden Ingreso',
    sort: false,
    editable: false,
  },
  system_val_date: {
    title: 'Fecha OI',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  payId: {
    title: 'No. Pago',
    sort: false,
    editable: false,
  },
};

export const RECEIVED_PAYS_COLUMNS = {
  payIdGens: {
    title: 'Pago Destino',
    sort: false,
    editable: false,
  },
  payId: {
    title: 'Pago Origen',
    sort: false,
    editable: false,
  },
  amount: {
    title: 'Monto Mensual',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: any) => {
      if (!isNaN(parseFloat(value))) {
        return new Intl.NumberFormat('es-MX').format(value);
      } else {
        return '0.00';
      }
    },
  },
  reference: {
    title: 'Referencia',
    sort: false,
    editable: false,
  },
  impWithoutIva: {
    title: 'Monto Sin Iva',
    sort: false,
    editable: false,
    class: 'bg-info text-light',
    valuePrepareFunction: (value: any) => {
      if (!isNaN(parseFloat(value))) {
        return new Intl.NumberFormat('es-MX').format(value);
      } else {
        return '0.00';
      }
    },
  },
  iva: {
    title: 'Iva',
    sort: false,
    editable: false,
  },
  ivaAmount: {
    title: 'Monto Iva',
    sort: false,
    editable: false,
    class: 'bg-warning text-light',
    valuePrepareFunction: (value: any) => {
      if (!isNaN(parseFloat(value))) {
        return new Intl.NumberFormat('es-MX').format(value);
      } else {
        return '0.00';
      }
    },
  },
  abonoComp: {
    title: 'Abono / Comp.',
    sort: false,
    editable: false,
  },
  actPay: {
    title: 'Pago Actual',
    sort: false,
    editable: false,
    class: 'bg-success text-light',
    valuePrepareFunction: (value: any) => {
      if (!isNaN(parseFloat(value))) {
        return new Intl.NumberFormat('es-MX').format(value);
      } else {
        return '0.00';
      }
    },
  },
  deduxcent: {
    title: 'Rec. Gast. (%)',
    sort: false,
    editable: false,
  },
  deduvalue: {
    title: 'Rec. Gast. Valor',
    sort: false,
    editable: false,
  },
  processDate: {
    title: 'Fecha Proceso',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  status: {
    title: 'Estatus',
    type: 'html',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case 'P':
            value = `<div class="badge badge-pill bg-success text-wrap ml-2 mr-2">Pagado</div>`;
            return value;
            break;
          case 'A':
            value = `<div class="badge badge-pill bg-info text-wrap ml-2 mr-2">Abonado</div>`;
            return value;
            break;
          case 'C':
            value = `<div class="badge badge-pill bg-warning text-wrap ml-2 mr-2">Complementado</div>`;
            return value;
            break;
          default:
            return value;
            break;
        }
      }
    },
  },
  payObserv: {
    title: 'Observaciones del Pago',
    sort: false,
    editable: false,
  },
  deduObserv: {
    title: 'Observaciones del Reconocimiento',
    sort: false,
    editable: false,
  },
};
