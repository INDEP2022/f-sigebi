import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const AUCTION_REPORT_COLUMNS = {
  lote_publico: {
    title: 'Lote Publico',
    sort: false,
  },
  desc_lote: {
    title: 'Descripción',
    sort: false,
  },
  tipo: {
    title: 'Tipo',
    sort: false,
  },
  importe: {
    title: 'Importe',
    sort: false,
  },
  vigencia: {
    title: 'Vigencia',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      //var raw = new Date(`'${date}'`);
      //console.log(raw);
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(
        date,
        'dd/MM/yyyy',
        'UTC'
      );
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  linea_captura: {
    title: 'Linea Captura',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  id_cliente: {
    title: 'Id Cliente',
    sort: false,
  },
  desc_vista: {
    title: 'Descripción Vista',
    type: 'html',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Vista',
        list: [
          { value: 'VISTA', title: 'VISTA' },
          { value: 'NO VISTA', title: 'NO VISTA' },
        ],
      },
    },
  },
};

export const AUCTION_REPORT_COLUMNS1 = {
  lote_publico: {
    title: 'Lote Publico',
    sort: false,
  },
  desc_lote: {
    title: 'Descripción',
    sort: false,
  },
  tipo: {
    title: 'Tipo',
    sort: false,
  },
  importe: {
    title: 'Importe',
    sort: false,
  },
  vigencia: {
    title: 'Vigencia',
    sort: false,
    /*valuePrepareFunction: (date: Date) => {
      //var raw = new Date(`'${date}'`);
      //console.log(raw);
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(date, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  linea_captura: {
    title: 'Linea Captura',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  id_cliente: {
    title: 'Id Cliente',
    sort: false,
  },
  desc_vista: {
    title: 'Descripción Vista',
    type: 'html',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'VISTA', title: 'VISTA' },
          { value: 'NO VISTA', title: 'NO VISTA' },
        ],
      },
    },
  },
};
