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
