import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const EVENT_COLUMNS = {
  eventId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  eatEventDetail: {
    title: 'Clave Procedimiento',
    // type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return cell.processKey;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.processKey;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
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
    type: 'html',
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
      component: CustomDateFilterComponent,
    },

    /*filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },*/
  },
};

export const CAPTURE_LINES_COLUMNS = {
  eventId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
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
