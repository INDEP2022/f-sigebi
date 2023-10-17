import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const ACT_DELIVERY_RECEPTION_COLUMNS = {
  /*watch: {
    title: 'Ver',
    sort: false,
  },*/
  rank: {
    title: 'No.',
    sort: false,
  },
  expediente: {
    title: 'Expediente',
    sort: false,
  },
  acta: {
    title: 'Acta',
    sort: false,
  },
  no_acta: {
    title: 'No. Acta',
    sort: false,
  },
  fecha: {
    title: 'Fecha',
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
    /*valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split(' ')[0].split('-');
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  estatus: {
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
        selectText: 'Estatus',
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
    title: 'No. Bien',
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
