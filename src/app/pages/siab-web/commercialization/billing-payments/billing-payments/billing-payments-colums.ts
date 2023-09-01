import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const BILLING_PAYMENTS_INVOICE_COLUMNS = {
  id_evento: {
    title: 'Evento',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    sort: false,
  },
  serie: {
    title: 'Serie',
    sort: false,
  },
  folio: {
    title: 'Folio',
    sort: false,
  },
  iva: {
    title: 'IVA',
    sort: false,
  },
  subtotal: {
    title: 'Sub Total',
    sort: false,
  },
  total: {
    title: 'Total',
    sort: false,
  },
  id_estatusfact: {
    title: 'Estado',
    sort: false,
  },
  formapago: {
    title: 'Método de Pago',
    sort: false,
  },
  condicionespago: {
    title: 'Condiciones de Pago',
    sort: false,
  },
  id_factura: {
    title: 'ID de Factura',
    sort: false,
  },
};

export const BILLING_PAYMENTS_COLUMNS = {
  id_evento: {
    title: 'Evento',
    sort: false,
  },
  lote_publico: {
    title: 'Lote',
    sort: false,
  },
  referencia: {
    title: 'Referencia',
    sort: false,
  },
  monto: {
    title: 'Monto',
    sort: false,
  },
  idordeningreso: {
    title: 'Orden de Ingreso',
    sort: false,
  },
  fechaoi: {
    title: 'Fecha OI',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fecha_afectacion: {
    title: 'Fecha Afectación',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },

  id_tipo_sat: {
    title: 'Tipo de Pago',
    sort: false,
  },
  id_pago: {
    title: 'Id de Pago',
    sort: false,
  },
  /*paymentTypes: {
    title: 'Tipos de pago',
    sort: false,
  },*/
};
