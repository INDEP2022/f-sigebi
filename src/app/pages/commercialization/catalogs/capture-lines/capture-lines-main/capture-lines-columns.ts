import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

export const EVENT_COLUMNS = {
  eventId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  // cve: {//SALE DE LA TABLA COMER_EVENTOS
  //   title: 'Clave',
  //   type: 'string',
  //   sort: false,
  // },
  customerBmx: {
    title: 'Cliente Bmx',
    type: 'number',
    sort: false,
  },
  userCreated: {
    title: 'Usuario Creo',
    type: 'string',
    sort: false,
  },
  creationDate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
};

export const CAPTURE_LINES_COLUMNS = {
  pallette: {
    title: 'No. Paleta',
    type: 'number',
    sort: false,
  },
  captureLine: {
    title: 'Línea Captura',
    type: 'string',
    sort: false,
  },
};
