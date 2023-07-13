import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const PREPARE_EVENT_EVENTS_LIST_COLUMNS = {
  id: {
    title: 'Evento',
    sort: false,
  },
  processKey: {
    title: 'Clave',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  eventTpId: {
    title: 'ID Tipo',
    sort: false,
  },
  tipo: {
    title: 'Tipo',
    sort: false,
  },
  place: {
    title: 'Lugar',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  observations: {
    title: 'Observaciones',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  user: {
    title: 'Usuario',
    sort: false,
  },
  delegationNumber: {
    title: 'Coordinación',
    sort: false,
  },
  statusVtaId: {
    title: 'Estatus',
    sort: false,
  },
};
