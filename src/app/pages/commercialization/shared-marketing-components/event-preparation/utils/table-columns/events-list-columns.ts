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
  comerTpevents: {
    title: 'Tipo',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value?.description ?? '';
    },
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
  catDelegation: {
    title: 'Coordinación',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value?.description ?? '';
    },
  },
  comerStatusvta: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value?.description ?? '';
    },
  },
};
