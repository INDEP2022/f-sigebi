import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  id: {
    title: 'Id',
    type: 'string',
    sort: false,
  },
  eventTpId: {
    title: 'Id Tipo Evento',
    type: 'string',
    sort: false,
  },
  statusVtaId: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  processKey: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
  place: {
    title: 'Lugar',
    type: 'string',
    sort: false,
  },
  eventDate: {
    title: 'Fecha de Evento',
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
  failureDate: {
    title: 'Fecha de Fallo',
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
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
};
