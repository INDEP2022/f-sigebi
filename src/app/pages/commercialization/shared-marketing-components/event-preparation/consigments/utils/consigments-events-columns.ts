import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';

export const CONSIGMENTS_EVENTS_COLUMNS = {
  id: {
    title: 'Evento',
    sort: false,
  },
  processKey: {
    title: 'Clave',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  observations: {
    title: 'Observaciones',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  user: {
    title: 'Capturó',
    sort: false,
  },
  catDelegation: {
    title: 'Regional',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value?.description ?? '';
    },
  },
};
