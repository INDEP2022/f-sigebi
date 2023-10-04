import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';

export const REGULAR_BILLING_GENERATION_ASSETS_COLUMNS = {
  notGood: {
    title: 'No. Bien',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  series: {
    title: 'Serie',
    sort: false,
  },
  Invoice: {
    title: 'Folio',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  observations: {
    title: 'Observaciones',
    sort: false,
  },
  eventId: {
    title: 'Evento',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  lotPublic: {
    title: 'lote',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  downloadValidation: {
    title: 'Validación/Motivo',
    sort: false,
  },
  insertDate: {
    title: 'Fecha Proceso',
    sort: false,
    valuePrepareFunction: (date: string) => {
      return date ? date.split('-').reverse().join('/') : date;
    },
  },
  userinsert: {
    title: 'Usuario',
    sort: false,
  },
};
