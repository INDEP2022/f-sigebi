import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_CAPTURE_EVENTS = {
  locTrans: {
    title: 'Localidad Entidad',
    sort: false,
    filter: false,
  },
  goodnumber: {
    title: 'No. Bien',
    sort: false,
    filter: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
    filter: false,
  },

  description: {
    title: 'Descripción',
    type: 'custom',
    renderComponent: SeeMoreComponent,
    sort: false,
    filter: false,
  },
};

export const COLUMNS_CAPTURE_EVENTS_2 = {
  typegood: {
    title: 'Tipo Bien',
    sort: false,
    filter: false,
  },
  proccessextdom: {
    title: 'Proceso',
    sort: false,
    filter: false,
  },
  expedientnumber: {
    title: 'Expediente',
    sort: false,
    filter: false,
  },
  destination: {
    title: 'Indicador Destino',
    sort: false,
    filter: false,
  },
};
