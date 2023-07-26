import { IdTpevent } from 'src/app/core/models/ms-event/event.model';

export const SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS = {
  idTpevent: {
    title: 'Evento',
    type: 'number',
    sort: false,
    valuePrepareFunction: (val: IdTpevent) => (val ? val.description : ''),
  },
  commentary: {
    title: 'Comentario',
    type: 'string',
    sort: false,
  },
};
